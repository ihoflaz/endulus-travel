import { PrismaClient } from '@prisma/client';
import { isProd } from './env.js';

const isTest = process.env.NODE_ENV === 'test';
const logLevel = isTest
  ? ['error']
  : isProd
    ? ['warn', 'error']
    : ['query', 'warn', 'error'];

export const prisma = new PrismaClient({ log: logLevel });

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
