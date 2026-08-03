import type { InventoryFilters } from '@medease/inventory-contract';
import type { Prisma } from '@medease/prisma';

export function buildItemWhere(
  tenantId: string,
  filters: InventoryFilters = {},
): Prisma.InventoryItemWhereInput {
  const where: Prisma.InventoryItemWhereInput = { tenantId };
  if (filters.facilityId) where.facilityId = filters.facilityId;
  if (filters.warehouseId) where.warehouseId = filters.warehouseId;
  if (filters.department) where.department = filters.department;
  if (filters.category) where.category = filters.category;
  if (filters.status) where.status = filters.status;
  if (filters.q) {
    where.OR = [
      { itemName: { contains: filters.q, mode: 'insensitive' } },
      { sku: { contains: filters.q, mode: 'insensitive' } },
      { barcode: { contains: filters.q, mode: 'insensitive' } },
    ];
  }
  return where;
}
