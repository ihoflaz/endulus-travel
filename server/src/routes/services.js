import { prisma } from '../config/prisma.js';
import { crudRouter } from '../utils/crudRouter.js';
import { serviceSchema } from '../schemas/entities.js';

const publicServiceShape = (s) => ({
  id: s.serviceId,
  serviceId: s.serviceId,
  title: s.title,
  description: s.description,
  icon: s.icon,
  image: s.image,
  fullDescription: s.fullDescription,
  features: s.features,
  isWomenGroup: s.isWomenGroup,
});

export default crudRouter({
  prismaModel: prisma.service,
  schema: serviceSchema,
  entity: 'Service',
  findByParam: 'serviceId',
  searchFields: ['title', 'description'],
  filterableFields: ['isWomenGroup'],
  publicShape: publicServiceShape,
});
