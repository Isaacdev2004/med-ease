import {
  PortalActionButton,
  PortalMetricsGrid,
  PortalListCard,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import { PageShell, SectionHeader } from '@/shared/components';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

const occupancyTrend = [
  { label: 'Mon', value: 82 },
  { label: 'Tue', value: 85 },
  { label: 'Wed', value: 87 },
  { label: 'Thu', value: 84 },
  { label: 'Fri', value: 89 },
  { label: 'Sat', value: 78 },
  { label: 'Sun', value: 76 },
];

const departmentMetrics = [
  {
    id: 'd1',
    primary: 'Emergency',
    secondary: 'Avg. LOS 4.2 hrs',
    badge: '92% occupancy',
  },
  {
    id: 'd2',
    primary: 'ICU',
    secondary: '12 critical patients',
    badge: '95% occupancy',
  },
  {
    id: 'd3',
    primary: 'Med-Surg',
    secondary: '38 discharges planned',
    badge: '81% occupancy',
  },
  {
    id: 'd4',
    primary: 'Pediatrics',
    secondary: 'Seasonal surge',
    badge: '74% occupancy',
  },
];

export default function AnalyticsPage() {
  const maxValue = Math.max(...occupancyTrend.map((item) => item.value));

  return (
    <PageShell
      title="Analytics"
      subtitle="Operational insights across departments and care pathways."
      primaryAction={
        <PortalActionButton
          label="Export dashboard"
          successTitle="Dashboard exported"
        />
      }
      secondaryActions={
        <PortalActionButton
          label="Schedule report"
          variant="outline"
          successTitle="Report scheduled"
        />
      }
    >
      <PortalMetricsGrid
        metrics={[
          { title: 'Bed occupancy', value: '87%', status: 'observation' },
          { title: 'Avg. length of stay', value: '4.6 days', status: 'stable' },
          {
            title: 'Readmission rate',
            value: '8.2%',
            description: '30-day rolling',
          },
          { title: 'Patient satisfaction', value: '4.6/5', status: 'stable' },
        ]}
      />

      <SectionHeader
        title="Occupancy trend"
        description="Weekly bed utilization (%)."
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Last 7 days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3 h-40">
            {occupancyTrend.map((item) => (
              <div
                key={item.label}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div
                  className="w-full rounded-t bg-primary/80 transition-all"
                  style={{ height: `${(item.value / maxValue) * 100}%` }}
                  title={`${item.value}%`}
                />
                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <PortalListCard
        title="Department breakdown"
        items={departmentMetrics}
        actionLabel="View details"
      />
    </PageShell>
  );
}
