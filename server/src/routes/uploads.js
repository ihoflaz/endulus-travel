import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import crypto from 'node:crypto';
import { fileTypeFromFile } from 'file-type';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { prisma } from '../config/prisma.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';
import { badRequest, notFound, HttpError } from '../utils/httpError.js';
import { audit } from '../utils/audit.js';

const router = Router();

// We sniff magic bytes after upload. SVG is intentionally NOT supported —
// SVG can contain scripts and is therefore an XSS vector when served from the
// same origin.
const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);

// Map sniffed mime → canonical extension (do NOT trust the client name)
const EXT_BY_MIME = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
};

// Stricter than the global limiter: bursts of uploads are unusual outside
// admin sessions. Per-user when authenticated; fall back to IP for the
// pre-auth path (only hit by failed-auth probes since the route requires
// auth — those requests get the limit anyway).
const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id || req.ip,
});

const ensureDir = (p) => fs.mkdirSync(p, { recursive: true });

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dir = path.join(env.UPLOAD_DIR, String(yyyy), mm);
    ensureDir(dir);
    cb(null, dir);
  },
  filename(_req, _file, cb) {
    // No extension yet — we rename after sniffing the actual content
    const id = crypto.randomBytes(16).toString('hex');
    cb(null, `${Date.now()}-${id}.bin`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: env.MAX_UPLOAD_BYTES,
    files: 1,
    fields: 4,
  },
  // First-pass mime check based on the request — we'll verify with magic bytes
  // post-upload before persisting anything.
  fileFilter(_req, file, cb) {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return cb(new HttpError(400, `Unsupported file type: ${file.mimetype}`));
    }
    cb(null, true);
  },
});

const toPublicPath = (absPath) => {
  const rel = path.relative(env.UPLOAD_DIR, absPath).split(path.sep).join('/');
  return `${env.PUBLIC_UPLOAD_BASE}/${rel}`;
};

const resolveSafe = (publicPath) => {
  const base = path.resolve(env.UPLOAD_DIR);
  const rel = publicPath.replace(env.PUBLIC_UPLOAD_BASE + '/', '');
  const abs = path.resolve(base, rel);
  if (!abs.startsWith(base + path.sep) && abs !== base) {
    throw new Error('Path traversal detected');
  }
  return abs;
};

router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const take = Math.min(Number(req.query.take || 60), 200);
    const skip = Math.max(Number(req.query.skip || 0), 0);
    const [items, total] = await Promise.all([
      prisma.mediaFile.findMany({
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      prisma.mediaFile.count(),
    ]);
    res.json({ items, total });
  })
);

router.post(
  '/',
  requireAuth,
  requireRole('EDITOR'),
  uploadLimiter,
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw badRequest('No file uploaded');

    // Verify via magic bytes — do not trust the client-supplied mime.
    let sniffed;
    try {
      sniffed = await fileTypeFromFile(req.file.path);
    } catch {
      sniffed = null;
    }
    if (!sniffed || !ALLOWED_MIME.has(sniffed.mime)) {
      await fsp.unlink(req.file.path).catch(() => {});
      throw badRequest(
        `Rejected: detected type ${sniffed?.mime ?? 'unknown'} is not an allowed image`
      );
    }

    // Rename with the canonical extension so static serving sets right type.
    const canonicalExt = EXT_BY_MIME[sniffed.mime];
    const finalPath = req.file.path.replace(/\.bin$/, canonicalExt);
    await fsp.rename(req.file.path, finalPath);

    const publicPath = toPublicPath(finalPath);
    const media = await prisma.mediaFile.create({
      data: {
        filename: path.basename(finalPath),
        originalName: req.file.originalname,
        mimeType: sniffed.mime,
        size: req.file.size,
        path: publicPath,
        uploadedBy: req.user.id,
      },
    });
    await audit(req, {
      action: 'media.upload',
      entity: 'MediaFile',
      entityId: media.id,
      meta: { mime: sniffed.mime, size: media.size },
    });
    res.status(201).json(media);
  })
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('EDITOR'),
  validate({ params: z.object({ id: z.string() }) }),
  asyncHandler(async (req, res) => {
    const media = await prisma.mediaFile.findUnique({
      where: { id: req.params.id },
    });
    if (!media) throw notFound();

    try {
      const abs = resolveSafe(media.path);
      await fsp.rm(abs, { force: true });
    } catch (e) {
      console.warn('[uploads] failed to remove file:', e.message);
    }
    await prisma.mediaFile.delete({ where: { id: req.params.id } });
    await audit(req, {
      action: 'media.delete',
      entity: 'MediaFile',
      entityId: req.params.id,
    });
    res.status(204).end();
  })
);

export default router;
