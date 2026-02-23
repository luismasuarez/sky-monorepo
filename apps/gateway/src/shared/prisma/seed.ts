import { PrismaPg } from '@prisma/adapter-pg';

// Run npm run prisma:generate to generate the Prisma Client based on the schema.prisma file
import { PrismaClient } from './generated/prisma/client';


const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

async function main() {

  // Crear usuario owner
  const owner = await prisma.user.create({
    data: {
      email: 'owner@gateway.com',
      password: '$2a$10$abcdefghijklmnopqrstuvwxyz',
      name: 'John Owner',
      role: 'OWNER',
    },
  });

  // Crear usuario user
  const user = await prisma.user.create({
    data: {
      email: 'user@gateway.com',
      password: '$2a$10$abcdefghijklmnopqrstuvwxyz',
      name: 'Jane User',
      role: 'USER',
    },
  });

  console.log('Seed completed!');
  console.log({ owner, user });
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });