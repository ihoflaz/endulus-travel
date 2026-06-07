import { prisma } from '../config/prisma.js';

// Best-effort audit log writer. Never throws — failures must not break the
// originating request. Stores who did what, when, to which entity.
export const audit = async (req, { action, entity, entityId, meta } = {}) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: req.user?.id ?? null,
        action,
        entity,
        entityId: entityId ? String(entityId) : null,
        meta: meta ?? undefined,
        ip: req.ip ?? null,
        userAgent: req.headers?.['user-agent']?.slice(0, 500) ?? null,
      },
    });
  } catch (e) {
    console.error('[audit] failed to write:', e?.message);
  }
};
