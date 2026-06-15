// Dynamic sitemap.xml + robots.txt. Lists static pages + every active tour
// and blog post slug, refreshed on every request (1h CDN cache acceptable).

import { Router } from 'express';
import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

const SITE_URL = process.env.SITE_URL || 'https://endulustravel.com';

const STATIC_PATHS = [
  { path: '/', priority: 1.0 },
  { path: '/turlar', priority: 0.9 },
  { path: '/yurt-ici-turlar', priority: 0.8 },
  { path: '/yurt-disi-turlar', priority: 0.8 },
  { path: '/tur-planlama', priority: 0.7 },
  { path: '/butceye-gore-rota', priority: 0.7 },
  { path: '/blog', priority: 0.7 },
  { path: '/hizmetler', priority: 0.6 },
  { path: '/hakkimizda', priority: 0.5 },
  { path: '/iletisim', priority: 0.6 },
  { path: '/on-anket', priority: 0.5 },
  { path: '/teklif-al', priority: 0.7 },
  { path: '/gizlilik', priority: 0.3 },
  { path: '/kullanim-kosullari', priority: 0.3 },
  { path: '/kvkk', priority: 0.3 },
];

const xmlEsc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
})[c]);

// Turkish first-segment -> { tr, en } localized segment (mirrors the frontend
// ROUTE_SEGMENTS so sitemap URLs match the actual /tr and /en routes).
const SEG = {
  '': { tr: '', en: '' },
  turlar: { tr: 'turlar', en: 'tours' },
  'yurt-ici-turlar': { tr: 'yurt-ici-turlar', en: 'domestic-tours' },
  'yurt-disi-turlar': { tr: 'yurt-disi-turlar', en: 'international-tours' },
  'tur-planlama': { tr: 'tur-planlama', en: 'tour-planning' },
  blog: { tr: 'blog', en: 'blog' },
  hizmetler: { tr: 'hizmetler', en: 'services' },
  hakkimizda: { tr: 'hakkimizda', en: 'about' },
  iletisim: { tr: 'iletisim', en: 'contact' },
  'on-anket': { tr: 'on-anket', en: 'survey' },
  'teklif-al': { tr: 'teklif-al', en: 'request-offer' },
  'butceye-gore-rota': { tr: 'butceye-gore-rota', en: 'budget-routes' },
  gizlilik: { tr: 'gizlilik', en: 'privacy' },
  'kullanim-kosullari': { tr: 'kullanim-kosullari', en: 'terms' },
  kvkk: { tr: 'kvkk', en: 'kvkk' },
};

// Build the {tr,en} URL pair for a first segment + optional sub-path (slug/id).
const pair = (firstSeg, sub = '') => {
  const m = SEG[firstSeg] || { tr: firstSeg, en: firstSeg };
  const tail = sub ? `/${sub}` : '';
  const j = (s) => (s ? `/${s}` : '');
  return {
    tr: `${SITE_URL}/tr${j(m.tr)}${tail}`,
    en: `${SITE_URL}/en${j(m.en)}${tail}`,
  };
};

// Each logical page emits two <url> nodes (tr + en), each carrying the full
// hreflang alternate set (tr, en, x-default=tr).
const pageNodes = ({ tr, en, lastmod, priority }) => {
  const alts = `    <xhtml:link rel="alternate" hreflang="tr" href="${xmlEsc(tr)}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${xmlEsc(en)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEsc(tr)}"/>`;
  const node = (loc) => `  <url>
    <loc>${xmlEsc(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>` : ''}
    <priority>${priority.toFixed(1)}</priority>
${alts}
  </url>`;
  return `${node(tr)}\n${node(en)}`;
};

router.get(
  '/sitemap.xml',
  asyncHandler(async (_req, res) => {
    const [tours, posts] = await Promise.all([
      prisma.tour.findMany({
        where: { active: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.blogPost.findMany({
        where: { active: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);
    const pages = [
      ...STATIC_PATHS.map((p) => {
        const firstSeg = p.path.replace(/^\//, '');
        return { ...pair(firstSeg), lastmod: new Date(), priority: p.priority };
      }),
      ...tours.map((t) => ({ ...pair('turlar', t.slug), lastmod: t.updatedAt, priority: 0.8 })),
      ...posts.map((p) => ({ ...pair('blog', p.slug), lastmod: p.updatedAt, priority: 0.6 })),
    ];
    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.map(pageNodes).join('\n')}
</urlset>`;
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.send(body);
  })
);

router.get('/robots.txt', (_req, res) => {
  const body = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: ${SITE_URL}/sitemap.xml
`;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(body);
});

export default router;
