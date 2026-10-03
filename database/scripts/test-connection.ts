import { loadDatabaseEnv } from '../load-env.js';
import { PrismaClient } from '@medease/prisma';

async function main() {
  loadDatabaseEnv();

  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    const count = await prisma.tenant.count();
    console.log(JSON.stringify({ ok: true, tenantCount: count }));
  } catch (error) {
    console.error(
      JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      }),
    );
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
