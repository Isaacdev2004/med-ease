import { MOCK_INVENTORY } from '@/services/inventory/mock-data';
import type { DemandForecast } from '@/services/inventory/types';

export function forecastDemand(inventoryId?: string): DemandForecast[] {
  const items = inventoryId ? MOCK_INVENTORY.filter((i) => i.inventoryId === inventoryId) : MOCK_INVENTORY.slice(0, 50);
  return items.map((item) => {
    const avgDaily = 1 + (parseInt(item.inventoryId.replace('inv-', ''), 10) % 20);
    const daysUntilStockout = item.availableQuantity / avgDaily;
    return {
      inventoryId: item.inventoryId,
      itemName: item.itemName,
      currentStock: item.availableQuantity,
      avgDailyUsage: avgDaily,
      forecastDays: 30,
      projectedStockout: daysUntilStockout < 30 ? new Date(Date.now() + daysUntilStockout * 86400000).toISOString() : undefined,
      recommendedOrder: Math.max(0, item.reorderQuantity - item.availableQuantity),
      confidence: 0.75 + Math.random() * 0.2,
    };
  });
}

export function abcAnalysis() {
  const sorted = [...MOCK_INVENTORY].sort((a, b) => b.quantityOnHand * b.purchasePrice - a.quantityOnHand * a.purchasePrice);
  const total = sorted.reduce((s, i) => s + i.quantityOnHand * i.purchasePrice, 0);
  let cumulative = 0;
  return sorted.slice(0, 100).map((item, idx) => {
    cumulative += item.quantityOnHand * item.purchasePrice;
    const pct = cumulative / total;
    return { inventoryId: item.inventoryId, itemName: item.itemName, class: pct <= 0.8 ? 'A' : pct <= 0.95 ? 'B' : 'C', rank: idx + 1 };
  });
}
