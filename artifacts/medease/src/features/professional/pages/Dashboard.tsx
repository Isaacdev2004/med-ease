import { format } from 'date-fns';
import { Link } from 'wouter';

import { appointmentQueries } from '@/features/appointments/queries/appointments.queries';
import { ROUTES } from '@/config/routes';
import type { Appointment } from '@/services/appointments/types';
import { LoadingView } from '@/shared/components';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';
import { useQuery } from '@tanstack/react-query';
import { Calendar } from 'lucide-react';

function appointmentStatusBadge(appointment: Appointment) {
  if (appointment.checkInStatus === 'with_provider') {
    return { label: 'With provider', variant: 'success' as const };
  }
  if (appointment.checkInStatus === 'in_waiting_room') {
    return { label: 'Waiting', variant: 'warning' as const };
  }
  if (appointment.checkInStatus === 'checked_in') {
    return { label: 'Checked in', variant: 'success' as const };
  }
  if (appointment.status === 'confirmed') {
    return { label: 'Confirmed', variant: 'secondary' as const };
  }
  return { label: 'Scheduled', variant: 'secondary' as const };
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function Dashboard() {
  const todayQuery = useQuery(appointmentQueries.today());

  const appointments = todayQuery.data ?? [];
  const todayLabel = format(new Date(), 'EEEE, MMMM do');

  return (
    <div className="space-y-6 motion-preset-entrance">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Today&apos;s Schedule
          </h1>
          <p className="text-muted-foreground mt-1">
            {todayLabel} • {appointments.length}{' '}
            {appointments.length === 1 ? 'appointment' : 'appointments'}
            {todayQuery.dataUpdatedAt
              ? ` • Updated ${format(new Date(todayQuery.dataUpdatedAt), 'p')}`
              : ''}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href={ROUTES.professional.appointments}>View schedule</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">
            Today&apos;s consultations
          </h2>

          {todayQuery.isLoading ? (
            <LoadingView label="Loading today's schedule…" />
          ) : appointments.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No appointments today"
              description="Your schedule will update here as visits are booked."
              action={
                <Button variant="outline" asChild>
                  <Link href={ROUTES.professional.appointments}>
                    Open appointments
                  </Link>
                </Button>
              }
            />
          ) : (
            appointments.map((appointment) => {
              const scheduled = new Date(appointment.scheduledAt);
              const status = appointmentStatusBadge(appointment);

              return (
                <Card
                  key={appointment.id}
                  className="hover-elevate transition-all duration-300"
                >
                  <CardContent className="p-0 flex flex-col sm:flex-row">
                    <div className="bg-muted p-4 flex flex-row sm:flex-col items-center justify-center min-w-24 sm:min-w-28 border-b sm:border-b-0 sm:border-r border-border">
                      <span className="font-bold text-lg mr-2 sm:mr-0">
                        {format(scheduled, 'h:mm')}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium uppercase">
                        {format(scheduled, 'a')}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {initials(appointment.patient.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-base">
                            {appointment.patient.fullName}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {appointment.reason} • {appointment.specialty}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {appointment.facility.name}
                            {appointment.room ? ` · ${appointment.room}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col sm:items-end justify-between items-center gap-2">
                        <Badge variant={status.variant}>{status.label}</Badge>
                        <Button size="sm" variant="ghost" className="h-8" asChild>
                          <Link
                            href={`${ROUTES.professional.root}/patient/${appointment.patient.id}`}
                          >
                            Review chart
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Clinical tasks</CardTitle>
            <CardDescription>
              Prescription refills, lab reviews, and care tasks will appear here
              when connected to your workflow queue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No urgent tasks right now.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
