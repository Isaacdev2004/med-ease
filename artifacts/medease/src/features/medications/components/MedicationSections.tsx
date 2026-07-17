import { format } from 'date-fns';
import { useState } from 'react';

import {
  AdherenceChart,
  DoseCard,
  EnterpriseMedicationCard,
  InteractionAlert,
  MedicationAdministrationCard,
  MedicationInteractionBanner,
  MedicationKpiCards,
  MedicationProgressRing,
  MedicationReminderCard,
  PharmacyQueueCard,
  PrescriptionCard,
  RefillCard,
} from '@/features/medications/components/MedicationComponents';
import {
  useMedicationAdherence,
  useMedicationAdministration,
  useMedicationAnalytics,
  useMedicationCalendar,
  useMedicationDashboard,
  useMedicationHistory,
  useMedicationInteractions,
  useMedicationReminders,
  useMedicationTimeline,
  useMedications,
  usePharmacyQueue,
  usePrescriptions,
  useRefills,
  useTodaysMedications,
} from '@/features/medications/hooks/use-medications';
import { useMedicationMutations } from '@/features/medications/mutations/medications.mutations';
import type {
  MedicationFilters,
  PatientMedication,
} from '@/services/medications/types';
import { BarChartPanel } from '@/shared/charts';
import { DataTable, LoadingView } from '@/shared/components';
import { TimelineEvent } from '@/shared/medical';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';
import { Pill } from 'lucide-react';

export function DashboardSection({ filters }: { filters?: MedicationFilters }) {
  const patientId = filters?.patientId;
  const dashboard = useMedicationDashboard(patientId);
  const interactions = useMedicationInteractions(patientId);
  if (!patientId || dashboard.isLoading)
    return <LoadingView label="Loading medications…" />;
  if (!dashboard.data)
    return <EmptyState icon={Pill} title="No medication data" />;
  return (
    <div className="space-y-6">
      <MedicationKpiCards dashboard={dashboard.data} />
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <MedicationProgressRing percent={dashboard.data.adherencePercent} />
        <div className="flex-1 grid gap-2 sm:grid-cols-3 w-full">
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold">
                {dashboard.data.refillAlerts}
              </p>
              <p className="text-xs text-muted-foreground">Refill alerts</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold">
                {dashboard.data.interactionAlerts}
              </p>
              <p className="text-xs text-muted-foreground">Interactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold">
                {dashboard.data.prescriptionAlerts}
              </p>
              <p className="text-xs text-muted-foreground">Expiring soon</p>
            </CardContent>
          </Card>
        </div>
      </div>
      {(interactions.data ?? [])
        .filter((i) => i.active)
        .map((i) => (
          <InteractionAlert key={i.id} interaction={i} />
        ))}
    </div>
  );
}

export function TodaySection({ filters }: { filters?: MedicationFilters }) {
  const patientId = filters?.patientId;
  const query = useTodaysMedications(patientId);
  const { logDose } = useMedicationMutations();
  if (!patientId || query.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(query.data ?? []).map((dose) => (
        <DoseCard
          key={dose.id}
          dose={dose}
          onLog={() =>
            void logDose.mutateAsync({
              medicationId: dose.medicationId,
              patientId: dose.patientId,
              scheduledDoseId: dose.id,
              status: 'taken',
            })
          }
        />
      ))}
    </div>
  );
}

export function ActiveMedicationsSection({
  filters,
}: {
  filters?: MedicationFilters;
}) {
  const query = useMedications({ ...filters, status: 'active' });
  if (query.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(query.data?.items ?? []).map((med) => (
        <EnterpriseMedicationCard key={med.id} medication={med} />
      ))}
    </div>
  );
}

export function CalendarSection({ filters }: { filters?: MedicationFilters }) {
  const [refDate] = useState(new Date());
  const patientId = filters?.patientId;
  const query = useMedicationCalendar(patientId, refDate);
  if (!patientId || query.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-2 sm:grid-cols-7">
      {(query.data ?? []).map((cell) => (
        <Card
          key={cell.date.toISOString()}
          className={cell.doses.length ? 'border-primary/30' : ''}
        >
          <CardHeader className="p-2 pb-0">
            <CardTitle className="text-xs">{format(cell.date, 'd')}</CardTitle>
          </CardHeader>
          <CardContent className="p-2 text-[10px]">
            {cell.doses.length ? `${cell.doses.length} doses` : '—'}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function HistorySection({ filters }: { filters?: MedicationFilters }) {
  const patientId = filters?.patientId;
  const query = useMedicationHistory(patientId);
  if (!patientId || query.isLoading) return <LoadingView />;
  return (
    <DataTable
      caption="Medication history"
      data={query.data ?? []}
      getRowId={(r) => r.id}
      columns={[
        {
          id: 'date',
          header: 'Date',
          cell: (r) => format(new Date(r.loggedAt), 'PPp'),
        },
        { id: 'status', header: 'Status', cell: (r) => r.status },
        { id: 'notes', header: 'Notes', cell: (r) => r.notes ?? '—' },
      ]}
    />
  );
}

export function TimelineSection({ filters }: { filters?: MedicationFilters }) {
  const patientId = filters?.patientId;
  const query = useMedicationTimeline(patientId);
  if (!patientId || query.isLoading) return <LoadingView />;
  return (
    <TimelineEvent
      items={(query.data ?? []).map((e, i) => ({
        id: e.id,
        title: e.title,
        description: e.description,
        date: format(new Date(e.date), 'PP'),
        status: i === 0 ? 'current' : 'completed',
      }))}
      aria-label="Medication timeline"
    />
  );
}

export function RemindersSection({ filters }: { filters?: MedicationFilters }) {
  const query = useMedicationReminders(filters?.patientId);
  if (query.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(query.data ?? []).map((r) => (
        <MedicationReminderCard
          key={r.id}
          title={r.title}
          message={r.message}
          dueAt={r.dueAt}
        />
      ))}
    </div>
  );
}

export function RefillsSection({ filters }: { filters?: MedicationFilters }) {
  const query = useRefills(filters?.patientId);
  const { approveRefill } = useMedicationMutations();
  if (query.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(query.data ?? []).map((r) => (
        <RefillCard
          key={r.id}
          refill={r}
          onApprove={() => void approveRefill.mutateAsync(r.id)}
        />
      ))}
    </div>
  );
}

export function AdherenceSection({ filters }: { filters?: MedicationFilters }) {
  const patientId = filters?.patientId;
  const query = useMedicationAdherence(patientId);
  if (!patientId || query.isLoading || !query.data) return <LoadingView />;
  return <AdherenceChart adherence={query.data} />;
}

export function InteractionsSection({
  filters,
}: {
  filters?: MedicationFilters;
}) {
  const patientId = filters?.patientId;
  const query = useMedicationInteractions(patientId);
  if (!patientId || query.isLoading) return <LoadingView />;
  return (
    <div className="space-y-4">
      {(query.data ?? []).map((i) => (
        <InteractionAlert key={i.id} interaction={i} />
      ))}
    </div>
  );
}

export function PrescriptionsSection({
  filters,
}: {
  filters?: MedicationFilters;
}) {
  const query = usePrescriptions(filters);
  if (query.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(query.data ?? []).map((rx) => (
        <PrescriptionCard key={rx.id} prescription={rx} />
      ))}
    </div>
  );
}

export function PharmacySection() {
  const query = usePharmacyQueue('pharm-001');
  if (query.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(query.data ?? []).map((item) => (
        <PharmacyQueueCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export function AnalyticsSection({ filters }: { filters?: MedicationFilters }) {
  const query = useMedicationAnalytics(filters);
  if (query.isLoading || !query.data) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">
              {query.data.totalPrescriptions}
            </p>
            <p className="text-xs text-muted-foreground">Prescriptions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{query.data.activeMedications}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{query.data.adherenceAverage}%</p>
            <p className="text-xs text-muted-foreground">Adherence</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{query.data.interactionCount}</p>
            <p className="text-xs text-muted-foreground">Interactions</p>
          </CardContent>
        </Card>
      </div>
      <BarChartPanel title="Most prescribed" data={query.data.mostPrescribed} />
      <BarChartPanel
        title="Adherence by month"
        data={query.data.adherenceByMonth}
      />
    </div>
  );
}

export function MedicationDetailSection({
  medication,
}: {
  medication: PatientMedication;
}) {
  return (
    <div className="space-y-6">
      <EnterpriseMedicationCard medication={medication} />
      <Card>
        <CardHeader>
          <CardTitle>Clinical details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
          {[
            ['Generic', medication.genericName],
            ['Class', medication.medicationClass],
            ['Route', medication.route],
            ['Condition', medication.condition ?? '—'],
            ['Storage', medication.storage ?? '—'],
            ['Adherence', `${medication.adherencePercent}%`],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-muted-foreground">{label}</p>
              <p className="font-medium capitalize">{value}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export type MedicationSection =
  | 'dashboard'
  | 'today'
  | 'calendar'
  | 'history'
  | 'refills'
  | 'reminders'
  | 'logs'
  | 'interactions'
  | 'adherence'
  | 'prescriptions'
  | 'dispensing'
  | 'analytics'
  | 'administration'
  | 'reconciliation'
  | 'formulary'
  | 'inventory'
  | 'emar';

export function AdministrationSection({
  filters,
}: {
  filters?: MedicationFilters;
}) {
  const query = useMedicationAdministration(filters?.patientId);
  if (query.isLoading) return <LoadingView />;
  const records = query.data ?? [];
  if (!records.length)
    return <EmptyState icon={Pill} title="No administration records" />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {records.slice(0, 20).map((r) => (
        <MedicationAdministrationCard key={r.id} record={r} />
      ))}
    </div>
  );
}

export function ReconciliationSection({
  filters,
}: {
  filters?: MedicationFilters;
}) {
  const meds = useMedications(filters);
  const interactions = useMedicationInteractions(filters?.patientId);
  if (meds.isLoading) return <LoadingView />;
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(meds.data?.items ?? []).slice(0, 12).map((m) => (
          <EnterpriseMedicationCard key={m.id} medication={m} />
        ))}
      </div>
      {(interactions.data ?? [])
        .filter((i) => i.active)
        .slice(0, 4)
        .map((i) => (
          <MedicationInteractionBanner key={i.id} interaction={i} />
        ))}
    </div>
  );
}

export function MedicationSectionContent({
  section,
  filters,
}: {
  section: MedicationSection;
  filters?: MedicationFilters;
}) {
  switch (section) {
    case 'today':
      return <TodaySection filters={filters} />;
    case 'calendar':
      return <CalendarSection filters={filters} />;
    case 'history':
      return <HistorySection filters={filters} />;
    case 'refills':
      return <RefillsSection filters={filters} />;
    case 'reminders':
      return <RemindersSection filters={filters} />;
    case 'logs':
      return <HistorySection filters={filters} />;
    case 'interactions':
      return <InteractionsSection filters={filters} />;
    case 'adherence':
      return <AdherenceSection filters={filters} />;
    case 'prescriptions':
      return <PrescriptionsSection filters={filters} />;
    case 'dispensing':
      return <PharmacySection />;
    case 'analytics':
      return <AnalyticsSection filters={filters} />;
    case 'administration':
    case 'emar':
      return <AdministrationSection filters={filters} />;
    case 'reconciliation':
      return <ReconciliationSection filters={filters} />;
    case 'inventory':
      return <PharmacySection />;
    case 'formulary':
      return <AnalyticsSection filters={filters} />;
    default:
      return <DashboardSection filters={filters} />;
  }
}
