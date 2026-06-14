// Single source of truth for analytics events.
//
// All marketing/analytics IDs come from build-time env vars (VITE_META_PIXEL_ID,
// VITE_GTM_ID, VITE_GA4_ID, VITE_META_IG_USERNAME). Missing → silent no-op.
//
// Every event:
//   - generates a stable `event_id` (used by Meta dedup between Pixel + CAPI)
//   - fires browser-side Pixel + dataLayer push
//   - optionally posts to our own /api/meta-capi for server-side mirroring

import { getUtmPayload, getMetaCookies } from './utm.js';

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || '';
const GTM_ID = import.meta.env.VITE_GTM_ID || '';
const GA4_ID = import.meta.env.VITE_GA4_ID || '';
const CAPI_ENABLED = (import.meta.env.VITE_META_CAPI_ENABLED || '').toLowerCase() === 'true';

let pixelLoaded = false;
let gtmLoaded = false;
let ga4Loaded = false;

// ---------------------------------------------------------------------------
// Loader: inject script tags lazily on first call. Idempotent.
// ---------------------------------------------------------------------------

const loadPixel = () => {
  if (pixelLoaded || !PIXEL_ID || typeof window === 'undefined') return;
  pixelLoaded = true;
  // Standard Meta Pixel snippet.
  /* eslint-disable */
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
    n.queue = []; t = b.createElement(e); t.async = !0; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  window.fbq('init', PIXEL_ID);
  window.fbq('track', 'PageView');
};

const loadGtm = () => {
  if (gtmLoaded || !GTM_ID || typeof window === 'undefined') return;
  gtmLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(s);
};

const loadGa4 = () => {
  if (ga4Loaded || !GA4_ID || GTM_ID /* GTM will load GA4 */ || typeof window === 'undefined') return;
  ga4Loaded = true;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA4_ID, { send_page_view: false });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(s);
};

export const initAnalytics = () => {
  loadPixel();
  loadGtm();
  loadGa4();
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const newEventId = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

const pushDataLayer = (payload) => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
};

const pixelTrack = (name, params, eventId) => {
  if (!PIXEL_ID || typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', name, params, { eventID: eventId });
};

// Server-side mirror. Best-effort — failures must not break UX.
const capiSend = async (event_name, eventId, custom_data, user_data_hint) => {
  if (!CAPI_ENABLED) return;
  try {
    await fetch('/api/meta-capi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      keepalive: true,
      body: JSON.stringify({
        event_name,
        event_id: eventId,
        event_source_url: typeof window !== 'undefined' ? window.location.href : null,
        custom_data,
        user_data: {
          ...getMetaCookies(),
          ...(user_data_hint || {}),
        },
        utm: getUtmPayload(),
      }),
    });
  } catch { /* swallow */ }
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const trackPageView = (path) => {
  pushDataLayer({ event: 'page_view', page_path: path });
  if (PIXEL_ID && typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
  if (GA4_ID && !GTM_ID && typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', { page_path: path });
  }
};

export const trackViewTour = (tour) => {
  if (!tour) return;
  const eventId = newEventId();
  const params = {
    content_ids: [tour.slug || tour.id],
    content_name: tour.title,
    content_category: 'tour',
    value: tour.pricePerPerson ?? tour.originalPrice ?? undefined,
    currency: tour.currency || 'TRY',
  };
  pixelTrack('ViewContent', params, eventId);
  pushDataLayer({ event: 'view_tour', tour: tour.slug, ...params });
  capiSend('ViewContent', eventId, params);
};

// Fired when a lead submits a contact / offer / survey form.
// `userData` should include the raw email/phone — server hashes before
// sending to Meta. Never store raw values in dataLayer.
export const trackLead = ({ kind, value, currency, tour } = {}, userData = {}) => {
  const eventId = newEventId();
  const params = {
    content_category: kind || 'contact',
    content_name: tour || undefined,
    value: value || undefined,
    currency: currency || 'TRY',
  };
  pixelTrack('Lead', params, eventId);
  pushDataLayer({ event: 'generate_lead', kind, tour, value, currency });
  // CAPI side gets the hashable values
  capiSend('Lead', eventId, params, userData);
  return eventId;
};

// Fired when a user opens WhatsApp / IG DM. Channel is 'whatsapp' or 'instagram'.
export const trackContact = ({ channel, tour } = {}) => {
  const eventId = newEventId();
  const params = {
    content_category: 'contact',
    content_name: channel,
    custom_data_channel: channel,
    content_ids: tour ? [tour] : undefined,
  };
  pixelTrack('Contact', params, eventId);
  pushDataLayer({ event: 'contact_click', channel, tour });
  capiSend('Contact', eventId, params);
  return eventId;
};

export const analyticsConfig = {
  pixelEnabled: !!PIXEL_ID,
  gtmEnabled: !!GTM_ID,
  ga4Enabled: !!GA4_ID,
  capiEnabled: CAPI_ENABLED,
};
