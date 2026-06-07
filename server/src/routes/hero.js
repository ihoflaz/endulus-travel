import { Router } from 'express';
import { prisma } from '../config/prisma.js';
import { optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { crudRouter } from '../utils/crudRouter.js';
import { heroSlideSchema, heroButtonSchema } from '../schemas/entities.js';

const router = Router();

const publicSlideShape = (s) => ({ image: s.image, alt: s.alt });
const publicButtonShape = (b) => ({
  label: b.label,
  labelKey: b.labelKey,
  href: b.href,
  style: b.style,
});

// GET /api/hero — composite: { slides, buttons, slogan }
router.get(
  '/',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const slidesWhere = req.user ? {} : { active: true };
    const buttonsWhere = req.user ? {} : { active: true };
    const [slides, buttons, slogan] = await Promise.all([
      prisma.heroSlide.findMany({ where: slidesWhere, orderBy: { order: 'asc' } }),
      prisma.heroButton.findMany({ where: buttonsWhere, orderBy: { order: 'asc' } }),
      prisma.setting.findUnique({ where: { key: 'hero.slogan' } }),
    ]);
    const shapedSlides = req.user ? slides : slides.map(publicSlideShape);
    const shapedButtons = req.user ? buttons : buttons.map(publicButtonShape);
    res.json({ slides: shapedSlides, buttons: shapedButtons, slogan: slogan?.value ?? '' });
  })
);

// Slogan editing is handled exclusively via /api/settings/hero.slogan to avoid
// two write paths for the same key. We keep no slogan endpoint on /api/hero.

router.use('/slides', crudRouter({
  prismaModel: prisma.heroSlide,
  schema: heroSlideSchema,
  entity: 'HeroSlide',
  filterableFields: [],
  publicShape: publicSlideShape,
}));

router.use('/buttons', crudRouter({
  prismaModel: prisma.heroButton,
  schema: heroButtonSchema,
  entity: 'HeroButton',
  filterableFields: [],
  publicShape: publicButtonShape,
}));

export default router;
