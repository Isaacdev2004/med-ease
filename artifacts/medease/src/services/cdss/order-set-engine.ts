import type { OrderSet, OrderSetCategory } from '@/services/cdss/types';

export function filterOrderSetsByCategory(orderSets: OrderSet[], category?: OrderSetCategory): OrderSet[] {
  if (!category) return orderSets;
  return orderSets.filter((o) => o.category === category);
}

export function sortOrderSetsByUsage(orderSets: OrderSet[]): OrderSet[] {
  return [...orderSets].sort((a, b) => b.usageCount - a.usageCount);
}

export const ORDER_SET_TEMPLATES: Record<OrderSetCategory, string[]> = {
  sepsis: ['Blood cultures', 'Lactate', 'Broad-spectrum antibiotics', 'IV fluids'],
  stroke: ['CT head', 'NIHSS assessment', 'tPA protocol', 'Neurology consult'],
  stemi: ['ECG', 'Troponin', 'Aspirin', 'PCI activation'],
  nstemi: ['ECG', 'Troponin series', 'Antiplatelet', 'Cardiology consult'],
  pneumonia: ['Chest X-ray', 'CBC', 'Blood culture', 'Antibiotics'],
  diabetes: ['HbA1c', 'Metformin', 'Diabetes education', 'Foot exam'],
  copd: ['Spirometry', 'Bronchodilator', 'Smoking cessation', 'Pulmonary rehab'],
  asthma: ['Peak flow', 'Inhaled corticosteroid', 'Action plan', 'Allergen review'],
  heart_failure: ['BNP', 'Echo', 'ACE inhibitor', 'Daily weights'],
  surgery: ['Pre-op labs', 'NPO', 'Antibiotic prophylaxis', 'DVT prophylaxis'],
  icu: ['ABG', 'Central line', 'Sedation protocol', 'Daily goals'],
  emergency: ['Vitals q15min', 'IV access', 'Trauma survey', 'Disposition plan'],
};
