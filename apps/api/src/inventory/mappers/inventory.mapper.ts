import type {
  InventoryCategory,
  InventoryDepartment,
  InventoryItem,
  InventoryStatus,
  StockMovement,
  StockMovementType,
  Warehouse,
} from '@medease/inventory-contract';
import type { Prisma } from '@medease/prisma';

export function toCents(amount: number): bigint {
  return BigInt(Math.round(amount * 100));
}

export function fromCents(cents: bigint | number): number {
  return Number(cents) / 100;
}

export function deriveStatus(
  quantityOnHand: number,
  reservedQuantity: number,
  reorderLevel: number,
  current: InventoryStatus,
): InventoryStatus {
  if (current === 'expired' || current === 'recalled' || current === 'inactive') {
    return current;
  }
  const available = quantityOnHand - reservedQuantity;
  if (available <= 0) return 'out_of_stock';
  if (available <= reorderLevel) return 'low_stock';
  return 'active';
}

export function mapWarehouse(
  row: Prisma.WarehouseGetPayload<object>,
): Warehouse {
  return {
    warehouseId: row.id,
    name: row.name,
    code: row.code,
    facilityId: row.facilityId,
    address: row.address,
    capacity: row.capacity,
    utilizationPercent: row.utilizationPercent,
    zones: row.zones,
    managerName: row.managerName,
    status: row.status === 'inactive' ? 'inactive' : 'active',
  };
}

export function mapItem(
  row: Prisma.InventoryItemGetPayload<object>,
): InventoryItem {
  const available = row.quantityOnHand - row.reservedQuantity;
  return {
    inventoryId: row.id,
    sku: row.sku,
    barcode: row.barcode,
    qrCode: `QR-${row.id.slice(-8).toUpperCase()}`,
    gs1Code: row.barcode || `(01)${row.sku}`,
    itemName: row.itemName,
    genericName: row.genericName ?? undefined,
    category: row.category as InventoryCategory,
    department: row.department as InventoryDepartment,
    manufacturer: row.manufacturer,
    supplierId: row.supplierName,
    batchNumber: row.batchNumber ?? undefined,
    unit: row.unit,
    packageSize: row.packageSize,
    purchasePrice: fromCents(row.purchasePriceCents),
    sellingPrice: fromCents(row.sellingPriceCents),
    quantityOnHand: row.quantityOnHand,
    reservedQuantity: row.reservedQuantity,
    availableQuantity: available,
    reorderLevel: row.reorderLevel,
    reorderQuantity: row.reorderQuantity,
    maximumStock: row.maximumStock,
    minimumStock: row.minimumStock,
    expiryDate: row.expiryDate?.toISOString().slice(0, 10),
    storageConditions: row.storageConditions,
    warehouseLocation: row.warehouseId,
    shelfLocation: row.shelfLocation,
    status: row.status as InventoryStatus,
    coldChain: row.coldChain,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function mapMovement(
  row: Prisma.StockMovementGetPayload<object>,
): StockMovement {
  return {
    movementId: row.id,
    inventoryId: row.inventoryId,
    itemName: row.itemName,
    type: row.type as StockMovementType,
    quantity: row.quantity,
    fromLocation: row.fromLocation ?? undefined,
    toLocation: row.toLocation ?? undefined,
    reference: row.reference ?? undefined,
    performedBy: row.performedBy,
    notes: row.notes ?? undefined,
    createdAt: row.createdAt.toISOString(),
  };
}
