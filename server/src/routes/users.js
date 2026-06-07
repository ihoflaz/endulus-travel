import { Router } from 'express';
import { hash as bcryptHash, passwordSchema } from '../utils/password.js';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { badRequest } from '../utils/httpError.js';
import { audit } from '../utils/audit.js';
import { env } from '../config/env.js';

const router = Router();
router.use(requireAuth, requireRole('ADMIN'));

const userSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  active: true,
  lastLogin: true,
  lastLoginIp: true,
  failedLogins: true,
  lockedUntil: true,
  createdAt: true,
  updatedAt: true,
};

// Guards against losing the last active admin.
const wouldLeaveZeroAdmins = async (userId, nextRole, nextActive) => {
  const current = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, active: true },
  });
  if (!current) return false;
  const wasActiveAdmin = current.role === 'ADMIN' && current.active;
  const willBeActiveAdmin =
    (nextRole ?? current.role) === 'ADMIN' &&
    (nextActive ?? current.active);
  if (!wasActiveAdmin || willBeActiveAdmin) return false;

  const otherActiveAdmins = await prisma.user.count({
    where: { id: { not: userId }, role: 'ADMIN', active: true },
  });
  return otherActiveAdmins === 0;
};

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const users = await prisma.user.findMany({
      select: userSelect,
      orderBy: { createdAt: 'asc' },
    });
    res.json(users);
  })
);

router.post(
  '/',
  validate({
    body: z.object({
      email: z.string().email().toLowerCase(),
      password: passwordSchema,
      name: z.string().optional(),
      role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']).default('VIEWER'),
      active: z.boolean().optional().default(true),
    }).strict(),
  }),
  asyncHandler(async (req, res) => {
    const { email, password, name, role, active } = req.body;
    const passwordHash = await bcryptHash(password, env.BCRYPT_ROUNDS);
    const user = await prisma.user.create({
      data: { email, passwordHash, name, role, active },
      select: userSelect,
    });
    await audit(req, { action: 'user.create', entity: 'User', entityId: user.id });
    res.status(201).json(user);
  })
);

router.put(
  '/:id',
  validate({
    params: z.object({ id: z.string() }),
    body: z.object({
      email: z.string().email().toLowerCase().optional(),
      name: z.string().optional().nullable(),
      role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']).optional(),
      active: z.boolean().optional(),
      password: passwordSchema.optional(),
      unlock: z.boolean().optional(),
    }).strict(),
  }),
  asyncHandler(async (req, res) => {
    if (
      (req.body.role !== undefined || req.body.active !== undefined) &&
      (await wouldLeaveZeroAdmins(req.params.id, req.body.role, req.body.active))
    ) {
      throw badRequest('Cannot remove the last active admin');
    }

    // Snapshot current state for audit and for deciding whether to revoke
    // active sessions.
    const before = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { role: true, active: true },
    });

    const { password, unlock, ...rest } = req.body;
    const data = { ...rest };
    if (password) data.passwordHash = await bcryptHash(password, env.BCRYPT_ROUNDS);
    if (unlock) {
      data.failedLogins = 0;
      data.lockedUntil = null;
    }
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: userSelect,
    });

    // Privilege/state changes invalidate existing sessions immediately —
    // otherwise an old access token keeps elevated rights until its TTL.
    const revokeSessions =
      password ||
      (req.body.role && before && req.body.role !== before.role) ||
      (req.body.active !== undefined && before && req.body.active !== before.active);

    if (revokeSessions) {
      await prisma.refreshToken.updateMany({
        where: { userId: user.id, revoked: false },
        data: { revoked: true },
      });
    }

    await audit(req, {
      action: 'user.update',
      entity: 'User',
      entityId: user.id,
      meta: {
        changed: Object.keys(req.body),
        roleBefore: before?.role,
        roleAfter: user.role,
        activeBefore: before?.active,
        activeAfter: user.active,
        sessionsRevoked: !!revokeSessions,
      },
    });
    res.json(user);
  })
);

router.delete(
  '/:id',
  validate({ params: z.object({ id: z.string() }) }),
  asyncHandler(async (req, res) => {
    if (req.params.id === req.user.id) {
      throw badRequest('Cannot delete yourself');
    }
    if (await wouldLeaveZeroAdmins(req.params.id, undefined, false)) {
      throw badRequest('Cannot delete the last active admin');
    }
    await prisma.user.delete({ where: { id: req.params.id } });
    await audit(req, {
      action: 'user.delete',
      entity: 'User',
      entityId: req.params.id,
    });
    res.status(204).end();
  })
);

export default router;
