export { researchService } from '@/services/research/research.service';
export { researchRepository } from '@/services/research/repository';
export { researchOfflineQueue } from '@/services/research/offline-sync';
export { computeResearchAnalytics, buildResearchDashboard } from '@/services/research/analytics';
export {
  MOCK_TRIALS,
  MOCK_PARTICIPANTS,
  MOCK_VISITS,
  MOCK_INVESTIGATORS,
  MOCK_SITES,
  MOCK_CONSENTS,
  MOCK_DEVIATIONS,
  MOCK_ADVERSE_EVENTS,
  MOCK_BIOSPECIMENS,
  MOCK_PUBLICATIONS,
  MOCK_INNOVATION,
  MOCK_GRANTS,
  MOCK_REGULATORY,
  MOCK_RESEARCH_AUDIT,
} from '@/services/research/mock-data';
