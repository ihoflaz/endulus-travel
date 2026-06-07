import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { audit } from '../utils/audit.js';

const DEFAULT_TAKE = 50;
const MAX_TAKE = 200;

/**
 * Build a CRUD router for a Prisma model.
 *
 * Options:
 * - prismaModel       : prisma delegate, e.g. `prisma.tour`
 * - schema            : zod schema for create payload (will be `.strict()` enforced)
 * - updateSchema      : optional zod for update (defaults to `schema.partial().strict()`)
 * - entity            : audit entity name, e.g. "Tour"
 * - listOrderBy       : default [{order:'asc'},{createdAt:'desc'}]
 * - publicFilter      : (req) → where clause for unauthenticated GETs
 * - adminFilter       : (req) → where clause for authenticated GETs
 * - publicShape       : (row) → row — strips fields from public responses
 * - findByParam       : 'id' (default) or 'slug', 'serviceId', etc.
 * - hasReorder        : add POST /reorder endpoint (default true)
 * - minRole           : role required for writes (default 'EDITOR')
 * - searchFields      : enable ?q= contains-search on these columns
 * - filterableFields  : allowlist of fields that can be filtered via query
 *                       string (boolean coerced if 'true'/'false', else string).
 *                       SECURITY: anything not in this list is rejected.
 * - listEnvelope      : (rows, meta) → response body shape
 */
export const crudRouter = ({
  prismaModel,
  schema,
  updateSchema,
  entity,
  listOrderBy = [{ order: 'asc' }, { createdAt: 'desc' }],
  publicFilter = () => ({ active: true }),
  adminFilter = () => ({}),
  publicShape,
  findByParam = 'id',
  hasReorder = true,
  minRole = 'EDITOR',
  searchFields = [],
  filterableFields = [],
  listEnvelope,
}) => {
  const router = Router();
  // .strict() rejects unknown keys with a 400 — surfaces client bugs instead
  // of silently dropping fields.
  const createSchema = typeof schema?.strict === 'function' ? schema.strict() : schema;
  const updSchema = updateSchema
    ? (typeof updateSchema.strict === 'function' ? updateSchema.strict() : updateSchema)
    : createSchema.partial().strict();

  const stripWrite = ({ id, createdAt, updatedAt, ...rest } = {}) => rest;

  const buildListWhere = (req) => {
    const base = req.user ? adminFilter(req) : publicFilter(req);
    const where = { ...base };
    if (req.query.q && searchFields.length) {
      where.OR = searchFields.map((f) => ({
        [f]: { contains: String(req.query.q), mode: 'insensitive' },
      }));
    }
    // Apply allowlisted filters only — never trust raw query keys.
    for (const field of filterableFields) {
      if (!(field in req.query)) continue;
      if (field in base) continue; // explicit override from filter wins
      const v = req.query[field];
      if (v === 'true') where[field] = true;
      else if (v === 'false') where[field] = false;
      else if (typeof v === 'string') where[field] = v;
    }
    return where;
  };

  router.get(
    '/',
    optionalAuth,
    asyncHandler(async (req, res) => {
      const take = Math.min(Math.max(Number(req.query.take || DEFAULT_TAKE), 1), MAX_TAKE);
      const skip = Math.max(Number(req.query.skip || 0), 0);
      const where = buildListWhere(req);
      const [rows, total] = await Promise.all([
        prismaModel.findMany({ where, orderBy: listOrderBy, take, skip }),
        prismaModel.count({ where }),
      ]);
      const shape = publicShape && !req.user ? rows.map(publicShape) : rows;
      res.setHeader('X-Total-Count', String(total));
      res.setHeader('X-Page-Size', String(take));
      res.setHeader('X-Page-Offset', String(skip));
      if (listEnvelope) return res.json(listEnvelope(shape, { total, take, skip }));
      res.json(shape);
    })
  );

  router.get(
    `/:${findByParam}`,
    optionalAuth,
    validate({
      params: z.object({
        [findByParam]: z.string().min(1).max(200),
      }),
    }),
    asyncHandler(async (req, res) => {
      const row = await prismaModel.findUnique({
        where: { [findByParam]: req.params[findByParam] },
      });
      if (!row) return res.status(404).json({ error: 'Not found' });
      if (row.active === false && !req.user) {
        return res.status(404).json({ error: 'Not found' });
      }
      const shape = publicShape && !req.user ? publicShape(row) : row;
      res.json(shape);
    })
  );

  router.post(
    '/',
    requireAuth,
    requireRole(minRole),
    validate({ body: createSchema }),
    asyncHandler(async (req, res) => {
      const row = await prismaModel.create({ data: req.body });
      await audit(req, { action: `${entity.toLowerCase()}.create`, entity, entityId: row.id });
      res.status(201).json(row);
    })
  );

  router.put(
    '/:id',
    requireAuth,
    requireRole(minRole),
    validate({
      params: z.object({ id: z.string() }),
      body: updSchema,
    }),
    asyncHandler(async (req, res) => {
      const row = await prismaModel.update({
        where: { id: req.params.id },
        data: stripWrite(req.body),
      });
      await audit(req, {
        action: `${entity.toLowerCase()}.update`,
        entity,
        entityId: row.id,
        meta: { changed: Object.keys(req.body) },
      });
      res.json(row);
    })
  );

  router.delete(
    '/:id',
    requireAuth,
    requireRole(minRole),
    validate({ params: z.object({ id: z.string() }) }),
    asyncHandler(async (req, res) => {
      await prismaModel.delete({ where: { id: req.params.id } });
      await audit(req, {
        action: `${entity.toLowerCase()}.delete`,
        entity,
        entityId: req.params.id,
      });
      res.status(204).end();
    })
  );

  if (hasReorder) {
    router.post(
      '/reorder',
      requireAuth,
      requireRole(minRole),
      validate({
        body: z.object({
          order: z
            .array(z.object({ id: z.string(), order: z.number().int() }))
            .min(1)
            .max(500),
        }),
      }),
      asyncHandler(async (req, res) => {
        await prisma.$transaction(
          req.body.order.map(({ id, order }) =>
            prismaModel.update({ where: { id }, data: { order } })
          )
        );
        await audit(req, {
          action: `${entity.toLowerCase()}.reorder`,
          entity,
          meta: { count: req.body.order.length },
        });
        res.json({ ok: true });
      })
    );
  }

  return router;
};
