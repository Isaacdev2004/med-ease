import { format } from 'date-fns';
import {
  AlertTriangle,
  Building2,
  Calendar,
  Clock,
  GraduationCap,
  Star,
  Users,
} from 'lucide-react';

import type {
  Attendance,
  Certification,
  CoverageMetrics,
  Department,
  Employee,
  LeaveRequest,
  OnCallSchedule,
  OrganizationUnit,
  PayrollSummary,
  PerformanceReview,
  Roster,
  Shift,
  Training,
  WorkforceAnalytics,
  WorkforceDashboard,
} from '@/services/workforce/types';
import { BarChartPanel } from '@/shared/charts';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

export function EmployeeCard({ employee }: { employee: Employee }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between gap-2">
          <CardTitle className="text-sm">{employee.fullName}</CardTitle>
          <Badge className="capitalize">
            {employee.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <p className="text-muted-foreground">
          {employee.jobTitle} · {employee.departmentName}
        </p>
        <p>{employee.email}</p>
        <p className="text-xs capitalize">
          {employee.employmentType.replace('_', ' ')}
        </p>
      </CardContent>
    </Card>
  );
}

export function StaffProviderCard({ employee }: { employee: Employee }) {
  return <EmployeeCard employee={employee} />;
}

export function DepartmentCard({ department }: { department: Department }) {
  return (
    <Card>
      <CardContent className="pt-4 flex items-center gap-3">
        <Building2 className="h-8 w-8 text-primary shrink-0" />
        <div>
          <p className="font-medium text-sm">{department.name}</p>
          <p className="text-xs text-muted-foreground">
            {department.facilityName} · {department.staffCount} staff
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ShiftCard({ shift }: { shift: Shift }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">{shift.employeeName}</span>
          <Badge className="capitalize">
            {shift.shiftType.replace('_', ' ')}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          {format(new Date(shift.startTime), 'MMM d, HH:mm')} –{' '}
          {format(new Date(shift.endTime), 'HH:mm')}
        </p>
        <Badge variant="outline" className="capitalize mt-1">
          {shift.status.replace('_', ' ')}
        </Badge>
        {shift.isOvertime ? (
          <p className="text-xs text-amber-600 mt-1">Overtime</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function ScheduleGrid({ shifts }: { shifts: Shift[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {shifts.slice(0, 12).map((s) => (
        <ShiftCard key={s.shiftId} shift={s} />
      ))}
    </div>
  );
}

export const CalendarView = ScheduleGrid;
export const RosterBoard = ({ roster }: { roster: Roster }) => (
  <div className="space-y-4">
    <div className="flex justify-between text-sm">
      <span className="font-medium">{roster.departmentName}</span>
      <span>Coverage: {roster.coveragePercent}%</span>
    </div>
    <ScheduleGrid shifts={roster.shifts} />
  </div>
);

export function AttendanceCard({ record }: { record: Attendance }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <div className="flex justify-between">
          <span>{record.employeeName}</span>
          <Badge className="capitalize">{record.status}</Badge>
        </div>
        <p className="text-muted-foreground">{record.date}</p>
        <p>
          {record.hoursWorked}h{' '}
          {record.overtimeHours ? `(+${record.overtimeHours}h OT)` : ''}
        </p>
      </CardContent>
    </Card>
  );
}

export function ClockInPanel({
  onClockIn,
  onClockOut,
}: {
  onClockIn?: () => void;
  onClockOut?: () => void;
}) {
  return (
    <Card>
      <CardContent className="pt-4 flex flex-col items-center gap-3">
        <Clock className="h-10 w-10 text-primary" />
        <p className="font-medium">Time Clock</p>
        <div className="flex gap-2">
          <Button size="sm" onClick={onClockIn}>
            Clock In
          </Button>
          <Button size="sm" variant="outline" onClick={onClockOut}>
            Clock Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function LeaveRequestCard({
  request,
  onApprove,
  onReject,
}: {
  request: LeaveRequest;
  onApprove?: () => void;
  onReject?: () => void;
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">{request.employeeName}</span>
          <Badge className="capitalize">{request.status}</Badge>
        </div>
        <p className="capitalize">
          {request.leaveType.replace('_', ' ')} · {request.days} day(s)
        </p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(request.startDate), 'MMM d')} –{' '}
          {format(new Date(request.endDate), 'MMM d')}
        </p>
        {request.status === 'pending' && (onApprove || onReject) ? (
          <div className="flex gap-2">
            {onApprove ? (
              <Button size="sm" onClick={onApprove}>
                Approve
              </Button>
            ) : null}
            {onReject ? (
              <Button size="sm" variant="outline" onClick={onReject}>
                Reject
              </Button>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function TrainingCard({ training }: { training: Training }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">{training.courseName}</span>
          <Badge className="capitalize">
            {training.status.replace('_', ' ')}
          </Badge>
        </div>
        <p className="text-muted-foreground">{training.employeeName}</p>
        <p className="text-xs">
          Due {format(new Date(training.dueDate), 'MMM d, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
}

export function CertificationCard({ cert }: { cert: Certification }) {
  const expiring = cert.status === 'expiring' || cert.status === 'expired';
  return (
    <Card className={cn(expiring && 'border-amber-500')}>
      <CardContent className="pt-4 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">{cert.name}</span>
          <Badge
            variant={expiring ? 'secondary' : 'outline'}
            className="capitalize"
          >
            {cert.status}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Exp: {format(new Date(cert.expiryDate), 'MMM d, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
}

export function PerformanceCard({ review }: { review: PerformanceReview }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <p className="font-medium">{review.employeeName}</p>
        <p className="text-2xl font-bold">{review.score}</p>
        <Badge className="capitalize">{review.rating.replace('_', ' ')}</Badge>
        <p className="text-xs text-muted-foreground mt-1">{review.period}</p>
      </CardContent>
    </Card>
  );
}

export const CompetencyCard = ({
  name,
  level,
}: {
  name: string;
  level: number;
}) => (
  <Card>
    <CardContent className="pt-4 text-sm">
      <p className="font-medium">{name}</p>
      <p>Level {level}/5</p>
    </CardContent>
  </Card>
);

export function PayrollSummaryCard({ summary }: { summary: PayrollSummary }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <p className="font-medium">{summary.employeeName}</p>
        <p className="text-2xl font-bold">€{summary.netPay.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">
          {summary.period} · OT €{summary.overtimePay}
        </p>
      </CardContent>
    </Card>
  );
}

export const BenefitsCard = ({ plan }: { plan: string }) => (
  <Card>
    <CardContent className="pt-4 text-sm">
      <p className="font-medium">{plan}</p>
      <p className="text-muted-foreground">Active enrollment</p>
    </CardContent>
  </Card>
);

export const EmergencyContactCard = ({
  name,
  phone,
}: {
  name: string;
  phone: string;
}) => (
  <Card>
    <CardContent className="pt-4 text-sm">
      <p className="font-medium">{name}</p>
      <p>{phone}</p>
    </CardContent>
  </Card>
);

export function OnCallCard({ schedule }: { schedule: OnCallSchedule }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <p className="font-medium">{schedule.employeeName}</p>
        <p className="text-muted-foreground">{schedule.specialty}</p>
        <p className="text-xs">Level {schedule.escalationLevel}</p>
      </CardContent>
    </Card>
  );
}

export const AvailabilityCard = ({
  day,
  time,
}: {
  day: string;
  time: string;
}) => (
  <Card>
    <CardContent className="pt-4 text-sm">
      <Calendar className="h-5 w-5 mb-1" />
      <p>{day}</p>
      <p className="text-muted-foreground">{time}</p>
    </CardContent>
  </Card>
);

export function CoverageDashboard({ metrics }: { metrics: CoverageMetrics[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((m) => (
        <Card key={m.departmentId}>
          <CardContent className="pt-4 text-sm">
            <p className="font-medium truncate">{m.departmentName}</p>
            <p className="text-2xl font-bold">{m.coveragePercent}%</p>
            <p className="text-xs text-muted-foreground">
              {m.gaps} gaps · {m.overtimeShifts} OT shifts
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function WorkforceMetrics({
  dashboard,
}: {
  dashboard: WorkforceDashboard;
}) {
  const kpis = [
    {
      label: 'Total staff',
      value: dashboard.totalStaff.toLocaleString(),
      icon: Users,
    },
    { label: 'Active', value: dashboard.activeStaff, icon: Users },
    { label: 'On leave', value: dashboard.onLeave, icon: Calendar },
    { label: 'Open shifts', value: dashboard.openShifts, icon: Clock },
    {
      label: 'Pending leave',
      value: dashboard.pendingLeave,
      icon: AlertTriangle,
    },
    {
      label: 'Expiring credentials',
      value: dashboard.expiringCredentials,
      icon: GraduationCap,
    },
    { label: 'Coverage', value: `${dashboard.coveragePercent}%`, icon: Star },
    {
      label: 'Absenteeism',
      value: `${dashboard.absenteeismRate}%`,
      icon: AlertTriangle,
    },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((k) => (
        <Card key={k.label}>
          <CardContent className="pt-4 flex items-center gap-3">
            <k.icon className="h-8 w-8 text-primary shrink-0" />
            <div>
              <p className="text-2xl font-bold">{k.value}</p>
              <p className="text-xs text-muted-foreground">{k.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function AnalyticsPanel({
  analytics,
}: {
  analytics: WorkforceAnalytics;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <BarChartPanel title="Staff trends" data={analytics.staffTrends} />
      <BarChartPanel
        title="Coverage by department"
        data={analytics.coverageByDepartment}
      />
      <BarChartPanel title="Absenteeism" data={analytics.absenteeismTrend} />
      <BarChartPanel
        title="Training compliance"
        data={analytics.trainingCompliance}
      />
      <div className="grid grid-cols-3 gap-4 lg:col-span-2">
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold">
              {analytics.credentialCompliance}%
            </p>
            <p className="text-xs text-muted-foreground">
              Credential compliance
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold">{analytics.overtimeHours}h</p>
            <p className="text-xs text-muted-foreground">Overtime hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold">{analytics.turnoverRate}%</p>
            <p className="text-xs text-muted-foreground">Turnover rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function OrganizationChart({ units }: { units: OrganizationUnit[] }) {
  return (
    <div className="space-y-2">
      {units.slice(0, 15).map((u) => (
        <div
          key={u.unitId}
          className="flex items-center gap-2 text-sm border-l-2 border-primary/30 pl-3 py-1"
        >
          <Building2 className="h-4 w-4 shrink-0" />
          <span className="font-medium">{u.name}</span>
          <Badge variant="outline" className="capitalize ml-auto">
            {u.type}
          </Badge>
          <span className="text-xs text-muted-foreground">{u.staffCount}</span>
        </div>
      ))}
    </div>
  );
}

export const StaffDirectory = ({ employees }: { employees: Employee[] }) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {employees.map((e) => (
      <EmployeeCard key={e.employeeId} employee={e} />
    ))}
  </div>
);

export function ExportToolbar({
  onExport,
}: {
  onExport?: (f: 'csv' | 'pdf' | 'xlsx') => void;
}) {
  return (
    <div className="flex gap-2">
      {(['xlsx', 'csv', 'pdf'] as const).map((f) => (
        <Button
          key={f}
          size="sm"
          variant="outline"
          onClick={() => onExport?.(f)}
        >
          {f.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}
