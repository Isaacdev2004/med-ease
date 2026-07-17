export { executiveService } from '@/services/executive/executive.service';
export { executiveRepository } from '@/services/executive/repository';
export { executiveOfflineQueue } from '@/services/executive/offline-sync';
export {
  computeExecutiveAnalytics,
  buildExecutiveCommandCenter,
} from '@/services/executive/analytics';
export {
  MOCK_ENTERPRISE_KPIS,
  MOCK_DEPARTMENT_SCORECARDS,
  MOCK_OPERATIONAL_METRICS,
  MOCK_BENCHMARK_REPORTS,
  MOCK_EXECUTIVE_FORECASTS,
  MOCK_STRATEGIC_INITIATIVES,
  MOCK_ENTERPRISE_ALERTS,
  MOCK_CAPACITY_SNAPSHOTS,
  MOCK_PERFORMANCE_REPORTS,
} from '@/services/executive/mock-data';
