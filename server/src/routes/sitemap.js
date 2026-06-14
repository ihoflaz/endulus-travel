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

const formatNode = ({ url, lastmod, priority }) =>
  `  <url>
    <loc>${xmlEsc(url)}</loc>
    ${lastmod ? `<lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>` : ''}
    <priority>${priority.toFixed(1)}</priority>
  </url>`;

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
    const urls = [
      ...STATIC_PATHS.map((p) => ({
        url: `${SITE_URL}${p.path}`,
        lastmod: new Date(),
        priority: p.priority,
      })),
      ...tours.map((t) => ({
        url: `${SITE_URL}/turlar/${t.slug}`,
        lastmod: t.updatedAt,
        priority: 0.8,
      })),
      ...posts.map((p) => ({
        url: `${SITE_URL}/blog/${p.slug}`,
        lastmod: p.updatedAt,
        priority: 0.6,
      })),
    ];
    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(formatNode).join('\n')}
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
