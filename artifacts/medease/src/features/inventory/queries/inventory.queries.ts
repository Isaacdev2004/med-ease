import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import { inventoryService } from '@/services/inventory/inventory.service';
import type { InventoryFilters } from '@/services/inventory/types';

export const inventoryQueries = {
  dashboard: (department?: string, warehouseId?: string) => ({
    queryKey: queryKeys.inventory.dashboard(department, warehouseId),
    queryFn: () => inventoryService.getDashboard(department, warehouseId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  inventory: (filters?: InventoryFilters) => ({
    queryKey: queryKeys.inventory.list(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => inventoryService.searchInventory(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  item: (inventoryId: string) => ({
    queryKey: queryKeys.inventory.item(inventoryId),
    queryFn: () => inventoryService.getInventoryItem(inventoryId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(inventoryId),
  }),
  movements: (filters?: InventoryFilters) => ({
    queryKey: queryKeys.inventory.movements(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => inventoryService.getStockMovements(filters),
    staleTime: CACHE_TIMES.patientTimeline,
  }),
  purchaseOrders: (filters?: InventoryFilters) => ({
    queryKey: queryKeys.inventory.purchaseOrders(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => inventoryService.getPurchaseOrders(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  suppliers: () => ({
    queryKey: queryKeys.inventory.suppliers(),
    queryFn: () => inventoryService.getSuppliers(),
    staleTime: CACHE_TIMES.reference,
  }),
  warehouses: () => ({
    queryKey: queryKeys.inventory.warehouses(),
    queryFn: () => inventoryService.getWarehouses(),
    staleTime: CACHE_TIMES.reference,
  }),
  assets: (filters?: InventoryFilters) => ({
    queryKey: queryKeys.inventory.assets(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => inventoryService.getAssets(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  transfers: (filters?: InventoryFilters) => ({
    queryKey: queryKeys.inventory.transfers(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => inventoryService.getTransfers(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  expiry: (department?: string) => ({
    queryKey: queryKeys.inventory.expiry(department),
    queryFn: () => inventoryService.getExpiryAlerts(department),
    staleTime: CACHE_TIMES.patientTimeline,
  }),
  forecast: (inventoryId?: string) => ({
    queryKey: queryKeys.inventory.forecast(inventoryId),
    queryFn: () => inventoryService.forecastDemand(inventoryId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  analytics: () => ({
    queryKey: queryKeys.inventory.analytics(),
    queryFn: () => inventoryService.getAnalytics(),
    staleTime: CACHE_TIMES.dashboard,
  }),
  barcode: (code: string) => ({
    queryKey: queryKeys.inventory.barcode(code),
    queryFn: () => inventoryService.scanBarcode(code),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(code),
  }),
  search: (query: string, department?: string) => ({
    queryKey: queryKeys.inventory.search(query, department),
    queryFn: () => inventoryService.search(query, department),
    staleTime: CACHE_TIMES.patientList,
    enabled: query.length >= 2,
  }),
};
