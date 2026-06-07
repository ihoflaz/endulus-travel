import { Router } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { prisma } from '../config/prisma.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { audit } from '../utils/audit.js';
import { notFound } from '../utils/httpError.js';

const router = Router();

// Stricter limit on public message creation — sloppy bots will hit this fast.
const submitLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

// Captures every customer-facing form on the public site:
// - Contact form (kind=CONTACT)
// - Offer request (kind=OFFER)
// - Survey (kind=SURVEY)
const messageBody = z.object({
  kind: z.enum(['CONTACT', 'OFFER', 'SURVEY']),
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  phone: z.string().max(64).optional(),
  subject: z.string().max(300).optional(),
  message: z.string().max(5000).optional(),
  // Form-specific extras packed as JSON. The frontend dictates the shape.
  meta: z.record(z.unknown()).optional(),
}).strict();

// PUBLIC create endpoint — anyone can submit.
router.post(
  '/',
  submitLimiter,
  validate({ body: messageBody }),
  asyncHandler(async (req, res) => {
    const m = await prisma.contactMessage.create({
      data: {
        ...req.body,
        ip: req.ip ?? null,
        userAgent: req.headers['user-agent']?.slice(0, 500) ?? null,
      },
      select: { id: true, kind: true, createdAt: true },
    });
    res.status(201).json(m);
  })
);

// Authenticated admin list — paginated, filterable by kind / status.
router.get(
  '/',
  requireAuth,
  validate({
    query: z.object({
      kind: z.enum(['CONTACT', 'OFFER', 'SURVEY']).optional(),
      status: z.enum(['NEW', 'READ', 'ARCHIVED']).optional(),
      take: z.coerce.number().int().min(1).max(200).default(50),
      skip: z.coerce.number().int().min(0).default(0),
    }),
  }),
  asyncHandler(async (req, res) => {
    const where = {};
    if (req.query.kind) where.kind = req.query.kind;
    if (req.query.status) where.status = req.query.status;
    const [items, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: req.query.take,
        skip: req.query.skip,
      }),
      prisma.contactMessage.count({ where }),
    ]);
    res.setHeader('X-Total-Count', String(total));
    res.json({ items, total });
  })
);

router.get(
  '/:id',
  requireAuth,
  validate({ params: z.object({ id: z.string() }) }),
  asyncHandler(async (req, res) => {
    const m = await prisma.contactMessage.findUnique({
      where: { id: req.params.id },
    });
    if (!m) throw notFound();
    // Mark as read on first view.
    if (m.status === 'NEW') {
      await prisma.contactMessage.update({
        where: { id: m.id },
        data: { status: 'READ' },
      });
      m.status = 'READ';
    }
    res.json(m);
  })
);

router.patch(
  '/:id',
  requireAuth,
  requireRole('EDITOR'),
  validate({
    params: z.object({ id: z.string() }),
    body: z.object({
      status: z.enum(['NEW', 'READ', 'ARCHIVED']),
    }).strict(),
  }),
  asyncHandler(async (req, res) => {
    const m = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
    });
    await audit(req, {
      action: 'message.update',
      entity: 'ContactMessage',
      entityId: m.id,
      meta: { status: req.body.status },
    });
    res.json(m);
  })
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('EDITOR'),
  validate({ params: z.object({ id: z.string() }) }),
  asyncHandler(async (req, res) => {
    await prisma.contactMessage.delete({ where: { id: req.params.id } });
    await audit(req, {
      action: 'message.delete',
      entity: 'ContactMessage',
      entityId: req.params.id,
    });
    res.status(204).end();
  })
);

export default router;
