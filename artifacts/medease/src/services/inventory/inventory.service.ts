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

const DELAY = 250;
async function delay(ms = DELAY) {
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
    return computeInventoryAnalytics();
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
