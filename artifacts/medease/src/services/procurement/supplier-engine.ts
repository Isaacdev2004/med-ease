import { MOCK_SUPPLIERS } from '@/services/procurement/mock-data';
import type { Supplier, SupplierScorecard } from '@/services/procurement/types';

export function rankSuppliers(category?: string): SupplierScorecard[] {
  let suppliers = MOCK_SUPPLIERS.filter((s) => s.status === 'active');
  if (category) suppliers = suppliers.filter((s) => s.category === category);

  return suppliers
    .map((s) => scoreSupplier(s))
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 100)
    .map((s, i) => ({ ...s, rank: i + 1 }));
}

export function scoreSupplier(supplier: Supplier): SupplierScorecard {
  const overall = (supplier.qualityScore + supplier.onTimeDeliveryRate + supplier.priceScore + supplier.complianceScore - supplier.riskScore) / 4;
  return {
    supplierId: supplier.supplierId,
    supplierName: supplier.name,
    overallScore: Math.round(overall * 10) / 10,
    quality: supplier.qualityScore,
    delivery: supplier.onTimeDeliveryRate,
    price: supplier.priceScore,
    compliance: supplier.complianceScore,
    risk: supplier.riskScore,
    trend: supplier.rating >= 4 ? 'up' : supplier.rating <= 3 ? 'down' : 'stable',
    rank: 0,
  };
}

export function getPreferredSupplier(category: string): Supplier | null {
  const preferred = MOCK_SUPPLIERS.find((s) => s.category === category && s.isPreferred && s.status === 'active');
  if (preferred) return preferred;
  const ranked = rankSuppliers(category);
  const top = ranked[0];
  if (!top) return null;
  return MOCK_SUPPLIERS.find((s) => s.supplierId === top.supplierId) ?? null;
}

export function assessSupplierRisk(supplierId: string): { risk: 'low' | 'medium' | 'high'; factors: string[] } {
  const s = MOCK_SUPPLIERS.find((x) => x.supplierId === supplierId);
  if (!s) return { risk: 'high', factors: ['Unknown supplier'] };
  const factors: string[] = [];
  if (s.riskScore > 30) factors.push('Elevated risk score');
  if (s.onTimeDeliveryRate < 75) factors.push('Poor delivery performance');
  if (s.complianceScore < 70) factors.push('Compliance gaps');
  if (s.isInternational) factors.push('International supply chain');
  const risk = s.riskScore > 35 || factors.length >= 3 ? 'high' : s.riskScore > 20 ? 'medium' : 'low';
  return { risk, factors };
}
