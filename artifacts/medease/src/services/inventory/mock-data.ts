import type {
  CycleCount,
  ExpiryAlert,
  InventoryItem,
  MedicalAsset,
  PurchaseOrder,
  StockMovement,
  StockTransfer,
  Supplier,
  Warehouse,
} from '@/services/inventory/types';

const CATEGORIES = ['medication', 'reagent', 'consumable', 'equipment', 'supplies', 'vaccine', 'controlled', 'otc', 'narcotic'] as const;
const DEPARTMENTS = ['pharmacy', 'laboratory', 'radiology', 'icu', 'surgery', 'general', 'biomedical', 'warehouse'] as const;
const STATUSES = ['active', 'low_stock', 'out_of_stock', 'expired', 'recalled', 'inactive'] as const;
const MANUFACTURERS = ['MedSupply Co', 'PharmaGlobal', 'LabTech Inc', 'BioMed Systems', 'HealthCore'];
const UNITS = ['each', 'box', 'vial', 'pack', 'bottle', 'kit'];

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function daysFromNow(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

export const MOCK_SUPPLIERS: Supplier[] = Array.from({ length: 1000 }, (_, i) => ({
  supplierId: `sup-${String(i + 1).padStart(4, '0')}`,
  name: `Supplier ${i + 1} ${['Medical', 'Pharma', 'Lab', 'Bio'][i % 4]}`,
  contactEmail: `contact${i + 1}@supplier.example.com`,
  contactPhone: `+33 1 ${String(10000000 + i).slice(0, 8)}`,
  address: `${100 + (i % 200)} Rue de Santé, Paris`,
  rating: 3 + (i % 20) / 10,
  onTimeDeliveryRate: 70 + (i % 30),
  totalOrders: 10 + (i % 500),
  categories: [CATEGORIES[i % CATEGORIES.length]!, CATEGORIES[(i + 2) % CATEGORIES.length]!],
  status: i % 50 === 0 ? 'inactive' : 'active',
}));

export const MOCK_WAREHOUSES: Warehouse[] = Array.from({ length: 250 }, (_, i) => ({
  warehouseId: `wh-${String(i + 1).padStart(3, '0')}`,
  name: `Warehouse ${i + 1}`,
  code: `WH-${String(i + 1).padStart(3, '0')}`,
  facilityId: `fac-${String((i % 25) + 1).padStart(3, '0')}`,
  address: `Zone ${(i % 10) + 1}, Facility ${(i % 25) + 1}`,
  capacity: 5000 + (i % 20) * 500,
  utilizationPercent: 40 + (i % 55),
  zones: [`A${i % 5}`, `B${i % 4}`, `C${i % 3}`],
  managerName: `Manager ${i + 1}`,
  status: i % 30 === 0 ? 'inactive' : 'active',
}));

export const MOCK_INVENTORY: InventoryItem[] = Array.from({ length: 15000 }, (_, i) => {
  const qty = i % 100 === 0 ? 0 : i % 50 === 0 ? 5 : 20 + (i % 500);
  const reserved = Math.min(qty, i % 20);
  const reorder = 15 + (i % 30);
  const dept = DEPARTMENTS[i % DEPARTMENTS.length]!;
  const cat = CATEGORIES[i % CATEGORIES.length]!;
  const supplier = MOCK_SUPPLIERS[i % MOCK_SUPPLIERS.length]!;
  const wh = MOCK_WAREHOUSES[i % MOCK_WAREHOUSES.length]!;
  const status = qty === 0 ? 'out_of_stock' : qty <= reorder ? 'low_stock' : i % 200 === 0 ? 'expired' : STATUSES[i % 3]!;
  const expiry = cat === 'medication' || cat === 'vaccine' || cat === 'reagent' ? daysFromNow(30 + (i % 365)) : undefined;
  return {
    inventoryId: `inv-${String(i + 1).padStart(5, '0')}`,
    sku: `SKU-${100000 + i}`,
    barcode: `5901234${String(i).padStart(6, '0')}`,
    qrCode: `QR-INV-${i + 1}`,
    gs1Code: `(01)5901234${String(i).padStart(6, '0')}`,
    itemName: `${cat.replace('_', ' ')} item ${i + 1}`,
    genericName: i % 3 === 0 ? `Generic ${i + 1}` : undefined,
    category: cat,
    department: dept,
    manufacturer: MANUFACTURERS[i % MANUFACTURERS.length]!,
    supplierId: supplier.supplierId,
    batchNumber: i % 4 === 0 ? `BATCH-${1000 + (i % 9999)}` : undefined,
    serialNumber: cat === 'equipment' ? `SN-${50000 + i}` : undefined,
    unit: UNITS[i % UNITS.length]!,
    packageSize: 1 + (i % 10),
    purchasePrice: 5 + (i % 200),
    sellingPrice: 8 + (i % 250),
    quantityOnHand: qty,
    reservedQuantity: reserved,
    availableQuantity: qty - reserved,
    reorderLevel: reorder,
    reorderQuantity: reorder * 2,
    maximumStock: 1000 + (i % 500),
    minimumStock: 5,
    expiryDate: expiry,
    manufactureDate: daysAgo(180 + (i % 365)),
    storageConditions: i % 10 === 0 ? '2-8°C cold chain' : 'Room temperature',
    warehouseLocation: wh.warehouseId,
    shelfLocation: `${wh.code}-A${i % 10}-${i % 20}`,
    status,
    coldChain: i % 10 === 0,
    createdAt: daysAgo(i % 365),
    updatedAt: daysAgo(i % 30),
  };
});

export const MOCK_ASSETS: MedicalAsset[] = Array.from({ length: 1200 }, (_, i) => {
  const types = ['imaging', 'analyzer', 'monitor', 'pump', 'bed', 'ambulance', 'biomedical', 'other'] as const;
  const type = types[i % types.length]!;
  return {
    assetId: `ast-${String(i + 1).padStart(4, '0')}`,
    inventoryId: i % 5 === 0 ? MOCK_INVENTORY[i]?.inventoryId : undefined,
    name: `${type} asset ${i + 1}`,
    assetType: type,
    department: DEPARTMENTS[i % DEPARTMENTS.length]!,
    serialNumber: `AST-SN-${10000 + i}`,
    manufacturer: MANUFACTURERS[i % MANUFACTURERS.length]!,
    model: `Model-${200 + (i % 50)}`,
    purchaseDate: daysAgo(365 + (i % 1000)),
    warrantyExpiry: daysFromNow(180 + (i % 365)),
    lastMaintenance: daysAgo(i % 90),
    nextMaintenance: daysFromNow(30 + (i % 60)),
    status: i % 20 === 0 ? 'maintenance' : i % 50 === 0 ? 'offline' : 'operational',
    location: `Building ${(i % 5) + 1}, Floor ${(i % 4) + 1}`,
    utilizationPercent: 50 + (i % 50),
    uptimePercent: 85 + (i % 15),
  };
});

const PO_STATUSES = ['draft', 'pending_approval', 'approved', 'ordered', 'partial', 'received', 'cancelled'] as const;

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = Array.from({ length: 500 }, (_, i) => {
  const supplier = MOCK_SUPPLIERS[i % MOCK_SUPPLIERS.length]!;
  const status = PO_STATUSES[i % PO_STATUSES.length]!;
  const lineCount = 1 + (i % 5);
  const items = Array.from({ length: lineCount }, (_, j) => {
    const qty = 10 + ((i + j) % 100);
    const price = 20 + ((i + j) % 80);
    return {
      lineId: `pol-${i}-${j}`,
      sku: `SKU-${100000 + i + j}`,
      itemName: `PO Item ${i}-${j}`,
      quantity: qty,
      unitPrice: price,
      receivedQuantity: status === 'received' ? qty : status === 'partial' ? Math.floor(qty / 2) : 0,
    };
  });
  const subtotal = items.reduce((s, li) => s + li.quantity * li.unitPrice, 0);
  const tax = Math.round(subtotal * 0.1);
  return {
    purchaseOrderId: `po-${String(i + 1).padStart(4, '0')}`,
    poNumber: `PO-${2025000 + i}`,
    supplierId: supplier.supplierId,
    supplierName: supplier.name,
    department: DEPARTMENTS[i % DEPARTMENTS.length]!,
    status,
    items,
    subtotal,
    tax,
    total: subtotal + tax,
    requestedBy: `user-${(i % 20) + 1}`,
    approvedBy: status !== 'draft' && status !== 'pending_approval' ? `mgr-${(i % 10) + 1}` : undefined,
    orderDate: status !== 'draft' ? daysAgo(i % 60) : undefined,
    expectedDelivery: daysFromNow(7 + (i % 14)),
    receivedDate: status === 'received' ? daysAgo(i % 30) : undefined,
    createdAt: daysAgo(i % 90),
    updatedAt: daysAgo(i % 14),
  };
});

export const MOCK_MOVEMENTS: StockMovement[] = Array.from({ length: 2500 }, (_, i) => {
  const item = MOCK_INVENTORY[i % MOCK_INVENTORY.length]!;
  const types = ['receive', 'issue', 'transfer', 'adjustment', 'return', 'count'] as const;
  const type = types[i % types.length]!;
  return {
    movementId: `mov-${String(i + 1).padStart(5, '0')}`,
    inventoryId: item.inventoryId,
    itemName: item.itemName,
    type,
    quantity: 1 + (i % 50),
    fromLocation: type === 'issue' || type === 'transfer' ? item.warehouseLocation : undefined,
    toLocation: type === 'receive' || type === 'transfer' ? item.warehouseLocation : undefined,
    reference: `REF-${10000 + i}`,
    performedBy: `user-${(i % 30) + 1}`,
    createdAt: daysAgo(i % 180),
  };
});

export const MOCK_TRANSFERS: StockTransfer[] = Array.from({ length: 400 }, (_, i) => {
  const from = MOCK_WAREHOUSES[i % MOCK_WAREHOUSES.length]!;
  const to = MOCK_WAREHOUSES[(i + 7) % MOCK_WAREHOUSES.length]!;
  const item = MOCK_INVENTORY[i % MOCK_INVENTORY.length]!;
  const statuses = ['pending', 'in_transit', 'completed', 'cancelled'] as const;
  const status = statuses[i % statuses.length]!;
  return {
    transferId: `trf-${String(i + 1).padStart(4, '0')}`,
    fromWarehouseId: from.warehouseId,
    toWarehouseId: to.warehouseId,
    fromWarehouseName: from.name,
    toWarehouseName: to.name,
    items: [{ inventoryId: item.inventoryId, itemName: item.itemName, quantity: 5 + (i % 20) }],
    status,
    requestedBy: `user-${(i % 15) + 1}`,
    completedAt: status === 'completed' ? daysAgo(i % 30) : undefined,
    createdAt: daysAgo(i % 60),
  };
});

export const MOCK_CYCLE_COUNTS: CycleCount[] = Array.from({ length: 300 }, (_, i) => {
  const wh = MOCK_WAREHOUSES[i % MOCK_WAREHOUSES.length]!;
  const statuses = ['scheduled', 'in_progress', 'completed', 'variance_review'] as const;
  const status = statuses[i % statuses.length]!;
  return {
    cycleCountId: `cc-${String(i + 1).padStart(4, '0')}`,
    warehouseId: wh.warehouseId,
    warehouseName: wh.name,
    status,
    scheduledDate: daysFromNow(i % 30),
    completedDate: status === 'completed' ? daysAgo(i % 14) : undefined,
    itemsCounted: 50 + (i % 200),
    varianceCount: i % 10,
    performedBy: status !== 'scheduled' ? `user-${(i % 10) + 1}` : undefined,
  };
});

export const MOCK_EXPIRY_ALERTS: ExpiryAlert[] = MOCK_INVENTORY.filter((i) => i.expiryDate)
  .slice(0, 500)
  .map((item, i) => {
    const days = Math.max(0, Math.floor((new Date(item.expiryDate!).getTime() - Date.now()) / 86400000));
    return {
      alertId: `exp-${i + 1}`,
      inventoryId: item.inventoryId,
      itemName: item.itemName,
      batchNumber: item.batchNumber,
      expiryDate: item.expiryDate!,
      quantity: item.quantityOnHand,
      daysUntilExpiry: days,
      severity: days <= 7 ? 'critical' : days <= 30 ? 'warning' : 'info',
      department: item.department,
    };
  });

export function buildDashboard(department?: string, warehouseId?: string) {
  let items = MOCK_INVENTORY;
  if (department) items = items.filter((i) => i.department === department);
  if (warehouseId) items = items.filter((i) => i.warehouseLocation === warehouseId);

  const inventoryValue = items.reduce((s, i) => s + i.quantityOnHand * i.purchasePrice, 0);
  const lowStock = items.filter((i) => i.status === 'low_stock').length;
  const outOfStock = items.filter((i) => i.status === 'out_of_stock').length;
  const expired = items.filter((i) => i.status === 'expired').length;
  const pendingOrders = MOCK_PURCHASE_ORDERS.filter((p) => ['pending_approval', 'approved', 'ordered'].includes(p.status)).length;
  const activeTransfers = MOCK_TRANSFERS.filter((t) => t.status === 'pending' || t.status === 'in_transit').length;
  const assetUtil = Math.round(MOCK_ASSETS.reduce((s, a) => s + a.utilizationPercent, 0) / MOCK_ASSETS.length);

  return {
    totalItems: items.length,
    inventoryValue: Math.round(inventoryValue),
    lowStockCount: lowStock,
    outOfStockCount: outOfStock,
    expiredCount: expired,
    pendingOrders,
    activeTransfers,
    assetUtilization: assetUtil,
    stockTurnover: 4.2,
    daysOfInventory: 45,
    recentMovements: MOCK_MOVEMENTS.slice(0, 8),
    recentOrders: MOCK_PURCHASE_ORDERS.slice(0, 6),
    expiryAlerts: MOCK_EXPIRY_ALERTS.filter((a) => !department || a.department === department).slice(0, 8),
  };
}
