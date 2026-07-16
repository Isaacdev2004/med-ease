export { inventoryService } from '@/services/inventory/inventory.service';
export { inventoryRepository } from '@/services/inventory/repository';
export { inventoryOfflineQueue } from '@/services/inventory/offline-sync';
export { computeInventoryAnalytics } from '@/services/inventory/analytics';
export { scanBarcode, generateBarcode } from '@/services/inventory/barcode';
export { forecastDemand, abcAnalysis } from '@/services/inventory/forecasting';
export { toFhirInventoryItem, toFhirDevice } from '@/services/inventory/mapper';
export {
  buildDashboard,
  MOCK_INVENTORY,
  MOCK_ASSETS,
  MOCK_SUPPLIERS,
  MOCK_PURCHASE_ORDERS,
  MOCK_WAREHOUSES,
  MOCK_MOVEMENTS,
  MOCK_TRANSFERS,
  MOCK_EXPIRY_ALERTS,
  MOCK_CYCLE_COUNTS,
} from '@/services/inventory/mock-data';
export type {
  InventoryItem,
  MedicalAsset,
  Supplier,
  PurchaseOrder,
  Warehouse,
  StockMovement,
  StockTransfer,
  ExpiryAlert,
  InventoryDashboard,
  InventoryAnalytics,
  DemandForecast,
  InventoryFilters,
  InventoryPermissions,
  BarcodeScanResult,
} from '@/services/inventory/types';
