import {
  isPrismaNotFoundError,
  toContractPaginated,
  toPaginatedResult,
} from '@medease/prisma';
import { NotFoundError } from '@workspace/repository-transport/errors';

export { toContractPaginated, toPaginatedResult };

export function assertItemFound<T>(
  item: T | null | undefined,
  inventoryId?: string,
): asserts item is T {
  if (!item) {
    throw new NotFoundError('Inventory item not found', {
      details: inventoryId ? { inventoryId } : undefined,
    });
  }
}

export function assertWarehouseFound<T>(
  warehouse: T | null | undefined,
  warehouseId?: string,
): asserts warehouse is T {
  if (!warehouse) {
    throw new NotFoundError('Warehouse not found', {
      details: warehouseId ? { warehouseId } : undefined,
    });
  }
}

export function assertSupplierFound<T>(
  supplier: T | null | undefined,
  supplierId?: string,
): asserts supplier is T {
  if (!supplier) {
    throw new NotFoundError('Supplier not found', {
      details: supplierId ? { supplierId } : undefined,
    });
  }
}

export function assertPurchaseOrderFound<T>(
  purchaseOrder: T | null | undefined,
  purchaseOrderId?: string,
): asserts purchaseOrder is T {
  if (!purchaseOrder) {
    throw new NotFoundError('Purchase order not found', {
      details: purchaseOrderId ? { purchaseOrderId } : undefined,
    });
  }
}

export function mapInventoryRepositoryError(error: unknown): never {
  if (isPrismaNotFoundError(error)) {
    throw new NotFoundError('Inventory resource not found', { cause: error });
  }
  throw error;
}
