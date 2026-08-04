export type InventoryCategory =
  | 'medication'
  | 'reagent'
  | 'consumable'
  | 'equipment'
  | 'supplies'
  | 'vaccine'
  | 'controlled'
  | 'asset'
  | 'otc'
  | 'narcotic';

export type InventoryDepartment =
  | 'pharmacy'
  | 'laboratory'
  | 'radiology'
  | 'icu'
  | 'surgery'
  | 'general'
  | 'biomedical'
  | 'warehouse';

export type InventoryStatus =
  'active' | 'low_stock' | 'out_of_stock' | 'expired' | 'recalled' | 'inactive';

export type StockMovementType =
  'receive' | 'issue' | 'transfer' | 'adjustment' | 'return' | 'count';

export interface Warehouse {
  warehouseId: string;
  name: string;
  code: string;
  facilityId: string;
  address: string;
  capacity: number;
  utilizationPercent: number;
  zones: string[];
  managerName: string;
  status: 'active' | 'inactive';
}

export interface InventoryItem {
  inventoryId: string;
  sku: string;
  barcode: string;
  qrCode: string;
  gs1Code: string;
  itemName: string;
  genericName?: string;
  category: InventoryCategory;
  department: InventoryDepartment;
  manufacturer: string;
  supplierId: string;
  batchNumber?: string;
  serialNumber?: string;
  unit: string;
  packageSize: number;
  purchasePrice: number;
  sellingPrice: number;
  quantityOnHand: number;
  reservedQuantity: number;
  availableQuantity: number;
  reorderLevel: number;
  reorderQuantity: number;
  maximumStock: number;
  minimumStock: number;
  expiryDate?: string;
  manufactureDate?: string;
  storageConditions: string;
  warehouseLocation: string;
  shelfLocation: string;
  status: InventoryStatus;
  coldChain?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  movementId: string;
  inventoryId: string;
  itemName: string;
  type: StockMovementType;
  quantity: number;
  fromLocation?: string;
  toLocation?: string;
  reference?: string;
  performedBy: string;
  notes?: string;
  createdAt: string;
}

export interface InventoryDashboard {
  totalItems: number;
  inventoryValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  expiredCount: number;
  expiringSoonCount: number;
  recentMovements: StockMovement[];
}

export interface InventoryFilters {
  facilityId?: string;
  warehouseId?: string;
  department?: InventoryDepartment;
  category?: InventoryCategory;
  status?: InventoryStatus;
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateInventoryInput {
  facilityId: string;
  warehouseId: string;
  sku: string;
  itemName: string;
  category: InventoryCategory;
  department: InventoryDepartment;
  quantityOnHand?: number;
  unit?: string;
  manufacturer?: string;
  supplierName?: string;
  reorderLevel?: number;
  reorderQuantity?: number;
  purchasePrice?: number;
  sellingPrice?: number;
  barcode?: string;
  shelfLocation?: string;
  batchNumber?: string;
  expiryDate?: string;
  coldChain?: boolean;
}

export interface UpdateInventoryInput {
  inventoryId: string;
  itemName?: string;
  reorderLevel?: number;
  status?: InventoryStatus;
  shelfLocation?: string;
  quantityOnHand?: number;
}

export interface ReceiveStockInput {
  inventoryId: string;
  quantity: number;
  reference?: string;
  notes?: string;
  performedBy?: string;
}

export interface IssueStockInput {
  inventoryId: string;
  quantity: number;
  reference?: string;
  notes?: string;
  performedBy?: string;
}

export interface AdjustStockInput {
  inventoryId: string;
  quantity: number;
  notes?: string;
  performedBy?: string;
}

export interface InventoryListResult {
  items: InventoryItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface MovementListResult {
  items: StockMovement[];
  total: number;
  page: number;
  pageSize: number;
}

export type PurchaseOrderStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'ordered'
  | 'partial'
  | 'received'
  | 'cancelled';

export interface Supplier {
  supplierId: string;
  name: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  rating: number;
  onTimeDeliveryRate: number;
  totalOrders: number;
  categories: InventoryCategory[];
  status: 'active' | 'inactive' | 'pending';
}

export interface PurchaseOrderLine {
  lineId: string;
  inventoryId?: string;
  sku: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  receivedQuantity: number;
}

export interface PurchaseOrder {
  purchaseOrderId: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  department: InventoryDepartment;
  status: PurchaseOrderStatus;
  items: PurchaseOrderLine[];
  subtotal: number;
  tax: number;
  total: number;
  requestedBy: string;
  approvedBy?: string;
  orderDate?: string;
  expectedDelivery?: string;
  receivedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePurchaseOrderInput {
  supplierId: string;
  department: InventoryDepartment;
  facilityId?: string;
  items: {
    sku: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    inventoryId?: string;
  }[];
  requestedBy?: string;
}

export interface PurchaseOrderListResult {
  items: PurchaseOrder[];
  total: number;
  page: number;
  pageSize: number;
}
