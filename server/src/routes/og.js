// Crawler-facing Open Graph renderer.
//
// The public site is a client-side SPA, so social scrapers (WhatsApp,
// facebookexternalhit, Twitterbot, Telegram, LinkedIn, Slack, Discord, Google)
// never execute the JS that sets per-page <meta> tags. nginx detects those
// user-agents and proxies their page requests here; we look the content up in
// the DB and return a tiny HTML document carrying the correct OG/Twitter meta
// so shared links render a rich card. Humans are served the SPA by nginx and
// never reach this route.

import { Router } from 'express';
import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
const SITE_URL = (process.env.SITE_URL || 'https://endulustravel.com').replace(/\/$/, '');
const DEFAULT_IMG = `${SITE_URL}/uploads/media/og-default.jpg`;

const abs = (u) => {
  if (!u) return DEFAULT_IMG;
  if (/^https?:\/\//i.test(u)) return u;
  return SITE_URL + (u.startsWith('/') ? '' : '/') + u;
};

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const clip = (s, n = 200) => {
  const t = String(s ?? '').replace(/\s+/g, ' ').trim();
  return t.length > n ? t.slice(0, n - 1).trimEnd() + '…' : t;
};

// first path segment (tr OR en spelling) -> logical kind
const SEG_KIND = {
  '': 'home',
  turlar: 'tours', tours: 'tours',
  'yurt-ici-turlar': 'domestic', 'domestic-tours': 'domestic',
  'yurt-disi-turlar': 'international', 'international-tours': 'international',
  'tur-planlama': 'planning', 'tour-planning': 'planning',
  blog: 'blog',
  hizmetler: 'services', services: 'services',
  hakkimizda: 'about', about: 'about',
  iletisim: 'contact', contact: 'contact',
  'on-anket': 'survey', survey: 'survey',
  'teklif-al': 'offer', 'request-offer': 'offer',
  'butceye-gore-rota': 'budget', 'budget-routes': 'budget',
  gizlilik: 'privacy', privacy: 'privacy',
  'kullanim-kosullari': 'terms', terms: 'terms',
  kvkk: 'kvkk',
};

// Static page meta (bilingual). Detail pages override from the DB entity.
const PAGES = {
  home: {
    tr: { t: 'Endülüs Travel — Hassasiyetinizle Kadim Diyarlara', d: 'İki kız kardeşin kurduğu; namaz vakitlerine uygun, helal mutfaklı, 15-20 kişilik butik turlar. Aileler ve hanımlar için huzurlu bir yol arkadaşlığı.' },
    en: { t: 'Endülüs Travel — Journeys With Your Values', d: 'Founded by two sisters; prayer-time-friendly, halal-cuisine, 15-20 guest boutique tours. A peaceful companionship for families and women.' },
  },
  tours: {
    tr: { t: 'Tur Paketleri — Endülüs Travel', d: 'Namaz vakitlerine ve helal mutfağa uygun, 15-20 kişilik butik tur paketleri. Mısır, Fas, Özbekistan ve daha fazlası.' },
    en: { t: 'Tour Packages — Endülüs Travel', d: 'Prayer-time-friendly, halal-cuisine boutique tours of 15-20 guests. Egypt, Morocco, Uzbekistan and more.' },
  },
  domestic: {
    tr: { t: 'Yurt İçi Turlar — Endülüs Travel', d: 'Kapadokya’dan İstanbul’a; değerlerinize uygun, butik yurt içi tur deneyimleri.' },
    en: { t: 'Domestic Tours — Endülüs Travel', d: 'From Cappadocia to Istanbul; boutique domestic tours aligned with your values.' },
  },
  international: {
    tr: { t: 'Yurt Dışı Turlar — Endülüs Travel', d: 'Fas’tan Mısır’a, Endülüs’ten Özbekistan’a; namaz vakitlerine uygun butik yurt dışı turlar.' },
    en: { t: 'International Tours — Endülüs Travel', d: 'From Morocco to Egypt and Uzbekistan; prayer-time-friendly boutique international tours.' },
  },
  planning: {
    tr: { t: 'Tur Planlama — Endülüs Travel', d: 'Adım adım sihirbazla hayalinizdeki rotayı tasarlayın; size özel teklif hazırlayalım.' },
    en: { t: 'Plan Your Tour — Endülüs Travel', d: 'Design your dream route with our step-by-step wizard; get a tailored offer.' },
  },
  blog: {
    tr: { t: 'Blog — Endülüs Travel', d: 'Rotalar, rehberler ve ilham veren seyahat hikâyeleri.' },
    en: { t: 'Blog — Endülüs Travel', d: 'Routes, guides and inspiring travel stories.' },
  },
  services: {
    tr: { t: 'Hizmetlerimiz — Endülüs Travel', d: 'Kişiye özel turlar, butik grup turları, aile turları ve kadın grupları.' },
    en: { t: 'Our Services — Endülüs Travel', d: 'Private tours, boutique group tours, family tours and women’s groups.' },
  },
  about: {
    tr: { t: 'Biz Kimiz — Endülüs Travel', d: 'Biri mühendis, biri diyetisyen iki kız kardeşin ortak tutkusundan doğan bir yol arkadaşlığı.' },
    en: { t: 'Who We Are — Endülüs Travel', d: 'A companionship born from the shared passion of two sisters — an engineer and a dietitian.' },
  },
  contact: {
    tr: { t: 'İletişim — Endülüs Travel', d: 'Telefon, WhatsApp, e-posta ve Kadıköy ofisimizle bize ulaşın.' },
    en: { t: 'Contact — Endülüs Travel', d: 'Reach us by phone, WhatsApp, email and our Kadıköy office.' },
  },
  survey: {
    tr: { t: 'Ön Anket — Endülüs Travel', d: 'Tercihlerinizi paylaşın, size özel kişiselleştirilmiş bir tur planı hazırlayalım.' },
    en: { t: 'Pre-Survey — Endülüs Travel', d: 'Share your preferences and we’ll craft a personalized tour plan for you.' },
  },
  offer: {
    tr: { t: 'Rezervasyon & Bilgi — Endülüs Travel', d: 'Yaklaşan turlarımıza katılın: turu ve tarihi seçin, ekibimiz 24 saat içinde rezervasyon için size dönsün.' },
    en: { t: 'Reservation & Info — Endülüs Travel', d: 'Join our upcoming tours: pick a tour and date and our team will reach out within 24 hours.' },
  },
  budget: {
    tr: { t: 'Bütçeye Göre Rota — Endülüs Travel', d: 'Bütçenize uygun, değerli rota seçenekleri.' },
    en: { t: 'Routes by Budget — Endülüs Travel', d: 'Value routes that fit your budget.' },
  },
  privacy: { tr: { t: 'Gizlilik Politikası — Endülüs Travel', d: 'Kişisel verilerinizi nasıl koruduğumuz.' }, en: { t: 'Privacy Policy — Endülüs Travel', d: 'How we protect your personal data.' } },
  terms: { tr: { t: 'Kullanım Koşulları — Endülüs Travel', d: 'Hizmetlerimizi kullanım koşulları.' }, en: { t: 'Terms of Use — Endülüs Travel', d: 'Terms for using our services.' } },
  kvkk: { tr: { t: 'KVKK Aydınlatma Metni — Endülüs Travel', d: '6698 sayılı Kanun kapsamında haklarınız.' }, en: { t: 'KVKK Notice — Endülüs Travel', d: 'Your rights under Turkish data law.' } },
};

const localize = (entity, lang, field) => {
  if (lang === 'en' && entity.translations && entity.translations.en && entity.translations.en[field]) {
    return entity.translations.en[field];
  }
  return entity[field];
};

const page = ({ url, title, description, image, type = 'website', lang }) => {
  const og = esc(title);
  const desc = esc(clip(description));
  const img = esc(abs(image));
  const u = esc(url);
  const locale = lang === 'en' ? 'en_US' : 'tr_TR';
  const altLocale = lang === 'en' ? 'tr_TR' : 'en_US';
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${og}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${u}">
<meta property="og:site_name" content="Endülüs Travel">
<meta property="og:title" content="${og}">
<meta property="og:description" content="${desc}">
<meta property="og:type" content="${esc(type)}">
<meta property="og:url" content="${u}">
<meta property="og:image" content="${img}">
<meta property="og:image:secure_url" content="${img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${locale}">
<meta property="og:locale:alternate" content="${altLocale}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${og}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${img}">
</head>
<body>
<h1>${og}</h1>
<p>${desc}</p>
<p><a href="${u}">${u}</a></p>
</body>
</html>`;
};

router.get('*', asyncHandler(async (req, res, next) => {
  const p = req.path;
  // Only handle public page paths; let assets/API/etc. fall through.
  if (/^\/(api|data|uploads|assets|admin)(\/|$)/.test(p) || /\.[a-z0-9]{2,5}$/i.test(p)) return next();

  const parts = p.split('/').filter(Boolean);
  let lang = 'tr';
  if (parts[0] === 'tr' || parts[0] === 'en') { lang = parts.shift(); }
  const firstSeg = parts[0] || '';
  const sub = parts[1] || '';
  const kind = SEG_KIND[firstSeg];

  const url = `${SITE_URL}${p}`;
  let meta = null;

  try {
    if (kind === 'tours' && sub) {
      const t = await prisma.tour.findUnique({ where: { slug: sub } });
      if (t && t.active) {
        meta = {
          title: `${localize(t, lang, 'title')} — Endülüs Travel`,
          description: localize(t, lang, 'description') || PAGES.tours[lang].d,
          image: t.image, type: 'product',
        };
      }
    } else if (kind === 'blog' && sub) {
      const b = await prisma.blogPost.findUnique({ where: { slug: sub } });
      if (b && b.active) {
        meta = { title: `${b.title} — Endülüs Travel`, description: b.summary || PAGES.blog[lang].d, image: b.coverImage, type: 'article' };
      }
    } else if (kind === 'services' && sub) {
      const s = await prisma.service.findFirst({ where: { serviceId: sub } });
      if (s && s.active) {
        meta = { title: `${s.title} — Endülüs Travel`, description: s.description || PAGES.services[lang].d, image: s.image, type: 'website' };
      }
    }
  } catch {
    meta = null; // DB hiccup → fall back to static meta below
  }

  if (!meta) {
    const pm = (PAGES[kind] || PAGES.home)[lang] || PAGES.home.tr;
    meta = { title: pm.t, description: pm.d, image: DEFAULT_IMG, type: kind === 'home' ? 'website' : 'website' };
  }

  res.type('html');
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
  res.send(page({ url, lang, ...meta }));
}));

export default router;
