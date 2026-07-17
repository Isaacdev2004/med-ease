import { useState } from 'react';

import {
  PortalActionButton,
  PortalMetricsGrid,
  PortalListCard,
  PortalStatusBadge,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import { PageShell, SectionHeader } from '@/shared/components';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';

const initialWards = [
  {
    id: 'w1',
    primary: 'ICU-3',
    secondary: '12 / 14 beds',
    badge: '86%',
    capacity: 86,
  },
  {
    id: 'w2',
    primary: 'Emergency',
    secondary: '28 / 32 beds',
    badge: '88%',
    capacity: 88,
  },
  {
    id: 'w3',
    primary: 'Med-Surg 2B',
    secondary: '18 / 24 beds',
    badge: '75%',
    capacity: 75,
  },
  {
    id: 'w4',
    primary: 'Pediatrics',
    secondary: '9 / 16 beds',
    badge: '56%',
    capacity: 56,
  },
];

export default function CapacityPage() {
  const [wards, setWards] = useState(initialWards);
  const overall = Math.round(
    wards.reduce((sum, w) => sum + w.capacity, 0) / wards.length,
  );

  return (
    <PageShell
      title="Capacity"
      subtitle="Ward-level capacity planning and surge readiness."
      primaryAction={
        <PortalActionButton
          label="Open surge plan"
          successTitle="Surge plan activated"
        />
      }
    >
      <PortalMetricsGrid
        columns={3}
        metrics={[
          {
            title: 'Overall occupancy',
            value: `${overall}%`,
            status: overall > 85 ? 'observation' : 'stable',
          },
          { title: 'Available beds', value: 42, status: 'stable' },
          {
            title: 'Projected peak',
            value: '94%',
            description: 'Next 48 hours',
            status: 'observation',
          },
        ]}
      />

      <SectionHeader
        title="Ward capacity"
        description="Current utilization by unit."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {wards.map((ward) => (
          <Card key={ward.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">{ward.primary}</CardTitle>
              <PortalStatusBadge
                label={ward.capacity > 85 ? 'high' : 'normal'}
                variant={ward.capacity > 85 ? 'destructive' : 'secondary'}
              />
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{ward.secondary}</p>
              <Progress value={ward.capacity} />
              <PortalActionButton
                label="Adjust capacity"
                variant="outline"
                successTitle={`${ward.primary} capacity updated`}
                onClick={() => {
                  setWards((prev) =>
                    prev.map((item) =>
                      item.id === ward.id
                        ? {
                            ...item,
                            capacity: Math.min(item.capacity + 2, 100),
                          }
                        : item,
                    ),
                  );
                }}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <PortalListCard
        title="Transfer recommendations"
        items={[
          {
            id: 'r1',
            primary: 'Med-Surg 4A → Rehab',
            secondary: '3 patients eligible for step-down',
            badge: 'suggested',
          },
          {
            id: 'r2',
            primary: 'ICU-3 overflow',
            secondary: 'Consider step-down to CCU',
            badge: 'urgent',
          },
        ]}
        actionLabel="Apply recommendations"
      />
    </PageShell>
  );
}
