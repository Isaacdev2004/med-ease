import { useState } from 'react';

import {
  PortalActionButton,
  PortalMetricsGrid,
  PortalListCard,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import { PageShell, SectionHeader } from '@/shared/components';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';

const initialResources = [
  { id: 'r1', primary: 'Portable ventilators', secondary: 'Respiratory therapy', badge: '8 available', count: 8 },
  { id: 'r2', primary: 'Infusion pumps', secondary: 'Med-Surg supply', badge: '24 available', count: 24 },
  { id: 'r3', primary: 'Wheelchairs', secondary: 'Patient transport', badge: '12 available', count: 12 },
  { id: 'r4', primary: 'Isolation rooms', secondary: 'Infection control', badge: '3 available', count: 3 },
];

export default function ResourcesPage() {
  const [resources, setResources] = useState(initialResources);

  return (
    <PageShell
      title="Resources"
      subtitle="Equipment, beds, and shared clinical resources."
      primaryAction={<PortalActionButton label="Request resource" successTitle="Resource request submitted" />}
    >
      <PortalMetricsGrid
        columns={3}
        metrics={[
          { title: 'Total resources', value: resources.length },
          { title: 'Low stock alerts', value: 2, status: 'observation' },
          { title: 'Pending requests', value: 5, status: 'observation' },
        ]}
      />

      <SectionHeader title="Resource inventory" description="Track availability across departments." />
      <div className="grid gap-4 md:grid-cols-2">
        {resources.map((resource) => (
          <Card key={resource.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-base">{resource.primary}</CardTitle>
                <p className="text-sm text-muted-foreground">{resource.secondary}</p>
              </div>
              <Badge variant="outline">{resource.badge}</Badge>
            </CardHeader>
            <CardContent>
              <PortalActionButton
                label="Reserve"
                variant="outline"
                successTitle={`${resource.primary} reserved`}
                onClick={() => {
                  setResources((prev) =>
                    prev.map((item) =>
                      item.id === resource.id
                        ? {
                            ...item,
                            count: Math.max(item.count - 1, 0),
                            badge: `${Math.max(item.count - 1, 0)} available`,
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
        title="Recent allocations"
        items={[
          { id: 'a1', primary: 'Ventilator → ICU-3-02', secondary: 'Allocated 09:15 by Nurse Kim', badge: 'active' },
          { id: 'a2', primary: 'Wheelchair → Med-Surg 2B', secondary: 'Returned 08:40', badge: 'returned' },
        ]}
      />
    </PageShell>
  );
}
