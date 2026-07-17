import { format } from 'date-fns';

import type { PatientHealthRecord } from '@/services/patient-records/types';
import { HealthScoreWidget } from '@/features/patient-records/components/PatientBanner';
import { ChartPanel, SparklineChart } from '@/shared/charts';
import { DataTable } from '@/shared/components';
import { MedicationCard } from '@/shared/medical';
import { TimelineEvent } from '@/shared/medical';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';
import { AlertTriangle, FileText, Scan } from 'lucide-react';

export function SummarySection({ record }: { record: PatientHealthRecord }) {
  return (
    <div className="space-y-6">
      <HealthScoreWidget score={record.healthScore} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Problem List</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {record.summary.problemList.map((p) => (
                <li key={p.id} className="flex justify-between">
                  <span>{p.label}</span>
                  <Badge variant="outline">{p.status}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Treatments</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              {record.summary.activeTreatments.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ProfileSection({ record }: { record: PatientHealthRecord }) {
  const d = record.demographics;
  const rows = [
    [
      'Address',
      `${d.address.street}, ${d.address.postalCode} ${d.address.city}`,
    ],
    ['Language', d.language],
    ['Marital status', d.maritalStatus],
    ['Occupation', d.occupation],
    ['Nationality', d.nationality],
    ['Primary physician', d.primaryPhysician],
    ['Insurance', `${d.insurance.provider} (${d.insurance.policyNumber})`],
    ['Smoking', d.smoking],
    ['Alcohol', d.alcohol],
    ['Weight / Height', `${d.weightKg} kg / ${d.heightCm} cm`],
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label}>
            <p className="text-muted-foreground">{label}</p>
            <p className="font-medium">{value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function VitalsSection({ record }: { record: PatientHealthRecord }) {
  const bpData = record.vitals
    .slice(0, 8)
    .reverse()
    .map((v, i) => ({
      label: `#${i + 1}`,
      value: v.bloodPressureSystolic ?? 0,
    }));
  const glucoseData = record.vitals
    .filter((v) => v.bloodGlucose)
    .slice(0, 8)
    .reverse()
    .map((v, i) => ({
      label: `#${i + 1}`,
      value: v.bloodGlucose ?? 0,
    }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartPanel title="Blood Pressure Trend" description="Systolic mmHg">
          <SparklineChart data={bpData} />
        </ChartPanel>
        {glucoseData.length > 0 ? (
          <ChartPanel title="Glucose Trend" description="mg/dL">
            <SparklineChart data={glucoseData} />
          </ChartPanel>
        ) : null}
      </div>
      <DataTable
        caption="Vitals history"
        data={record.vitals}
        getRowId={(r) => r.id}
        columns={[
          {
            id: 'date',
            header: 'Date',
            cell: (r) => format(new Date(r.recordedAt), 'PP'),
          },
          {
            id: 'bp',
            header: 'BP',
            cell: (r) =>
              r.bloodPressureSystolic
                ? `${r.bloodPressureSystolic}/${r.bloodPressureDiastolic}`
                : '—',
          },
          { id: 'hr', header: 'HR', cell: (r) => r.heartRate ?? '—' },
          {
            id: 'temp',
            header: 'Temp',
            cell: (r) =>
              r.temperatureC ? `${r.temperatureC.toFixed(1)}°C` : '—',
          },
          {
            id: 'spo2',
            header: 'SpO₂',
            cell: (r) => (r.oxygenSaturation ? `${r.oxygenSaturation}%` : '—'),
          },
        ]}
      />
    </div>
  );
}

export function LaboratorySection({ record }: { record: PatientHealthRecord }) {
  return (
    <DataTable
      caption="Laboratory results"
      data={record.labs}
      getRowId={(r) => r.id}
      columns={[
        { id: 'test', header: 'Test', cell: (r) => r.testName },
        { id: 'cat', header: 'Category', cell: (r) => r.category },
        { id: 'value', header: 'Value', cell: (r) => `${r.value} ${r.unit}` },
        { id: 'range', header: 'Reference', cell: (r) => r.referenceRange },
        {
          id: 'flag',
          header: 'Flag',
          cell: (r) => (
            <Badge
              variant={
                r.flag === 'normal'
                  ? 'secondary'
                  : r.flag === 'critical'
                    ? 'destructive'
                    : 'warning'
              }
            >
              {r.flag}
            </Badge>
          ),
        },
        {
          id: 'date',
          header: 'Resulted',
          cell: (r) => format(new Date(r.resultedAt), 'PP'),
        },
      ]}
    />
  );
}

export function MedicationsSection({
  record,
}: {
  record: PatientHealthRecord;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {record.medications.map((med) => (
        <MedicationCard
          key={med.id}
          name={med.name}
          dosage={med.dosage}
          frequency={med.frequency}
          prescribedBy={med.prescribedBy.replace('Dr. ', '')}
          status={
            med.status === 'active'
              ? 'active'
              : med.status === 'paused'
                ? 'paused'
                : 'discontinued'
          }
          instructions={med.instructions}
        />
      ))}
    </div>
  );
}

export function AllergiesSection({ record }: { record: PatientHealthRecord }) {
  if (!record.allergies.length) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="No known allergies"
        description="No allergies documented."
      />
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {record.allergies.map((a) => (
        <Card key={a.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{a.substance}</CardTitle>
              <Badge
                variant={
                  a.severity === 'life_threatening' || a.severity === 'severe'
                    ? 'destructive'
                    : 'warning'
                }
              >
                {a.severity}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Type: {a.type}</p>
            <p>Reaction: {a.reaction}</p>
            <p>Recorded: {format(new Date(a.recordedDate), 'PP')}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ImmunizationsSection({
  record,
}: {
  record: PatientHealthRecord;
}) {
  return (
    <DataTable
      caption="Immunizations"
      data={record.immunizations}
      getRowId={(r) => r.id}
      columns={[
        { id: 'vaccine', header: 'Vaccine', cell: (r) => r.vaccine },
        { id: 'dose', header: 'Dose', cell: (r) => r.dose },
        {
          id: 'date',
          header: 'Date',
          cell: (r) => format(new Date(r.date), 'PP'),
        },
        { id: 'provider', header: 'Provider', cell: (r) => r.provider },
      ]}
    />
  );
}

export function ProceduresSection({ record }: { record: PatientHealthRecord }) {
  if (!record.procedures.length) {
    return (
      <EmptyState
        title="No procedures"
        description="No procedures documented."
      />
    );
  }
  return (
    <div className="space-y-4">
      {record.procedures.map((p) => (
        <Card key={p.id}>
          <CardHeader>
            <CardTitle className="text-base">{p.name}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              {p.category} · {format(new Date(p.date), 'PP')}
            </p>
            <p>
              {p.physician} — {p.facility}
            </p>
            {p.recoveryNotes ? <p className="mt-2">{p.recoveryNotes}</p> : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function RadiologySection({ record }: { record: PatientHealthRecord }) {
  return (
    <div className="space-y-4">
      {record.radiology.map((study) => (
        <Card key={study.id}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Scan className="h-5 w-5" aria-hidden="true" />
              <CardTitle className="text-base">
                {study.modality} — {study.bodyPart}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground mb-2">
              {format(new Date(study.date), 'PP')} · {study.radiologist}
            </p>
            <p>{study.report}</p>
            <div className="mt-4 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              Image viewer placeholder — future PACS integration
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function TimelineSection({ record }: { record: PatientHealthRecord }) {
  return (
    <TimelineEvent
      items={record.timeline.map((e, index) => ({
        id: e.id,
        title: e.title,
        description: e.actor ? `${e.description} — ${e.actor}` : e.description,
        date: format(new Date(e.date), 'PPp'),
        status: (index === 0 ? 'current' : 'completed') as
          'current' | 'completed',
      }))}
      aria-label="Unified health record timeline"
    />
  );
}

export function DocumentsSection({ record }: { record: PatientHealthRecord }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {record.documents.map((doc) => (
        <Card key={doc.id}>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <FileText className="h-5 w-5" aria-hidden="true" />
            <CardTitle className="text-base">{doc.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              {doc.type} · {format(new Date(doc.date), 'PP')}
            </p>
            <p>{doc.author}</p>
            <div className="mt-3 rounded border border-dashed p-4 text-center text-xs">
              PDF viewer placeholder
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function EmergencySection({ record }: { record: PatientHealthRecord }) {
  const e = record.emergencySummary;
  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="text-destructive">Emergency Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p>
          <strong>Blood group:</strong> {e.bloodGroup}
        </p>
        <div>
          <strong>Critical allergies:</strong>
          <ul className="list-disc pl-5">
            {e.criticalAllergies.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Active medications:</strong>
          <ul className="list-disc pl-5">
            {e.activeMedications.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Chronic conditions:</strong>
          <ul className="list-disc pl-5">
            {e.chronicConditions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
        <p>
          <strong>Primary physician:</strong> {e.primaryPhysician}
        </p>
      </CardContent>
    </Card>
  );
}

export function NotesSection({ record }: { record: PatientHealthRecord }) {
  if (!record.notes.length) {
    return (
      <EmptyState
        title="No clinical notes"
        description="Clinical notes will appear here."
      />
    );
  }
  return (
    <div className="space-y-4">
      {record.notes.map((note) => (
        <Card key={note.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{note.title}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {note.author} · {format(new Date(note.date), 'PPp')} ·{' '}
              {note.specialty}
            </p>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {note.content}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function CarePlansSection({ record }: { record: PatientHealthRecord }) {
  if (!record.carePlans.length) {
    return (
      <EmptyState
        title="No care plans"
        description="Active care plans will appear here."
      />
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {record.carePlans.map((plan) => (
        <Card key={plan.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base">{plan.title}</CardTitle>
              <Badge
                variant={plan.status === 'active' ? 'success' : 'secondary'}
              >
                {plan.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Goals:</strong> {plan.goals.join(', ')}
            </p>
            <p>
              <strong>Interventions:</strong> {plan.interventions.join(', ')}
            </p>
            <p>
              <strong>Assigned:</strong> {plan.assignedClinicians.join(', ')}
            </p>
            <p>
              <strong>Review:</strong> {plan.reviewSchedule}
            </p>
            {plan.progress ? <p>{plan.progress}</p> : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function FamilyHistorySection({
  record,
}: {
  record: PatientHealthRecord;
}) {
  return (
    <DataTable
      caption="Family history"
      data={record.familyHistory}
      getRowId={(r) => `${r.relation}-${r.condition}`}
      columns={[
        { id: 'relation', header: 'Relation', cell: (r) => r.relation },
        { id: 'condition', header: 'Condition', cell: (r) => r.condition },
        {
          id: 'onset',
          header: 'Age of onset',
          cell: (r) => r.ageOfOnset ?? '—',
        },
      ]}
    />
  );
}

export function LifestyleSection({ record }: { record: PatientHealthRecord }) {
  const l = record.lifestyle;
  const d = record.demographics;
  const rows = [
    ['Diet', l.diet],
    ['Exercise', l.exercise],
    ['Sleep', `${l.sleepHours} hours/night`],
    ['Stress level', l.stressLevel],
    ['Smoking', d.smoking],
    ['Alcohol', d.alcohol],
    ['BMI', String(d.bmi)],
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lifestyle Profile</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label}>
            <p className="text-muted-foreground">{label}</p>
            <p className="font-medium capitalize">{value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function SocialHistorySection({
  record,
}: {
  record: PatientHealthRecord;
}) {
  const s = record.socialHistory;
  const rows = [
    ['Living situation', s.livingSituation],
    ['Support network', s.supportNetwork],
    ['Employment', s.employment],
    ['Travel history', s.travelHistory ?? 'None documented'],
    ['Occupation', record.demographics.occupation],
    ['Marital status', record.demographics.maritalStatus],
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social History</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label}>
            <p className="text-muted-foreground">{label}</p>
            <p className="font-medium">{value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function DashboardSection({ record }: { record: PatientHealthRecord }) {
  return (
    <div className="space-y-6">
      <SummarySection record={record} />
      <Card>
        <CardHeader>
          <CardTitle>Recent Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <TimelineSection
            record={{ ...record, timeline: record.timeline.slice(0, 8) }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export function RecordSectionContent({
  section,
  record,
}: {
  section: string;
  record: PatientHealthRecord;
}) {
  switch (section) {
    case 'profile':
      return <ProfileSection record={record} />;
    case 'summary':
      return <SummarySection record={record} />;
    case 'vitals':
      return <VitalsSection record={record} />;
    case 'laboratory':
      return <LaboratorySection record={record} />;
    case 'medications':
      return <MedicationsSection record={record} />;
    case 'allergies':
      return <AllergiesSection record={record} />;
    case 'immunizations':
      return <ImmunizationsSection record={record} />;
    case 'procedures':
      return <ProceduresSection record={record} />;
    case 'radiology':
      return <RadiologySection record={record} />;
    case 'notes':
      return <NotesSection record={record} />;
    case 'care-plans':
      return <CarePlansSection record={record} />;
    case 'timeline':
      return <TimelineSection record={record} />;
    case 'documents':
      return <DocumentsSection record={record} />;
    case 'family-history':
      return <FamilyHistorySection record={record} />;
    case 'lifestyle':
      return <LifestyleSection record={record} />;
    case 'social-history':
      return <SocialHistorySection record={record} />;
    case 'emergency':
      return <EmergencySection record={record} />;
    default:
      return <DashboardSection record={record} />;
  }
}
