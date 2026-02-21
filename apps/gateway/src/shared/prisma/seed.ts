import { PrismaPg } from '@prisma/adapter-pg';

// Run npm run prisma:generate to generate the Prisma Client based on the schema.prisma file
import { PrismaClient } from './generated/prisma/client';


const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

async function main() {

  // Crear usuario host
  const host = await prisma.user.create({
    data: {
      email: 'admin@gateway.com',
      password: '$2a$10$abcdefghijklmnopqrstuvwxyz',
      name: 'John Host',
      role: 'HOST',
    },
  });

  // Crear usuario guest
  const guest = await prisma.user.create({
    data: {
      email: 'guest@gateway.com',
      password: '$2a$10$abcdefghijklmnopqrstuvwxyz',
      name: 'Jane Guest',
      role: 'GUEST',
    },
  });

  console.log('Seed completed!');
  console.log({ host, guest });
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });