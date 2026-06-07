import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { crudRouter } from '../utils/crudRouter.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { audit } from '../utils/audit.js';
import { budgetRouteSchema } from '../schemas/entities.js';

const publicBudgetShape = (r) => ({
  id: r.legacyId ?? r.id,
  persons: r.persons,
  budget: r.budget,
  destination: r.destination,
  days: r.days,
  departure: r.departure,
  image: r.image,
  description: r.description,
  highlights: r.highlights,
  price: r.price,
});

// Custom router so we can auto-fill `legacyId` for new admin-created rows.
const router = Router();

// Wrap the factory router to attach our extension before delegation.
const factoryRouter = crudRouter({
  prismaModel: prisma.budgetRoute,
  schema: budgetRouteSchema,
  entity: 'BudgetRoute',
  searchFields: ['destination', 'departure'],
  filterableFields: ['destination'],
  publicShape: publicBudgetShape,
});

// Override POST to assign next-available legacyId.
router.post(
  '/',
  requireAuth,
  requireRole('EDITOR'),
  validate({ body: budgetRouteSchema.strict() }),
  asyncHandler(async (req, res) => {
    const max = await prisma.budgetRoute.aggregate({ _max: { legacyId: true } });
    const nextLegacyId = (max._max.legacyId ?? 0) + 1;
    const row = await prisma.budgetRoute.create({
      data: { ...req.body, legacyId: nextLegacyId },
    });
    await audit(req, { action: 'budgetroute.create', entity: 'BudgetRoute', entityId: row.id });
    res.status(201).json(row);
  })
);

router.use(factoryRouter);

export default router;
