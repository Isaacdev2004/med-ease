import { AlertTriangle, LayoutDashboard } from 'lucide-react';

import { useAdmissionBoard, useTransfers } from '@/features/admissions/hooks/use-admissions';
import { useBedBoard } from '@/features/beds/hooks/use-beds';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Placeholder } from '@/shared/ui/placeholder';
import { LoadingView } from '@/shared/components';

export default function Dashboard() {
  const bedBoard = useBedBoard();
  const admissionBoard = useAdmissionBoard();
  const transfers = useTransfers();

  if (bedBoard.isLoading || admissionBoard.isLoading || transfers.isLoading) {
    return <LoadingView label="Loading facility operations…" />;
  }

  const summary = bedBoard.data?.summary;
  const occupancy = summary?.occupancyPercent ?? 0;
  const occupied = summary?.occupied ?? 0;
  const total = summary?.total ?? 0;
  const available = summary?.available ?? 0;

  const bedsByWard = new Map<string, { occupied: number; total: number }>();
  for (const bed of bedBoard.data?.beds ?? []) {
    const ward = bed.ward || 'General';
    const row = bedsByWard.get(ward) ?? { occupied: 0, total: 0 };
    row.total += 1;
    if (bed.status === 'occupied') row.occupied += 1;
    bedsByWard.set(ward, row);
  }

  const criticalWards = [...bedsByWard.entries()]
    .map(([ward, counts]) => ({
      ward,
      percent:
        counts.total > 0
          ? Math.round((counts.occupied / counts.total) * 1000) / 10
          : 0,
    }))
    .filter((w) => w.percent >= 90)
    .sort((a, b) => b.percent - a.percent);

  const openTransfers = (transfers.data ?? []).filter(
    (t) => t.status !== 'completed' && t.status !== 'cancelled',
  );
  const parisId = '01930000-0000-7000-8000-000000000201';
  const inbound = openTransfers.filter((t) => t.toFacilityId === parisId).length;
  const outbound = openTransfers.filter(
    (t) => t.fromFacilityId === parisId,
  ).length;

  const pendingAdmissions = admissionBoard.data?.summary?.pending ?? 0;
  const admitted = admissionBoard.data?.summary?.admitted ?? 0;

  const recentTransfers = openTransfers.slice(0, 5);

  return (
    <div className="space-y-6 motion-preset-entrance">
      <h1 className="text-3xl font-bold tracking-tight">
        Facility Operations Control
      </h1>

      {criticalWards[0] ? (
        <Alert variant="warning" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Capacity Warning</AlertTitle>
          <AlertDescription>
            {criticalWards[0].ward} is currently operating at{' '}
            {criticalWards[0].percent}% capacity. Consider diverting non-critical
            scheduled admissions.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bed Occupancy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancy}%</div>
            <p className="text-xs text-muted-foreground">
              {occupied} occupied · {available} available · {total} beds
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{admitted}</div>
            <p className="text-xs text-muted-foreground">
              {pendingAdmissions} pending admission
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Beds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{available}</div>
            <p className="text-xs text-muted-foreground">
              Ready for assignment
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Transfers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTransfers.length}</div>
            <p className="text-xs text-muted-foreground">
              {inbound} inbound, {outbound} outbound
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <Card className="lg:col-span-4 flex flex-col">
          <CardHeader>
            <CardTitle>Ward Occupancy</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-80 lg:min-h-96">
            {bedsByWard.size === 0 ? (
              <Placeholder
                icon={LayoutDashboard}
                title="No bed board data"
                description="Bed occupancy by ward will appear when beds are seeded for this facility."
                className="flex-1"
              />
            ) : (
              <ul className="space-y-3">
                {[...bedsByWard.entries()]
                  .map(([ward, counts]) => ({
                    ward,
                    percent:
                      counts.total > 0
                        ? Math.round((counts.occupied / counts.total) * 1000) /
                          10
                        : 0,
                    ...counts,
                  }))
                  .sort((a, b) => b.percent - a.percent)
                  .map((row) => (
                    <li key={row.ward} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{row.ward}</span>
                        <span className="text-muted-foreground">
                          {row.occupied}/{row.total} ({row.percent}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${Math.min(row.percent, 100)}%` }}
                        />
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTransfers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No open transfers right now.
              </p>
            ) : (
              <div className="space-y-4 border-l-2 border-muted ml-3">
                {recentTransfers.map((transfer) => (
                  <div
                    key={transfer.id}
                    className="relative pl-6 pb-4 last:pb-0"
                  >
                    <span className="absolute left-[-5px] top-1 h-2 w-2 rounded-full bg-primary ring-4 ring-background" />
                    <p className="text-sm font-medium leading-none mb-1">
                      {transfer.patientName ?? 'Patient transfer'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {transfer.fromFacilityName} → {transfer.toFacilityName} ·{' '}
                      {transfer.status.replaceAll('_', ' ')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
