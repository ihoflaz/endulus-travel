import { prisma } from '../config/prisma.js';
import { crudRouter } from '../utils/crudRouter.js';
import { reviewSchema } from '../schemas/entities.js';

// Public callers only ever see published reviews; admins (authenticated) see all.
const publicReviewShape = (r) => ({
  id: r.id,
  tourSlug: r.tourSlug,
  authorName: r.authorName,
  location: r.location,
  rating: r.rating,
  content: r.content,
});

export default crudRouter({
  prismaModel: prisma.review,
  schema: reviewSchema,
  entity: 'Review',
  publicFilter: () => ({ isPublished: true }),
  adminFilter: () => ({}),
  publicShape: publicReviewShape,
  filterableFields: ['tourSlug', 'isPublished'],
  listOrderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
});
