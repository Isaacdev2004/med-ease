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

export function mapInventoryRepositoryError(error: unknown): never {
  if (isPrismaNotFoundError(error)) {
    throw new NotFoundError('Inventory resource not found', { cause: error });
  }
  throw error;
}
