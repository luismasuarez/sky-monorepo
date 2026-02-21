import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

/**
 * Prisma Client Singleton for Next.js
 *
 * This singleton ensures a single PrismaClient instance across the application,
 * with proper handling for hot-reloading in development mode.
 *
 * Usage in Server Components:
 * ```typescript
 * import { prisma } from '@/lib/prisma/prisma.service';
 *
 * const users = await prisma.user.findMany();
 * ```
 *
 * Usage in API Routes:
 * ```typescript
 * import { prisma } from '@/lib/prisma/prisma.service';
 *
 * export async function GET() {
 *   const users = await prisma.user.findMany();
 *   return Response.json(users);
 * }
 * ```
 *
 * Usage in Server Actions:
 * ```typescript
 * 'use server'
 * import { prisma } from '@/lib/prisma/prisma.service';
 *
 * export async function createUser(data: any) {
 *   return await prisma.user.create({ data });
 * }
 * ```
 */

const prismaClientSingleton = () => {
  // Create PostgreSQL connection pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  // Create Prisma adapter for PostgreSQL
  const adapter = new PrismaPg(pool)

  // Create and return PrismaClient instance
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

// Declare global type for TypeScript
declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

// Create singleton instance
// In development, preserve the instance across hot-reloads
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}

export default prisma
