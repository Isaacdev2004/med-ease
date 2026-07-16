import { format } from 'date-fns';

import {
  AppointmentDetails,
  AppointmentMetrics,
  AppointmentSummary,
  EnterpriseAppointmentCard,
  QueueCard,
  ReminderCard,
  UpcomingAppointmentCard,
  WaitlistCard,
} from '@/features/appointments/components/AppointmentComponents';
import { BookingWizard } from '@/features/appointments/components/BookingWizard';
import { CalendarView, useCalendarNavigation } from '@/features/appointments/components/CalendarComponents';
import {
  ResourceCalendar,
  ScheduleGrid,
} from '@/features/appointments/components/ScheduleComponents';
import {
  useAppointmentAnalytics,
  useAppointmentCalendar,
  useAppointments,
  usePastAppointments,
  useQueue,
  useTelemedicineAppointments,
  useUpcomingAppointments,
  useWaitlist,
} from '@/features/appointments/hooks/use-appointments';
import type { AppointmentFilters } from '@/services/appointments/types';
import { BarChartPanel } from '@/shared/charts';
import { DataTable, LoadingView } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';
import { Calendar } from 'lucide-react';

export function DashboardSection({ filters }: { filters?: AppointmentFilters }) {
  const upcoming = useUpcomingAppointments(filters);
  const analytics = useAppointmentAnalytics(filters);
  const items = upcoming.data?.slice(0, 6) ?? [];

  if (upcoming.isLoading || analytics.isLoading) return <LoadingView label="Loading appointments…" />;

  return (
    <div className="space-y-6">
      {analytics.data ? <AppointmentMetrics analytics={analytics.data} /> : null}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.length ? items.map((a) => (
          <EnterpriseAppointmentCard key={a.id} appointment={a} compact />
        )) : (
          <EmptyState icon={Calendar} title="No upcoming appointments" description="Book an appointment to get started." />
        )}
      </div>
    </div>
  );
}

export function UpcomingSection({ filters }: { filters?: AppointmentFilters }) {
  const query = useUpcomingAppointments(filters);
  if (query.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(query.data ?? []).map((a) => <UpcomingAppointmentCard key={a.id} appointment={a} />)}
    </div>
  );
}

export function HistorySection({ filters }: { filters?: AppointmentFilters }) {
  const query = usePastAppointments(filters);
  if (query.isLoading) return <LoadingView />;
  return (
    <DataTable
      caption="Past appointments"
      data={query.data ?? []}
      getRowId={(a) => a.id}
      columns={[
        { id: 'date', header: 'Date', cell: (a) => format(new Date(a.scheduledAt), 'PP') },
        { id: 'provider', header: 'Provider', cell: (a) => a.provider.fullName },
        { id: 'specialty', header: 'Specialty', cell: (a) => a.specialty },
        { id: 'status', header: 'Status', cell: (a) => a.status },
      ]}
    />
  );
}

export function CalendarSection({ filters }: { filters?: AppointmentFilters }) {
  const nav = useCalendarNavigation();
  const query = useAppointmentCalendar(filters, nav.referenceDate, nav.mode);
  if (query.isLoading) return <LoadingView label="Loading calendar…" />;
  const data = query.data;
  return (
    <CalendarView
      mode={nav.mode}
      grid={'grid' in (data ?? {}) ? (data as { grid: Parameters<typeof CalendarView>[0]['grid'] }).grid : undefined}
      dayEvents={'dayEvents' in (data ?? {}) ? (data as { dayEvents: Parameters<typeof CalendarView>[0]['dayEvents'] }).dayEvents : undefined}
      agendaEvents={'agenda' in (data ?? {}) ? (data as { agenda: Parameters<typeof CalendarView>[0]['agendaEvents'] }).agenda : undefined}
      allEvents={data?.events ?? []}
      referenceDate={nav.referenceDate}
      onReferenceDateChange={nav.setReferenceDate}
      onModeChange={nav.setMode}
    />
  );
}

export function BookSection({ patientId }: { patientId?: string }) {
  return <BookingWizard defaultPatientId={patientId} />;
}

export function WaitlistSection() {
  const query = useWaitlist();
  if (query.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(query.data ?? []).map((e) => <WaitlistCard key={e.id} entry={e} />)}
    </div>
  );
}

export function QueueSection({ filters }: { filters?: AppointmentFilters }) {
  const query = useQueue(filters);
  if (query.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(query.data ?? []).map((e) => <QueueCard key={e.id} entry={e} />)}
    </div>
  );
}

export function TelemedicineSection({ filters }: { filters?: AppointmentFilters }) {
  const query = useTelemedicineAppointments(filters);
  if (query.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(query.data ?? []).map((a) => <EnterpriseAppointmentCard key={a.id} appointment={a} />)}
    </div>
  );
}

export function ScheduleSection({ filters }: { filters?: AppointmentFilters }) {
  const query = useAppointments({ ...filters, pageSize: 50 });
  const items = query.data?.items ?? [];
  return <ScheduleGrid appointments={items} />;
}

export function ResourcesSection({ filters }: { filters?: AppointmentFilters }) {
  const query = useAppointments({ ...filters, pageSize: 100 });
  return <ResourceCalendar appointments={query.data?.items ?? []} />;
}

export function AnalyticsSection({ filters }: { filters?: AppointmentFilters }) {
  const query = useAppointmentAnalytics(filters);
  if (query.isLoading || !query.data) return <LoadingView />;
  return (
    <div className="space-y-6">
      <AppointmentMetrics analytics={query.data} />
      <div className="grid gap-4 lg:grid-cols-2">
        <BarChartPanel title="Daily Appointments" data={query.data.dailyAppointments} />
        <BarChartPanel title="Provider Workload" data={query.data.providerWorkload} />
        <BarChartPanel title="Weekly Trends" data={query.data.weeklyTrend} />
        <BarChartPanel title="Facility Occupancy" data={query.data.facilityOccupancy} />
      </div>
    </div>
  );
}

export function DetailSection({ appointment }: { appointment: import('@/services/appointments/types').Appointment }) {
  return (
    <div className="space-y-6">
      <AppointmentSummary appointment={appointment} />
      <AppointmentDetails appointment={appointment} />
      <ReminderCard appointment={appointment} />
    </div>
  );
}

export type AppointmentSection =
  | 'dashboard'
  | 'book'
  | 'calendar'
  | 'upcoming'
  | 'history'
  | 'schedule'
  | 'waitlist'
  | 'queue'
  | 'telemedicine'
  | 'resources'
  | 'analytics'
  | 'follow-ups';

export function AppointmentSectionContent({
  section,
  filters,
  patientId,
}: {
  section: AppointmentSection;
  filters?: AppointmentFilters;
  patientId?: string;
}) {
  switch (section) {
    case 'book': return <BookSection patientId={patientId} />;
    case 'calendar': return <CalendarSection filters={filters} />;
    case 'upcoming': return <UpcomingSection filters={filters} />;
    case 'history': return <HistorySection filters={filters} />;
    case 'schedule': return <ScheduleSection filters={filters} />;
    case 'waitlist': return <WaitlistSection />;
    case 'queue': return <QueueSection filters={filters} />;
    case 'telemedicine': return <TelemedicineSection filters={filters} />;
    case 'resources': return <ResourcesSection filters={filters} />;
    case 'analytics': return <AnalyticsSection filters={filters} />;
    case 'follow-ups': return <UpcomingSection filters={{ ...filters, followUp: true }} />;
    default: return <DashboardSection filters={filters} />;
  }
}
