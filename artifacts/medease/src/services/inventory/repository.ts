import {
  approvePurchaseOrder,
  createPurchaseOrder,
  receivePurchaseOrder,
} from '@/services/inventory/procurement';
import { generateBarcode, scanBarcode } from '@/services/inventory/barcode';
import { forecastDemand } from '@/services/inventory/forecasting';
import {
  buildDashboard,
  MOCK_ASSETS,
  MOCK_CYCLE_COUNTS,
  MOCK_EXPIRY_ALERTS,
  MOCK_INVENTORY,
  MOCK_MOVEMENTS,
  MOCK_PURCHASE_ORDERS,
  MOCK_SUPPLIERS,
  MOCK_TRANSFERS,
  MOCK_WAREHOUSES,
} from '@/services/inventory/mock-data';
import {
  adjustStock,
  issueStock,
  receiveStock,
} from '@/services/inventory/stock';
import {
  completeTransfer,
  createTransfer,
} from '@/services/inventory/transfers';
import type {
  AdjustInventoryInput,
  CreateInventoryInput,
  CreatePurchaseOrderInput,
  InventoryExport,
  InventoryFilters,
  InventoryItem,
  IssueStockInput,
  ItemFavorite,
  ReceiveStockInput,
  TransferStockInput,
} from '@/services/inventory/types';

function paginate<T>(items: T[], page = 1, pageSize = 25) {
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
  };
}

function matchItem(item: InventoryItem, filters: InventoryFilters) {
  if (filters.department && item.department !== filters.department)
    return false;
  if (filters.category && item.category !== filters.category) return false;
  if (filters.warehouseId && item.warehouseLocation !== filters.warehouseId)
    return false;
  if (filters.supplierId && item.supplierId !== filters.supplierId)
    return false;
  if (filters.status && item.status !== filters.status) return false;
  if (
    filters.lowStock &&
    item.status !== 'low_stock' &&
    item.status !== 'out_of_stock'
  )
    return false;
  if (filters.expiringSoon && item.expiryDate) {
    const days = (new Date(item.expiryDate).getTime() - Date.now()) / 86400000;
    if (days > 90) return false;
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    if (
      !item.itemName.toLowerCase().includes(q) &&
      !item.sku.toLowerCase().includes(q) &&
      !item.barcode.includes(q)
    )
      return false;
  }
  return true;
}

class InventoryRepository {
  private items = [...MOCK_INVENTORY];
  private orders = [...MOCK_PURCHASE_ORDERS];
  private movements = [...MOCK_MOVEMENTS];
  private transfers = [...MOCK_TRANSFERS];
  private favorites: ItemFavorite[] = [];
  private nextId = 16000;

  searchInventory(filters?: InventoryFilters) {
    const filtered = this.items.filter((i) => matchItem(i, filters ?? {}));
    return paginate(filtered, filters?.page, filters?.pageSize);
  }

  getInventoryItem(inventoryId: string) {
    return this.items.find((i) => i.inventoryId === inventoryId) ?? null;
  }

  createInventoryItem(input: CreateInventoryInput) {
    const id = `inv-${String(++this.nextId).padStart(5, '0')}`;
    const now = new Date().toISOString();
    const qty = input.quantityOnHand ?? 0;
    const item: InventoryItem = {
      inventoryId: id,
      sku: input.sku,
      barcode: generateBarcode(id),
      qrCode: `QR-${id}`,
      gs1Code: `(01)5901234${this.nextId}`,
      itemName: input.itemName,
      category: input.category,
      department: input.department,
      manufacturer: 'MedSupply Co',
      supplierId: input.supplierId,
      unit: input.unit,
      packageSize: 1,
      purchasePrice: input.purchasePrice,
      sellingPrice: input.sellingPrice,
      quantityOnHand: qty,
      reservedQuantity: 0,
      availableQuantity: qty,
      reorderLevel: input.reorderLevel,
      reorderQuantity: input.reorderLevel * 2,
      maximumStock: 1000,
      minimumStock: 5,
      storageConditions: 'Room temperature',
      warehouseLocation: input.warehouseLocation,
      shelfLocation: `${input.warehouseLocation}-A1`,
      status: qty === 0 ? 'out_of_stock' : 'active',
      createdAt: now,
      updatedAt: now,
    };
    this.items.unshift(item);
    return item;
  }

  updateInventory(inventoryId: string, updates: Partial<InventoryItem>) {
    const idx = this.items.findIndex((i) => i.inventoryId === inventoryId);
    if (idx < 0) return null;
    this.items[idx] = {
      ...this.items[idx]!,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.items[idx]!;
  }

  deleteInventory(inventoryId: string) {
    const idx = this.items.findIndex((i) => i.inventoryId === inventoryId);
    if (idx < 0) return false;
    this.items.splice(idx, 1);
    return true;
  }

  receiveStock(input: ReceiveStockInput) {
    const item = this.getInventoryItem(input.inventoryId);
    if (!item) return null;
    const updated = receiveStock(item, input);
    const idx = this.items.findIndex(
      (i) => i.inventoryId === input.inventoryId,
    );
    this.items[idx] = updated;
    this.movements.unshift({
      movementId: `mov-${++this.nextId}`,
      inventoryId: item.inventoryId,
      itemName: item.itemName,
      type: 'receive',
      quantity: input.quantity,
      toLocation: item.warehouseLocation,
      reference: input.reference,
      performedBy: 'current-user',
      createdAt: new Date().toISOString(),
    });
    return updated;
  }

  issueStock(input: IssueStockInput) {
    const item = this.getInventoryItem(input.inventoryId);
    if (!item) return null;
    const updated = issueStock(item, input);
    const idx = this.items.findIndex(
      (i) => i.inventoryId === input.inventoryId,
    );
    this.items[idx] = updated;
    this.movements.unshift({
      movementId: `mov-${++this.nextId}`,
      inventoryId: item.inventoryId,
      itemName: item.itemName,
      type: 'issue',
      quantity: input.quantity,
      fromLocation: item.warehouseLocation,
      reference: input.reference,
      performedBy: 'current-user',
      createdAt: new Date().toISOString(),
    });
    return updated;
  }

  transferStock(input: TransferStockInput) {
    const item = this.getInventoryItem(input.inventoryId);
    if (!item) return null;
    const fromWh = MOCK_WAREHOUSES.find(
      (w) => w.warehouseId === input.fromWarehouseId,
    );
    const toWh = MOCK_WAREHOUSES.find(
      (w) => w.warehouseId === input.toWarehouseId,
    );
    const transfer = createTransfer(
      input.fromWarehouseId,
      input.toWarehouseId,
      fromWh?.name ?? input.fromWarehouseId,
      toWh?.name ?? input.toWarehouseId,
      [
        {
          inventoryId: input.inventoryId,
          itemName: item.itemName,
          quantity: input.quantity,
        },
      ],
      `trf-${++this.nextId}`,
    );
    this.transfers.unshift(transfer);
    issueStock(item, {
      inventoryId: input.inventoryId,
      quantity: input.quantity,
    });
    return completeTransfer(transfer);
  }

  adjustInventory(input: AdjustInventoryInput) {
    const item = this.getInventoryItem(input.inventoryId);
    if (!item) return null;
    const updated = adjustStock(item, input.quantity);
    const idx = this.items.findIndex(
      (i) => i.inventoryId === input.inventoryId,
    );
    this.items[idx] = updated;
    this.movements.unshift({
      movementId: `mov-${++this.nextId}`,
      inventoryId: item.inventoryId,
      itemName: item.itemName,
      type: 'adjustment',
      quantity: input.quantity,
      reference: input.reason,
      performedBy: 'current-user',
      createdAt: new Date().toISOString(),
    });
    return updated;
  }

  getStockMovements(filters?: InventoryFilters) {
    let items = [...this.movements];
    if (filters?.department) {
      const ids = new Set(
        this.items
          .filter((i) => i.department === filters.department)
          .map((i) => i.inventoryId),
      );
      items = items.filter((m) => ids.has(m.inventoryId));
    }
    return paginate(
      items.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      filters?.page,
      filters?.pageSize,
    );
  }

  getPurchaseOrders(filters?: InventoryFilters) {
    let items = [...this.orders];
    if (filters?.department)
      items = items.filter((p) => p.department === filters.department);
    return paginate(
      items.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      filters?.page,
      filters?.pageSize,
    );
  }

  createPurchaseOrder(input: CreatePurchaseOrderInput) {
    const id = `po-${String(++this.nextId).padStart(4, '0')}`;
    const po = createPurchaseOrder(input, id, `PO-${2026000 + this.nextId}`);
    this.orders.unshift(po);
    return po;
  }

  approvePurchaseOrder(purchaseOrderId: string) {
    const idx = this.orders.findIndex(
      (p) => p.purchaseOrderId === purchaseOrderId,
    );
    if (idx < 0) return null;
    this.orders[idx] = approvePurchaseOrder(this.orders[idx]!, 'current-user');
    return this.orders[idx]!;
  }

  receivePurchaseOrder(purchaseOrderId: string) {
    const idx = this.orders.findIndex(
      (p) => p.purchaseOrderId === purchaseOrderId,
    );
    if (idx < 0) return null;
    this.orders[idx] = receivePurchaseOrder(this.orders[idx]!);
    return this.orders[idx]!;
  }

  getSuppliers() {
    return MOCK_SUPPLIERS;
  }

  getWarehouses() {
    return MOCK_WAREHOUSES;
  }

  getAssets(filters?: InventoryFilters) {
    let items = [...MOCK_ASSETS];
    if (filters?.department)
      items = items.filter((a) => a.department === filters.department);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getTransfers(filters?: InventoryFilters) {
    return paginate(
      [...this.transfers].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      ),
      filters?.page,
      filters?.pageSize,
    );
  }

  getExpiryAlerts(department?: string) {
    return department
      ? MOCK_EXPIRY_ALERTS.filter((a) => a.department === department)
      : MOCK_EXPIRY_ALERTS;
  }

  getCycleCounts() {
    return MOCK_CYCLE_COUNTS;
  }

  getDashboard(department?: string, warehouseId?: string) {
    return buildDashboard(department, warehouseId);
  }

  scanBarcode(barcode: string) {
    return scanBarcode(barcode);
  }

  generateBarcode(inventoryId: string) {
    return { barcode: generateBarcode(inventoryId), inventoryId };
  }

  forecastDemand(inventoryId?: string) {
    return forecastDemand(inventoryId);
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

  exportInventory(format: 'csv' | 'pdf' | 'xlsx'): InventoryExport {
    return {
      format,
      generatedAt: new Date().toISOString(),
      url: `/mock/exports/inventory.${format}`,
      recordCount: this.items.length,
    };
  }

  search(query: string, department?: string) {
    const q = query.toLowerCase();
    const items = this.items
      .filter(
        (i) =>
          (!department || i.department === department) &&
          (i.itemName.toLowerCase().includes(q) ||
            i.sku.toLowerCase().includes(q)),
      )
      .slice(0, 15);
    const suppliers = MOCK_SUPPLIERS.filter((s) =>
      s.name.toLowerCase().includes(q),
    ).slice(0, 5);
    return { items, suppliers };
  }
}

export const inventoryRepository = new InventoryRepository();
