import { MOCK_WAREHOUSES } from '@/services/inventory/mock-data';

export function getWarehouseUtilization(warehouseId: string) {
  const wh = MOCK_WAREHOUSES.find((w) => w.warehouseId === warehouseId);
  return wh?.utilizationPercent ?? 0;
}

export function listWarehouseZones(warehouseId: string) {
  return (
    MOCK_WAREHOUSES.find((w) => w.warehouseId === warehouseId)?.zones ?? []
  );
}
