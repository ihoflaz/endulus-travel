import { prisma } from '../config/prisma.js';
import { crudRouter } from '../utils/crudRouter.js';
import { blogSchema } from '../schemas/entities.js';

const publicBlogShape = (p) => ({
  slug: p.slug,
  title: p.title,
  summary: p.summary,
  content: p.content,
  coverImage: p.coverImage,
  category: p.category,
  date: p.date,
  author: p.author,
});

export default crudRouter({
  prismaModel: prisma.blogPost,
  schema: blogSchema,
  entity: 'BlogPost',
  findByParam: 'slug',
  searchFields: ['title', 'summary', 'category', 'author'],
  filterableFields: ['category', 'author'],
  publicShape: publicBlogShape,
});
