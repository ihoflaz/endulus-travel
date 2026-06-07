# --- Base ---
FROM node:22-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# --- Full deps (dev + prod, for building) ---
FROM base AS deps-all
ENV NODE_ENV=development
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# --- Generate prisma client (uses full deps) ---
FROM deps-all AS build
COPY prisma ./prisma
RUN ./node_modules/.bin/prisma generate

# --- Production-only deps (slim runtime image) ---
FROM base AS deps-prod
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# --- Runtime ---
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache openssl tini wget \
 && addgroup -S app && adduser -S app -G app

# Copy slim prod deps + generated Prisma client
COPY --from=deps-prod --chown=app:app /app/node_modules ./node_modules
COPY --from=build --chown=app:app /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build --chown=app:app /app/node_modules/@prisma ./node_modules/@prisma
# We also need the prisma CLI for `migrate deploy` at startup
COPY --from=deps-all --chown=app:app /app/node_modules/prisma ./node_modules/prisma
COPY --from=deps-all --chown=app:app /app/node_modules/.bin/prisma ./node_modules/.bin/prisma

COPY --chown=app:app package.json ./
COPY --chown=app:app prisma ./prisma
COPY --chown=app:app scripts ./scripts
COPY --chown=app:app src ./src

RUN mkdir -p /app/uploads && chown -R app:app /app/uploads

USER app
EXPOSE 4000
ENTRYPOINT ["/sbin/tini", "--"]
# Apply committed migrations (safe — never drops data unless schema says so)
# then optionally seed (gated by RUN_SEED env, default true).
CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && ( [ \"$RUN_SEED\" = \"false\" ] || node prisma/seed.js ) && node src/index.js"]
