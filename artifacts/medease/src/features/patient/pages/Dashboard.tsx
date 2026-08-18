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
      loadingLabel="Chargement de votre résumé santé"
    >
      {(data) => (
        <PageShell
          title={`Bon retour, ${data.greetingName}`}
          subtitle="Voici votre résumé santé du jour."
          status={<StatusBadge status="stable" label="Stable" />}
          lastUpdated={
            dashboardQuery.dataUpdatedAt
              ? format(new Date(dashboardQuery.dataUpdatedAt), 'PPp')
              : undefined
          }
          primaryAction={<Button>Prendre rendez-vous</Button>}
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
                        Préparer la visite
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
                        Reprogrammer
                      </LoadingButton>
                    </div>
                  }
                />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" aria-hidden="true" />
                      Aucun rendez-vous à venir
                    </CardTitle>
                    <CardDescription>
                      Réservez votre prochaine consultation quand vous le souhaitez.
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}

              {data.medications.length > 0 ? (
                <>
                  <SectionHeader title="Traitements actifs" />
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
                  Résultats récents
                </CardTitle>
                <CardDescription>{data.recentTestLabel}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Les résultats de laboratoire de votre équipe soignante
                  apparaîtront ici dès qu&apos;ils seront disponibles.
                </p>
              </CardContent>
            </Card>
          </div>
        </PageShell>
      )}
    </QueryStateView>
  );
}
