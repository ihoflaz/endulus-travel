// Legacy data routes — emit JSON in the exact shape the original
// public/data/*.json files used, so the public frontend can keep its
// existing fetch('data/X.json') calls working unchanged.

import { Router } from 'express';
import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// Short TTL caching: edge/CDN can cache for 60s and revalidate up to 5min
// while the backend regenerates. Admin edits become visible within a minute.
router.use((_req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60, stale-while-revalidate=300');
  next();
});

router.get(
  '/tours.json',
  asyncHandler(async (_req, res) => {
    const tours = await prisma.tour.findMany({
      where: { active: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    const featured = tours.map((t) => ({
      id: t.slug,
      slug: t.slug,
      title: t.title,
      description: t.description,
      pricePerPerson: t.pricePerPerson,
      originalPrice: t.originalPrice,
      campaignPrice: t.campaignPrice,
      currency: t.currency,
      priceStatus: t.priceStatus,
      priceNote: t.priceNote,
      groupSize: t.groupSize,
      category: t.category,
      type: t.type,
      destination: t.destination,
      image: t.image,
      gallery: t.gallery,
      specialOffer: t.specialOffer,
      dates: t.dates,
      duration: t.duration,
      highlights: t.highlights,
      included: t.included,
      notIncluded: t.notIncluded,
      itinerary: t.itinerary,
      faq: t.faq,
      translations: t.translations,
      whatsappMessage: t.whatsappMessage,
    }));
    res.json({ featured });
  })
);

router.get(
  '/blog.json',
  asyncHandler(async (_req, res) => {
    const posts = await prisma.blogPost.findMany({
      where: { active: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    res.json(posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      content: p.content,
      coverImage: p.coverImage,
      category: p.category,
      date: p.date,
      author: p.author,
    })));
  })
);

router.get(
  '/services.json',
  asyncHandler(async (_req, res) => {
    const services = await prisma.service.findMany({
      where: { active: true, isWomenGroup: false },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
    res.json(services.map((s) => ({
      id: s.serviceId,
      title: s.title,
      description: s.description,
      icon: s.icon,
    })));
  })
);

router.get(
  '/women-groups.json',
  asyncHandler(async (_req, res) => {
    const services = await prisma.service.findMany({
      where: { active: true, isWomenGroup: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
    res.json(services.map((s) => ({
      id: s.serviceId,
      title: s.title,
      description: s.description,
      icon: s.icon,
    })));
  })
);

router.get(
  '/service-content.json',
  asyncHandler(async (_req, res) => {
    const services = await prisma.service.findMany({
      where: { active: true },
    });
    const obj = {};
    for (const s of services) {
      obj[s.serviceId] = {
        image: s.image,
        fullDescription: s.fullDescription,
        features: s.features,
      };
    }
    res.json(obj);
  })
);

router.get(
  '/hero.json',
  asyncHandler(async (_req, res) => {
    const [slides, buttons, slogan] = await Promise.all([
      prisma.heroSlide.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
      prisma.heroButton.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
      prisma.setting.findUnique({ where: { key: 'hero.slogan' } }),
    ]);
    res.json({
      slides: slides.map((s) => ({ image: s.image, alt: s.alt })),
      slogan: slogan?.value ?? '',
      buttons: buttons.map((b) => ({
        label: b.label,
        labelKey: b.labelKey,
        href: b.href,
        style: b.style,
      })),
    });
  })
);

router.get(
  '/categories.json',
  asyncHandler(async (_req, res) => {
    const cats = await prisma.category.findMany({
      where: { active: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
    res.json(cats.map((c) => ({
      key: c.key,
      label: c.label,
      description: c.description,
    })));
  })
);

const buildOptions = async (filter) => {
  const opts = await prisma.formOption.findMany({
    where: { active: true, ...filter },
    orderBy: [{ groupName: 'asc' }, { order: 'asc' }],
  });
  const grouped = {};
  for (const o of opts) {
    if (!grouped[o.groupName]) grouped[o.groupName] = [];
    grouped[o.groupName].push({ value: o.value, label: o.label });
  }
  return grouped;
};

router.get(
  '/form-options.json',
  asyncHandler(async (_req, res) => {
    const grouped = await buildOptions({ NOT: { groupName: { startsWith: 'survey.' } } });
    res.json(grouped);
  })
);

router.get(
  '/survey-questions.json',
  asyncHandler(async (_req, res) => {
    const grouped = await buildOptions({ groupName: { startsWith: 'survey.' } });
    // Strip "survey." prefix to match legacy file shape
    const out = {};
    for (const [k, v] of Object.entries(grouped)) {
      out[k.replace(/^survey\./, '')] = v;
    }
    res.json(out);
  })
);

router.get(
  '/budget-routes.json',
  asyncHandler(async (_req, res) => {
    const rows = await prisma.budgetRoute.findMany({
      where: { active: true },
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
    });
    res.json(rows.map((r, i) => ({
      // Keep `id` numeric for backwards compatibility with the legacy frontend
      // (it does `routes.find(r => r.id === 3)`); for newer cuid-only rows we
      // expose a synthetic positional index so .find(x => x.id === N) still
      // works deterministically within a single response.
      id: r.legacyId ?? i + 1000,
      persons: r.persons,
      budget: r.budget,
      destination: r.destination,
      days: r.days,
      departure: r.departure,
      image: r.image,
      description: r.description,
      highlights: r.highlights,
      price: r.price,
    })));
  })
);

router.get(
  '/tour-wizard.json',
  asyncHandler(async (_req, res) => {
    const steps = await prisma.tourWizardStep.findMany({
      where: { active: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
    res.json(steps.map((s) => ({
      step: s.step,
      title: s.title,
      description: s.description,
      options: s.options || [],
    })));
  })
);

router.get(
  '/reviews.json',
  asyncHandler(async (req, res) => {
    const where = { isPublished: true };
    if (req.query.tourSlug) where.tourSlug = String(req.query.tourSlug);
    const rows = await prisma.review.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    res.json(rows.map((r) => ({
      id: r.id,
      tourSlug: r.tourSlug,
      authorName: r.authorName,
      location: r.location,
      rating: r.rating,
      content: r.content,
    })));
  })
);

router.get(
  '/contact.json',
  asyncHandler(async (_req, res) => {
    const s = await prisma.setting.findUnique({ where: { key: 'contact' } });
    res.json(s?.value ?? {});
  })
);

router.get(
  '/about.json',
  asyncHandler(async (_req, res) => {
    const s = await prisma.setting.findUnique({ where: { key: 'about' } });
    res.json(s?.value ?? {});
  })
);

export default router;
