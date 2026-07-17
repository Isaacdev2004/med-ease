import { useState } from 'react';

import {
  PortalActionButton,
  PortalFormField,
  PortalSettingsToggle,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import { PageShell, SectionHeader } from '@/shared/components';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export default function SettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [autoLogout, setAutoLogout] = useState(true);

  return (
    <PageShell
      title="Settings"
      subtitle="Manage notifications, security, and display preferences."
      primaryAction={
        <PortalActionButton
          label="Save all settings"
          successTitle="Settings saved"
        />
      }
    >
      <SectionHeader
        title="Notifications"
        description="Choose how you receive alerts."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <PortalSettingsToggle
          id="email-alerts"
          label="Email alerts"
          description="Critical patient and system notifications"
          checked={emailAlerts}
          onCheckedChange={setEmailAlerts}
        />
        <PortalSettingsToggle
          id="sms-alerts"
          label="SMS alerts"
          description="Urgent escalations only"
          checked={smsAlerts}
          onCheckedChange={setSmsAlerts}
        />
      </div>

      <SectionHeader
        title="Security"
        description="Authentication and session controls."
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account security</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <PortalFormField
            id="current-password"
            label="Current password"
            type="password"
          />
          <PortalFormField
            id="new-password"
            label="New password"
            type="password"
          />
          <PortalSettingsToggle
            id="auto-logout"
            label="Auto logout"
            description="Sign out after 30 minutes of inactivity"
            checked={autoLogout}
            onCheckedChange={setAutoLogout}
          />
        </CardContent>
      </Card>

      <SectionHeader
        title="Display"
        description="Appearance and localization."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <PortalSettingsToggle
          id="dark-mode"
          label="Dark mode"
          description="Use dark theme across the portal"
          checked={darkMode}
          onCheckedChange={setDarkMode}
        />
        <Card>
          <CardContent className="pt-6">
            <PortalFormField
              id="timezone"
              label="Timezone"
              defaultValue="America/New_York (EST)"
            />
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
