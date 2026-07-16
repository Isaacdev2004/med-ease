import { MOCK_PURCHASE_ORDERS, MOCK_PURCHASE_REQUESTS } from '@/services/procurement/mock-data';
import type { DemandForecast, ProcurementDepartment } from '@/services/procurement/types';

export function forecastProcurementDemand(department?: ProcurementDepartment): DemandForecast[] {
  const requests = department
    ? MOCK_PURCHASE_REQUESTS.filter((r) => r.department === department)
    : MOCK_PURCHASE_REQUESTS.slice(0, 100);

  return requests.slice(0, 50).map((r) => {
    const idx = parseInt(r.requestId.replace('req-', ''), 10) || 1;
    const currentDemand = r.lineItems.reduce((s, l) => s + l.quantity, 0);
    const projected = Math.round(currentDemand * (1.1 + (idx % 10) / 50));
    const leadTime = 3 + (idx % 21);
    return {
      itemId: r.requestId,
      itemName: r.title,
      department: r.department,
      currentDemand,
      projectedDemand: projected,
      leadTimeDays: leadTime,
      recommendedOrderDate: new Date(Date.now() + (leadTime - 5) * 86400000).toISOString(),
      confidence: 0.7 + (idx % 25) / 100,
    };
  });
}

export function forecastPurchaseSpend(department?: ProcurementDepartment) {
  const orders = department
    ? MOCK_PURCHASE_ORDERS.filter((o) => o.department === department)
    : MOCK_PURCHASE_ORDERS.slice(0, 200);
  const monthly = Array.from({ length: 6 }, (_, i) => {
    const monthOrders = orders.filter((_, idx) => idx % 6 === i);
    return {
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]!,
      projected: monthOrders.reduce((s, o) => s + o.total, 0) * 1.05,
      actual: monthOrders.reduce((s, o) => s + o.total, 0),
    };
  });
  return monthly;
}

export function calculateSafetyStock(avgDailyUsage: number, leadTimeDays: number, serviceLevel = 0.95) {
  const zScore = serviceLevel >= 0.95 ? 1.65 : 1.28;
  return Math.ceil(avgDailyUsage * leadTimeDays + zScore * Math.sqrt(leadTimeDays) * avgDailyUsage * 0.2);
}

export function seasonalAdjustment(baseDemand: number, month: number): number {
  const seasonal = [0.9, 0.95, 1.0, 1.05, 1.1, 1.08, 0.95, 0.92, 1.0, 1.05, 1.12, 1.15];
  return Math.round(baseDemand * (seasonal[month] ?? 1));
}
