import { useApiAuth } from '@/services/auth/auth-service';
import { computeInventoryAnalytics } from '@/services/inventory/analytics';
import { inventoryRepository } from '@/services/inventory/repository';
import type {
  AdjustInventoryInput,
  CreateInventoryInput,
  CreatePurchaseOrderInput,
  InventoryFilters,
  IssueStockInput,
  ReceiveStockInput,
  TransferStockInput,
} from '@/services/inventory/types';

const DELAY = useApiAuth ? 0 : 250;
async function delay(ms = DELAY) {
  if (DELAY <= 0) return;
  await new Promise((r) => setTimeout(r, ms));
}

export const inventoryService = {
  async searchInventory(filters?: InventoryFilters) {
    await delay();
    return inventoryRepository.searchInventory(filters);
  },

  async getInventoryItem(inventoryId: string) {
    await delay();
    return inventoryRepository.getInventoryItem(inventoryId);
  },

  async createInventoryItem(input: CreateInventoryInput) {
    await delay();
    return inventoryRepository.createInventoryItem(input);
  },

  async updateInventory(
    inventoryId: string,
    updates: Parameters<typeof inventoryRepository.updateInventory>[1],
  ) {
    await delay();
    return inventoryRepository.updateInventory(inventoryId, updates);
  },

  async deleteInventory(inventoryId: string) {
    await delay();
    return inventoryRepository.deleteInventory(inventoryId);
  },

  async receiveStock(input: ReceiveStockInput) {
    await delay();
    return inventoryRepository.receiveStock(input);
  },

  async issueStock(input: IssueStockInput) {
    await delay();
    return inventoryRepository.issueStock(input);
  },

  async transferStock(input: TransferStockInput) {
    await delay();
    return inventoryRepository.transferStock(input);
  },

  async adjustInventory(input: AdjustInventoryInput) {
    await delay();
    return inventoryRepository.adjustInventory(input);
  },

  async getStockMovements(filters?: InventoryFilters) {
    await delay();
    return inventoryRepository.getStockMovements(filters);
  },

  async getPurchaseOrders(filters?: InventoryFilters) {
    await delay();
    return inventoryRepository.getPurchaseOrders(filters);
  },

  async createPurchaseOrder(input: CreatePurchaseOrderInput) {
    await delay();
    return inventoryRepository.createPurchaseOrder(input);
  },

  async approvePurchaseOrder(purchaseOrderId: string) {
    await delay();
    return inventoryRepository.approvePurchaseOrder(purchaseOrderId);
  },

  async receivePurchaseOrder(purchaseOrderId: string) {
    await delay();
    return inventoryRepository.receivePurchaseOrder(purchaseOrderId);
  },

  async getSuppliers() {
    await delay();
    return inventoryRepository.getSuppliers();
  },

  async getWarehouses() {
    await delay();
    return inventoryRepository.getWarehouses();
  },

  async getAssets(filters?: InventoryFilters) {
    await delay();
    return inventoryRepository.getAssets(filters);
  },

  async getTransfers(filters?: InventoryFilters) {
    await delay();
    return inventoryRepository.getTransfers(filters);
  },

  async getExpiryAlerts(department?: string) {
    await delay();
    return inventoryRepository.getExpiryAlerts(department);
  },

  async getCycleCounts() {
    await delay();
    return inventoryRepository.getCycleCounts();
  },

  async getDashboard(department?: string, warehouseId?: string) {
    await delay();
    return inventoryRepository.getDashboard(department, warehouseId);
  },

  async getAnalytics() {
    await delay();
    if (!useApiAuth) return computeInventoryAnalytics();

    const [dashboard, inventory, warehouses, suppliers, orders] =
      await Promise.all([
        inventoryRepository.getDashboard(),
        inventoryRepository.searchInventory({ page: 1, pageSize: 100 }),
        inventoryRepository.getWarehouses(),
        inventoryRepository.getSuppliers(),
        inventoryRepository.getPurchaseOrders({ page: 1, pageSize: 50 }),
      ]);

    const byDept = new Map<string, number>();
    for (const item of inventory.items) {
      const key = item.department || 'general';
      byDept.set(
        key,
        (byDept.get(key) ?? 0) + item.quantityOnHand * item.purchasePrice,
      );
    }

    const expiredValue = inventory.items
      .filter((i) => i.status === 'expired')
      .reduce((s, i) => s + i.quantityOnHand * i.purchasePrice, 0);

    return {
      inventoryValue: dashboard.inventoryValue,
      stockTurnover: dashboard.stockTurnover,
      daysOfInventory: dashboard.daysOfInventory,
      lowStockItems: dashboard.lowStockCount,
      expiredStockValue: Math.round(expiredValue),
      procurementCycleDays: 0,
      supplierPerformance: suppliers.length
        ? Math.round(
            (suppliers.reduce((s, x) => s + x.rating, 0) / suppliers.length) * 20,
          )
        : 0,
      warehouseUtilization: warehouses.length
        ? Math.round(
            warehouses.reduce((s, w) => s + w.utilizationPercent, 0) /
              warehouses.length,
          )
        : 0,
      assetUtilization: dashboard.assetUtilization,
      equipmentUptime: 0,
      inventoryTrends: [
        { label: 'Current', value: dashboard.inventoryValue },
      ],
      consumptionByDepartment: [...byDept.entries()].map(([label, value]) => ({
        label,
        value: Math.round(value),
      })),
      procurementSpend: [
        {
          label: 'Open POs',
          value: orders.items.reduce((s, o) => s + o.total, 0),
        },
      ],
      expiryTimeline: dashboard.expiryAlerts.slice(0, 6).map((a) => ({
        label: a.itemName.slice(0, 16),
        value: a.quantity,
      })),
      abcAnalysis: [
        { label: 'Tracked SKUs', value: dashboard.totalItems },
        { label: 'Low stock', value: dashboard.lowStockCount },
        { label: 'Out of stock', value: dashboard.outOfStockCount },
      ],
      warehouseCapacity: warehouses.slice(0, 6).map((w) => ({
        label: w.code,
        value: w.utilizationPercent,
      })),
      equipmentUtilization: [],
      supplierRankings: suppliers.slice(0, 8).map((s) => ({
        label: s.name.slice(0, 15),
        value: Math.round(s.rating * 20),
      })),
    };
  },

  async scanBarcode(barcode: string) {
    await delay(100);
    return inventoryRepository.scanBarcode(barcode);
  },

  async generateBarcode(inventoryId: string) {
    await delay();
    return inventoryRepository.generateBarcode(inventoryId);
  },

  async forecastDemand(inventoryId?: string) {
    await delay();
    return inventoryRepository.forecastDemand(inventoryId);
  },

  async favoriteItem(inventoryId: string, userId: string) {
    await delay();
    return inventoryRepository.favoriteItem(inventoryId, userId);
  },

  async exportInventory(format: 'csv' | 'pdf' | 'xlsx' = 'xlsx') {
    await delay();
    return inventoryRepository.exportInventory(format);
  },

  async search(query: string, department?: string) {
    await delay();
    return inventoryRepository.search(query, department);
  },
};
