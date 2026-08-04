import type { QueryParams } from '@workspace/repository-transport';
import { httpTransport } from '@workspace/repository-transport';

import type {
  AdjustInventoryInput,
  CreateInventoryInput,
  CreatePurchaseOrderInput,
  InventoryCategory,
  InventoryDashboard,
  InventoryDepartment,
  InventoryFilters,
  InventoryItem,
  InventoryStatus,
  IssueStockInput,
  PurchaseOrder,
  PurchaseOrderLine,
  PurchaseOrderStatus,
  ReceiveStockInput,
  StockMovement,
  StockMovementType,
  Supplier,
  Warehouse,
} from '@/services/inventory/types';

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
  return asString(value, 'supplies') as InventoryCategory;
}

function asDepartment(value: unknown): InventoryDepartment {
  return asString(value, 'general') as InventoryDepartment;
}

function asStatus(value: unknown): InventoryStatus {
  return asString(value, 'active') as InventoryStatus;
}

function asMovementType(value: unknown): StockMovementType {
  return asString(value, 'adjustment') as StockMovementType;
}

function asPoStatus(value: unknown): PurchaseOrderStatus {
  return asString(value, 'draft') as PurchaseOrderStatus;
}

function emptyPage(page = 1, pageSize = 25) {
  return { items: [], total: 0, page, pageSize };
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
    pendingOrders: asNumber(row.pendingOrders),
    activeTransfers: 0,
    assetUtilization: 0,
    stockTurnover: 0,
    daysOfInventory: 0,
    recentMovements: recent,
    recentOrders: [],
    expiryAlerts: [],
  };
}

export function mapPurchaseOrderLine(raw: unknown): PurchaseOrderLine {
  const row = asRecord(raw);
  return {
    lineId: asString(row.lineId),
    inventoryId: asOptionalString(row.inventoryId),
    sku: asString(row.sku),
    itemName: asString(row.itemName),
    quantity: asNumber(row.quantity),
    unitPrice: asNumber(row.unitPrice),
    receivedQuantity: asNumber(row.receivedQuantity),
  };
}

export function mapPurchaseOrder(raw: unknown): PurchaseOrder {
  const row = asRecord(raw);
  return {
    purchaseOrderId: asString(row.purchaseOrderId),
    poNumber: asString(row.poNumber),
    supplierId: asString(row.supplierId),
    supplierName: asString(row.supplierName),
    department: asDepartment(row.department),
    status: asPoStatus(row.status),
    items: Array.isArray(row.items)
      ? row.items.map(mapPurchaseOrderLine)
      : [],
    subtotal: asNumber(row.subtotal),
    tax: asNumber(row.tax),
    total: asNumber(row.total),
    requestedBy: asString(row.requestedBy),
    approvedBy: asOptionalString(row.approvedBy),
    orderDate: asOptionalString(row.orderDate),
    expectedDelivery: asOptionalString(row.expectedDelivery),
    receivedDate: asOptionalString(row.receivedDate),
    createdAt: asString(row.createdAt),
    updatedAt: asString(row.updatedAt),
  };
}

export function mapPaginatedPurchaseOrders(raw: unknown) {
  const row = asRecord(raw);
  const items = Array.isArray(row.items)
    ? row.items.map(mapPurchaseOrder)
    : [];
  return {
    items,
    total: asNumber(row.total, items.length),
    page: asNumber(row.page, 1),
    pageSize: asNumber(row.pageSize, 25),
  };
}

export function mapSupplier(raw: unknown): Supplier {
  const row = asRecord(raw);
  return {
    supplierId: asString(row.supplierId),
    name: asString(row.name),
    contactEmail: asString(row.contactEmail),
    contactPhone: asString(row.contactPhone),
    address: asString(row.address),
    rating: asNumber(row.rating),
    onTimeDeliveryRate: asNumber(row.onTimeDeliveryRate),
    totalOrders: asNumber(row.totalOrders),
    categories: Array.isArray(row.categories)
      ? row.categories
          .filter((c): c is string => typeof c === 'string')
          .map((c) => c as InventoryCategory)
      : [],
    status:
      asString(row.status) === 'inactive'
        ? 'inactive'
        : asString(row.status) === 'pending'
          ? 'pending'
          : 'active',
  };
}

class InventoryHttpRepository {
  private readonly transport = httpTransport;
  private readonly favorites: { inventoryId: string; userId: string; createdAt: string }[] =
    [];

  searchInventory(filters?: InventoryFilters) {
    return this.transport
      .get(`${BASE}/items`, { query: inventoryFiltersToQuery(filters) })
      .then(mapPaginatedItems) as Promise<{
      items: InventoryItem[];
      total: number;
      page: number;
      pageSize: number;
    }>;
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
      return null;
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

  deleteInventory(_inventoryId: string) {
    return false;
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

  async transferStock() {
    return null;
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

  getPurchaseOrders(filters?: InventoryFilters) {
    return this.transport
      .get(`${BASE}/purchase-orders`, {
        query: inventoryFiltersToQuery(filters),
      })
      .then(mapPaginatedPurchaseOrders) as Promise<{
      items: PurchaseOrder[];
      total: number;
      page: number;
      pageSize: number;
    }>;
  }

  createPurchaseOrder(input: CreatePurchaseOrderInput) {
    return this.transport
      .post(`${BASE}/purchase-orders`, { body: input })
      .then(mapPurchaseOrder);
  }

  async approvePurchaseOrder(purchaseOrderId: string) {
    try {
      return mapPurchaseOrder(
        await this.transport.post(
          `${BASE}/purchase-orders/${purchaseOrderId}/approve`,
          { body: {} },
        ),
      );
    } catch {
      return null;
    }
  }

  async receivePurchaseOrder(purchaseOrderId: string) {
    try {
      return mapPurchaseOrder(
        await this.transport.post(
          `${BASE}/purchase-orders/${purchaseOrderId}/receive`,
          { body: {} },
        ),
      );
    } catch {
      return null;
    }
  }

  getSuppliers(): Promise<Supplier[]> {
    return this.transport
      .get(`${BASE}/suppliers`)
      .then((raw: unknown) =>
        Array.isArray(raw) ? raw.map(mapSupplier) : [],
      );
  }

  getWarehouses() {
    return this.transport
      .get(`${BASE}/warehouses`)
      .then((raw: unknown) =>
        Array.isArray(raw) ? raw.map(mapWarehouse) : [],
      );
  }

  getAssets(filters?: InventoryFilters) {
    return emptyPage(filters?.page, filters?.pageSize);
  }

  getTransfers(filters?: InventoryFilters) {
    return emptyPage(filters?.page, filters?.pageSize);
  }

  async getExpiryAlerts(department?: string) {
    const page = await this.searchInventory({
      department: department as InventoryDepartment | undefined,
      pageSize: 100,
    });
    const items: InventoryItem[] = page.items;
    const now = Date.now();
    return items
      .filter((item: InventoryItem) => Boolean(item.expiryDate))
      .map((item: InventoryItem) => {
        const days = Math.round(
          (new Date(item.expiryDate!).getTime() - now) / 86400000,
        );
        return {
          alertId: `exp-${item.inventoryId}`,
          inventoryId: item.inventoryId,
          itemName: item.itemName,
          batchNumber: item.batchNumber,
          expiryDate: item.expiryDate!,
          quantity: item.quantityOnHand,
          daysUntilExpiry: days,
          severity:
            days <= 30
              ? ('critical' as const)
              : days <= 90
                ? ('warning' as const)
                : ('info' as const),
          department: item.department,
        };
      })
      .filter((a: { daysUntilExpiry: number }) => a.daysUntilExpiry <= 90)
      .sort(
        (
          a: { daysUntilExpiry: number },
          b: { daysUntilExpiry: number },
        ) => a.daysUntilExpiry - b.daysUntilExpiry,
      );
  }

  getCycleCounts() {
    return [];
  }

  async getDashboard(department?: string, warehouseId?: string) {
    const [dashboard, orders] = await Promise.all([
      this.transport
        .get(`${BASE}/dashboard`, {
          query: { department, warehouseId },
        })
        .then(mapInventoryDashboard),
      this.getPurchaseOrders({
        department: department as InventoryDepartment | undefined,
        pageSize: 25,
      }),
    ]);
    const pendingOrders = orders.items.filter((p: PurchaseOrder) =>
      ['pending_approval', 'approved', 'ordered'].includes(p.status),
    ).length;
    return {
      ...dashboard,
      pendingOrders,
      recentOrders: orders.items.slice(0, 6),
    };
  }

  async scanBarcode(barcode: string) {
    const page = await this.searchInventory({ q: barcode, pageSize: 5 });
    const item = page.items.find(
      (i: InventoryItem) => i.barcode === barcode || i.sku === barcode,
    );
    return {
      barcode,
      inventoryId: item?.inventoryId,
      itemName: item?.itemName,
      found: Boolean(item),
      gs1Code: item?.gs1Code,
    };
  }

  generateBarcode(inventoryId: string) {
    return { barcode: `ME-${inventoryId.slice(-10)}`, inventoryId };
  }

  forecastDemand(_inventoryId?: string) {
    return [];
  }

  favoriteItem(inventoryId: string, userId: string) {
    if (
      !this.favorites.some(
        (f) => f.inventoryId === inventoryId && f.userId === userId,
      )
    ) {
      this.favorites.push({
        inventoryId,
        userId,
        createdAt: new Date().toISOString(),
      });
    }
    return this.favorites.filter((f) => f.userId === userId);
  }

  async exportInventory(format: 'csv' | 'pdf' | 'xlsx') {
    const { total } = await this.searchInventory({ pageSize: 1 });
    return {
      format,
      generatedAt: new Date().toISOString(),
      url: `${BASE}/exports/inventory.${format}`,
      recordCount: total,
    };
  }

  async search(query: string, department?: string) {
    const [itemsPage, suppliers] = await Promise.all([
      this.searchInventory({
        q: query,
        department: department as InventoryDepartment | undefined,
        pageSize: 15,
      }),
      this.getSuppliers(),
    ]);
    const q = query.toLowerCase();
    return {
      items: itemsPage.items,
      suppliers: (suppliers as Supplier[])
        .filter((s: Supplier) => s.name.toLowerCase().includes(q))
        .slice(0, 5),
    };
  }
}

export const inventoryHttpRepository = new InventoryHttpRepository();
