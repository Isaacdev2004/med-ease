import { useState } from 'react';

import {
  PortalActionButton,
  PortalField,
  PortalFormField,
  PortalInfoCard,
  PortalMetricsGrid,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import { MOCK_EMERGENCY_PROFILE } from '@/features/portal-pages/data/mock-data';
import { PageShell, SectionHeader } from '@/shared/components';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export default function EmergencyProfilePage() {
  const [profile, setProfile] = useState(MOCK_EMERGENCY_PROFILE);

  return (
    <PageShell
      title="Emergency Profile"
      subtitle="Critical health information for first responders and ER staff."
      primaryAction={
        <PortalActionButton
          label="Save emergency profile"
          successTitle="Emergency profile updated"
          onClick={() => setProfile((prev) => ({ ...prev }))}
        />
      }
    >
      <PortalMetricsGrid
        columns={3}
        metrics={[
          { title: 'Blood type', value: profile.bloodType, status: 'critical' },
          { title: 'Allergies', value: profile.allergies.length, status: 'observation' },
          { title: 'Active conditions', value: profile.conditions.length },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <PortalInfoCard title="Allergies & conditions">
          <div className="space-y-2">
            <span className="text-muted-foreground text-sm">Allergies</span>
            <div className="flex flex-wrap gap-2">
              {profile.allergies.map((item) => (
                <Badge key={item} variant="destructive">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-muted-foreground text-sm">Conditions</span>
            <div className="flex flex-wrap gap-2">
              {profile.conditions.map((item) => (
                <Badge key={item} variant="secondary">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </PortalInfoCard>

        <PortalInfoCard title="Emergency contact">
          <PortalField label="Name" value={profile.emergencyContact.name} />
          <PortalField label="Relation" value={profile.emergencyContact.relation} />
          <PortalField label="Phone" value={profile.emergencyContact.phone} />
          <PortalActionButton label="Notify contact" variant="outline" successTitle="Emergency contact notified" />
        </PortalInfoCard>
      </div>

      <SectionHeader title="Current medications" description="Active prescriptions for emergency reference." />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Medication list</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {profile.medications.map((med) => (
            <div key={med} className="flex items-center justify-between border-b pb-2 last:border-0 text-sm">
              <span>{med}</span>
              <Badge variant="outline">Active</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 grid gap-4 sm:grid-cols-2">
          <PortalFormField id="primary-care" label="Primary care provider" defaultValue={profile.primaryCare} />
          <PortalFormField id="insurance" label="Insurance" defaultValue={profile.insurance} />
        </CardContent>
      </Card>
    </PageShell>
  );
}
