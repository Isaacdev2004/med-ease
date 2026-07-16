import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import { newId } from '@medease/uuid';

import { PrismaClient } from '../generated/client';
import {
  applyPrismaRequestContext,
  clearPrismaRequestContext,
  runInSystemTransaction,
  runInTransactionWithRequestContext,
} from './request-context';

const DATABASE_URL = process.env.DATABASE_URL;
const describeIf = DATABASE_URL ? describe : describe.skip;

describeIf('RLS tenant isolation', () => {
  const prisma = new PrismaClient();
  const tenantA = newId();
  const tenantB = newId();
  const orgA = newId();
  const orgB = newId();

  before(async () => {
    await runInSystemTransaction(prisma, async (tx) => {
      await tx.tenant.createMany({
        data: [
          { id: tenantA, name: 'Tenant A', slug: `tenant-a-${tenantA.slice(0, 8)}` },
          { id: tenantB, name: 'Tenant B', slug: `tenant-b-${tenantB.slice(0, 8)}` },
        ],
      });

      await tx.organization.createMany({
        data: [
          { id: orgA, tenantId: tenantA, name: 'Org A', slug: 'org-a' },
          { id: orgB, tenantId: tenantB, name: 'Org B', slug: 'org-b' },
        ],
      });
    });
  });

  after(async () => {
    await runInSystemTransaction(prisma, async (tx) => {
      await tx.organization.deleteMany({ where: { id: { in: [orgA, orgB] } } });
      await tx.tenant.deleteMany({ where: { id: { in: [tenantA, tenantB] } } });
    });
    await prisma.$disconnect();
  });

  it('returns no tenant rows without session context', async () => {
    const tenants = await prisma.tenant.findMany({
      where: { id: { in: [tenantA, tenantB] } },
    });
    assert.equal(tenants.length, 0);
  });

  it('scopes organizations to the active tenant context', async () => {
    const orgsForA = await runInTransactionWithRequestContext(
      prisma,
      {
        requestId: 'req-a',
        correlationId: 'corr-a',
        tenantId: tenantA,
        organizationId: orgA,
        roles: ['physician'],
        permissions: [],
      },
      (tx) => tx.organization.findMany({ where: { id: { in: [orgA, orgB] } } }),
    );

    assert.equal(orgsForA.length, 1);
    assert.equal(orgsForA[0]?.id, orgA);

    const orgsForB = await runInTransactionWithRequestContext(
      prisma,
      {
        requestId: 'req-b',
        correlationId: 'corr-b',
        tenantId: tenantB,
        organizationId: orgB,
        roles: ['physician'],
        permissions: [],
      },
      (tx) => tx.organization.findMany({ where: { id: { in: [orgA, orgB] } } }),
    );

    assert.equal(orgsForB.length, 1);
    assert.equal(orgsForB[0]?.id, orgB);
  });

  it('allows system context for cross-tenant bootstrap reads', async () => {
    const tenants = await runInSystemTransaction(prisma, (tx) =>
      tx.tenant.findMany({ where: { id: { in: [tenantA, tenantB] } } }),
    );

    assert.equal(tenants.length, 2);
  });

  it('clears request context after transaction', async () => {
    await prisma.$transaction(async (tx) => {
      await applyPrismaRequestContext(tx, {
        tenantId: tenantA,
        role: 'physician',
      });

      const visible = await tx.tenant.findMany({ where: { id: tenantA } });
      assert.equal(visible.length, 1);

      await clearPrismaRequestContext(tx);
    });

    const hidden = await prisma.tenant.findMany({ where: { id: tenantA } });
    assert.equal(hidden.length, 0);
  });
});
