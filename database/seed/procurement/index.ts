import type { SeedModule } from '../types';

const DEMO_TENANT_ID = '01930000-0000-7000-8000-000000000001';
const DEMO_ADMIN_ID = '01930000-0000-7000-8000-000000000101';
const DEMO_FACILITY_PARIS = '01930000-0000-7000-8000-000000000201';
const ITEM_AMOX = '01930000-0000-7000-8000-000000001411';
const ITEM_GLOVES = '01930000-0000-7000-8000-000000001412';

const SUPPLIER_MED = '01930000-0000-7000-8000-000000001501';
const SUPPLIER_LAB = '01930000-0000-7000-8000-000000001502';
const PO_OPEN = '01930000-0000-7000-8000-000000001511';
const PO_RECEIVED = '01930000-0000-7000-8000-000000001512';
const LINE_OPEN_1 = '01930000-0000-7000-8000-000000001521';
const LINE_OPEN_2 = '01930000-0000-7000-8000-000000001522';
const LINE_RECV_1 = '01930000-0000-7000-8000-000000001523';

export const procurementSeed: SeedModule = {
  name: 'procurement',
  async run(ctx) {
    if (ctx.dryRun) return;

    const { PrismaClient, runInSystemTransaction } =
      await import('@medease/prisma');
    type TransactionClient = Parameters<
      Parameters<typeof runInSystemTransaction>[1]
    >[0];
    const prisma = new PrismaClient();
    const now = new Date();

    try {
      await runInSystemTransaction(prisma, async (tx: TransactionClient) => {
        await tx.supplier.upsert({
          where: { id: SUPPLIER_MED },
          create: {
            id: SUPPLIER_MED,
            tenantId: DEMO_TENANT_ID,
            name: 'MedSupply EU',
            contactEmail: 'orders@medsupply.eu',
            contactPhone: '+33 1 42 00 10 10',
            address: '12 Rue de la Santé, Paris',
            rating: 4.6,
            onTimeDeliveryRate: 94,
            totalOrders: 128,
            categories: ['medication', 'consumable', 'vaccine'],
            status: 'active',
          },
          update: {
            name: 'MedSupply EU',
            status: 'active',
            rating: 4.6,
          },
        });

        await tx.supplier.upsert({
          where: { id: SUPPLIER_LAB },
          create: {
            id: SUPPLIER_LAB,
            tenantId: DEMO_TENANT_ID,
            name: 'LabTech FR',
            contactEmail: 'sales@labtech.fr',
            contactPhone: '+33 1 55 00 20 20',
            address: '8 Avenue Pasteur, Lyon',
            rating: 4.3,
            onTimeDeliveryRate: 91,
            totalOrders: 64,
            categories: ['reagent', 'supplies'],
            status: 'active',
          },
          update: {
            name: 'LabTech FR',
            status: 'active',
          },
        });

        await tx.purchaseOrder.upsert({
          where: { id: PO_OPEN },
          create: {
            id: PO_OPEN,
            tenantId: DEMO_TENANT_ID,
            facilityId: DEMO_FACILITY_PARIS,
            supplierId: SUPPLIER_MED,
            poNumber: 'PO-2026-PAR-001',
            department: 'pharmacy',
            status: 'approved',
            subtotalCents: 15300n,
            taxCents: 1530n,
            totalCents: 16830n,
            requestedBy: 'Marie Dubois',
            approvedBy: DEMO_ADMIN_ID,
            orderDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
            expectedDelivery: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
            createdBy: DEMO_ADMIN_ID,
            lines: {
              create: [
                {
                  id: LINE_OPEN_1,
                  tenantId: DEMO_TENANT_ID,
                  inventoryId: ITEM_AMOX,
                  sku: 'MED-AMOX-500',
                  itemName: 'Amoxicillin 500mg',
                  quantity: 60,
                  unitPriceCents: 850n,
                  receivedQuantity: 0,
                  sortOrder: 0,
                },
                {
                  id: LINE_OPEN_2,
                  tenantId: DEMO_TENANT_ID,
                  inventoryId: ITEM_GLOVES,
                  sku: 'SUP-GLV-M',
                  itemName: 'Nitrile Gloves (M)',
                  quantity: 80,
                  unitPriceCents: 450n,
                  receivedQuantity: 0,
                  sortOrder: 1,
                },
              ],
            },
          },
          update: {
            status: 'approved',
            totalCents: 16830n,
            updatedBy: DEMO_ADMIN_ID,
          },
        });

        await tx.purchaseOrder.upsert({
          where: { id: PO_RECEIVED },
          create: {
            id: PO_RECEIVED,
            tenantId: DEMO_TENANT_ID,
            facilityId: DEMO_FACILITY_PARIS,
            supplierId: SUPPLIER_LAB,
            poNumber: 'PO-2026-PAR-002',
            department: 'laboratory',
            status: 'received',
            subtotalCents: 74000n,
            taxCents: 7400n,
            totalCents: 81400n,
            requestedBy: 'Marie Dubois',
            approvedBy: DEMO_ADMIN_ID,
            orderDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
            expectedDelivery: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
            receivedDate: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
            createdBy: DEMO_ADMIN_ID,
            lines: {
              create: [
                {
                  id: LINE_RECV_1,
                  tenantId: DEMO_TENANT_ID,
                  sku: 'LAB-REA-TROP',
                  itemName: 'Troponin Assay Reagent',
                  quantity: 4,
                  unitPriceCents: 18500n,
                  receivedQuantity: 4,
                  sortOrder: 0,
                },
              ],
            },
          },
          update: {
            status: 'received',
            updatedBy: DEMO_ADMIN_ID,
          },
        });
      });
    } finally {
      await prisma.$disconnect();
    }
  },
};
