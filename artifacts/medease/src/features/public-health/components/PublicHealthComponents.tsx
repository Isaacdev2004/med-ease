import { format } from 'date-fns';
import {
  Activity,
  AlertTriangle,
  Baby,
  Building2,
  GraduationCap,
  Heart,
  MapPin,
  Shield,
  Syringe,
  Users,
} from 'lucide-react';

import type {
  ChildHealthRecord,
  CommunityProgram,
  ContactTracingRecord,
  DiseaseCase,
  EnvironmentalInspection,
  ImmunizationRecord,
  ImmunizationRegistry,
  MaternalRecord,
  OccupationalAssessment,
  OutbreakInvestigation,
  PublicHealthAnalytics,
  PublicHealthDashboard,
  SchoolHealthScreening,
  SdohAssessment,
} from '@/services/public-health/types';
import { BarChartPanel } from '@/shared/charts';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

const caseVariant = {
  suspected: 'outline',
  confirmed: 'destructive',
  probable: 'secondary',
  ruled_out: 'outline',
  closed: 'default',
} as const;
const contactVariant = {
  identified: 'outline',
  notified: 'secondary',
  monitoring: 'default',
  quarantined: 'destructive',
  cleared: 'default',
} as const;

export function EpidemiologyDashboard({
  dashboard,
}: {
  dashboard: PublicHealthDashboard;
}) {
  const metrics = [
    {
      label: 'Active Cases',
      value: dashboard.activeCases.toLocaleString(),
      icon: AlertTriangle,
    },
    {
      label: 'Active Outbreaks',
      value: dashboard.activeOutbreaks,
      icon: Activity,
    },
    {
      label: 'Immunizations Due',
      value: dashboard.immunizationsDue.toLocaleString(),
      icon: Syringe,
    },
    {
      label: 'Contacts Monitoring',
      value: dashboard.contactsMonitoring.toLocaleString(),
      icon: Users,
    },
    {
      label: 'Active Programs',
      value: dashboard.communityProgramsActive,
      icon: Heart,
    },
    {
      label: 'SDOH High Risk',
      value: dashboard.sdohHighRisk.toLocaleString(),
      icon: MapPin,
    },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-4 flex items-center gap-3">
              <m.icon className="h-8 w-8 text-primary shrink-0" />
              <div>
                <p className="text-2xl font-bold">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <BarChartPanel title="Case Trend" data={dashboard.caseTrend} />
    </div>
  );
}

export function DiseaseCaseCard({ caseRecord }: { caseRecord: DiseaseCase }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{caseRecord.disease}</span>
          <Badge
            variant={caseVariant[caseRecord.status]}
            className="capitalize"
          >
            {caseRecord.status.replace('_', ' ')}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {caseRecord.caseId} · {caseRecord.patientId}
        </p>
        <p className="text-xs">ICD-10: {caseRecord.icd10Code}</p>
        <p className="text-xs">
          {format(new Date(caseRecord.reportedAt), 'MMM d, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
}

export function OutbreakCard({
  outbreak,
}: {
  outbreak: OutbreakInvestigation;
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium line-clamp-2">{outbreak.name}</span>
          <Badge className="capitalize shrink-0">{outbreak.status}</Badge>
        </div>
        <p className="text-xs">
          {outbreak.disease} · {outbreak.caseCount} cases
        </p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(outbreak.startedAt), 'MMM d, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
}

export function ContactTracingBoard({
  contacts,
}: {
  contacts: ContactTracingRecord[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="h-5 w-5" /> Contact Tracing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {contacts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No contacts being traced.
          </p>
        ) : (
          contacts.slice(0, 8).map((c) => (
            <div
              key={c.contactId}
              className="flex items-center justify-between gap-2 text-sm border-b pb-2 last:border-0"
            >
              <div>
                <p className="font-medium">{c.contactName}</p>
                <p className="text-xs text-muted-foreground">
                  Case: {c.caseId}
                </p>
              </div>
              <Badge variant={contactVariant[c.status]} className="capitalize">
                {c.status}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export function ImmunizationCard({ record }: { record: ImmunizationRecord }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{record.vaccine}</span>
          <Badge className="capitalize">{record.status}</Badge>
        </div>
        <p className="text-xs">
          Dose {record.doseNumber} · CVX {record.cvxCode}
        </p>
        <p className="text-xs text-muted-foreground">{record.patientId}</p>
      </CardContent>
    </Card>
  );
}

export function RegistryCard({ registry }: { registry: ImmunizationRegistry }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <p className="font-medium">{registry.name}</p>
        <Badge variant="outline">{registry.jurisdiction}</Badge>
        <p className="text-xs">
          {registry.memberCount.toLocaleString()} members ·{' '}
          {registry.coverageRate}% coverage
        </p>
      </CardContent>
    </Card>
  );
}

export function CommunityProgramCard({
  program,
}: {
  program: CommunityProgram;
}) {
  const rate =
    program.targetPopulation > 0
      ? Math.round((program.enrolledCount / program.targetPopulation) * 100)
      : 0;
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <p className="font-medium line-clamp-2">{program.name}</p>
        <div className="flex gap-2">
          <Badge variant="outline">{program.category}</Badge>
          <Badge className="capitalize">{program.status}</Badge>
        </div>
        <p className="text-xs">
          {program.enrolledCount}/{program.targetPopulation} enrolled ({rate}%)
        </p>
      </CardContent>
    </Card>
  );
}

export function MaternalHealthCard({ record }: { record: MaternalRecord }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium flex items-center gap-1">
            <Baby className="h-4 w-4" /> {record.patientId}
          </span>
          <Badge
            variant={record.riskLevel === 'high' ? 'destructive' : 'outline'}
            className="capitalize"
          >
            {record.riskLevel}
          </Badge>
        </div>
        <p className="text-xs">{record.gestationalWeeks} weeks gestation</p>
        <p className="text-xs text-muted-foreground">
          Last visit {format(new Date(record.lastVisitAt), 'MMM d, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
}

export function ChildHealthCard({ record }: { record: ChildHealthRecord }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{record.patientId}</span>
          <Badge className="capitalize">
            {record.wellnessStatus.replace('_', ' ')}
          </Badge>
        </div>
        <p className="text-xs">{record.ageMonths} months</p>
        <Badge
          variant={record.immunizationUpToDate ? 'default' : 'destructive'}
        >
          {record.immunizationUpToDate
            ? 'Immunizations current'
            : 'Immunizations overdue'}
        </Badge>
      </CardContent>
    </Card>
  );
}

export function SchoolHealthCard({
  screening,
}: {
  screening: SchoolHealthScreening;
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium flex items-center gap-1">
            <GraduationCap className="h-4 w-4" /> {screening.schoolName}
          </span>
        </div>
        <p className="text-xs">
          {screening.screenedCount}/{screening.studentCount} screened
        </p>
        <p className="text-xs">
          {screening.referralCount} referrals ·{' '}
          {format(new Date(screening.screeningDate), 'MMM d, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
}

export function OccupationalHealthCard({
  assessment,
}: {
  assessment: OccupationalAssessment;
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <p className="font-medium">{assessment.employer}</p>
        <p className="text-xs">{assessment.assessmentType}</p>
        <Badge className="capitalize">{assessment.result}</Badge>
      </CardContent>
    </Card>
  );
}

export function EnvironmentalInspectionCard({
  inspection,
}: {
  inspection: EnvironmentalInspection;
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium flex items-center gap-1">
            <Building2 className="h-4 w-4" /> {inspection.siteName}
          </span>
          <Badge className="capitalize">
            {inspection.status.replace('_', ' ')}
          </Badge>
        </div>
        <p className="text-xs">
          {inspection.inspectionType} · Score: {inspection.score}
        </p>
      </CardContent>
    </Card>
  );
}

export function SDOHCard({ assessment }: { assessment: SdohAssessment }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium capitalize">
            {assessment.domain.replace('_', ' ')}
          </span>
          <Badge
            variant={
              assessment.riskLevel === 'high' ? 'destructive' : 'outline'
            }
            className="capitalize"
          >
            {assessment.riskLevel}
          </Badge>
        </div>
        <p className="text-xs">Score: {assessment.score}/100</p>
        {assessment.interventionNeeded && (
          <Badge variant="secondary">Intervention needed</Badge>
        )}
      </CardContent>
    </Card>
  );
}

export function HeatMapPanel({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  return <BarChartPanel title="Regional Distribution" data={data} />;
}

export function AnalyticsPanel({
  analytics,
}: {
  analytics: PublicHealthAnalytics;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Incidence Rate', value: `${analytics.incidenceRate}%` },
          {
            label: 'Immunization Coverage',
            value: `${analytics.immunizationCoverage}%`,
          },
          {
            label: 'Contact Tracing',
            value: `${analytics.contactTracingCompletion}%`,
          },
          {
            label: 'SDOH Interventions',
            value: `${analytics.sdohInterventionRate}%`,
          },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <BarChartPanel
          title="Disease Distribution"
          data={analytics.diseaseDistribution}
        />
        <HeatMapPanel data={analytics.regionalHeatmap} />
      </div>
    </div>
  );
}

export function ExportToolbar({
  onExport,
}: {
  onExport?: (format: 'csv' | 'pdf' | 'xlsx') => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {(['csv', 'pdf', 'xlsx'] as const).map((fmt) => (
        <Button
          key={fmt}
          variant="outline"
          size="sm"
          onClick={() => onExport?.(fmt)}
        >
          Export {fmt.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}

export function PublicHealthSafetyPanel({
  outbreaks,
}: {
  outbreaks: OutbreakInvestigation[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Shield className="h-5 w-5" /> Active Outbreaks
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {outbreaks.length === 0 ? (
          <p className="text-sm text-muted-foreground col-span-full">
            No active outbreaks.
          </p>
        ) : (
          outbreaks.map((o) => <OutbreakCard key={o.outbreakId} outbreak={o} />)
        )}
      </CardContent>
    </Card>
  );
}
