import type {
  AdjustStockInput,
  CreateInventoryInput,
  CreatePurchaseOrderInput,
  InventoryDashboard,
  InventoryDepartment,
  InventoryFilters,
  InventoryItem,
  InventoryListResult,
  IssueStockInput,
  MovementListResult,
  PurchaseOrder,
  PurchaseOrderListResult,
  ReceiveStockInput,
  Supplier,
  UpdateInventoryInput,
  Warehouse,
} from './inventory.types';

export interface InventoryRepositoryContract {
  searchItems(filters?: InventoryFilters): Promise<InventoryListResult>;
  getItem(inventoryId: string): Promise<InventoryItem>;
  createItem(input: CreateInventoryInput): Promise<InventoryItem>;
  updateItem(input: UpdateInventoryInput): Promise<InventoryItem>;
  receiveStock(input: ReceiveStockInput): Promise<InventoryItem>;
  issueStock(input: IssueStockInput): Promise<InventoryItem>;
  adjustStock(input: AdjustStockInput): Promise<InventoryItem>;
  getMovements(
    inventoryId?: string,
    filters?: InventoryFilters,
  ): Promise<MovementListResult>;
  getWarehouses(facilityId?: string): Promise<Warehouse[]>;
  getDashboard(
    facilityId?: string,
    warehouseId?: string,
    department?: InventoryDepartment,
  ): Promise<InventoryDashboard>;
  getSuppliers(): Promise<Supplier[]>;
  getPurchaseOrders(
    filters?: InventoryFilters,
  ): Promise<PurchaseOrderListResult>;
  createPurchaseOrder(input: CreatePurchaseOrderInput): Promise<PurchaseOrder>;
  approvePurchaseOrder(purchaseOrderId: string): Promise<PurchaseOrder>;
  receivePurchaseOrder(purchaseOrderId: string): Promise<PurchaseOrder>;
}
