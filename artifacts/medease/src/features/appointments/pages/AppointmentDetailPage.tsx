import { format } from 'date-fns';
import { Link, useLocation } from 'wouter';

import { DetailSection } from '@/features/appointments/components/AppointmentSections';
import { AppointmentHeader } from '@/features/appointments/components/AppointmentComponents';
import { useAppointment } from '@/features/appointments/hooks/use-appointments';
import {
  useCancelAppointment,
  useCheckIn,
  useRescheduleAppointment,
} from '@/features/appointments/mutations/appointments.mutations';
import { LoadingView, PageShell } from '@/shared/components';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';

function getAppointmentId(pathname: string): string | undefined {
  const segments = pathname.split('/').filter(Boolean);
  const idx = segments.indexOf('appointments');
  if (idx === -1) return undefined;
  const candidate = segments[idx + 1];
  if (!candidate || candidate === 'book' || candidate === 'calendar')
    return undefined;
  return candidate;
}

export default function AppointmentDetailPage() {
  const [location] = useLocation();
  const appointmentId = getAppointmentId(location);
  const query = useAppointment(appointmentId);
  const cancel = useCancelAppointment();
  const reschedule = useRescheduleAppointment();
  const checkIn = useCheckIn();
  const listPath = resolveModuleBasePath(location, 'appointments');

  if (query.isLoading) {
    return (
      <PageShell title="Appointment Details">
        <LoadingView label="Loading appointment…" />
      </PageShell>
    );
  }

  if (!query.data) {
    return (
      <PageShell title="Appointment Details">
        <EmptyState
          title="Appointment not found"
          description="Unable to load appointment details."
        />
      </PageShell>
    );
  }

  const appointment = query.data;

  return (
    <PageShell
      title="Appointment Details"
      subtitle={format(new Date(appointment.scheduledAt), 'PPpp')}
      secondaryActions={
        <Button variant="outline" asChild>
          <Link href={listPath}>Back to list</Link>
        </Button>
      }
      primaryAction={
        <div className="flex flex-wrap gap-2">
          {appointment.checkInStatus === 'not_checked_in' ? (
            <Button
              variant="outline"
              onClick={() =>
                void checkIn.mutateAsync({ appointmentId: appointment.id })
              }
            >
              Check In
            </Button>
          ) : null}
          <Button
            variant="outline"
            onClick={() => {
              const next = new Date(appointment.scheduledAt);
              next.setDate(next.getDate() + 7);
              void reschedule.mutateAsync({
                appointmentId: appointment.id,
                scheduledAt: next.toISOString(),
              });
            }}
          >
            Reschedule +7d
          </Button>
          <Button
            variant="destructive"
            onClick={() =>
              void cancel.mutateAsync({ appointmentId: appointment.id })
            }
          >
            Cancel
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <AppointmentHeader appointment={appointment} />
        <DetailSection appointment={appointment} />
      </div>
    </PageShell>
  );
}
