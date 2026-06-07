import { Router } from 'express';
import { hash as bcryptHash, compare as bcryptCompare, passwordSchema } from '../utils/password.js';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import crypto from 'node:crypto';
import { prisma } from '../config/prisma.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { unauthorized } from '../utils/httpError.js';
import {
  signAccess,
  signRefresh,
  verifyRefresh,
  hashToken,
} from '../utils/tokens.js';
import { audit } from '../utils/audit.js';
import { env, isProd } from '../config/env.js';

const router = Router();

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_FAIL = 8; // per account
const ACCOUNT_LOCK_MS = 15 * 60 * 1000;

const loginLimiter = rateLimit({
  windowMs: LOGIN_WINDOW_MS,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

const cookieOpts = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax',
  path: '/',
};

const REFRESH_BYTES = 48;

// Issue a new pair of tokens for a user. If `familyId` is provided we rotate
// within the same family (used by /refresh). Otherwise a new family is created
// (used by /login).
const issueTokens = async (user, req, familyId) => {
  const refresh = crypto.randomBytes(REFRESH_BYTES).toString('hex');
  const signedRefresh = signRefresh({ sub: user.id, jti: refresh.slice(0, 16) });
  const tokenHash = hashToken(signedRefresh);
  const fid = familyId || crypto.randomBytes(16).toString('hex');

  await prisma.refreshToken.create({
    data: {
      tokenHash,
      familyId: fid,
      userId: user.id,
      ip: req?.ip ?? null,
      userAgent: req?.headers?.['user-agent']?.slice(0, 500) ?? null,
      expiresAt: new Date(Date.now() + env.JWT_REFRESH_TTL * 1000),
    },
  });

  const access = signAccess({ sub: user.id, role: user.role });
  return { access, refresh: signedRefresh, familyId: fid };
};

const setAuthCookies = (res, { access, refresh }) => {
  res.cookie('access_token', access, {
    ...cookieOpts,
    maxAge: env.JWT_ACCESS_TTL * 1000,
  });
  res.cookie('refresh_token', refresh, {
    ...cookieOpts,
    maxAge: env.JWT_REFRESH_TTL * 1000,
  });
};

const clearAuthCookies = (res) => {
  res.clearCookie('access_token', cookieOpts);
  res.clearCookie('refresh_token', cookieOpts);
};

const sanitizeUser = (u) => ({
  id: u.id,
  email: u.email,
  name: u.name,
  role: u.role,
});

router.post(
  '/login',
  loginLimiter,
  validate({
    body: z.object({
      email: z.string().email().toLowerCase(),
      password: z.string().min(6),
    }),
  }),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.active) throw unauthorized('Invalid credentials');

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw unauthorized('Account temporarily locked. Try again later.');
    }

    const ok = await bcryptCompare(password, user.passwordHash);
    if (!ok) {
      // Per-account failed-login counter with temporary lock
      const newCount = (user.failedLogins ?? 0) + 1;
      const data = { failedLogins: newCount };
      if (newCount >= LOGIN_MAX_FAIL) {
        data.lockedUntil = new Date(Date.now() + ACCOUNT_LOCK_MS);
        data.failedLogins = 0;
      }
      await prisma.user.update({ where: { id: user.id }, data });
      await audit(req, {
        action: 'login.failed',
        entity: 'User',
        entityId: user.id,
      });
      throw unauthorized('Invalid credentials');
    }

    // Successful login — reset counter, record metadata, issue tokens
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLogins: 0,
        lockedUntil: null,
        lastLogin: new Date(),
        lastLoginIp: req.ip ?? null,
      },
    });

    const { access, refresh } = await issueTokens(user, req);
    setAuthCookies(res, { access, refresh });
    await audit(req, {
      action: 'login.success',
      entity: 'User',
      entityId: user.id,
    });
    // Tokens are delivered ONLY via HttpOnly cookies. Returning them in the
    // JSON body would re-expose them to XSS and defeat the point of cookies.
    res.json({ user: sanitizeUser(user) });
  })
);

router.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const token = req.cookies?.refresh_token || req.body?.refresh;
    if (!token) throw unauthorized('Missing refresh token');

    let payload;
    try {
      payload = verifyRefresh(token);
    } catch (e) {
      throw unauthorized(e.message);
    }

    const tokenHash = hashToken(token);

    // Atomic rotation: only succeed if the stored row is still active.
    // Serializable isolation makes the updateMany→findUnique sequence safe
    // against concurrent /refresh calls that share the same refresh token.
    // updateMany returns count; count===0 → already rotated / revoked → reuse!
    const result = await prisma.$transaction(
      async (tx) => {
        const updated = await tx.refreshToken.updateMany({
          where: { tokenHash, revoked: false },
          data: { revoked: true },
        });
        if (updated.count === 0) {
          // Reuse attempt detected — revoke the entire family.
          const old = await tx.refreshToken.findUnique({ where: { tokenHash } });
          if (old) {
            await tx.refreshToken.updateMany({
              where: { familyId: old.familyId, revoked: false },
              data: { revoked: true },
            });
          }
          return { reuse: true, userId: payload.sub };
        }
        const original = await tx.refreshToken.findUnique({
          where: { tokenHash },
          select: { familyId: true, userId: true, expiresAt: true },
        });
        return { reuse: false, ...original };
      },
      { isolationLevel: 'Serializable' }
    );

    if (result.reuse) {
      await audit(req, {
        action: 'refresh.reuse_detected',
        entity: 'User',
        entityId: result.userId,
      });
      clearAuthCookies(res);
      throw unauthorized('Refresh token reuse detected — session revoked');
    }
    if (result.expiresAt < new Date()) {
      throw unauthorized('Refresh token expired');
    }

    const user = await prisma.user.findUnique({ where: { id: result.userId } });
    if (!user || !user.active) {
      clearAuthCookies(res);
      throw unauthorized('Inactive user');
    }

    const { access, refresh } = await issueTokens(user, req, result.familyId);
    setAuthCookies(res, { access, refresh });
    res.json({ user: sanitizeUser(user) });
  })
);

router.post(
  '/logout',
  asyncHandler(async (req, res) => {
    const token = req.cookies?.refresh_token || req.body?.refresh;
    let userId = req.user?.id ?? null;
    if (token) {
      const tokenHash = hashToken(token);
      const row = await prisma.refreshToken
        .findUnique({ where: { tokenHash } })
        .catch(() => null);
      if (row) {
        if (!userId) userId = row.userId;
        // Revoke entire family on explicit logout — kills all sessions started
        // from this login chain.
        await prisma.refreshToken
          .updateMany({
            where: { familyId: row.familyId, revoked: false },
            data: { revoked: true },
          })
          .catch(() => {});
      }
    }
    clearAuthCookies(res);
    if (userId) {
      await audit(req, { action: 'logout', entity: 'User', entityId: userId });
    }
    res.json({ ok: true });
  })
);

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ user: sanitizeUser(req.user) });
  })
);

router.post(
  '/change-password',
  requireAuth,
  validate({
    body: z.object({
      currentPassword: z.string().min(1),
      newPassword: passwordSchema,
    }),
  }),
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const ok = await bcryptCompare(currentPassword, user.passwordHash);
    if (!ok) throw unauthorized('Wrong current password');
    if (newPassword === currentPassword) {
      throw unauthorized('New password must differ from the current one');
    }
    const passwordHash = await bcryptHash(newPassword, env.BCRYPT_ROUNDS);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });
    // Kill all sessions for this user — they must re-login everywhere
    await prisma.refreshToken.updateMany({
      where: { userId: user.id, revoked: false },
      data: { revoked: true },
    });
    await audit(req, {
      action: 'password.changed',
      entity: 'User',
      entityId: user.id,
    });
    clearAuthCookies(res);
    res.json({ ok: true });
  })
);

export default router;
