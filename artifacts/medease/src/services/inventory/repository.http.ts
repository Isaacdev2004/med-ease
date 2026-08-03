import type { QueryParams } from '@workspace/repository-transport';
import { httpTransport } from '@workspace/repository-transport';

import type {
  AdjustInventoryInput,
  CreateInventoryInput,
  InventoryCategory,
  InventoryDashboard,
  InventoryDepartment,
  InventoryFilters,
  InventoryItem,
  InventoryStatus,
  IssueStockInput,
  ReceiveStockInput,
  StockMovement,
  StockMovementType,
  Warehouse,
} from '@/services/inventory/types';
import { inventoryMockRepository } from '@/services/inventory/repository.mock';

const BASE = '/api/inventory';
const DEMO_FACILITY = '01930000-0000-7000-8000-000000000201';

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function asCategory(value: unknown): InventoryCategory {
  const v = asString(value, 'supplies');
  return v as InventoryCategory;
}

function asDepartment(value: unknown): InventoryDepartment {
  const v = asString(value, 'general');
  return v as InventoryDepartment;
}

function asStatus(value: unknown): InventoryStatus {
  const v = asString(value, 'active');
  return v as InventoryStatus;
}

function asMovementType(value: unknown): StockMovementType {
  const v = asString(value, 'adjustment');
  return v as StockMovementType;
}

export function inventoryFiltersToQuery(
  filters?: InventoryFilters,
): QueryParams | undefined {
  if (!filters) return undefined;
  return {
    department: filters.department,
    category: filters.category,
    warehouseId: filters.warehouseId,
    status: filters.status,
    q: filters.q,
    page: filters.page,
    pageSize: filters.pageSize,
  };
}

export function mapInventoryItem(raw: unknown): InventoryItem {
  const row = asRecord(raw);
  return {
    inventoryId: asString(row.inventoryId),
    sku: asString(row.sku),
    barcode: asString(row.barcode),
    qrCode: asString(row.qrCode),
    gs1Code: asString(row.gs1Code),
    itemName: asString(row.itemName),
    genericName: asOptionalString(row.genericName),
    category: asCategory(row.category),
    department: asDepartment(row.department),
    manufacturer: asString(row.manufacturer),
    supplierId: asString(row.supplierId),
    batchNumber: asOptionalString(row.batchNumber),
    serialNumber: asOptionalString(row.serialNumber),
    unit: asString(row.unit, 'ea'),
    packageSize: asNumber(row.packageSize, 1),
    purchasePrice: asNumber(row.purchasePrice),
    sellingPrice: asNumber(row.sellingPrice),
    quantityOnHand: asNumber(row.quantityOnHand),
    reservedQuantity: asNumber(row.reservedQuantity),
    availableQuantity: asNumber(row.availableQuantity),
    reorderLevel: asNumber(row.reorderLevel),
    reorderQuantity: asNumber(row.reorderQuantity),
    maximumStock: asNumber(row.maximumStock),
    minimumStock: asNumber(row.minimumStock),
    expiryDate: asOptionalString(row.expiryDate),
    manufactureDate: asOptionalString(row.manufactureDate),
    storageConditions: asString(row.storageConditions),
    warehouseLocation: asString(row.warehouseLocation),
    shelfLocation: asString(row.shelfLocation),
    status: asStatus(row.status),
    coldChain: asBoolean(row.coldChain),
    createdAt: asString(row.createdAt),
    updatedAt: asString(row.updatedAt),
  };
}

export function mapStockMovement(raw: unknown): StockMovement {
  const row = asRecord(raw);
  return {
    movementId: asString(row.movementId),
    inventoryId: asString(row.inventoryId),
    itemName: asString(row.itemName),
    type: asMovementType(row.type),
    quantity: asNumber(row.quantity),
    fromLocation: asOptionalString(row.fromLocation),
    toLocation: asOptionalString(row.toLocation),
    reference: asOptionalString(row.reference),
    performedBy: asString(row.performedBy),
    notes: asOptionalString(row.notes),
    createdAt: asString(row.createdAt),
  };
}

export function mapWarehouse(raw: unknown): Warehouse {
  const row = asRecord(raw);
  return {
    warehouseId: asString(row.warehouseId),
    name: asString(row.name),
    code: asString(row.code),
    facilityId: asString(row.facilityId),
    address: asString(row.address),
    capacity: asNumber(row.capacity),
    utilizationPercent: asNumber(row.utilizationPercent),
    zones: Array.isArray(row.zones)
      ? row.zones.filter((z): z is string => typeof z === 'string')
      : [],
    managerName: asString(row.managerName),
    status: asString(row.status) === 'inactive' ? 'inactive' : 'active',
  };
}

export function mapPaginatedItems(raw: unknown) {
  const row = asRecord(raw);
  const items = Array.isArray(row.items) ? row.items.map(mapInventoryItem) : [];
  return {
    items,
    total: asNumber(row.total, items.length),
    page: asNumber(row.page, 1),
    pageSize: asNumber(row.pageSize, 25),
  };
}

export function mapPaginatedMovements(raw: unknown) {
  const row = asRecord(raw);
  const items = Array.isArray(row.items)
    ? row.items.map(mapStockMovement)
    : [];
  return {
    items,
    total: asNumber(row.total, items.length),
    page: asNumber(row.page, 1),
    pageSize: asNumber(row.pageSize, 25),
  };
}

export function mapInventoryDashboard(raw: unknown): InventoryDashboard {
  const row = asRecord(raw);
  const recent = Array.isArray(row.recentMovements)
    ? row.recentMovements.map(mapStockMovement)
    : [];
  return {
    totalItems: asNumber(row.totalItems),
    inventoryValue: asNumber(row.inventoryValue),
    lowStockCount: asNumber(row.lowStockCount),
    outOfStockCount: asNumber(row.outOfStockCount),
    expiredCount: asNumber(row.expiredCount),
    pendingOrders: 0,
    activeTransfers: 0,
    assetUtilization: 0,
    stockTurnover: 0,
    daysOfInventory: 0,
    recentMovements: recent,
    recentOrders: [],
    expiryAlerts: [],
  };
}

class InventoryHttpRepository {
  private readonly transport = httpTransport;
  private readonly mock = inventoryMockRepository;

  searchInventory(filters?: InventoryFilters) {
    return this.transport
      .get(`${BASE}/items`, { query: inventoryFiltersToQuery(filters) })
      .then(mapPaginatedItems);
  }

  async getInventoryItem(inventoryId: string) {
    try {
      return mapInventoryItem(
        await this.transport.get(`${BASE}/items/${inventoryId}`),
      );
    } catch {
      return null;
    }
  }

  async createInventoryItem(input: CreateInventoryInput) {
    const warehouses = await this.getWarehouses();
    const warehouse =
      warehouses.find(
        (w: Warehouse) =>
          w.warehouseId === input.warehouseLocation ||
          w.code === input.warehouseLocation,
      ) ?? warehouses[0];

    if (!warehouse) {
      return this.mock.createInventoryItem(input);
    }

    return this.transport
      .post(`${BASE}/items`, {
        body: {
          facilityId: warehouse.facilityId || DEMO_FACILITY,
          warehouseId: warehouse.warehouseId,
          sku: input.sku,
          itemName: input.itemName,
          category: input.category,
          department: input.department,
          quantityOnHand: input.quantityOnHand,
          unit: input.unit,
          supplierName: input.supplierId,
          reorderLevel: input.reorderLevel,
          purchasePrice: input.purchasePrice,
          sellingPrice: input.sellingPrice,
          shelfLocation: `${warehouse.code}-A1`,
        },
      })
      .then(mapInventoryItem);
  }

  async updateInventory(
    inventoryId: string,
    updates: Partial<InventoryItem>,
  ) {
    try {
      return mapInventoryItem(
        await this.transport.patch(`${BASE}/items/${inventoryId}`, {
          body: {
            itemName: updates.itemName,
            reorderLevel: updates.reorderLevel,
            status: updates.status,
            shelfLocation: updates.shelfLocation,
            quantityOnHand: updates.quantityOnHand,
          },
        }),
      );
    } catch {
      return null;
    }
  }

  deleteInventory(inventoryId: string) {
    return this.mock.deleteInventory(inventoryId);
  }

  receiveStock(input: ReceiveStockInput) {
    return this.transport
      .post(`${BASE}/items/${input.inventoryId}/receive`, {
        body: {
          quantity: input.quantity,
          reference: input.reference,
          notes: input.batchNumber
            ? `batch=${input.batchNumber}`
            : undefined,
        },
      })
      .then(mapInventoryItem);
  }

  issueStock(input: IssueStockInput) {
    return this.transport
      .post(`${BASE}/items/${input.inventoryId}/issue`, {
        body: {
          quantity: input.quantity,
          reference: input.reference,
          notes: input.toDepartment
            ? `to=${input.toDepartment}`
            : undefined,
        },
      })
      .then(mapInventoryItem);
  }

  transferStock(
    ...args: Parameters<typeof inventoryMockRepository.transferStock>
  ) {
    return this.mock.transferStock(...args);
  }

  adjustInventory(input: AdjustInventoryInput) {
    return this.transport
      .post(`${BASE}/items/${input.inventoryId}/adjust`, {
        body: {
          quantity: input.quantity,
          notes: input.reason,
        },
      })
      .then(mapInventoryItem);
  }

  getStockMovements(filters?: InventoryFilters) {
    return this.transport
      .get(`${BASE}/movements`, { query: inventoryFiltersToQuery(filters) })
      .then(mapPaginatedMovements);
  }

  getPurchaseOrders(
    ...args: Parameters<typeof inventoryMockRepository.getPurchaseOrders>
  ) {
    return this.mock.getPurchaseOrders(...args);
  }

  createPurchaseOrder(
    ...args: Parameters<typeof inventoryMockRepository.createPurchaseOrder>
  ) {
    return this.mock.createPurchaseOrder(...args);
  }

  approvePurchaseOrder(
    ...args: Parameters<typeof inventoryMockRepository.approvePurchaseOrder>
  ) {
    return this.mock.approvePurchaseOrder(...args);
  }

  receivePurchaseOrder(
    ...args: Parameters<typeof inventoryMockRepository.receivePurchaseOrder>
  ) {
    return this.mock.receivePurchaseOrder(...args);
  }

  getSuppliers() {
    return this.mock.getSuppliers();
  }

  getWarehouses() {
    return this.transport
      .get(`${BASE}/warehouses`)
      .then((raw: unknown) =>
        Array.isArray(raw) ? raw.map(mapWarehouse) : [],
      );
  }

  getAssets(...args: Parameters<typeof inventoryMockRepository.getAssets>) {
    return this.mock.getAssets(...args);
  }

  getTransfers(
    ...args: Parameters<typeof inventoryMockRepository.getTransfers>
  ) {
    return this.mock.getTransfers(...args);
  }

  getExpiryAlerts(
    ...args: Parameters<typeof inventoryMockRepository.getExpiryAlerts>
  ) {
    return this.mock.getExpiryAlerts(...args);
  }

  getCycleCounts() {
    return this.mock.getCycleCounts();
  }

  getDashboard(department?: string, warehouseId?: string) {
    return this.transport
      .get(`${BASE}/dashboard`, {
        query: {
          department,
          warehouseId,
        },
      })
      .then(mapInventoryDashboard);
  }

  scanBarcode(...args: Parameters<typeof inventoryMockRepository.scanBarcode>) {
    return this.mock.scanBarcode(...args);
  }

  generateBarcode(
    ...args: Parameters<typeof inventoryMockRepository.generateBarcode>
  ) {
    return this.mock.generateBarcode(...args);
  }

  forecastDemand(
    ...args: Parameters<typeof inventoryMockRepository.forecastDemand>
  ) {
    return this.mock.forecastDemand(...args);
  }

  favoriteItem(
    ...args: Parameters<typeof inventoryMockRepository.favoriteItem>
  ) {
    return this.mock.favoriteItem(...args);
  }

  exportInventory(
    ...args: Parameters<typeof inventoryMockRepository.exportInventory>
  ) {
    return this.mock.exportInventory(...args);
  }

  search(...args: Parameters<typeof inventoryMockRepository.search>) {
    return this.mock.search(...args);
  }
}

export const inventoryHttpRepository = new InventoryHttpRepository();
