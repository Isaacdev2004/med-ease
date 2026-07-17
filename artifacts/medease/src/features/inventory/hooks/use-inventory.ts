import { useQuery } from '@tanstack/react-query';

import { inventoryQueries } from '@/features/inventory/queries/inventory.queries';
import type { InventoryFilters } from '@/services/inventory/types';

export function useInventoryDashboard(
  department?: string,
  warehouseId?: string,
) {
  return useQuery(inventoryQueries.dashboard(department, warehouseId));
}

export function useInventory(filters?: InventoryFilters) {
  return useQuery(inventoryQueries.inventory(filters));
}

export function useInventoryItem(inventoryId: string) {
  return useQuery(inventoryQueries.item(inventoryId));
}

export function useStockMovements(filters?: InventoryFilters) {
  return useQuery(inventoryQueries.movements(filters));
}

export function usePurchaseOrders(filters?: InventoryFilters) {
  return useQuery(inventoryQueries.purchaseOrders(filters));
}

export function useSuppliers() {
  return useQuery(inventoryQueries.suppliers());
}

export function useWarehouses() {
  return useQuery(inventoryQueries.warehouses());
}

export function useAssets(filters?: InventoryFilters) {
  return useQuery(inventoryQueries.assets(filters));
}

export function useTransfers(filters?: InventoryFilters) {
  return useQuery(inventoryQueries.transfers(filters));
}

export function useExpiry(department?: string) {
  return useQuery(inventoryQueries.expiry(department));
}

export function useForecast(inventoryId?: string) {
  return useQuery(inventoryQueries.forecast(inventoryId));
}

export function useInventoryAnalytics() {
  return useQuery(inventoryQueries.analytics());
}

export function useBarcodeScanner(code: string) {
  return useQuery(inventoryQueries.barcode(code));
}

export function useInventorySearch(query: string, department?: string) {
  return useQuery(inventoryQueries.search(query, department));
}
