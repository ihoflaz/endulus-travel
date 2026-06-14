// Server-side Meta Conversions API (CAPI) proxy.
//
// Why a proxy? The Meta access token must never reach the browser. The
// frontend sends only event metadata + (raw email/phone hints when allowed),
// we hash PII with SHA-256 and forward to Meta Graph.
//
// Disabled cleanly when META_CAPI_ACCESS_TOKEN or META_DATASET_ID is unset.

import { Router } from 'express';
import crypto from 'node:crypto';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN || '';
const DATASET_ID = process.env.META_DATASET_ID || '';
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE || '';
const ENABLED = !!ACCESS_TOKEN && !!DATASET_ID;

const sha256 = (v) => crypto.createHash('sha256').update(String(v)).digest('hex');

// Normalize before hashing per Meta's spec: trim, lowercase email, strip
// non-digit chars from phone, then add country code if missing.
const normalizeEmail = (v) => String(v || '').trim().toLowerCase();
const normalizePhone = (v) => {
  let p = String(v || '').replace(/\D/g, '');
  if (!p) return '';
  if (p.length === 10) p = '90' + p;        // assume Turkish if 10 digits
  else if (p.startsWith('0')) p = '90' + p.slice(1);
  return p;
};

const buildUserData = ({ user_data = {}, req }) => {
  const ud = {
    client_ip_address: req.ip,
    client_user_agent: req.headers['user-agent'],
  };
  if (user_data.em) ud.em = [sha256(normalizeEmail(user_data.em))];
  if (user_data.ph) {
    const norm = normalizePhone(user_data.ph);
    if (norm) ud.ph = [sha256(norm)];
  }
  if (user_data.fbp) ud.fbp = user_data.fbp;
  if (user_data.fbc) ud.fbc = user_data.fbc;
  if (user_data.external_id) ud.external_id = [sha256(String(user_data.external_id))];
  return ud;
};

const bodySchema = z.object({
  event_name: z.enum(['PageView', 'ViewContent', 'Lead', 'Contact', 'InitiateCheckout', 'Purchase']),
  event_id: z.string().min(1).max(128),
  event_source_url: z.string().url().optional().nullable(),
  user_data: z.object({
    // Lenient on shape — a malformed email must NOT 4xx the whole conversion
    // event. normalizeEmail + hash handle whatever comes in.
    em: z.string().max(254).optional(),
    ph: z.string().max(64).optional(),
    fbp: z.string().max(256).nullable().optional(),
    fbc: z.string().max(256).nullable().optional(),
    external_id: z.string().max(128).optional(),
  }).optional(),
  custom_data: z.record(z.unknown()).optional(),
  utm: z.record(z.string().nullable()).optional(),
}).strict();

router.get('/health', (_req, res) => {
  res.json({ enabled: ENABLED });
});

router.post(
  '/',
  validate({ body: bodySchema }),
  asyncHandler(async (req, res) => {
    if (!ENABLED) {
      // Silent accept so the frontend's keepalive fetch doesn't surface
      // errors when CAPI hasn't been configured yet. Returns 204 No Content.
      return res.status(204).end();
    }
    const { event_name, event_id, event_source_url, custom_data, utm, user_data } = req.body;
    const payload = {
      data: [{
        event_name,
        event_id,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: event_source_url || undefined,
        user_data: buildUserData({ user_data, req }),
        custom_data: {
          ...(custom_data || {}),
          ...(utm || {}),
        },
      }],
      ...(TEST_EVENT_CODE ? { test_event_code: TEST_EVENT_CODE } : {}),
    };
    try {
      const resp = await fetch(
        `https://graph.facebook.com/v20.0/${DATASET_ID}/events?access_token=${encodeURIComponent(ACCESS_TOKEN)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      const text = await resp.text();
      if (!resp.ok) {
        console.error('[capi] Meta error', resp.status, text);
        return res.status(502).json({ ok: false, error: 'Meta API error' });
      }
      res.json({ ok: true, meta: text ? JSON.parse(text) : null });
    } catch (e) {
      console.error('[capi] forwarding failed:', e?.message);
      res.status(502).json({ ok: false, error: 'CAPI forwarding failed' });
    }
  })
);

export default router;
