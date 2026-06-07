import { prisma } from '../config/prisma.js';
import { crudRouter } from '../utils/crudRouter.js';
import { tourWizardStepSchema } from '../schemas/entities.js';

const publicWizardShape = (s) => ({
  step: s.step,
  title: s.title,
  description: s.description,
  options: s.options || [],
});

export default crudRouter({
  prismaModel: prisma.tourWizardStep,
  schema: tourWizardStepSchema,
  entity: 'TourWizardStep',
  findByParam: 'step',
  filterableFields: [],
  publicShape: publicWizardShape,
});
