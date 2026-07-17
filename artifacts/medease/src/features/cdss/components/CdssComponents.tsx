import { format } from 'date-fns';
import {
  AlertTriangle,
  BookOpen,
  Brain,
  Calculator,
  ClipboardList,
  FileText,
  Pill,
  ShieldAlert,
  Stethoscope,
} from 'lucide-react';

import type {
  AlertAudit,
  AllergyAlert,
  CalculatorResult,
  CdssAnalytics,
  CdssDashboard,
  ClinicalAlert,
  ClinicalPathway,
  ClinicalProtocol,
  ClinicalRecommendation,
  ClinicalRule,
  ContraindicationAlert,
  DecisionTree,
  DiagnosticSuggestion,
  DrugInteractionAlert,
  DuplicateTherapyAlert,
  EvidenceArticle,
  Guideline,
  OrderSet,
  PreventiveReminder,
  RiskCalculator,
} from '@/services/cdss/types';
import { BarChartPanel } from '@/shared/charts';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

const severityVariant = {
  critical: 'destructive',
  high: 'default',
  medium: 'secondary',
  low: 'outline',
  info: 'outline',
} as const;

export function CDSDashboard({ dashboard }: { dashboard: CdssDashboard }) {
  const metrics = [
    {
      label: 'Active Alerts',
      value: dashboard.activeAlerts.toLocaleString(),
      icon: AlertTriangle,
    },
    {
      label: 'Critical Alerts',
      value: dashboard.criticalAlerts.toLocaleString(),
      icon: ShieldAlert,
    },
    {
      label: 'Pending Recommendations',
      value: dashboard.pendingRecommendations.toLocaleString(),
      icon: Brain,
    },
    {
      label: 'Guideline Compliance',
      value: `${dashboard.guidelineCompliance}%`,
      icon: BookOpen,
    },
    {
      label: 'Order Sets Applied',
      value: dashboard.orderSetsApplied.toLocaleString(),
      icon: ClipboardList,
    },
    {
      label: 'Preventive Due',
      value: dashboard.preventiveDue.toLocaleString(),
      icon: Stethoscope,
    },
  ];
  return (
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
  );
}

export function ClinicalAlertCard({
  alert,
  onAcknowledge,
  onOverride,
}: {
  alert: ClinicalAlert;
  onAcknowledge?: () => void;
  onOverride?: () => void;
}) {
  return (
    <Card className={cn(alert.severity === 'critical' && 'border-destructive')}>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{alert.title}</span>
          <Badge
            variant={severityVariant[alert.severity]}
            className="capitalize"
          >
            {alert.severity}
          </Badge>
        </div>
        <p className="text-muted-foreground">{alert.patientName}</p>
        <p className="line-clamp-2">{alert.message}</p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="capitalize">
            {alert.type.replace(/_/g, ' ')}
          </Badge>
          <Badge className="capitalize">{alert.status}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {format(new Date(alert.triggeredAt), 'MMM d, yyyy HH:mm')}
        </p>
        {alert.status === 'active' ? (
          <div className="flex gap-2">
            {onAcknowledge ? (
              <Button size="sm" onClick={onAcknowledge}>
                Acknowledge
              </Button>
            ) : null}
            {onOverride ? (
              <Button size="sm" variant="outline" onClick={onOverride}>
                Override
              </Button>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function RecommendationCard({
  recommendation,
  onApply,
}: {
  recommendation: ClinicalRecommendation;
  onApply?: () => void;
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{recommendation.title}</span>
          <Badge variant="outline">Level {recommendation.evidenceLevel}</Badge>
        </div>
        <p className="text-muted-foreground">{recommendation.patientName}</p>
        <p className="line-clamp-2">{recommendation.rationale}</p>
        <Badge className="capitalize">{recommendation.status}</Badge>
        {onApply && recommendation.status === 'pending' ? (
          <Button size="sm" onClick={onApply}>
            Apply
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function GuidelineCard({ guideline }: { guideline: Guideline }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{guideline.title}</span>
          <Badge variant="outline" className="uppercase">
            {guideline.source}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          {guideline.condition} · {guideline.currentVersion}
        </p>
        <p className="text-xs">
          Compliance {guideline.complianceRate}% · Reviewed{' '}
          {format(new Date(guideline.lastReviewed), 'MMM d, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
}

export function GuidelineViewer({ guideline }: { guideline: Guideline }) {
  const version = guideline.versions[0];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{guideline.title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <p className="text-muted-foreground">
          {version?.summary ?? 'Evidence-based clinical guidance'}
        </p>
        <p className="text-xs">
          Source: {guideline.source.toUpperCase()} · Status: {guideline.status}
        </p>
      </CardContent>
    </Card>
  );
}

export function EvidenceCard({ article }: { article: EvidenceArticle }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{article.title}</span>
          <Badge variant="outline">Level {article.evidenceLevel}</Badge>
        </div>
        <p className="text-muted-foreground">
          {article.source} · {article.pubDate}
        </p>
        <p className="line-clamp-2">{article.summary}</p>
      </CardContent>
    </Card>
  );
}

export function DiagnosticSuggestionCard({
  suggestion,
}: {
  suggestion: DiagnosticSuggestion;
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{suggestion.suggestedDiagnosis}</span>
          <Badge>{suggestion.probability}%</Badge>
        </div>
        <p className="text-muted-foreground">
          {suggestion.patientName} · {suggestion.presentingComplaint}
        </p>
        <p className="text-xs">Labs: {suggestion.suggestedLabs.join(', ')}</p>
        <p className="text-xs">
          Imaging: {suggestion.suggestedImaging.join(', ')}
        </p>
      </CardContent>
    </Card>
  );
}

export function DifferentialDiagnosisPanel({
  suggestion,
}: {
  suggestion: DiagnosticSuggestion;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Differential for {suggestion.presentingComplaint}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <p>
          {suggestion.suggestedDiagnosis} — {suggestion.probability}%
          probability
        </p>
        <p className="text-muted-foreground">
          Suggested workup:{' '}
          {[...suggestion.suggestedLabs, ...suggestion.suggestedImaging].join(
            ' · ',
          )}
        </p>
      </CardContent>
    </Card>
  );
}

export function OrderSetCard({ orderSet }: { orderSet: OrderSet }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{orderSet.name}</span>
          <Badge variant="outline" className="uppercase">
            {orderSet.category.replace(/_/g, ' ')}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          {orderSet.itemCount} items · Used {orderSet.usageCount} times
        </p>
        <p className="text-xs">
          Evidence: {orderSet.evidenceSource.toUpperCase()}
        </p>
      </CardContent>
    </Card>
  );
}

export function PreventiveReminderCard({
  reminder,
}: {
  reminder: PreventiveReminder;
}) {
  return (
    <Card
      className={cn(reminder.status === 'overdue' && 'border-destructive/50')}
    >
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{reminder.title}</span>
          <Badge className="capitalize">{reminder.status}</Badge>
        </div>
        <p className="text-muted-foreground">{reminder.patientName}</p>
        <p className="text-xs">
          Due {format(new Date(reminder.dueDate), 'MMM d, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
}

export function DrugInteractionBanner({
  alert,
}: {
  alert: DrugInteractionAlert;
}) {
  return (
    <Card className="border-destructive bg-destructive/5">
      <CardContent className="pt-4 flex items-start gap-3 text-sm">
        <Pill className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">
            Drug Interaction: {alert.drugA} + {alert.drugB}
          </p>
          <p className="text-muted-foreground">
            {alert.patientName} · {alert.mechanism}
          </p>
          <p className="text-xs mt-1">{alert.recommendation}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function AllergyBanner({ alert }: { alert: AllergyAlert }) {
  return (
    <Card className="border-destructive bg-destructive/5">
      <CardContent className="pt-4 flex items-start gap-3 text-sm">
        <ShieldAlert className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Allergy Alert: {alert.allergen}</p>
          <p className="text-muted-foreground">
            {alert.patientName} — {alert.medication} may cause {alert.reaction}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ContraindicationBanner({
  alert,
}: {
  alert: ContraindicationAlert;
}) {
  return (
    <Card className="border-destructive bg-destructive/5">
      <CardContent className="pt-4 flex items-start gap-3 text-sm">
        <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Contraindication: {alert.medication}</p>
          <p className="text-muted-foreground">
            {alert.condition} · {alert.recommendation}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function RiskCalculatorCard({
  calculator,
  onCalculate,
}: {
  calculator: RiskCalculator;
  onCalculate?: () => void;
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <span className="font-medium">{calculator.name}</span>
        </div>
        <p className="text-muted-foreground">{calculator.description}</p>
        {onCalculate ? (
          <Button size="sm" onClick={onCalculate}>
            Calculate
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function CalculatorPanel({ result }: { result: CalculatorResult }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base capitalize">
          {result.calculatorType.replace(/_/g, ' ')} Result
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <p className="text-3xl font-bold">{result.score}</p>
        <p className="text-muted-foreground">{result.interpretation}</p>
        <p className="text-xs">
          {format(new Date(result.calculatedAt), 'MMM d, yyyy HH:mm')}
        </p>
      </CardContent>
    </Card>
  );
}

export function ClinicalProtocolCard({
  protocol,
}: {
  protocol: ClinicalProtocol;
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{protocol.name}</span>
          <Badge className="capitalize">{protocol.status}</Badge>
        </div>
        <p className="text-muted-foreground">
          {protocol.condition} · {protocol.version}
        </p>
        <p className="text-xs">Compliance {protocol.complianceRate}%</p>
      </CardContent>
    </Card>
  );
}

export function ClinicalPathwayCard({ pathway }: { pathway: ClinicalPathway }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <span className="font-medium">{pathway.name}</span>
        <p className="text-muted-foreground">
          {pathway.stageCount} stages · {pathway.avgDurationDays}d avg
        </p>
        <p className="text-xs">Adherence {pathway.adherenceRate}%</p>
      </CardContent>
    </Card>
  );
}

export function CdssAnalyticsPanel({
  analytics,
}: {
  analytics: CdssAnalytics;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Alert Volume',
            value: analytics.alertVolume.toLocaleString(),
          },
          { label: 'Acceptance Rate', value: `${analytics.acceptanceRate}%` },
          { label: 'Override Rate', value: `${analytics.overrideRate}%` },
          {
            label: 'Guideline Compliance',
            value: `${analytics.guidelineCompliance}%`,
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
        <BarChartPanel title="Alert Trend" data={analytics.alertTrend} />
        <BarChartPanel title="Alerts by Type" data={analytics.alertsByType} />
      </div>
    </div>
  );
}

export function DecisionTreeViewer({ tree }: { tree: DecisionTree }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{tree.name}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        {tree.nodes.map((n) => (
          <div key={n.nodeId} className="rounded-md border p-2">
            {n.question ? <p className="font-medium">{n.question}</p> : null}
            {n.recommendation ? (
              <p className="text-muted-foreground">{n.recommendation}</p>
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function AuditTimeline({ audits }: { audits: AlertAudit[] }) {
  return (
    <div className="space-y-2">
      {audits.slice(0, 10).map((a) => (
        <Card key={a.auditId}>
          <CardContent className="pt-4 text-sm flex justify-between">
            <span className="capitalize">
              {a.action.replace(/_/g, ' ')} — {a.alertId}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(new Date(a.timestamp), 'MMM d, yyyy')}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ClinicalRuleCard({
  rule,
  onToggle,
}: {
  rule: ClinicalRule;
  onToggle?: () => void;
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{rule.name}</span>
          <Badge variant={rule.enabled ? 'default' : 'outline'}>
            {rule.enabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>
        <p className="text-muted-foreground capitalize">
          {rule.category.replace(/_/g, ' ')} · {rule.triggerCount} triggers
        </p>
        {onToggle ? (
          <Button size="sm" variant="outline" onClick={onToggle}>
            Toggle rule
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function CdssExportToolbar({
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

export function OverrideDialogHint({ onOverride }: { onOverride: () => void }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>Override requires documented clinical justification</span>
        </div>
        <Button size="sm" variant="outline" onClick={onOverride}>
          Override with reason
        </Button>
      </CardContent>
    </Card>
  );
}

export function DuplicateTherapyBanner({
  alert,
}: {
  alert: DuplicateTherapyAlert;
}) {
  return (
    <Card className="border-amber-500/50 bg-amber-500/5">
      <CardContent className="pt-4 text-sm">
        <p className="font-medium">
          Duplicate therapy: {alert.therapeuticClass}
        </p>
        <p className="text-muted-foreground">
          {alert.medications.join(' + ')} — {alert.recommendation}
        </p>
      </CardContent>
    </Card>
  );
}
