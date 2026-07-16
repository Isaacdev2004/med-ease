import { useState } from 'react';

import {
  PortalActionButton,
  PortalField,
  PortalFormField,
  PortalInfoCard,
  PortalMetricsGrid,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import { MOCK_PROFILE } from '@/features/portal-pages/data/mock-data';
import { PageShell, SectionHeader } from '@/shared/components';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export default function ProfilePage() {
  const [profile, setProfile] = useState(MOCK_PROFILE);

  return (
    <PageShell
      title="Profile"
      subtitle="Your professional identity and contact details."
      primaryAction={
        <PortalActionButton
          label="Save profile"
          successTitle="Profile updated"
          successDescription="Your changes have been saved."
          onClick={() => setProfile((prev) => ({ ...prev, phone: prev.phone }))}
        />
      }
    >
      <PortalMetricsGrid
        columns={3}
        metrics={[
          { title: 'Role', value: profile.role },
          { title: 'Department', value: profile.department, status: 'stable' },
          { title: 'Facility', value: profile.facility },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Personal information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <PortalFormField id="profile-name" label="Full name" defaultValue={profile.name} />
            <PortalFormField id="profile-email" label="Email" defaultValue={profile.email} type="email" />
            <PortalFormField id="profile-phone" label="Phone" defaultValue={profile.phone} />
            <PortalFormField id="profile-license" label="License" defaultValue={profile.license} />
          </CardContent>
        </Card>

        <PortalInfoCard title="Credentials & languages">
          <PortalField label="Primary facility" value={profile.facility} />
          <div className="space-y-2">
            <span className="text-muted-foreground text-sm">Credentials</span>
            <div className="flex flex-wrap gap-2">
              {profile.credentials.map((item) => (
                <Badge key={item} variant="secondary">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-muted-foreground text-sm">Languages</span>
            <div className="flex flex-wrap gap-2">
              {profile.languages.map((item) => (
                <Badge key={item} variant="outline">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </PortalInfoCard>
      </div>

      <SectionHeader title="Recent activity" description="Account changes and verifications." />
      <PortalInfoCard title="Verification status" actionLabel="Request verification">
        <PortalField label="Identity" value="Verified" />
        <PortalField label="License" value="Verified — expires Dec 2027" />
        <PortalField label="Two-factor auth" value="Enabled" />
      </PortalInfoCard>
    </PageShell>
  );
}
