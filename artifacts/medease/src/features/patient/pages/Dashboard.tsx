import { format } from 'date-fns';
import { Calendar, FlaskConical } from 'lucide-react';

import {
  usePatientDashboard,
  useRescheduleAppointmentMutation,
} from '@/features/patient/hooks/use-patient-data';
import {
  PageShell,
  SectionHeader,
  LoadingButton,
  StatusBadge,
} from '@/shared/components';
import { QueryStateView } from '@/shared/data/QueryStateView';
import { AppointmentCard, MedicationCard } from '@/shared/medical';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="col-span-full lg:col-span-2 h-48" />
        <Skeleton className="h-48" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const dashboardQuery = usePatientDashboard();
  const reschedule = useRescheduleAppointmentMutation(
    dashboardQuery.data?.patientId ?? 'user-patient',
  );

  return (
    <QueryStateView
      query={dashboardQuery}
      skeleton={<DashboardSkeleton />}
      loadingLabel="Loading your health summary"
    >
      {(data) => (
        <PageShell
          title={`Welcome back, ${data.greetingName}`}
          subtitle="Here's your health summary for today."
          status={<StatusBadge status="stable" label="Stable" />}
          lastUpdated={
            dashboardQuery.dataUpdatedAt
              ? format(new Date(dashboardQuery.dataUpdatedAt), 'PPp')
              : undefined
          }
          primaryAction={<Button>Book Appointment</Button>}
        >
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {data.nextAppointment ? (
                <AppointmentCard
                  providerName={data.nextAppointment.providerName}
                  specialty={data.nextAppointment.specialty}
                  scheduledAt={format(
                    new Date(data.nextAppointment.scheduledAt),
                    "EEEE, MMM d 'at' h:mm a",
                  )}
                  location={data.nextAppointment.location}
                  status="pending"
                  actions={
                    <div className="flex flex-wrap gap-2 w-full">
                      <Button variant="secondary" size="sm">
                        Prepare for visit
                      </Button>
                      <LoadingButton
                        variant="outline"
                        size="sm"
                        loading={reschedule.isPending}
                        onClick={() =>
                          data.nextAppointment &&
                          reschedule.mutate({
                            appointmentId: data.nextAppointment.id,
                            scheduledAt: new Date(
                              Date.now() + 172_800_000,
                            ).toISOString(),
                          })
                        }
                      >
                        Reschedule
                      </LoadingButton>
                    </div>
                  }
                />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" aria-hidden="true" />
                      No upcoming appointments
                    </CardTitle>
                    <CardDescription>
                      Book your next visit when you are ready.
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}

              {data.medications.length > 0 ? (
                <>
                  <SectionHeader title="Active Medications" />
                  <div className="grid gap-4 md:grid-cols-2">
                    {data.medications.map((medication) => (
                      <MedicationCard
                        key={medication.id}
                        name={medication.name}
                        dosage={medication.dosage}
                        frequency={medication.schedule}
                        prescribedBy="Emily Chen"
                        status="active"
                        refillsRemaining={medication.refillsRemaining}
                        instructions={medication.schedule}
                      />
                    ))}
                  </div>
                </>
              ) : null}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FlaskConical className="h-5 w-5" aria-hidden="true" />
                  Recent Test Results
                </CardTitle>
                <CardDescription>{data.recentTestLabel}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Lab results from your care team will appear here once
                  available.
                </p>
              </CardContent>
            </Card>
          </div>
        </PageShell>
      )}
    </QueryStateView>
  );
}
