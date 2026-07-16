import { MOCK_ASSETS, MOCK_INVENTORY, MOCK_PURCHASE_ORDERS, MOCK_SUPPLIERS, MOCK_WAREHOUSES } from '@/services/inventory/mock-data';
import type { InventoryAnalytics } from '@/services/inventory/types';

export function computeInventoryAnalytics(): InventoryAnalytics {
  const inventoryValue = MOCK_INVENTORY.reduce((s, i) => s + i.quantityOnHand * i.purchasePrice, 0);
  const lowStock = MOCK_INVENTORY.filter((i) => i.status === 'low_stock' || i.status === 'out_of_stock').length;
  const expiredValue = MOCK_INVENTORY.filter((i) => i.status === 'expired').reduce((s, i) => s + i.quantityOnHand * i.purchasePrice, 0);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const depts = ['Pharmacy', 'Laboratory', 'Radiology', 'ICU', 'Surgery'];

  return {
    inventoryValue: Math.round(inventoryValue),
    stockTurnover: 4.5,
    daysOfInventory: 42,
    lowStockItems: lowStock,
    expiredStockValue: Math.round(expiredValue),
    procurementCycleDays: 12,
    supplierPerformance: 88,
    warehouseUtilization: Math.round(MOCK_WAREHOUSES.reduce((s, w) => s + w.utilizationPercent, 0) / MOCK_WAREHOUSES.length),
    assetUtilization: Math.round(MOCK_ASSETS.reduce((s, a) => s + a.utilizationPercent, 0) / MOCK_ASSETS.length),
    equipmentUptime: Math.round(MOCK_ASSETS.reduce((s, a) => s + a.uptimePercent, 0) / MOCK_ASSETS.length),
    inventoryTrends: months.map((m, i) => ({ label: m, value: 800000 + i * 50000 })),
    consumptionByDepartment: depts.map((d, i) => ({ label: d, value: 50000 + i * 15000 })),
    procurementSpend: months.map((m, i) => ({ label: m, value: 120000 + i * 20000 })),
    expiryTimeline: months.map((m, i) => ({ label: m, value: 5000 + i * 800 })),
    abcAnalysis: [{ label: 'Class A', value: 70 }, { label: 'Class B', value: 20 }, { label: 'Class C', value: 10 }],
    warehouseCapacity: MOCK_WAREHOUSES.slice(0, 6).map((w) => ({ label: w.code, value: w.utilizationPercent })),
    equipmentUtilization: MOCK_ASSETS.slice(0, 6).map((a) => ({ label: a.name.slice(0, 12), value: a.utilizationPercent })),
    supplierRankings: MOCK_SUPPLIERS.slice(0, 8).map((s) => ({ label: s.name.slice(0, 15), value: Math.round(s.rating * 20) })),
  };
}

export function getProcurementCycleTime() {
  const received = MOCK_PURCHASE_ORDERS.filter((p) => p.receivedDate && p.orderDate);
  if (!received.length) return 14;
  const avg = received.reduce((s, p) => {
    const days = (new Date(p.receivedDate!).getTime() - new Date(p.orderDate!).getTime()) / 86400000;
    return s + days;
  }, 0) / received.length;
  return Math.round(avg);
}
