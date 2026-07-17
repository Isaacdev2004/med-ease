export { cdssService } from '@/services/cdss/cdss.service';
export { cdssRepository } from '@/services/cdss/repository';
export { cdssOfflineQueue } from '@/services/cdss/offline-sync';
export {
  computeCdssAnalytics,
  buildCdssDashboard,
} from '@/services/cdss/analytics';
export {
  MOCK_ALERTS,
  MOCK_ALLERGY_ALERTS,
  MOCK_AUDIT,
  MOCK_CALCULATORS,
  MOCK_CLINICAL_RULES,
  MOCK_CONTRAINDICATIONS,
  MOCK_DECISION_TREES,
  MOCK_DIAGNOSTIC_SUGGESTIONS,
  MOCK_DRUG_INTERACTIONS,
  MOCK_DUPLICATE_THERAPY,
  MOCK_EVIDENCE,
  MOCK_GUIDELINES,
  MOCK_ORDER_SETS,
  MOCK_PATHWAYS,
  MOCK_PREVENTIVE,
  MOCK_PROTOCOLS,
  MOCK_RECOMMENDATIONS,
} from '@/services/cdss/mock-data';
