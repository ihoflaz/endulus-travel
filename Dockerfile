# --- Build the Vite React app ---
FROM node:22-alpine AS build
WORKDIR /app
# Install ALL dependencies (devDeps are needed by Vite to build)
ENV NODE_ENV=development
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY index.html vite.config.js eslint.config.js ./
COPY public ./public
COPY src ./src
# Bake VITE_* envs into the build
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV NODE_ENV=production
RUN npm run build

# --- Serve via nginx (unprivileged, runs as user 101) ---
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime
# Image's default user is already `nginx` (UID 101); don't toggle to root.
# nginx-unprivileged allows config + html copies as the non-root user.
COPY --chown=nginx:nginx docker/nginx-frontend.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html
EXPOSE 8080
# Healthcheck reaches the backend via the nginx proxy so a backend outage
# flips the frontend to "unhealthy" too — useful for orchestrator-driven
# rolling restarts.
HEALTHCHECK --interval=15s --timeout=3s --retries=3 --start-period=10s \
  CMD wget -q --spider http://127.0.0.1:8080/api/health || exit 1
CMD ["nginx", "-g", "daemon off;"]
