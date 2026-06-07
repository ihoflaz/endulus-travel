// Daily cleanup of expired/old rows so growing tables stay bounded.
// Run via `npm run cleanup` or schedule with cron.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const AUDIT_RETENTION_DAYS = Number(process.env.AUDIT_RETENTION_DAYS || 180);
const REFRESH_GRACE_DAYS = Number(process.env.REFRESH_GRACE_DAYS || 7);
const MESSAGE_ARCHIVE_DAYS = Number(process.env.MESSAGE_ARCHIVE_DAYS || 365);

const daysAgo = (n) => new Date(Date.now() - n * 86_400_000);

const main = async () => {
  const audit = await prisma.auditLog.deleteMany({
    where: { createdAt: { lt: daysAgo(AUDIT_RETENTION_DAYS) } },
  });
  console.log(`[cleanup] removed ${audit.count} audit rows older than ${AUDIT_RETENTION_DAYS}d`);

  const tokens = await prisma.refreshToken.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: daysAgo(REFRESH_GRACE_DAYS) } },
        { revoked: true, createdAt: { lt: daysAgo(REFRESH_GRACE_DAYS) } },
      ],
    },
  });
  console.log(`[cleanup] removed ${tokens.count} expired/revoked refresh tokens`);

  const msgs = await prisma.contactMessage.deleteMany({
    where: {
      status: 'ARCHIVED',
      updatedAt: { lt: daysAgo(MESSAGE_ARCHIVE_DAYS) },
    },
  });
  console.log(`[cleanup] removed ${msgs.count} archived messages older than ${MESSAGE_ARCHIVE_DAYS}d`);
};

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
