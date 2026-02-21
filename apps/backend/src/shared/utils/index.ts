import { PrismaPg } from '@prisma/adapter-pg';

// Singleton para evitar múltiples instancias en desarrollo
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaPg | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaPg({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Re-export Prisma types y helpers
export * from '@prisma/client';
export * from './helpers';

