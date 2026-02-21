import { PrismaPg } from '@prisma/adapter-pg';
// Run npm run prisma:generate to generate the Prisma Client based on the schema.prisma file
import { PrismaClient } from '../prisma/generated/prisma/client';


const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});
async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error('Usage: npx tsx scripts/make-host.ts <email>');
    process.exit(1);
  }

  const user = await prisma.user.update({
    where: { email },
    data: { role: 'HOST' },
  });

  console.log('User updated to HOST:', user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());