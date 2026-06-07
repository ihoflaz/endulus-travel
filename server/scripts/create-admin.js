// Create / upsert an admin user from env (ADMIN_EMAIL / ADMIN_PASSWORD).
// Usable from docker entrypoint or manually: `npm run create-admin`.
import { PrismaClient } from '@prisma/client';
import { hash as bcryptHash } from '../src/utils/password.js';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Admin';
  if (!email || !password) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD env vars required');
    process.exit(1);
  }
  const rounds = Number(process.env.BCRYPT_ROUNDS || 12);
  const passwordHash = await bcryptHash(password, rounds);
  const user = await prisma.user.upsert({
    where: { email },
    create: { email, passwordHash, name, role: 'ADMIN', active: true },
    update: { passwordHash, role: 'ADMIN', active: true, name },
  });
  console.log(`Admin user ready: ${user.email} (id=${user.id})`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
