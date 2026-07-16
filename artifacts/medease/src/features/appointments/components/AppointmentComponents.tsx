import { format } from 'date-fns';
import {
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  User,
  Video,
} from 'lucide-react';

import type { Appointment, AppointmentAnalytics, AppointmentStatus, QueueEntry, WaitlistEntry } from '@/services/appointments/types';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';
import { MetricCard, StatCard } from '@/shared/components';
import { AppointmentCard as SharedAppointmentCard } from '@/shared/medical';

const STATUS_VARIANT: Record<AppointmentStatus, 'secondary' | 'success' | 'warning' | 'destructive' | 'info'> = {
  scheduled: 'info',
  confirmed: 'info',
  checked_in: 'secondary',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'secondary',
  no_show: 'destructive',
  rescheduled: 'info',
  waiting: 'warning',
  delayed: 'warning',
};

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <Badge variant={STATUS_VARIANT[status]} className="capitalize" aria-label={`Status: ${status.replace('_', ' ')}`}>
      {status.replace(/_/g, ' ')}
    </Badge>
  );
}

export function AppointmentHeader({ appointment }: { appointment: Appointment }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 className="text-2xl font-bold">{appointment.specialty}</h1>
        <p className="text-muted-foreground">{appointment.id} · {appointment.patient.fullName}</p>
      </div>
      <AppointmentStatusBadge status={appointment.status} />
    </div>
  );
}

export function EnterpriseAppointmentCard({
  appointment,
  actions,
  compact,
}: {
  appointment: Appointment;
  actions?: React.ReactNode;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <UpcomingAppointmentCard
        appointment={appointment}
        actions={actions}
      />
    );
  }
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
        <div>
          <CardTitle className="text-base">{appointment.specialty}</CardTitle>
          <p className="text-sm text-muted-foreground">{appointment.provider.fullName}</p>
        </div>
        <AppointmentStatusBadge status={appointment.status} />
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p className="flex items-center gap-2"><Calendar className="h-4 w-4" aria-hidden="true" />{format(new Date(appointment.scheduledAt), 'PPp')}</p>
        <p className="flex items-center gap-2"><MapPin className="h-4 w-4" aria-hidden="true" />{appointment.facility.name} · {appointment.room}</p>
        <p className="flex items-center gap-2"><Clock className="h-4 w-4" aria-hidden="true" />{appointment.durationMinutes} min · {appointment.visitType.replace('_', ' ')}</p>
        {actions ? <div className="pt-2">{actions}</div> : null}
      </CardContent>
    </Card>
  );
}

export function UpcomingAppointmentCard({
  appointment,
  actions,
}: {
  appointment: Appointment;
  actions?: React.ReactNode;
}) {
  return (
    <SharedAppointmentCard
      providerName={appointment.provider.fullName}
      specialty={appointment.specialty}
      scheduledAt={format(new Date(appointment.scheduledAt), 'PPp')}
      location={`${appointment.facility.name}, ${appointment.room}`}
      status={
        appointment.status === 'completed' ? 'success'
          : appointment.status === 'cancelled' || appointment.status === 'no_show' ? 'neutral'
            : appointment.status === 'in_progress' || appointment.status === 'delayed' ? 'observation'
              : appointment.status === 'checked_in' || appointment.status === 'waiting' ? 'warning'
                : 'pending'
      }
      actions={actions}
    />
  );
}

export function AppointmentDetails({ appointment }: { appointment: Appointment }) {
  const rows = [
    ['Patient', `${appointment.patient.fullName} (${appointment.patient.mrn})`],
    ['Provider', appointment.provider.fullName],
    ['Facility', appointment.facility.name],
    ['Department', appointment.department],
    ['Room', appointment.room],
    ['Date & Time', format(new Date(appointment.scheduledAt), 'PPpp')],
    ['Duration', `${appointment.durationMinutes} minutes`],
    ['Visit Type', appointment.visitType.replace('_', ' ')],
    ['Priority', appointment.priority],
    ['Insurance', appointment.insurance],
    ['Reason', appointment.reason],
    ['Check-in', appointment.checkInStatus.replace(/_/g, ' ')],
  ];
  return (
    <Card>
      <CardHeader><CardTitle>Appointment Details</CardTitle></CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label}>
            <p className="text-muted-foreground">{label}</p>
            <p className="font-medium capitalize">{value}</p>
          </div>
        ))}
        {appointment.telehealthLink ? (
          <div className="sm:col-span-2">
            <p className="text-muted-foreground">Telehealth</p>
            <a href={appointment.telehealthLink} className="font-medium text-primary underline">{appointment.telehealthLink}</a>
          </div>
        ) : null}
        {appointment.clinicalNotes ? (
          <div className="sm:col-span-2">
            <p className="text-muted-foreground">Clinical Notes</p>
            <p>{appointment.clinicalNotes}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function AppointmentSummary({ appointment }: { appointment: Appointment }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard label="Duration" value={`${appointment.durationMinutes}m`} icon={Clock} />
      <StatCard label="Priority" value={appointment.priority} icon={AlertCircle} />
      <StatCard label="Visit" value={appointment.visitType.replace('_', ' ')} icon={appointment.visitType === 'telemedicine' ? Video : Stethoscope} />
    </div>
  );
}

export function AppointmentMetrics({ analytics }: { analytics: AppointmentAnalytics }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard label="Today" value={analytics.todayCount} icon={Calendar} />
      <StatCard label="Upcoming" value={analytics.upcomingCount} icon={Clock} />
      <MetricCard title="Completed" value={analytics.completedCount} status="success" />
      <MetricCard title="Cancelled" value={analytics.cancelledCount} status="neutral" />
      <MetricCard title="No Shows" value={analytics.noShowCount} status="warning" />
      <MetricCard title="Avg Wait" value={`${analytics.averageWaitMinutes}m`} status="info" />
      <MetricCard title="Utilization" value={`${analytics.utilizationPercent}%`} status="success" />
      <MetricCard title="Booking Rate" value={`${analytics.bookingRatePercent}%`} status="info" />
      <MetricCard title="Queue" value={analytics.queueLength} status="warning" />
      <MetricCard title="Telemedicine" value={analytics.telemedicineCount} status="info" />
    </div>
  );
}

export function QueueCard({ entry }: { entry: QueueEntry }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">#{entry.position} {entry.patientName}</CardTitle>
          <Badge variant="outline">~{entry.estimatedWaitMinutes}m</Badge>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p>{entry.providerName}</p>
        <p className="capitalize">{entry.checkInStatus.replace(/_/g, ' ')}</p>
      </CardContent>
    </Card>
  );
}

export function WaitlistCard({ entry }: { entry: WaitlistEntry }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{entry.patientName}</CardTitle>
          <Badge variant={entry.priority === 'urgent' ? 'destructive' : 'secondary'}>#{entry.position}</Badge>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p>{entry.providerName} · {entry.specialty}</p>
        <p>Requested: {format(new Date(entry.requestedDate), 'PP')}</p>
      </CardContent>
    </Card>
  );
}

export function CheckInCard({ appointment, onCheckIn }: { appointment: Appointment; onCheckIn?: () => void }) {
  return (
    <Card className={cn(appointment.checkInStatus !== 'not_checked_in' && 'border-success/50')}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <User className="h-4 w-4" aria-hidden="true" />
          {appointment.patient.fullName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>{appointment.specialty} · {format(new Date(appointment.scheduledAt), 'p')}</p>
        <AppointmentStatusBadge status={appointment.status} />
        {onCheckIn && appointment.checkInStatus === 'not_checked_in' ? (
          <button type="button" className="text-primary underline text-sm" onClick={onCheckIn}>Check in patient</button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function ReminderCard({ appointment }: { appointment: Appointment }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <p className="font-medium">Reminder: {appointment.specialty}</p>
        <p className="text-muted-foreground">{format(new Date(appointment.scheduledAt), 'PPp')}</p>
        <p className="text-muted-foreground">{appointment.provider.fullName} at {appointment.facility.name}</p>
      </CardContent>
    </Card>
  );
}
