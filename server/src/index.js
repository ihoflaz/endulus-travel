import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import fs from 'node:fs';
import rateLimit from 'express-rate-limit';

import { env, isProd } from './config/env.js';
import { prisma } from './config/prisma.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';
import { csrfGuard } from './middleware/csrf.js';
import { requestId } from './middleware/requestId.js';
import { corsErrorHandler } from './middleware/cors-error.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import tourRoutes from './routes/tours.js';
import blogRoutes from './routes/blog.js';
import serviceRoutes from './routes/services.js';
import heroRoutes from './routes/hero.js';
import settingsRoutes from './routes/settings.js';
import categoryRoutes from './routes/categories.js';
import formOptionRoutes from './routes/formOptions.js';
import budgetRouteRoutes from './routes/budgetRoutes.js';
import tourWizardRoutes from './routes/tourWizard.js';
import uploadRoutes from './routes/uploads.js';
import legacyDataRoutes from './routes/legacyData.js';
import messageRoutes from './routes/messages.js';
import auditRoutes from './routes/audit.js';

export const buildApp = () => {
  const app = express();

  // trust proxy: numeric hop count. Behind Cloudflare (1) + nginx (1) = 2.
  const trust = /^\d+$/.test(env.TRUST_PROXY)
    ? Number(env.TRUST_PROXY)
    : env.TRUST_PROXY;
  app.set('trust proxy', trust);
  app.disable('x-powered-by');

  app.use(requestId);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: isProd
        ? {
            useDefaults: true,
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
              connectSrc: ["'self'"],
              frameAncestors: ["'none'"],
              objectSrc: ["'none'"],
              baseUri: ["'self'"],
            },
          }
        : false,
      hsts: isProd ? { maxAge: 31_536_000, includeSubDomains: true, preload: true } : false,
    })
  );

  const allowedOrigins = env.CORS_ORIGIN.split(',').map((s) => s.trim()).filter(Boolean);
  app.use(
    cors({
      origin(origin, cb) {
        if (!origin) return cb(null, true);
        if (allowedOrigins.includes(origin)) return cb(null, true);
        // false → no CORS headers, browser blocks. Don't throw.
        return cb(null, false);
      },
      credentials: true,
    })
  );

  // strict:false allows top-level JSON primitives — needed for settings PUT
  // that accepts a bare string value. Validation enforced by Zod on every route.
  app.use(express.json({ limit: '2mb', strict: false }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));
  app.use(cookieParser(env.COOKIE_SECRET));

  if (env.MORGAN_ENABLED !== false) {
    if (!isProd) app.use(morgan('dev'));
    else app.use(
      morgan(
        ':remote-addr :method :url :status :res[content-length] - :response-time ms reqId=:req[x-request-id]'
      )
    );
  }

  // Global rate limit (auth limiter is stricter; upload limiter even stricter)
  app.use(
    '/api',
    rateLimit({
      windowMs: 60 * 1000,
      max: 600,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  // CSRF guard for cookie-authenticated mutations (Bearer requests skip)
  app.use('/api', csrfGuard);

  // Static uploads — also served by nginx in production, but the backend
  // serves them too so docker-compose works without an edge reverse proxy.
  fs.mkdirSync(env.UPLOAD_DIR, { recursive: true });
  app.use(
    env.PUBLIC_UPLOAD_BASE,
    express.static(env.UPLOAD_DIR, {
      fallthrough: true,
      maxAge: '7d',
      setHeaders(res) {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
      },
    })
  );

  // Health endpoints
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, env: env.NODE_ENV, time: new Date().toISOString() });
  });

  app.get('/api/health/full', async (_req, res) => {
    // Bound DB ping — clearTimeout so timer never lingers on success.
    let timer = null;
    try {
      await new Promise((resolve, reject) => {
        timer = setTimeout(() => reject(new Error('DB ping timeout')), 3000);
        prisma.$queryRaw`SELECT 1`.then(resolve, reject);
      }).finally(() => {
        if (timer) clearTimeout(timer);
      });
      res.json({ ok: true, db: 'up', env: env.NODE_ENV, time: new Date().toISOString() });
    } catch (e) {
      res.status(503).json({ ok: false, db: 'down', error: e.message });
    }
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/tours', tourRoutes);
  app.use('/api/blog', blogRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/hero', heroRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/form-options', formOptionRoutes);
  app.use('/api/budget-routes', budgetRouteRoutes);
  app.use('/api/tour-wizard', tourWizardRoutes);
  app.use('/api/uploads', uploadRoutes);
  app.use('/api/messages', messageRoutes);
  app.use('/api/audit', auditRoutes);

  // Legacy JSON-shape routes for the public frontend.
  app.use('/data', legacyDataRoutes);

  // CORS errors → 403 (before the catch-all 500 handler).
  app.use(corsErrorHandler);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

// Default export: a constructed app, kept for backwards compat with consumers
// that import it directly. Tests prefer `buildApp()`.
const app = buildApp();
export default app;

// Self-start only when run as a script (not when imported by tests).
const isMain = import.meta.url.endsWith(process.argv[1]?.replaceAll('\\', '/')) ||
               process.argv[1]?.endsWith('src/index.js') ||
               process.argv[1]?.endsWith('src\\index.js');

if (isMain) {
  const server = app.listen(env.PORT, '0.0.0.0', () => {
    console.log(`[server] listening on http://0.0.0.0:${env.PORT} (${env.NODE_ENV})`);
  });

  const shutdown = (signal) => {
    console.log(`[server] ${signal} received, shutting down...`);
    let forced = false;
    const forceExit = setTimeout(() => {
      forced = true;
      console.error('[server] forced exit after 10s');
      process.exit(1);
    }, 10_000).unref();

    server.close(async () => {
      try {
        await prisma.$disconnect();
      } catch (e) {
        console.error('[server] prisma disconnect failed:', e?.message);
      }
      if (!forced) {
        clearTimeout(forceExit);
        process.exit(0);
      }
    });
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}
