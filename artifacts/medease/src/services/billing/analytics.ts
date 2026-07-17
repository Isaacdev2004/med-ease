import {
  MOCK_CLAIMS,
  MOCK_INVOICES,
  MOCK_PAYMENTS,
  MOCK_REFUNDS,
} from '@/services/billing/mock-data';
import type { RevenueAnalytics } from '@/services/billing/types';

export function computeRevenueAnalytics(): RevenueAnalytics {
  const totalRevenue = MOCK_INVOICES.reduce((s, i) => s + i.total, 0);
  const collections = MOCK_PAYMENTS.filter(
    (p) => p.status === 'completed',
  ).reduce((s, p) => s + p.amount, 0);
  const outstanding = MOCK_INVOICES.reduce((s, i) => s + i.balance, 0);
  const approved = MOCK_CLAIMS.filter((c) =>
    ['approved', 'paid', 'partially_approved'].includes(c.status),
  ).length;
  const denied = MOCK_CLAIMS.filter((c) => c.status === 'denied').length;
  const totalClaims = MOCK_CLAIMS.length;
  const claimApprovalRate =
    totalClaims > 0 ? Math.round((approved / totalClaims) * 100) : 0;
  const denialRate =
    totalClaims > 0 ? Math.round((denied / totalClaims) * 100) : 0;
  const reimbursed = MOCK_CLAIMS.reduce((s, c) => s + c.approvedAmount, 0);
  const averageReimbursement =
    approved > 0 ? Math.round(reimbursed / approved) : 0;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const departments = [
    'Consultation',
    'Laboratory',
    'Radiology',
    'Pharmacy',
    'Telemedicine',
    'Monitoring',
  ];

  return {
    totalRevenue,
    collections,
    outstanding,
    claimApprovalRate,
    denialRate,
    averageReimbursement,
    arAging: [
      { bucket: '0-30 days', amount: outstanding * 0.45 },
      { bucket: '31-60 days', amount: outstanding * 0.3 },
      { bucket: '61-90 days', amount: outstanding * 0.15 },
      { bucket: '90+ days', amount: outstanding * 0.1 },
    ],
    cashFlow: months.map((m, i) => ({
      label: m,
      value: 50000 + i * 12000 + Math.random() * 5000,
    })),
    departmentRevenue: departments.map((d, i) => ({
      department: d,
      amount: 80000 + i * 15000,
    })),
    providerRevenue: Array.from({ length: 5 }, (_, i) => ({
      provider: `Dr. Provider ${i + 1}`,
      amount: 40000 + i * 8000,
    })),
    facilityRevenue: Array.from({ length: 5 }, (_, i) => ({
      facility: `Facility ${i + 1}`,
      amount: 120000 + i * 20000,
    })),
    dailyRevenue: Array.from({ length: 14 }, (_, i) => ({
      label: `Day ${i + 1}`,
      value: 3000 + i * 200,
    })),
    monthlyRevenue: months.map((m, i) => ({
      label: m,
      value: 180000 + i * 25000,
    })),
    claimsTrends: months.map((m, i) => ({
      month: m,
      submitted: 200 + i * 20,
      approved: 150 + i * 15,
      denied: 20 + i * 3,
    })),
    collectionsTrends: months.map((m, i) => ({
      month: m,
      collected: 160000 + i * 20000,
      outstanding: 80000 - i * 5000,
    })),
    payerMix: [
      { payer: 'AXA Santé', amount: collections * 0.3, percentage: 30 },
      { payer: 'CNAM', amount: collections * 0.25, percentage: 25 },
      { payer: 'Self-Pay', amount: collections * 0.2, percentage: 20 },
      { payer: 'Allianz', amount: collections * 0.15, percentage: 15 },
      { payer: 'Other', amount: collections * 0.1, percentage: 10 },
    ],
    agingReport: [
      { bucket: 'Current', count: 1200, amount: outstanding * 0.5 },
      { bucket: '1-30 days', count: 800, amount: outstanding * 0.25 },
      { bucket: '31-60 days', count: 400, amount: outstanding * 0.15 },
      { bucket: '60+ days', count: 200, amount: outstanding * 0.1 },
    ],
  };
}

export function computeRefundTotal() {
  return MOCK_REFUNDS.filter((r) => r.status === 'completed').reduce(
    (s, r) => s + r.amount,
    0,
  );
}
