import { verifyAccess } from '../utils/tokens.js';
import { forbidden, unauthorized } from '../utils/httpError.js';
import { prisma } from '../config/prisma.js';

const extractToken = (req) => {
  const h = req.headers.authorization;
  if (h?.startsWith('Bearer ')) return h.slice(7);
  if (req.cookies?.access_token) return req.cookies.access_token;
  return null;
};

const lookupUser = async (id) =>
  prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, role: true, active: true },
  });

export const requireAuth = async (req, _res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return next(unauthorized('Missing token'));

    const payload = verifyAccess(token);
    const user = await lookupUser(payload.sub);
    if (!user || !user.active) return next(unauthorized('Inactive user'));
    req.user = user;
    next();
  } catch (e) {
    next(unauthorized(e?.message || 'Invalid token'));
  }
};

const ROLE_RANK = { VIEWER: 1, EDITOR: 2, ADMIN: 3 };

export const requireRole = (minRole) => (req, _res, next) => {
  if (!req.user) return next(unauthorized());
  const rank = ROLE_RANK[req.user.role] || 0;
  const minRank = ROLE_RANK[minRole] || 0;
  if (rank < minRank) return next(forbidden(`Requires role >= ${minRole}`));
  next();
};

// Only swallows JWT/decode errors — propagates real failures (DB outage, etc.)
const isJwtError = (e) =>
  e?.name === 'JsonWebTokenError' ||
  e?.name === 'TokenExpiredError' ||
  e?.name === 'NotBeforeError';

export const optionalAuth = async (req, _res, next) => {
  const token = extractToken(req);
  if (!token) return next();
  try {
    const payload = verifyAccess(token);
    const user = await lookupUser(payload.sub);
    if (user?.active) req.user = user;
    next();
  } catch (e) {
    if (isJwtError(e)) return next(); // invalid/expired token — treat as anonymous
    next(e); // real error (DB) — let error handler decide
  }
};
