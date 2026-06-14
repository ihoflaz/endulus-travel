# Endülüs Travel — Deployment Guide

## TL;DR

```bash
git clone <repo> /opt/endulus
cd /opt/endulus
cp .env.example .env
# Edit .env — fill JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, POSTGRES_PASSWORD, ADMIN_PASSWORD
docker compose up -d --build
```

After ~90 seconds the stack is healthy. Visit `http://localhost:8080` from the server (or set up the edge nginx, below) and log in at `/admin/login` with the credentials from `.env`.

---

## 1. Secrets — fill these in `.env`

```bash
# Generate strong values
openssl rand -hex 32  # → JWT_ACCESS_SECRET
openssl rand -hex 32  # → JWT_REFRESH_SECRET
openssl rand -hex 24  # → POSTGRES_PASSWORD (URL-safe — no @ : / # ?)
```

| Variable | Purpose | Required |
|---|---|---|
| `JWT_ACCESS_SECRET` | Signs access JWT | ✅ ≥32 chars |
| `JWT_REFRESH_SECRET` | Signs refresh JWT | ✅ ≥32 chars, different from access |
| `POSTGRES_PASSWORD` | DB superuser password | ✅ URL-safe |
| `ADMIN_EMAIL`/`ADMIN_PASSWORD` | First admin login | ✅ password ≥10 chars |
| `CORS_ORIGIN` | Comma-separated allowed origins | ✅ production domains |
| `TRUST_PROXY` | `2` behind Cloudflare→nginx, `1` for nginx only | ✅ |
| `RUN_SEED` | `true` on first boot, `false` after | optional |

The backend will refuse to start if any placeholder (`__REQUIRED__…`) is still present.

### Marketing & analytics (optional but recommended)

| Variable | Purpose |
|---|---|
| `VITE_META_PIXEL_ID` | Meta Pixel ID — baked into the JS bundle, exposed to browser |
| `META_DATASET_ID` | Same value as Pixel ID, used server-side for CAPI |
| `META_CAPI_ACCESS_TOKEN` | Server-only CAPI token (Meta Events Manager → Settings) |
| `META_TEST_EVENT_CODE` | Set during testing; remove for live traffic |
| `VITE_GTM_ID` | Google Tag Manager container ID (loads GA4 inside GTM) |
| `VITE_GA4_ID` | Direct GA4 measurement ID (only when not using GTM) |
| `VITE_META_IG_USERNAME` | Used by IG DM buttons; e.g. `endulustravell` |
| `VITE_META_CAPI_ENABLED` | `true` to mirror Pixel events to /api/meta-capi |

When `META_DATASET_ID` + `META_CAPI_ACCESS_TOKEN` are set, `/api/meta-capi`
forwards events to Meta with SHA-256 hashed email/phone. Both Pixel and CAPI
fire the same `event_id`, so Meta deduplicates automatically.

### SMTP (form notifications)

| Variable | Purpose |
|---|---|
| `SMTP_HOST` | leave empty to disable mailer |
| `SMTP_PORT` | 587 (STARTTLS) or 465 (TLS) |
| `SMTP_USER`/`SMTP_PASS` | credentials (no auth if both empty) |
| `MAIL_FROM` | `Endülüs Travel <info@endulustravel.com>` |
| `OPS_EMAIL` | where new lead notifications are sent |

When set, every public POST to `/api/messages` triggers two emails: a
notification to `OPS_EMAIL` and an acknowledgement to the visitor.

---

## 2. First boot

```bash
docker compose up -d --build
docker compose logs -f backend
```

Watch for:
```
[seed] created admin user: admin@endulustravel.com
[server] listening on http://0.0.0.0:4000 (production)
```

If the admin user already exists (rebooting), seed says `[seed] admin already exists` — that's fine.

After verifying you can log in, set `RUN_SEED=false` in `.env` and `docker compose up -d` again. This prevents content rows admins deleted from being silently re-created on restart.

---

## 3. Bare-metal nginx (recommended for HTTPS)

The Docker stack publishes ports on `127.0.0.1` only. A host-level nginx terminates TLS and proxies to those loopback ports.

```bash
sudo apt install nginx certbot python3-certbot-nginx
sudo cp /opt/endulus/docker/nginx-edge.conf.example /etc/nginx/sites-available/endulustravel
# Edit server_name, paths, then symlink:
sudo ln -s /etc/nginx/sites-available/endulustravel /etc/nginx/sites-enabled/
sudo certbot --nginx -d endulustravel.com -d www.endulustravel.com
sudo nginx -t && sudo systemctl reload nginx
```

Uncomment the SSL block in the example after Certbot writes the cert files.

---

## 4. Backups

```bash
docker compose --profile backup up -d
# Daily dumps written to the `endulus_backup_data` volume.
docker run --rm -v endulus_backup_data:/backups alpine ls -lh /backups
```

Off-site copy (rsync the backup volume to S3/B2/etc.):

```bash
docker run --rm -v endulus_backup_data:/backups alpine \
  tar czf - /backups | aws s3 cp - s3://my-bucket/endulus/backups-$(date +%F).tar.gz
```

Restore from a `.dump`:

```bash
docker compose exec -T postgres pg_restore -U endulus -d endulus -c < endulus-YYYYMMDD-HHMMSS.dump
```

---

## 5. Periodic cleanup

```bash
docker compose exec backend node scripts/cleanup.js
```

Removes:
- `AuditLog` rows older than 180 days
- Expired or revoked `RefreshToken` rows older than 7 days
- `ContactMessage` rows that were archived more than 365 days ago

Schedule via host cron:

```cron
0 3 * * * docker compose -f /opt/endulus/docker-compose.yml exec -T backend node scripts/cleanup.js
```

---

## 6. Updating

```bash
cd /opt/endulus
git pull
docker compose up -d --build
```

The backend runs `prisma migrate deploy` on every start — schema changes apply automatically. Migrations are immutable; rolling back means restoring the previous backup.

---

## 7. Health & monitoring

| Endpoint | What it checks |
|---|---|
| `https://endulustravel.com/api/health` | Process alive |
| `https://endulustravel.com/api/health/full` | Process + Postgres ping (3s budget) |

Logs (rotated automatically — 10MB × 5 per service):

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

---

## 8. Initial post-deploy checklist

1. ✅ Log in to `/admin/login` with the seeded admin
2. ✅ Go to **Profilim** → change the password
3. ✅ **Site & SEO** → set title, description, og:image, favicon
4. ✅ **İletişim** → real phone, email, address, working hours, map embed
5. ✅ **WhatsApp** → real number + default message
6. ✅ **Footer** → legal name, license number, copyright
7. ✅ **Yasal Sayfalar** → fill gizlilik/kullanım-koşulları/KVKK bodies
8. ✅ **Hero Slides** → upload real slider images
9. ✅ Verify the public site renders all the above
10. ✅ Submit a test message from the contact form, check it appears in **Mesajlar**

---

## 9. Troubleshooting

**Backend container restarts in a loop.**
Check `docker compose logs backend` — usually a missing env var or invalid migration. `EXPOSE_ERRORS=true` in `.env` will surface the stack trace in API responses (turn off after debugging).

**Admin login fails with "Invalid credentials" after deploy.**
If you changed `ADMIN_PASSWORD` after first seed, the existing row was not updated. Two options:
1. Run `docker compose exec backend npm run create-admin` (upserts).
2. Or reset the password via psql.

**Frontend shows stale data.**
The `/data/*.json` routes carry `Cache-Control: max-age=60, s-maxage=60, stale-while-revalidate=300`. Wait a minute or hard-reload (Ctrl-F5). At the CDN edge, purge `/data/*` after major content updates.

**Cannot upload file (413 / 500).**
`MAX_UPLOAD_BYTES` is 10 MB. Increase in `.env` AND in `docker/nginx-frontend.conf` (`client_max_body_size`) AND in the host nginx config.
