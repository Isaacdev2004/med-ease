import { Link } from 'wouter';

import { MedicationCard } from '@/features/medical-library/components/MedicationCard';
import { MedicationTabs } from '@/features/medical-library/components/MedicationTabs';
import type { MedicationRecord } from '@/services/medical-library/medical-library.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface MedicationProfileProps {
  medication: MedicationRecord;
  related: MedicationRecord[];
  portalBase: string;
}

export function MedicationProfile({
  medication,
  related,
  portalBase,
}: MedicationProfileProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <MedicationTabs medication={medication} />
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Medication Sidebar</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>
              <span className="font-medium">Manufacturer:</span>{' '}
              {medication.manufacturer ?? '—'}
            </p>
            <p>
              <span className="font-medium">Route:</span> {medication.route}
            </p>
            <p>
              <span className="font-medium">Updated:</span>{' '}
              {new Date(medication.updatedAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
        {related.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Related Medications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {related.map((med) => (
                <Link
                  key={med.id}
                  href={`${portalBase}/medical-library/${med.id}`}
                  className="block text-sm font-medium hover:underline"
                >
                  {med.name}
                </Link>
              ))}
            </CardContent>
          </Card>
        ) : null}
        {related.length > 0 ? (
          <div className="grid gap-3">
            {related.slice(0, 2).map((med) => (
              <MedicationCard
                key={med.id}
                medication={med}
                portalBase={portalBase}
                compact
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
