import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { audit } from '../utils/audit.js';
import { formOptionSchema } from '../schemas/entities.js';

const router = Router();

// Grouped shape: { destinations: [...], preferences: [...], ... }
router.get(
  '/',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const where = req.user ? {} : { active: true };
    const all = await prisma.formOption.findMany({
      where,
      orderBy: [{ groupName: 'asc' }, { order: 'asc' }],
    });
    const grouped = {};
    for (const opt of all) {
      if (!grouped[opt.groupName]) grouped[opt.groupName] = [];
      grouped[opt.groupName].push({
        value: opt.value,
        label: opt.label,
        id: opt.id,
        order: opt.order,
        active: opt.active,
      });
    }
    res.json(grouped);
  })
);

router.get(
  '/flat',
  requireAuth,
  asyncHandler(async (_req, res) => {
    const all = await prisma.formOption.findMany({
      orderBy: [{ groupName: 'asc' }, { order: 'asc' }],
    });
    res.json(all);
  })
);

router.post(
  '/',
  requireAuth,
  requireRole('EDITOR'),
  validate({ body: formOptionSchema }),
  asyncHandler(async (req, res) => {
    const opt = await prisma.formOption.create({ data: req.body });
    await audit(req, { action: 'formoption.create', entity: 'FormOption', entityId: opt.id });
    res.status(201).json(opt);
  })
);

router.put(
  '/:id',
  requireAuth,
  requireRole('EDITOR'),
  validate({
    params: z.object({ id: z.string() }),
    // Natural key (groupName + value) is part of a unique constraint and is
    // also referenced by client code; do not let editors mutate it.
    body: formOptionSchema.omit({ groupName: true, value: true }).partial().strict(),
  }),
  asyncHandler(async (req, res) => {
    const opt = await prisma.formOption.update({
      where: { id: req.params.id },
      data: req.body,
    });
    await audit(req, { action: 'formoption.update', entity: 'FormOption', entityId: opt.id });
    res.json(opt);
  })
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('EDITOR'),
  validate({ params: z.object({ id: z.string() }) }),
  asyncHandler(async (req, res) => {
    await prisma.formOption.delete({ where: { id: req.params.id } });
    await audit(req, {
      action: 'formoption.delete',
      entity: 'FormOption',
      entityId: req.params.id,
    });
    res.status(204).end();
  })
);

export default router;
