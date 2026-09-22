import {
  MOCK_BUDGETS,
  MOCK_DELIVERIES,
  MOCK_INVOICES,
  MOCK_PURCHASE_ORDERS,
  MOCK_SUPPLIERS,
} from '@/services/procurement/mock-data';
import { rankSuppliers } from '@/services/procurement/supplier-engine';
import type {
  ProcurementAnalytics,
  PurchaseOrder,
  SpendAnalysis,
} from '@/services/procurement/types';

export function emptySpendAnalysis(): SpendAnalysis {
  return {
    totalSpend: 0,
    committedSpend: 0,
    savings: 0,
    byDepartment: [],
    bySupplier: [],
  };
}

export function isSpendAnalysis(value: unknown): value is SpendAnalysis {
  return (
    value != null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    'totalSpend' in value &&
    'committedSpend' in value &&
    'savings' in value
  );
}

export function buildSpendAnalysisFromOrders(
  orders: PurchaseOrder[],
): SpendAnalysis {
  const totalSpend = orders.reduce(
    (sum, order) => sum + (Number(order.total) || 0),
    0,
  );
  const committedSpend = orders
    .filter((order) => ['approved', 'ordered'].includes(order.status))
    .reduce((sum, order) => sum + (Number(order.total) || 0), 0);

  const deptMap = new Map<string, number>();
  for (const order of orders) {
    deptMap.set(
      order.department,
      (deptMap.get(order.department) ?? 0) + (Number(order.total) || 0),
    );
  }

  const supMap = new Map<string, { name: string; amount: number }>();
  for (const order of orders) {
    const current = supMap.get(order.supplierId) ?? {
      name: order.supplierName,
      amount: 0,
    };
    current.amount += Number(order.total) || 0;
    supMap.set(order.supplierId, current);
  }

  return {
    totalSpend: Math.round(totalSpend),
    committedSpend: Math.round(committedSpend),
    savings: Math.round(totalSpend * 0.05),
    byDepartment: [...deptMap.entries()].map(([department, amount]) => ({
      department: department as SpendAnalysis['byDepartment'][0]['department'],
      amount: Math.round(amount),
    })),
    bySupplier: [...supMap.entries()]
      .map(([supplierId, value]) => ({
        supplierId,
        name: value.name,
        amount: Math.round(value.amount),
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 20),
  };
}

export function computeProcurementAnalytics(): ProcurementAnalytics {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const spendTrends = months.map((label, i) => ({
    label,
    value: MOCK_PURCHASE_ORDERS.filter((_, idx) => idx % 6 === i).reduce(
      (s, o) => s + o.total,
      0,
    ),
  }));

  const deptMap = new Map<string, number>();
  for (const o of MOCK_PURCHASE_ORDERS.slice(0, 5000)) {
    deptMap.set(o.department, (deptMap.get(o.department) ?? 0) + o.total);
  }
  const spendByDepartment = [...deptMap.entries()].map(([label, value]) => ({
    label,
    value: Math.round(value),
  }));

  const catSpend = MOCK_PURCHASE_ORDERS.slice(0, 3000).reduce(
    (acc, o) => {
      const key = o.department;
      acc[key] = (acc[key] ?? 0) + o.total;
      return acc;
    },
    {} as Record<string, number>,
  );
  const spendByCategory = Object.entries(catSpend).map(([label, value]) => ({
    label,
    value: Math.round(value),
  }));

  const supplierRankings = rankSuppliers()
    .slice(0, 10)
    .map((s) => ({
      label: s.supplierName.slice(0, 20),
      value: s.overallScore,
    }));

  const matched = MOCK_INVOICES.filter(
    (i) =>
      i.status === 'matched' || i.status === 'approved' || i.status === 'paid',
  ).length;
  const invoiceMatchRate = Math.round((matched / MOCK_INVOICES.length) * 100);
  const onTime =
    MOCK_SUPPLIERS.reduce((s, sup) => s + sup.onTimeDeliveryRate, 0) /
    MOCK_SUPPLIERS.length;

  return {
    spendTrends,
    spendByDepartment,
    spendByCategory,
    supplierRankings,
    procurementCycleTime: months.map((label, i) => ({
      label,
      value: 5 + (i % 8),
    })),
    budgetVsActual: MOCK_BUDGETS.slice(0, 6).map((b) => ({
      label: b.department,
      value: Math.round((b.spent / b.allocated) * 100),
    })),
    invoiceMatchRate,
    onTimeDeliveryRate: Math.round(onTime),
    savingsAchieved: Math.round(
      MOCK_PURCHASE_ORDERS.slice(0, 100).reduce((s) => s + 500, 0),
    ),
  };
}

export function computeSpendAnalysis(department?: string): SpendAnalysis {
  let orders = MOCK_PURCHASE_ORDERS;
  if (department) orders = orders.filter((o) => o.department === department);
  return buildSpendAnalysisFromOrders(orders);
}

export function countDelayedDeliveries(): number {
  return MOCK_DELIVERIES.filter((d) => d.status === 'delayed').length;
}
