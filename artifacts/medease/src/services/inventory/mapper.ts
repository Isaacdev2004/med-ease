import type { InventoryItem, MedicalAsset } from '@/services/inventory/types';

export function toFhirInventoryItem(item: InventoryItem) {
  return {
    resourceType: 'InventoryItem',
    id: item.inventoryId,
    status: item.status === 'active' ? 'active' : 'inactive',
    code: { text: item.itemName },
    name: item.itemName,
    identifier: [{ value: item.sku }, { value: item.barcode }],
    quantity: { value: item.quantityOnHand, unit: item.unit },
  };
}

export function toFhirDevice(asset: MedicalAsset) {
  return {
    resourceType: 'Device',
    id: asset.assetId,
    deviceName: [{ name: asset.name }],
    serialNumber: asset.serialNumber,
    manufacturer: asset.manufacturer,
    modelNumber: asset.model,
    status: asset.status,
  };
}
