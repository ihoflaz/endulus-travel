import { prisma } from '../config/prisma.js';
import { crudRouter } from '../utils/crudRouter.js';
import { tourSchema } from '../schemas/entities.js';

// Strip admin-only fields from public responses (the legacy frontend doesn't
// know about them anyway, and they may contain operational notes).
const publicTourShape = (t) => ({
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
});

export default crudRouter({
  prismaModel: prisma.tour,
  schema: tourSchema,
  entity: 'Tour',
  findByParam: 'slug',
  searchFields: ['title', 'destination', 'description'],
  filterableFields: ['type', 'category', 'specialOffer', 'featured', 'currency'],
  publicShape: publicTourShape,
  // Public callers see { featured: [...] } — kept as the legacy shape. The
  // backend list returns ALL active tours; if you want only featured rows in
  // this endpoint, pass `?featured=true`.
  listEnvelope: (rows) => ({ featured: rows }),
});
