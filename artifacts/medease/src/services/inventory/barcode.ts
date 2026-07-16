import { MOCK_INVENTORY } from '@/services/inventory/mock-data';
import type { BarcodeScanResult } from '@/services/inventory/types';

export function generateBarcode(inventoryId: string) {
  const item = MOCK_INVENTORY.find((i) => i.inventoryId === inventoryId);
  return item?.barcode ?? `5901234${Date.now()}`;
}

export function generateGs1Code(inventoryId: string) {
  const item = MOCK_INVENTORY.find((i) => i.inventoryId === inventoryId);
  return item?.gs1Code ?? `(01)5901234${Date.now()}`;
}

export function scanBarcode(barcode: string): BarcodeScanResult {
  const item = MOCK_INVENTORY.find((i) => i.barcode === barcode || i.gs1Code.includes(barcode));
  if (!item) return { barcode, found: false };
  return { barcode, found: true, inventoryId: item.inventoryId, itemName: item.itemName, gs1Code: item.gs1Code };
}
