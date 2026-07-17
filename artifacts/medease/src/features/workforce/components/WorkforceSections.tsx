import {
  AnalyticsPanel,
  AttendanceCard,
  CertificationCard,
  ClockInPanel,
  CoverageDashboard,
  DepartmentCard,
  ExportToolbar,
  LeaveRequestCard,
  OrganizationChart,
  PayrollSummaryCard,
  PerformanceCard,
  RosterBoard,
  ScheduleGrid,
  StaffDirectory,
  TrainingCard,
  WorkforceMetrics,
} from '@/features/workforce/components/WorkforceComponents';
import {
  useAttendance,
  useCoverage,
  useDepartments,
  useEmployees,
  useLeaveRequests,
  useOrganization,
  usePayroll,
  usePerformance,
  useRoster,
  useSchedules,
  useTraining,
  useWorkforceAnalytics,
  useWorkforceDashboard,
} from '@/features/workforce/hooks/use-workforce';
import { useWorkforceMutations } from '@/features/workforce/mutations/workforce.mutations';
import type { WorkforceFilters } from '@/services/workforce/types';
import { useAuth } from '@/services/auth/auth-context';
import { LoadingView } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';
import { Users } from 'lucide-react';

export type WorkforceSection =
  | 'dashboard'
  | 'schedule'
  | 'attendance'
  | 'training'
  | 'performance'
  | 'staff'
  | 'scheduling'
  | 'schedules'
  | 'leave'
  | 'employees'
  | 'departments'
  | 'organization'
  | 'payroll'
  | 'credentials'
  | 'analytics';

export function DashboardSection({ filters }: { filters?: WorkforceFilters }) {
  const dashboard = useWorkforceDashboard(
    filters?.facilityId,
    filters?.departmentId,
  );
  const coverage = useCoverage(filters?.departmentId);
  if (dashboard.isLoading) return <LoadingView label="Loading workforce…" />;
  if (!dashboard.data)
    return <EmptyState icon={Users} title="No workforce data" />;
  return (
    <div className="space-y-6">
      <WorkforceMetrics dashboard={dashboard.data} />
      {coverage.data ? <CoverageDashboard metrics={coverage.data} /> : null}
      <ScheduleGrid shifts={dashboard.data.recentShifts} />
    </div>
  );
}

export function ScheduleSection({ filters }: { filters?: WorkforceFilters }) {
  const query = useSchedules(filters);
  if (query.isLoading) return <LoadingView />;
  const items = query.data?.items ?? [];
  return <ScheduleGrid shifts={items} />;
}

export function AttendanceSection({ filters }: { filters?: WorkforceFilters }) {
  const query = useAttendance(filters);
  const { clockIn, clockOut } = useWorkforceMutations();
  const empId = filters?.employeeId ?? 'emp-00001';
  if (query.isLoading) return <LoadingView />;
  const items = query.data?.items ?? [];
  return (
    <div className="space-y-6">
      <ClockInPanel
        onClockIn={() =>
          clockIn.mutate({ employeeId: empId, type: 'clock_in' })
        }
        onClockOut={() =>
          clockOut.mutate({ employeeId: empId, type: 'clock_out' })
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, 12).map((a) => (
          <AttendanceCard key={a.attendanceId} record={a} />
        ))}
      </div>
    </div>
  );
}

export function TrainingSection({ filters }: { filters?: WorkforceFilters }) {
  const query = useTraining(filters);
  if (query.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(query.data?.items ?? []).slice(0, 12).map((t) => (
        <TrainingCard key={t.trainingId} training={t} />
      ))}
    </div>
  );
}

export function PerformanceSection({
  filters,
}: {
  filters?: WorkforceFilters;
}) {
  const query = usePerformance(filters);
  if (query.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(query.data?.items ?? []).slice(0, 12).map((p) => (
        <PerformanceCard key={p.reviewId} review={p} />
      ))}
    </div>
  );
}

export function StaffSection({ filters }: { filters?: WorkforceFilters }) {
  const query = useEmployees(filters);
  if (query.isLoading) return <LoadingView />;
  return <StaffDirectory employees={query.data?.items ?? []} />;
}

export function SchedulingSection({ filters }: { filters?: WorkforceFilters }) {
  const roster = useRoster(filters?.departmentId);
  const schedules = useSchedules(filters);
  if (roster.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      {roster.data ? <RosterBoard roster={roster.data} /> : null}
      <ScheduleGrid shifts={schedules.data?.items ?? []} />
    </div>
  );
}

export function LeaveSection({ filters }: { filters?: WorkforceFilters }) {
  const query = useLeaveRequests(filters);
  const { approveLeave, rejectLeave } = useWorkforceMutations();
  const { user } = useAuth();
  if (query.isLoading) return <LoadingView />;
  const items = query.data?.items ?? [];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.slice(0, 12).map((l) => (
        <LeaveRequestCard
          key={l.leaveId}
          request={l}
          onApprove={
            l.status === 'pending'
              ? () =>
                  approveLeave.mutate({
                    leaveId: l.leaveId,
                    approverId: user?.id ?? 'mgr-001',
                  })
              : undefined
          }
          onReject={
            l.status === 'pending'
              ? () => rejectLeave.mutate(l.leaveId)
              : undefined
          }
        />
      ))}
    </div>
  );
}

export function EmployeesSection({ filters }: { filters?: WorkforceFilters }) {
  return <StaffSection filters={filters} />;
}

export function DepartmentsSection({
  filters,
}: {
  filters?: WorkforceFilters;
}) {
  const query = useDepartments(filters);
  if (query.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(query.data?.items ?? []).slice(0, 12).map((d) => (
        <DepartmentCard key={d.departmentId} department={d} />
      ))}
    </div>
  );
}

export function OrganizationSection() {
  const query = useOrganization();
  if (query.isLoading) return <LoadingView />;
  return <OrganizationChart units={query.data ?? []} />;
}

export function PayrollSection({ filters }: { filters?: WorkforceFilters }) {
  const query = usePayroll(filters);
  if (query.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(query.data?.items ?? []).slice(0, 9).map((p) => (
        <PayrollSummaryCard key={p.payrollId} summary={p} />
      ))}
    </div>
  );
}

export function CredentialsSection({
  filters,
}: {
  filters?: WorkforceFilters;
}) {
  const query = useEmployees(filters);
  if (query.isLoading) return <LoadingView />;
  const certs = (query.data?.items ?? [])
    .flatMap((e) => e.certifications)
    .slice(0, 12);
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {certs.map((c) => (
        <CertificationCard key={c.certificationId} cert={c} />
      ))}
    </div>
  );
}

export function AnalyticsSection() {
  const analytics = useWorkforceAnalytics();
  const coverage = useCoverage();
  if (analytics.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      {analytics.data ? <AnalyticsPanel analytics={analytics.data} /> : null}
      {coverage.data ? <CoverageDashboard metrics={coverage.data} /> : null}
      <ExportToolbar />
    </div>
  );
}

export function WorkforceSectionContent({
  section,
  filters,
}: {
  section: WorkforceSection;
  filters?: WorkforceFilters;
}) {
  switch (section) {
    case 'schedule':
      return <ScheduleSection filters={filters} />;
    case 'attendance':
      return <AttendanceSection filters={filters} />;
    case 'training':
      return <TrainingSection filters={filters} />;
    case 'performance':
      return <PerformanceSection filters={filters} />;
    case 'staff':
      return <StaffSection filters={filters} />;
    case 'scheduling':
      return <SchedulingSection filters={filters} />;
    case 'schedules':
      return <SchedulingSection filters={filters} />;
    case 'leave':
      return <LeaveSection filters={filters} />;
    case 'employees':
      return <EmployeesSection filters={filters} />;
    case 'departments':
      return <DepartmentsSection filters={filters} />;
    case 'organization':
      return <OrganizationSection />;
    case 'payroll':
      return <PayrollSection filters={filters} />;
    case 'credentials':
      return <CredentialsSection filters={filters} />;
    case 'analytics':
      return <AnalyticsSection />;
    default:
      return <DashboardSection filters={filters} />;
  }
}
