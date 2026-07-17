export { workforceService } from '@/services/workforce/workforce.service';
export { workforceRepository } from '@/services/workforce/repository';
export { workforceOfflineQueue } from '@/services/workforce/offline-sync';
export {
  computeWorkforceAnalytics,
  computeCoverage,
} from '@/services/workforce/analytics';
export {
  toFhirPractitioner,
  toFhirPractitionerRole,
} from '@/services/workforce/mapper';
export {
  buildWorkforceDashboard,
  MOCK_EMPLOYEES,
  MOCK_DEPARTMENTS,
  MOCK_SHIFTS,
  MOCK_ATTENDANCE,
  MOCK_LEAVE_REQUESTS,
  MOCK_TRAINING,
  MOCK_PERFORMANCE,
  MOCK_ROSTERS,
  MOCK_ON_CALL,
  MOCK_PAYROLL,
  MOCK_ORG_UNITS,
} from '@/services/workforce/mock-data';
export type {
  Employee,
  Department,
  Shift,
  Attendance,
  LeaveRequest,
  Training,
  PerformanceReview,
  Certification,
  WorkforceDashboard,
  WorkforceAnalytics,
  CoverageMetrics,
  WorkforceFilters,
  WorkforcePermissions,
  Roster,
  OnCallSchedule,
  PayrollSummary,
  OrganizationUnit,
  CreateEmployeeInput,
  AssignShiftInput,
} from '@/services/workforce/types';
