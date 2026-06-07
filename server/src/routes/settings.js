import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { notFound, badRequest } from '../utils/httpError.js';
import { audit } from '../utils/audit.js';

const router = Router();

// Restrict social/map URLs to safe schemes — blocks `javascript:` and `data:`
// injection attempts that the frontend might otherwise render in an href.
const safeUrl = z
  .string()
  .max(2048)
  .refine(
    (v) => v === '' || /^https?:\/\//i.test(v),
    'URL must start with http:// or https://'
  );

// Google Maps embed URL specifically — blocks arbitrary iframe sources.
const mapsEmbedUrl = z
  .string()
  .max(4096)
  .refine(
    (v) =>
      v === '' ||
      /^https:\/\/(www\.)?google\.[a-z.]+\/maps\/embed/i.test(v) ||
      /^https:\/\/maps\.google\.[a-z.]+\//i.test(v),
    'Only https://www.google.com/maps/embed URLs are allowed'
  );

const e164ish = z
  .string()
  .max(32)
  .regex(/^[+\d\s()-]*$/, 'Phone may only contain digits, spaces, +, -, ( and )');

// Registry of allowed setting keys and their value schemas. Anything not in
// this map is rejected, so EDITORs can't write arbitrary JSON under any key.
export const SETTING_SCHEMAS = {
  about: z.object({
    title: z.string().max(200).optional(),
    description: z.string().max(5000).optional(),
    slogan: z.string().max(500).optional(),
    values: z.array(z.string().max(200)).max(20).optional(),
  }).strict(),
  contact: z.object({
    address: z.string().max(500).optional(),
    phone: e164ish.optional(),
    email: z.string().email().optional().or(z.literal('')),
    workingHours: z.string().max(200).optional(),
    weekendHours: z.string().max(200).optional(),
    social: z.object({
      facebook: safeUrl.optional(),
      twitter: safeUrl.optional(),
      instagram: safeUrl.optional(),
      youtube: safeUrl.optional(),
    }).strict().optional(),
    mapLocation: safeUrl.optional(),
    mapEmbedCode: mapsEmbedUrl.optional(),
  }).strict(),
  'hero.slogan': z.string().max(500),
  // Site-wide branding / SEO
  site: z.object({
    title: z.string().max(120).optional(),
    description: z.string().max(300).optional(),
    keywords: z.array(z.string().max(80)).max(30).optional(),
    ogImage: safeUrl.optional(),
    favicon: safeUrl.optional(),
  }).strict(),
  // Footer / legal text
  footer: z.object({
    aboutText: z.string().max(800).optional(),
    legalName: z.string().max(200).optional(),
    licenseNumber: z.string().max(100).optional(),
    copyright: z.string().max(200).optional(),
  }).strict(),
  // Channel-specific contact methods
  whatsapp: z.object({
    number: e164ish.optional(),
    defaultMessage: z.string().max(500).optional(),
  }).strict(),
  // Free-form legal pages (HTML allowed but stripped of <script> via Zod)
  'legal.privacy': z.object({
    title: z.string().max(200).optional(),
    body: z.string().max(50_000).refine(
      (v) => !v || !/<script\b/i.test(v),
      '<script> tags are not allowed'
    ).optional(),
  }).strict(),
  'legal.terms': z.object({
    title: z.string().max(200).optional(),
    body: z.string().max(50_000).refine(
      (v) => !v || !/<script\b/i.test(v),
      '<script> tags are not allowed'
    ).optional(),
  }).strict(),
  'legal.kvkk': z.object({
    title: z.string().max(200).optional(),
    body: z.string().max(50_000).refine(
      (v) => !v || !/<script\b/i.test(v),
      '<script> tags are not allowed'
    ).optional(),
  }).strict(),
};

export const ALLOWED_SETTING_KEYS = new Set(Object.keys(SETTING_SCHEMAS));

router.get(
  '/:key',
  validate({ params: z.object({ key: z.string().min(1).max(64) }) }),
  asyncHandler(async (req, res) => {
    if (!ALLOWED_SETTING_KEYS.has(req.params.key)) throw notFound();
    const setting = await prisma.setting.findUnique({
      where: { key: req.params.key },
    });
    res.json(setting?.value ?? null);
  })
);

router.put(
  '/:key',
  requireAuth,
  requireRole('EDITOR'),
  validate({ params: z.object({ key: z.string().min(1).max(64) }) }),
  asyncHandler(async (req, res) => {
    const { key } = req.params;
    const schema = SETTING_SCHEMAS[key];
    if (!schema) throw badRequest(`Unknown setting key: ${key}`);
    const value = schema.parse(req.body);
    const setting = await prisma.setting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
    await audit(req, {
      action: 'setting.update',
      entity: 'Setting',
      entityId: key,
    });
    res.json(setting.value);
  })
);

router.get(
  '/',
  requireAuth,
  asyncHandler(async (_req, res) => {
    const all = await prisma.setting.findMany({ orderBy: { key: 'asc' } });
    res.json(all);
  })
);

export default router;
