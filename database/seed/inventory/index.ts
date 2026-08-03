import type { SeedModule } from '../types';

const DEMO_TENANT_ID = '01930000-0000-7000-8000-000000000001';
const DEMO_ADMIN_ID = '01930000-0000-7000-8000-000000000101';
const DEMO_FACILITY_PARIS = '01930000-0000-7000-8000-000000000201';

const WAREHOUSE_PARIS = '01930000-0000-7000-8000-000000001401';
const ITEM_AMOX = '01930000-0000-7000-8000-000000001411';
const ITEM_GLOVES = '01930000-0000-7000-8000-000000001412';
const ITEM_SYRINGE = '01930000-0000-7000-8000-000000001413';
const ITEM_REAGENT = '01930000-0000-7000-8000-000000001414';
const ITEM_VACCINE = '01930000-0000-7000-8000-000000001415';
const MOV_1 = '01930000-0000-7000-8000-000000001421';
const MOV_2 = '01930000-0000-7000-8000-000000001422';
const MOV_3 = '01930000-0000-7000-8000-000000001423';

export const inventorySeed: SeedModule = {
  name: 'inventory',
  async run(ctx) {
    if (ctx.dryRun) return;

    const { PrismaClient, runInSystemTransaction } =
      await import('@medease/prisma');
    type TransactionClient = Parameters<
      Parameters<typeof runInSystemTransaction>[1]
    >[0];
    const prisma = new PrismaClient();
    const now = new Date();
    const expirySoon = new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000);
    const expiryFar = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    try {
      await runInSystemTransaction(prisma, async (tx: TransactionClient) => {
        await tx.warehouse.upsert({
          where: { id: WAREHOUSE_PARIS },
          create: {
            id: WAREHOUSE_PARIS,
            tenantId: DEMO_TENANT_ID,
            facilityId: DEMO_FACILITY_PARIS,
            name: 'Paris Central Pharmacy Store',
            code: 'PAR-PHARM',
            address: '47 Boulevard de l’Hôpital, Paris',
            capacity: 5000,
            utilizationPercent: 62,
            zones: ['A', 'B', 'Cold'],
            managerName: 'Marie Dubois',
            status: 'active',
          },
          update: {
            name: 'Paris Central Pharmacy Store',
            utilizationPercent: 62,
            status: 'active',
          },
        });

        const items = [
          {
            id: ITEM_AMOX,
            sku: 'MED-AMOX-500',
            barcode: '3400930004111',
            itemName: 'Amoxicillin 500mg',
            genericName: 'Amoxicillin',
            category: 'medication' as const,
            department: 'pharmacy' as const,
            manufacturer: 'Sanofi',
            supplierName: 'MedSupply EU',
            unit: 'box',
            packageSize: 20,
            purchasePriceCents: 850n,
            sellingPriceCents: 1200n,
            quantityOnHand: 48,
            reservedQuantity: 4,
            reorderLevel: 20,
            reorderQuantity: 60,
            maximumStock: 200,
            minimumStock: 10,
            expiryDate: expiryFar,
            batchNumber: 'AMX-2026-04',
            storageConditions: 'Room temperature',
            shelfLocation: 'PAR-PHARM-A12',
            status: 'active' as const,
            coldChain: false,
          },
          {
            id: ITEM_GLOVES,
            sku: 'SUP-GLV-M',
            barcode: '3400930004112',
            itemName: 'Nitrile Gloves (M)',
            category: 'consumable' as const,
            department: 'general' as const,
            manufacturer: 'Ansell',
            supplierName: 'MedSupply EU',
            unit: 'box',
            packageSize: 100,
            purchasePriceCents: 450n,
            sellingPriceCents: 650n,
            quantityOnHand: 12,
            reservedQuantity: 0,
            reorderLevel: 25,
            reorderQuantity: 80,
            maximumStock: 300,
            minimumStock: 15,
            storageConditions: 'Dry storage',
            shelfLocation: 'PAR-PHARM-B04',
            status: 'low_stock' as const,
            coldChain: false,
          },
          {
            id: ITEM_SYRINGE,
            sku: 'SUP-SYR-5ML',
            barcode: '3400930004113',
            itemName: 'Syringe 5ml',
            category: 'consumable' as const,
            department: 'surgery' as const,
            manufacturer: 'BD',
            supplierName: 'MedSupply EU',
            unit: 'box',
            packageSize: 50,
            purchasePriceCents: 320n,
            sellingPriceCents: 480n,
            quantityOnHand: 0,
            reservedQuantity: 0,
            reorderLevel: 30,
            reorderQuantity: 100,
            maximumStock: 400,
            minimumStock: 20,
            storageConditions: 'Room temperature',
            shelfLocation: 'PAR-PHARM-B08',
            status: 'out_of_stock' as const,
            coldChain: false,
          },
          {
            id: ITEM_REAGENT,
            sku: 'LAB-REA-TROP',
            barcode: '3400930004114',
            itemName: 'Troponin Assay Reagent',
            category: 'reagent' as const,
            department: 'laboratory' as const,
            manufacturer: 'Roche',
            supplierName: 'LabTech FR',
            unit: 'kit',
            packageSize: 1,
            purchasePriceCents: 18500n,
            sellingPriceCents: 24000n,
            quantityOnHand: 6,
            reservedQuantity: 1,
            reorderLevel: 4,
            reorderQuantity: 8,
            maximumStock: 20,
            minimumStock: 2,
            expiryDate: expirySoon,
            batchNumber: 'TRP-8891',
            storageConditions: '2–8°C',
            shelfLocation: 'PAR-PHARM-COLD-02',
            status: 'active' as const,
            coldChain: true,
          },
          {
            id: ITEM_VACCINE,
            sku: 'VAC-FLU-2026',
            barcode: '3400930004115',
            itemName: 'Influenza Vaccine 2026',
            category: 'vaccine' as const,
            department: 'pharmacy' as const,
            manufacturer: 'GSK',
            supplierName: 'MedSupply EU',
            unit: 'vial',
            packageSize: 10,
            purchasePriceCents: 920n,
            sellingPriceCents: 1450n,
            quantityOnHand: 80,
            reservedQuantity: 10,
            reorderLevel: 40,
            reorderQuantity: 120,
            maximumStock: 250,
            minimumStock: 20,
            expiryDate: expiryFar,
            batchNumber: 'FLU-26-A',
            storageConditions: '2–8°C',
            shelfLocation: 'PAR-PHARM-COLD-01',
            status: 'active' as const,
            coldChain: true,
          },
        ];

        for (const item of items) {
          await tx.inventoryItem.upsert({
            where: { id: item.id },
            create: {
              ...item,
              tenantId: DEMO_TENANT_ID,
              warehouseId: WAREHOUSE_PARIS,
              facilityId: DEMO_FACILITY_PARIS,
              createdBy: DEMO_ADMIN_ID,
            },
            update: {
              itemName: item.itemName,
              quantityOnHand: item.quantityOnHand,
              reservedQuantity: item.reservedQuantity,
              status: item.status,
              purchasePriceCents: item.purchasePriceCents,
              sellingPriceCents: item.sellingPriceCents,
              updatedBy: DEMO_ADMIN_ID,
            },
          });
        }

        const movements = [
          {
            id: MOV_1,
            inventoryId: ITEM_AMOX,
            itemName: 'Amoxicillin 500mg',
            type: 'receive' as const,
            quantity: 60,
            toLocation: WAREHOUSE_PARIS,
            reference: 'PO-PAR-2201',
            performedBy: 'Marie Dubois',
            createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
          },
          {
            id: MOV_2,
            inventoryId: ITEM_GLOVES,
            itemName: 'Nitrile Gloves (M)',
            type: 'issue' as const,
            quantity: 8,
            fromLocation: WAREHOUSE_PARIS,
            reference: 'WARD-ICU',
            performedBy: 'Marie Dubois',
            createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
          },
          {
            id: MOV_3,
            inventoryId: ITEM_REAGENT,
            itemName: 'Troponin Assay Reagent',
            type: 'receive' as const,
            quantity: 4,
            toLocation: WAREHOUSE_PARIS,
            reference: 'PO-LAB-118',
            performedBy: 'Marie Dubois',
            createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
          },
        ];

        for (const movement of movements) {
          await tx.stockMovement.upsert({
            where: { id: movement.id },
            create: {
              ...movement,
              tenantId: DEMO_TENANT_ID,
              createdBy: DEMO_ADMIN_ID,
            },
            update: {
              quantity: movement.quantity,
              reference: movement.reference,
            },
          });
        }
      });
    } finally {
      await prisma.$disconnect();
    }
  },
};
