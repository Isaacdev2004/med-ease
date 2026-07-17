import { format } from 'date-fns';
import {
  AlertTriangle,
  ClipboardCheck,
  FileText,
  Shield,
  ShieldAlert,
  Stethoscope,
  Target,
  TrendingUp,
} from 'lucide-react';

import {
  buildFishboneCategories,
  buildFiveWhys,
} from '@/services/quality/incident-engine';
import type {
  AccreditationStandard,
  AuditRecord,
  CapaRecord,
  ComplianceRecord,
  IncidentReport,
  InfectionRecord,
  PolicyDocument,
  QualityAnalytics,
  QualityDashboard,
  QualityIndicator,
  Risk,
  RootCauseAnalysis,
} from '@/services/quality/types';
import { BarChartPanel } from '@/shared/charts';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

const severityVariant = {
  low: 'outline',
  medium: 'secondary',
  high: 'default',
  critical: 'destructive',
} as const;
const riskVariant = {
  low: 'outline',
  medium: 'secondary',
  high: 'default',
  extreme: 'destructive',
} as const;

export function IncidentCard({
  incident,
  onEscalate,
}: {
  incident: IncidentReport;
  onEscalate?: () => void;
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{incident.title}</span>
          <Badge
            variant={severityVariant[incident.severity]}
            className="capitalize"
          >
            {incident.severity}
          </Badge>
        </div>
        <p className="text-muted-foreground line-clamp-2">
          {incident.description}
        </p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="capitalize">
            {incident.type.replace(/_/g, ' ')}
          </Badge>
          <Badge className="capitalize">{incident.status}</Badge>
          {incident.anonymous ? (
            <Badge variant="outline">Anonymous</Badge>
          ) : null}
          {incident.escalated ? (
            <Badge variant="destructive">Escalated</Badge>
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">
          {format(new Date(incident.reportedAt), 'MMM d, yyyy HH:mm')}
        </p>
        {onEscalate && !incident.escalated ? (
          <Button size="sm" variant="outline" onClick={onEscalate}>
            Escalate
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function RiskCard({ risk }: { risk: Risk }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{risk.title}</span>
          <Badge variant={riskVariant[risk.level]} className="capitalize">
            {risk.level}
          </Badge>
        </div>
        <p className="text-muted-foreground capitalize">
          {risk.category} · Score {risk.riskScore}
        </p>
        <p className="text-xs">
          L{risk.likelihood} × I{risk.impact} · Owner {risk.ownerId}
        </p>
        <Badge variant="outline" className="capitalize">
          {risk.status}
        </Badge>
      </CardContent>
    </Card>
  );
}

export function CAPACard({
  capa,
  onClose,
}: {
  capa: CapaRecord;
  onClose?: () => void;
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{capa.title}</span>
          <Badge className="capitalize">{capa.type}</Badge>
        </div>
        <p className="text-muted-foreground">{capa.actionPlan}</p>
        <div className="flex justify-between text-xs">
          <Badge variant="outline" className="capitalize">
            {capa.status.replace(/_/g, ' ')}
          </Badge>
          <span>Due {format(new Date(capa.dueDate), 'MMM d, yyyy')}</span>
        </div>
        {onClose && capa.status !== 'closed' ? (
          <Button size="sm" onClick={onClose}>
            Advance CAPA
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function AuditCard({ audit }: { audit: AuditRecord }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">{audit.title}</span>
          <Badge className="capitalize">{audit.status.replace('_', ' ')}</Badge>
        </div>
        <p className="text-muted-foreground capitalize">
          {audit.type} · {format(new Date(audit.scheduledDate), 'MMM d, yyyy')}
        </p>
        {audit.score != null ? (
          <p className="text-xs">
            Score: {audit.score}% · {audit.findingsCount} findings
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export const InspectionCard = AuditCard;

export function PolicyCard({
  policy,
  onArchive,
}: {
  policy: PolicyDocument;
  onArchive?: () => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between gap-2">
          <CardTitle className="text-sm">{policy.title}</CardTitle>
          <Badge className="capitalize">{policy.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <p className="text-muted-foreground capitalize">
          {policy.type} · {policy.version}
        </p>
        <p className="text-xs">
          Review: {format(new Date(policy.reviewDate), 'MMM d, yyyy')}
        </p>
        {onArchive && policy.status !== 'archived' ? (
          <Button size="sm" variant="outline" onClick={onArchive}>
            Archive
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function DocumentViewer({ policy }: { policy: PolicyDocument }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{policy.title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <p className="text-muted-foreground">{policy.contentSummary}</p>
        <p className="text-xs">
          Effective {format(new Date(policy.effectiveDate), 'MMM d, yyyy')} ·
          Owner {policy.ownerId}
        </p>
      </CardContent>
    </Card>
  );
}

export function AccreditationCard({
  standard,
}: {
  standard: AccreditationStandard;
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">{standard.code}</span>
          <Badge className="capitalize">
            {standard.status.replace('_', ' ')}
          </Badge>
        </div>
        <p>{standard.title}</p>
        <p className="text-xs text-muted-foreground">
          {standard.framework.toUpperCase()} · {standard.complianceScore}% ·{' '}
          {standard.gapCount} gaps
        </p>
      </CardContent>
    </Card>
  );
}

export function ComplianceScoreCard({ record }: { record: ComplianceRecord }) {
  return (
    <Card>
      <CardContent className="pt-4 flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary shrink-0" />
        <div className="text-sm">
          <p className="font-medium">{record.title}</p>
          <p className="text-2xl font-bold">{record.score}%</p>
          <Badge className="capitalize">
            {record.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export function InfectionDashboard({
  records,
  outbreaks,
}: {
  records: InfectionRecord[];
  outbreaks: { outbreakId: string; count: number }[];
}) {
  const byType = ['clabsi', 'cauti', 'ssi', 'vap', 'other_hai'].map((t) => ({
    label: t.toUpperCase(),
    value: records.filter((r) => r.type === t).length,
  }));
  return (
    <div className="space-y-4">
      <BarChartPanel title="HAI Surveillance" data={byType} />
      {outbreaks.length ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {outbreaks.slice(0, 3).map((o) => (
            <Card key={o.outbreakId}>
              <CardContent className="pt-4 text-sm">
                <p className="font-medium">{o.outbreakId}</p>
                <p>{o.count} linked cases</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function HeatMap({ data }: { data: QualityDashboard['riskHeatMap'] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((cell) => (
        <Card
          key={cell.label}
          className={cn(
            cell.likelihood * cell.impact >= 15 && 'border-destructive',
          )}
        >
          <CardContent className="pt-4 text-sm">
            <p className="font-medium capitalize">{cell.label}</p>
            <p>
              L{cell.likelihood} × I{cell.impact} · {cell.count} risks
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function FishbonePanel({ rca }: { rca?: RootCauseAnalysis }) {
  const categories = rca?.categories ?? buildFishboneCategories();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Fishbone Analysis</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Badge key={c} variant="outline">
            {c}
          </Badge>
        ))}
        {rca ? (
          <p className="col-span-full text-sm text-muted-foreground mt-2">
            {rca.summary}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function FiveWhysPanel({ rca }: { rca?: RootCauseAnalysis }) {
  const whys = rca?.whys ?? buildFiveWhys('incident');
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Five Whys</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {whys.map((w, i) => (
          <p key={i}>
            {i + 1}. {w}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}

export function RootCauseTimeline({
  analyses,
}: {
  analyses: RootCauseAnalysis[];
}) {
  return (
    <div className="space-y-2">
      {analyses.slice(0, 6).map((a) => (
        <Card key={a.rcaId}>
          <CardContent className="pt-4 text-sm">
            <div className="flex justify-between">
              <span className="font-medium capitalize">
                {a.method.replace('_', ' ')}
              </span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(a.createdAt), 'MMM d, yyyy')}
              </span>
            </div>
            <p className="text-muted-foreground">{a.summary}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ExecutiveDashboard({
  dashboard,
}: {
  dashboard: QualityDashboard;
}) {
  const metrics = [
    {
      label: 'Open Incidents',
      value: dashboard.openIncidents,
      icon: AlertTriangle,
    },
    { label: 'High Risks', value: dashboard.highRisks, icon: ShieldAlert },
    { label: 'Open CAPA', value: dashboard.openCapa, icon: ClipboardCheck },
    { label: 'Audit Score', value: `${dashboard.auditScore}%`, icon: Target },
    {
      label: 'Infection Rate',
      value: `${dashboard.infectionRate}‰`,
      icon: Stethoscope,
    },
    {
      label: 'Accreditation',
      value: `${dashboard.accreditationReadiness}%`,
      icon: Shield,
    },
    {
      label: 'Compliance',
      value: `${dashboard.compliancePercent}%`,
      icon: Shield,
    },
    {
      label: 'Policy Compliance',
      value: `${dashboard.policyCompliance}%`,
      icon: FileText,
    },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
  );
}

export function QualityMetrics({
  indicators,
}: {
  indicators: QualityIndicator[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {indicators.slice(0, 9).map((i) => (
        <Card key={i.indicatorId}>
          <CardContent className="pt-4 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">{i.name}</span>
              <Badge variant="outline">{i.trend}</Badge>
            </div>
            <p className="text-2xl font-bold">
              {i.value}
              {i.unit === '%' ? '%' : ` ${i.unit}`}
            </p>
            <p className="text-xs text-muted-foreground">
              Target: {i.target}
              {i.unit === '%' ? '%' : ` ${i.unit}`}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function AnalyticsPanel({ analytics }: { analytics: QualityAnalytics }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'CAPA Completion', value: `${analytics.capaCompletion}%` },
          { label: 'Audit Scores', value: `${analytics.auditScores}%` },
          { label: 'Open Findings', value: analytics.openFindings },
          {
            label: 'Accreditation Ready',
            value: `${analytics.accreditationReadiness}%`,
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
      <div className="grid gap-4 md:grid-cols-2">
        <BarChartPanel title="Incident Trend" data={analytics.incidentTrend} />
        <BarChartPanel
          title="Risk by Category"
          data={analytics.riskByCategory}
        />
      </div>
      <BarChartPanel title="Department Risk" data={analytics.departmentRisk} />
    </div>
  );
}

export function ExportToolbar({
  onExport,
}: {
  onExport?: (format: 'csv' | 'pdf' | 'xlsx') => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {(['csv', 'pdf', 'xlsx'] as const).map((f) => (
        <Button
          key={f}
          size="sm"
          variant="outline"
          onClick={() => onExport?.(f)}
        >
          Export {f.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}

export function QualityKPIBanner({
  analytics,
}: {
  analytics: QualityAnalytics;
}) {
  return (
    <Card>
      <CardContent className="pt-4 flex items-center gap-3">
        <TrendingUp className="h-8 w-8 text-emerald-600" />
        <div className="text-sm">
          <p className="font-medium">Enterprise Quality Performance</p>
          <p className="text-muted-foreground">
            {analytics.compliancePercent}% compliance ·{' '}
            {analytics.policyCompliance}% policy adherence
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
