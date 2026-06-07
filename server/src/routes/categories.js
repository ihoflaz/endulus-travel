import { prisma } from '../config/prisma.js';
import { crudRouter } from '../utils/crudRouter.js';
import { categorySchema } from '../schemas/entities.js';

const publicCategoryShape = (c) => ({
  key: c.key,
  label: c.label,
  description: c.description,
});

// PUT must not allow changing `key` (other tables reference it as FK-by-string).
export default crudRouter({
  prismaModel: prisma.category,
  schema: categorySchema,
  updateSchema: categorySchema.omit({ key: true }).partial(),
  entity: 'Category',
  findByParam: 'key',
  searchFields: ['label', 'description'],
  filterableFields: [],
  publicShape: publicCategoryShape,
});
