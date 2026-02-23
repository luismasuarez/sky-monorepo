import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

// Run npm run prisma:generate to generate the Prisma Client based on the schema.prisma file
import { PrismaClient } from './generated/prisma/client';


const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

async function main() {
  const plainPassword = 'Password123!';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // Crear usuario owner
  const owner = await prisma.user.create({
    data: {
      email: 'owner@gateway.com',
      password: hashedPassword,
      name: 'John Owner',
      roles: ['OWNER'],
    },
  });

  // Crear usuario admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@gateway.com',
      password: hashedPassword,
      name: 'Alice Admin',
      roles: ['ADMIN'],
    },
  });

  // Crear usuario user
  const user = await prisma.user.create({
    data: {
      email: 'user@gateway.com',
      password: hashedPassword,
      name: 'Jane User',
      roles: ['USER'],
      permissions: ['AUTH_ME_READ'],
    },
  });

  console.log('Seed completed!');
  console.log({ owner, admin, user });
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });