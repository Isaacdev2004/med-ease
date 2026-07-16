import { format } from 'date-fns';
import { Beaker, FlaskConical } from 'lucide-react';
import { useRoute } from 'wouter';

import {
  CriticalAlertCard,
  LabOrderCard,
  LabResultCard,
  LabTimeline,
  LaboratoryAnalyticsPanel,
  LaboratoryKpiCards,
  MicrobiologyPanel,
  PathologyPanel,
  BloodBankPanel,
  QualityDashboardPanel,
  InstrumentCard,
  TechnologistCard,
  ResultViewer,
  ExportShareToolbar,
  PreparationCard,
  SpecimenCard,
  TrendChart,
} from '@/features/laboratory/components/LaboratoryComponents';
import {
  useCriticalResults,
  useLaboratoryAlerts,
  useLaboratoryAnalytics,
  useLaboratoryDashboard,
  useLaboratoryOrders,
  useLaboratoryResults,
  useLaboratoryResult,
  useLaboratoryTimeline,
  useLaboratoryTrends,
  useSpecimenTracking,
  usePendingResults,
  useMicrobiology,
  usePathology,
  useBloodBank,
  useQualityDashboard,
  useLabInstruments,
  useFavorites,
} from '@/features/laboratory/hooks/use-laboratory';
import { MOCK_TECHNOLOGISTS } from '@/services/laboratory';
import { useLaboratoryMutations } from '@/features/laboratory/mutations/laboratory.mutations';
import { LAB_TEST_CATALOG } from '@/services/laboratory';
import type { LabOrderFilters } from '@/services/laboratory/types';
import { BarChartPanel } from '@/shared/charts';
import { LoadingView } from '@/shared/components';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';
import { Button } from '@/shared/ui/button';

export type LaboratorySection =
  | 'dashboard'
  | 'orders'
  | 'results'
  | 'history'
  | 'trends'
  | 'list'
  | 'critical'
  | 'queue'
  | 'specimens'
  | 'verification'
  | 'catalog'
  | 'analytics'
  | 'reports'
  | 'quality'
  | 'microbiology'
  | 'pathology'
  | 'bloodBank'
  | 'pending'
  | 'instruments';

export function DashboardSection({ filters }: { filters?: LabOrderFilters }) {
  const patientId = filters?.patientId;
  const dashboard = useLaboratoryDashboard(patientId);
  const alerts = useLaboratoryAlerts(patientId);
  if (dashboard.isLoading) return <LoadingView label="Loading laboratory dashboard…" />;
  if (!dashboard.data) return <EmptyState icon={FlaskConical} title="No laboratory data" />;
  return (
    <div className="space-y-6">
      <LaboratoryKpiCards dashboard={dashboard.data} />
      <BarChartPanel title="Orders by category" data={dashboard.data.chartData} />
      <LabTimeline entries={dashboard.data.recentActivity} />
      {(alerts.data ?? []).filter((a) => !a.acknowledged).slice(0, 3).map((a) => (
        <CriticalAlertCard key={a.id} alert={a} />
      ))}
    </div>
  );
}

export function OrdersSection({ filters }: { filters?: LabOrderFilters }) {
  const query = useLaboratoryOrders(filters);
  if (query.isLoading) return <LoadingView />;
  const orders = query.data ?? [];
  if (!orders.length) return <EmptyState icon={Beaker} title="No lab orders" />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {orders.slice(0, 24).map((o) => <LabOrderCard key={o.id} order={o} />)}
    </div>
  );
}

export function ResultsSection({ filters }: { filters?: LabOrderFilters }) {
  const patientId = filters?.patientId;
  const query = useLaboratoryResults(patientId ? { patientId } : undefined);
  if (query.isLoading) return <LoadingView />;
  const results = query.data ?? [];
  if (!results.length) return <EmptyState icon={FlaskConical} title="No results" />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {results.slice(0, 20).map((r) => <LabResultCard key={r.id} report={r} />)}
    </div>
  );
}

export function HistorySection({ filters }: { filters?: LabOrderFilters }) {
  const patientId = filters?.patientId;
  const timeline = useLaboratoryTimeline(patientId);
  if (!patientId || timeline.isLoading) return <LoadingView />;
  return <LabTimeline entries={timeline.data ?? []} />;
}

export function TrendsSection({ filters }: { filters?: LabOrderFilters }) {
  const patientId = filters?.patientId;
  const trends = useLaboratoryTrends(patientId);
  if (!patientId || trends.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {(trends.data ?? []).map((s) => <TrendChart key={s.testId} series={s} />)}
    </div>
  );
}

export function PreparationSection() {
  const tests = LAB_TEST_CATALOG.filter((t) => t.preparation).slice(0, 6);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {tests.map((t) => (
        <PreparationCard key={t.id} testName={t.name} preparation={t.preparation ?? t.collectionInstructions} />
      ))}
    </div>
  );
}

export function CriticalSection({ filters }: { filters?: LabOrderFilters }) {
  const query = useCriticalResults(filters?.patientId);
  if (query.isLoading) return <LoadingView />;
  const alerts = query.data ?? [];
  if (!alerts.length) return <EmptyState icon={FlaskConical} title="No critical alerts" description="All results within acceptable limits." />;
  return (
    <div className="grid gap-4">
      {alerts.map((a) => <CriticalAlertCard key={a.id} alert={a} />)}
    </div>
  );
}

export function SpecimensSection({ filters }: { filters?: LabOrderFilters }) {
  const query = useSpecimenTracking(undefined, filters?.patientId);
  const { collectSpecimen } = useLaboratoryMutations();
  if (query.isLoading) return <LoadingView />;
  const specimens = query.data ?? [];
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {specimens.slice(0, 18).map((s) => <SpecimenCard key={s.id} specimen={s} />)}
      </div>
      {specimens[0] ? (
        <Button variant="outline" onClick={() => void collectSpecimen.mutateAsync({ orderId: specimens[0]!.orderId, collectedBy: 'Lab Tech' })}>
          Mark sample collected (demo)
        </Button>
      ) : null}
    </div>
  );
}

export function PendingVerificationSection() {
  const query = usePendingResults();
  const { verifyResult, approveResult } = useLaboratoryMutations();
  if (query.isLoading) return <LoadingView />;
  const pending = query.data ?? [];
  if (!pending.length) return <EmptyState icon={FlaskConical} title="No pending verification" />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {pending.slice(0, 12).map((r) => (
        <Card key={r.id}>
          <CardHeader className="pb-2"><CardTitle className="text-base">{r.title}</CardTitle></CardHeader>
          <CardContent className="flex gap-2">
            <Button size="sm" onClick={() => void verifyResult.mutateAsync({ reportId: r.id, verifiedBy: 'Dr. Emily Chen' })}>Verify</Button>
            <Button size="sm" variant="outline" onClick={() => void approveResult.mutateAsync({ reportId: r.id, approvedBy: 'Dr. Emily Chen', digitalSignature: 'SIG-demo' })}>Approve</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function MicrobiologySection({ filters }: { filters?: LabOrderFilters }) {
  const query = useMicrobiology(filters?.patientId);
  if (query.isLoading) return <LoadingView />;
  const items = query.data ?? [];
  if (!items.length) return <EmptyState icon={FlaskConical} title="No microbiology results" />;
  return <div className="grid gap-4 sm:grid-cols-2">{items.slice(0, 12).map((m) => <MicrobiologyPanel key={m.id} result={m} />)}</div>;
}

export function PathologySection({ filters }: { filters?: LabOrderFilters }) {
  const query = usePathology(filters?.patientId);
  if (query.isLoading) return <LoadingView />;
  const items = query.data ?? [];
  if (!items.length) return <EmptyState icon={FlaskConical} title="No pathology results" />;
  return <div className="grid gap-4 sm:grid-cols-2">{items.slice(0, 12).map((p) => <PathologyPanel key={p.id} result={p} />)}</div>;
}

export function BloodBankSection({ filters }: { filters?: LabOrderFilters }) {
  const query = useBloodBank(filters?.patientId);
  if (query.isLoading) return <LoadingView />;
  const items = query.data ?? [];
  if (!items.length) return <EmptyState icon={FlaskConical} title="No blood bank records" />;
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.slice(0, 12).map((b) => <BloodBankPanel key={b.id} record={b} />)}</div>;
}

export function QualitySection() {
  const query = useQualityDashboard();
  if (query.isLoading) return <LoadingView />;
  if (!query.data) return <EmptyState icon={FlaskConical} title="No quality data" />;
  return <QualityDashboardPanel dashboard={query.data} />;
}

export function InstrumentsSection() {
  const query = useLabInstruments();
  if (query.isLoading) return <LoadingView />;
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(query.data ?? []).map((i) => <InstrumentCard key={i.id} instrument={i} />)}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_TECHNOLOGISTS.map((t) => <TechnologistCard key={t.id} technologist={t} />)}
      </div>
    </div>
  );
}

export function FavoritesSection({ filters }: { filters?: LabOrderFilters }) {
  const query = useFavorites(filters?.patientId);
  if (query.isLoading) return <LoadingView />;
  const favs = query.data ?? [];
  if (!favs.length) return <EmptyState icon={FlaskConical} title="No favorite results" />;
  return <div className="grid gap-4 sm:grid-cols-2">{favs.slice(0, 12).map((r) => <LabResultCard key={r.id} report={r} />)}</div>;
}

export function AnalyticsSection() {
  const query = useLaboratoryAnalytics();
  if (query.isLoading) return <LoadingView />;
  if (!query.data) return <EmptyState icon={FlaskConical} title="No analytics" />;
  return <LaboratoryAnalyticsPanel analytics={query.data} />;
}

export function CatalogSection() {
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-3 py-2 text-left">LOINC</th>
            <th className="px-3 py-2 text-left">Test</th>
            <th className="px-3 py-2 text-left">Category</th>
            <th className="px-3 py-2 text-left">TAT (h)</th>
          </tr>
        </thead>
        <tbody>
          {LAB_TEST_CATALOG.map((t) => (
            <tr key={t.id} className="border-t">
              <td className="px-3 py-2 font-mono text-xs">{t.loincCode}</td>
              <td className="px-3 py-2">{t.name}</td>
              <td className="px-3 py-2 capitalize">{t.category.replace('_', ' ')}</td>
              <td className="px-3 py-2">{t.turnaroundHours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ResultDetailSection({ resultId: propId }: { resultId?: string }) {
  const [, params] = useRoute('/laboratory/:resultId');
  const raw = propId ?? params?.resultId ?? '';
  const isReserved = ['orders', 'results', 'history', 'trends'].includes(raw);
  const reportId = isReserved ? undefined : raw.startsWith('rep-') ? raw : raw ? `rep-lo-${raw.padStart(5, '0')}` : undefined;
  const query = useLaboratoryResult(reportId);
  const { exportResult, shareResult } = useLaboratoryMutations();
  if (isReserved) return null;
  if (query.isLoading) return <LoadingView />;
  if (!query.data) return <EmptyState icon={FlaskConical} title="Result not found" />;
  const { report, observations } = query.data;
  return (
    <div className="space-y-6">
      <ExportShareToolbar
        onExport={() => void exportResult.mutateAsync({ reportId: report.id, format: 'pdf' })}
        onShare={() => void shareResult.mutateAsync({ reportId: report.id, sharedWith: 'care-team@medease.app' })}
      />
      <ResultViewer report={report} observations={observations} />
      {report.summary ? <Card><CardContent className="pt-4 text-sm">{report.summary}</CardContent></Card> : null}
      {report.releasedAt ? <p className="text-sm text-muted-foreground">Released {format(new Date(report.releasedAt), 'PPp')}</p> : null}
    </div>
  );
}

export function LaboratorySectionContent({ section, filters }: { section: LaboratorySection; filters?: LabOrderFilters }) {
  switch (section) {
    case 'orders': return <OrdersSection filters={filters} />;
    case 'results': return <ResultsSection filters={filters} />;
    case 'history': return <HistorySection filters={filters} />;
    case 'trends': return <TrendsSection filters={filters} />;
    case 'critical': return <CriticalSection filters={filters} />;
    case 'specimens': return <SpecimensSection filters={filters} />;
    case 'verification': case 'pending': return <PendingVerificationSection />;
    case 'microbiology': return <MicrobiologySection filters={filters} />;
    case 'pathology': return <PathologySection filters={filters} />;
    case 'bloodBank': return <BloodBankSection filters={filters} />;
    case 'quality': return <QualitySection />;
    case 'instruments': return <InstrumentsSection />;
    case 'catalog': return <CatalogSection />;
    case 'list': case 'queue': case 'dashboard': return <DashboardSection filters={filters} />;
    case 'analytics': case 'reports': return <AnalyticsSection />;
    default: return <DashboardSection filters={filters} />;
  }
}
