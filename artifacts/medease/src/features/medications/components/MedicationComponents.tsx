import { format } from 'date-fns';
import { AlertTriangle, Pill } from 'lucide-react';

import type {
  DrugInteraction,
  MedicationAdherence,
  MedicationAnalytics,
  MedicationDashboard,
  PatientMedication,
  Prescription,
  RefillRequest,
  ScheduledDose,
} from '@/services/medications/types';
import { MedicationCard as SharedMedicationCard } from '@/shared/medical';
import { MetricCard, StatCard } from '@/shared/components';
import { BarChartPanel, SparklineChart, ChartPanel } from '@/shared/charts';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';
import { getInteractionSeverityColor } from '@/services/medications/interaction-engine';

export function MedicationStatusBadge({ status }: { status: PatientMedication['status'] }) {
  const variant = status === 'active' ? 'success' : status === 'paused' ? 'warning' : status === 'cancelled' ? 'destructive' : 'secondary';
  return <Badge variant={variant} className="capitalize">{status}</Badge>;
}

export function PrescriptionCard({ prescription }: { prescription: Prescription }) {
  return (
    <Card>
      <CardHeader className="pb-2 flex-row items-start justify-between">
        <div>
          <CardTitle className="text-base">{prescription.medication.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{prescription.prescriptionNumber}</p>
        </div>
        <Badge variant={prescription.status === 'active' ? 'success' : 'secondary'}>{prescription.status}</Badge>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <p>{prescription.dose} · {prescription.frequency}</p>
        <p className="text-muted-foreground">{prescription.prescribingPhysician}</p>
        <p className="text-muted-foreground">Expires {format(new Date(prescription.expiresAt), 'PP')}</p>
        {prescription.medication.controlledSubstance ? (
          <Badge variant="destructive">Controlled substance</Badge>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function EnterpriseMedicationCard({ medication, actions }: { medication: PatientMedication; actions?: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <SharedMedicationCard
        name={medication.name}
        dosage={medication.dose}
        frequency={medication.frequency}
        prescribedBy={medication.prescribingPhysician.replace('Dr. ', '')}
        status={medication.status === 'active' ? 'active' : medication.status === 'paused' ? 'paused' : 'discontinued'}
        refillsRemaining={medication.refillsRemaining}
        instructions={medication.instructions}
      />
      {actions}
    </div>
  );
}

export function DoseCard({ dose, onLog }: { dose: ScheduledDose; onLog?: () => void }) {
  return (
    <Card className={cn(dose.status === 'missed' && 'border-destructive/50')}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{dose.medicationName}</CardTitle>
          <Badge variant={dose.status === 'taken' ? 'success' : dose.status === 'pending' ? 'info' : 'warning'}>{dose.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="text-sm">
        <p>{format(new Date(dose.scheduledAt), 'p')} · {dose.slot} · {dose.dose}</p>
        {onLog && dose.status === 'pending' ? (
          <button type="button" className="mt-2 text-primary underline text-sm" onClick={onLog}>Mark as taken</button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function RefillCard({ refill, onApprove }: { refill: RefillRequest; onApprove?: () => void }) {
  return (
    <Card>
      <CardHeader className="pb-2 flex-row justify-between">
        <CardTitle className="text-base">{refill.medicationName}</CardTitle>
        <Badge variant={refill.status === 'approved' ? 'success' : refill.status === 'rejected' ? 'destructive' : 'warning'}>{refill.status}</Badge>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p>{refill.patientName} · {refill.pharmacyName}</p>
        <p>{refill.remainingTablets ?? '—'} tablets · {refill.daysLeft ?? '—'} days left</p>
        {onApprove && refill.status === 'pending' ? (
          <button type="button" className="mt-2 text-primary underline" onClick={onApprove}>Approve</button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function InteractionAlert({ interaction }: { interaction: DrugInteraction }) {
  return (
    <Card className="border-l-4" style={{ borderLeftColor: getInteractionSeverityColor(interaction.severity) }}>
      <CardContent className="pt-4 flex gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
        <div className="text-sm">
          <p className="font-medium">{interaction.source} ↔ {interaction.target}</p>
          <p className="text-muted-foreground capitalize">{interaction.type} · {interaction.severity}</p>
          <p>{interaction.recommendation}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function MedicationKpiCards({ dashboard }: { dashboard: MedicationDashboard }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard label="Today's doses" value={dashboard.todayTotal} icon={Pill} />
      <MetricCard title="Taken" value={dashboard.taken} status="success" />
      <MetricCard title="Pending" value={dashboard.pending} status="info" />
      <MetricCard title="Missed" value={dashboard.missed} status="warning" />
      <MetricCard title="Medication Score" value={dashboard.medicationScore} status="success" />
    </div>
  );
}

export function AdherenceChart({ adherence }: { adherence: MedicationAdherence }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartPanel title="Adherence trend">
        <SparklineChart data={adherence.trend} />
      </ChartPanel>
      <BarChartPanel
        title="Compliance overview"
        data={[
          { label: 'Daily', value: adherence.daily },
          { label: 'Weekly', value: adherence.weekly },
          { label: 'Monthly', value: adherence.monthly },
        ]}
      />
    </div>
  );
}

export function MedicationProgressRing({ percent }: { percent: number }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-full border-8 border-primary/20 h-32 w-32" aria-label={`Adherence ${percent}%`}>
      <span className="text-2xl font-bold">{percent}%</span>
      <span className="text-xs text-muted-foreground">Adherence</span>
    </div>
  );
}

export function MedicationReminderCard({ title, message, dueAt }: { title: string; message: string; dueAt: string }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <p className="font-medium">{title}</p>
        <p className="text-muted-foreground">{message}</p>
        <p className="text-xs text-muted-foreground mt-1">{format(new Date(dueAt), 'PPp')}</p>
      </CardContent>
    </Card>
  );
}

export function PharmacyQueueCard({ item }: { item: { patientName: string; medicationName: string; status: string; receivedAt: string } }) {
  return (
    <Card>
      <CardHeader className="pb-2 flex-row justify-between">
        <CardTitle className="text-base">{item.medicationName}</CardTitle>
        <Badge>{item.status}</Badge>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p>{item.patientName}</p>
        <p>Received {format(new Date(item.receivedAt), 'PP')}</p>
      </CardContent>
    </Card>
  );
}

export const MedicationCard = EnterpriseMedicationCard;

export function MedicationInteractionBanner({ interaction }: { interaction: DrugInteraction }) {
  return <InteractionAlert interaction={interaction} />;
}

export function MedicationWarningBanner({ title, message }: { title: string; message: string }) {
  return (
    <Card className="border-warning/50 bg-warning/5">
      <CardContent className="pt-4 flex gap-3">
        <AlertTriangle className="h-5 w-5 text-warning shrink-0" aria-hidden="true" />
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function DispenseCard({ dispense }: { dispense: { medicationName: string; quantity: number; unit: string; dispensedAt: string; pharmacyName: string } }) {
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-base">{dispense.medicationName}</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <p>{dispense.quantity} {dispense.unit} · {dispense.pharmacyName}</p>
        <p className="text-muted-foreground">Dispensed {format(new Date(dispense.dispensedAt), 'PP')}</p>
      </CardContent>
    </Card>
  );
}

export function MedicationAdministrationCard({ record }: { record: { medicationName: string; dose: string; administeredAt: string; administeredBy: string; status: string } }) {
  return (
    <Card>
      <CardHeader className="pb-2 flex-row justify-between">
        <CardTitle className="text-base">{record.medicationName}</CardTitle>
        <Badge variant="success">{record.status}</Badge>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <p>{record.dose} · {record.administeredBy}</p>
        <p className="text-muted-foreground">{format(new Date(record.administeredAt), 'PPp')}</p>
      </CardContent>
    </Card>
  );
}

export const AdherenceGauge = MedicationProgressRing;
export const ComplianceChart = AdherenceChart;

export function MedicationEducationPanel({ education }: { education: { title: string; summary: string; instructions: string[]; sideEffects: string[]; storage: string } }) {
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-base">{education.title}</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-2">
        <p>{education.summary}</p>
        <ul className="list-disc pl-5">{education.instructions.map((i) => <li key={i}>{i}</li>)}</ul>
        <p className="text-muted-foreground">Storage: {education.storage}</p>
      </CardContent>
    </Card>
  );
}

export function MedicationAnalyticsPanel({ analytics }: { analytics: MedicationAnalytics }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card><CardContent className="pt-4"><p className="text-2xl font-bold">{analytics.activeMedications}</p><p className="text-xs text-muted-foreground">Active meds</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-2xl font-bold">{analytics.adherenceAverage}%</p><p className="text-xs text-muted-foreground">Adherence</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-2xl font-bold">{analytics.pendingRefills}</p><p className="text-xs text-muted-foreground">Pending refills</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-2xl font-bold">{analytics.interactionCount}</p><p className="text-xs text-muted-foreground">Interactions</p></CardContent></Card>
    </div>
  );
}
