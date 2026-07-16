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

export type InventoryStatus = 'active' | 'low_stock' | 'out_of_stock' | 'expired' | 'recalled' | 'inactive';
export type AssetStatus = 'operational' | 'maintenance' | 'offline' | 'retired';
export type PurchaseOrderStatus = 'draft' | 'pending_approval' | 'approved' | 'ordered' | 'partial' | 'received' | 'cancelled';
export type TransferStatus = 'pending' | 'in_transit' | 'completed' | 'cancelled';
export type StockMovementType = 'receive' | 'issue' | 'transfer' | 'adjustment' | 'return' | 'count';
export type CycleCountStatus = 'scheduled' | 'in_progress' | 'completed' | 'variance_review';

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

export interface MedicalAsset {
  assetId: string;
  inventoryId?: string;
  name: string;
  assetType: 'imaging' | 'analyzer' | 'monitor' | 'pump' | 'bed' | 'ambulance' | 'biomedical' | 'other';
  department: InventoryDepartment;
  serialNumber: string;
  manufacturer: string;
  model: string;
  purchaseDate: string;
  warrantyExpiry?: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  status: AssetStatus;
  location: string;
  utilizationPercent: number;
  uptimePercent: number;
}

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

export interface PurchaseOrderLine {
  lineId: string;
  inventoryId?: string;
  sku: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  receivedQuantity: number;
}

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

export interface StockTransfer {
  transferId: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  fromWarehouseName: string;
  toWarehouseName: string;
  items: { inventoryId: string; itemName: string; quantity: number }[];
  status: TransferStatus;
  requestedBy: string;
  completedAt?: string;
  createdAt: string;
}

export interface CycleCount {
  cycleCountId: string;
  warehouseId: string;
  warehouseName: string;
  status: CycleCountStatus;
  scheduledDate: string;
  completedDate?: string;
  itemsCounted: number;
  varianceCount: number;
  performedBy?: string;
}

export interface ExpiryAlert {
  alertId: string;
  inventoryId: string;
  itemName: string;
  batchNumber?: string;
  expiryDate: string;
  quantity: number;
  daysUntilExpiry: number;
  severity: 'critical' | 'warning' | 'info';
  department: InventoryDepartment;
}

export interface InventoryDashboard {
  totalItems: number;
  inventoryValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  expiredCount: number;
  pendingOrders: number;
  activeTransfers: number;
  assetUtilization: number;
  stockTurnover: number;
  daysOfInventory: number;
  recentMovements: StockMovement[];
  recentOrders: PurchaseOrder[];
  expiryAlerts: ExpiryAlert[];
}

export interface InventoryAnalytics {
  inventoryValue: number;
  stockTurnover: number;
  daysOfInventory: number;
  lowStockItems: number;
  expiredStockValue: number;
  procurementCycleDays: number;
  supplierPerformance: number;
  warehouseUtilization: number;
  assetUtilization: number;
  equipmentUptime: number;
  inventoryTrends: { label: string; value: number }[];
  consumptionByDepartment: { label: string; value: number }[];
  procurementSpend: { label: string; value: number }[];
  expiryTimeline: { label: string; value: number }[];
  abcAnalysis: { label: string; value: number }[];
  warehouseCapacity: { label: string; value: number }[];
  equipmentUtilization: { label: string; value: number }[];
  supplierRankings: { label: string; value: number }[];
}

export interface DemandForecast {
  inventoryId: string;
  itemName: string;
  currentStock: number;
  avgDailyUsage: number;
  forecastDays: number;
  projectedStockout?: string;
  recommendedOrder: number;
  confidence: number;
}

export interface InventoryFilters {
  department?: InventoryDepartment;
  category?: InventoryCategory;
  warehouseId?: string;
  supplierId?: string;
  status?: InventoryStatus;
  q?: string;
  page?: number;
  pageSize?: number;
  lowStock?: boolean;
  expiringSoon?: boolean;
}

export interface CreateInventoryInput {
  itemName: string;
  sku: string;
  category: InventoryCategory;
  department: InventoryDepartment;
  supplierId: string;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  reorderLevel: number;
  warehouseLocation: string;
  quantityOnHand?: number;
}

export interface ReceiveStockInput {
  inventoryId: string;
  quantity: number;
  batchNumber?: string;
  expiryDate?: string;
  reference?: string;
}

export interface IssueStockInput {
  inventoryId: string;
  quantity: number;
  reference?: string;
  toDepartment?: string;
}

export interface TransferStockInput {
  inventoryId: string;
  quantity: number;
  fromWarehouseId: string;
  toWarehouseId: string;
}

export interface AdjustInventoryInput {
  inventoryId: string;
  quantity: number;
  reason: string;
}

export interface CreatePurchaseOrderInput {
  supplierId: string;
  department: InventoryDepartment;
  items: { sku: string; itemName: string; quantity: number; unitPrice: number }[];
}

export interface ItemFavorite {
  inventoryId: string;
  userId: string;
  createdAt: string;
}

export interface InventoryPermissions {
  canView: boolean;
  canWrite: boolean;
  canProcure: boolean;
  canReceive: boolean;
  canIssue: boolean;
  canTransfer: boolean;
  canAudit: boolean;
  canViewAnalytics: boolean;
  canExport: boolean;
  canAdmin: boolean;
}

export interface BarcodeScanResult {
  barcode: string;
  inventoryId?: string;
  itemName?: string;
  found: boolean;
  gs1Code?: string;
}

export interface InventoryExport {
  format: 'csv' | 'pdf' | 'xlsx';
  generatedAt: string;
  url: string;
  recordCount: number;
}
