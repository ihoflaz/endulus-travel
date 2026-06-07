import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(requireAuth, requireRole('ADMIN'));

router.get(
  '/',
  validate({
    query: z.object({
      action: z.string().max(64).optional(),
      entity: z.string().max(64).optional(),
      userId: z.string().max(64).optional(),
      take: z.coerce.number().int().min(1).max(200).default(50),
      skip: z.coerce.number().int().min(0).default(0),
    }),
  }),
  asyncHandler(async (req, res) => {
    const where = {};
    if (req.query.action) where.action = req.query.action;
    if (req.query.entity) where.entity = req.query.entity;
    if (req.query.userId) where.userId = req.query.userId;
    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: req.query.take,
        skip: req.query.skip,
        include: { user: { select: { email: true } } },
      }),
      prisma.auditLog.count({ where }),
    ]);
    res.setHeader('X-Total-Count', String(total));
    res.json({ items, total });
  })
);

export default router;
