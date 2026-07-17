export function getSupplierPerformance(supplierId: string) {
  return {
    supplierId,
    onTimeRate: 85 + Math.random() * 10,
    qualityScore: 4 + Math.random(),
    totalSpend: 50000 + Math.random() * 100000,
  };
}

export function rankSuppliers() {
  return Array.from({ length: 10 }, (_, i) => ({
    rank: i + 1,
    supplierId: `sup-${String(i + 1).padStart(4, '0')}`,
    score: 95 - i * 3,
  }));
}
