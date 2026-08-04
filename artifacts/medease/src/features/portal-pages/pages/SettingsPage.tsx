import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  PortalActionButton,
  PortalFormField,
  PortalSettingsToggle,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import { useApiAuth } from '@/services/auth/auth-service';
import { fetchPreferences, savePreferences } from '@/services/enterprise';
import { LoadingView, PageShell, SectionHeader } from '@/shared/components';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

type Prefs = {
  emailAlerts: boolean;
  smsAlerts: boolean;
  darkMode: boolean;
  autoLogout: boolean;
};

const DEFAULTS: Prefs = {
  emailAlerts: true,
  smsAlerts: false,
  darkMode: false,
  autoLogout: true,
};

export default function SettingsPage() {
  const client = useQueryClient();
  const remote = useQuery({
    queryKey: ['settings', 'preferences'],
    queryFn: async () => {
      const raw = (await fetchPreferences()) as Partial<Prefs>;
      return { ...DEFAULTS, ...raw };
    },
    enabled: useApiAuth,
  });

  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);

  useEffect(() => {
    if (remote.data) setPrefs(remote.data);
  }, [remote.data]);

  const save = useMutation({
    mutationFn: () => savePreferences(prefs),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ['settings', 'preferences'] });
    },
  });

  if (useApiAuth && remote.isLoading) {
    return <LoadingView label="Loading settings…" />;
  }

  return (
    <PageShell
      title="Settings"
      subtitle="Manage notifications, security, and display preferences."
      primaryAction={
        <PortalActionButton
          label={save.isPending ? 'Saving…' : 'Save all settings'}
          successTitle="Settings saved"
          onClick={() => {
            if (useApiAuth) save.mutate();
          }}
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
          checked={prefs.emailAlerts}
          onCheckedChange={(emailAlerts) =>
            setPrefs((p) => ({ ...p, emailAlerts }))
          }
        />
        <PortalSettingsToggle
          id="sms-alerts"
          label="SMS alerts"
          description="Urgent escalations only"
          checked={prefs.smsAlerts}
          onCheckedChange={(smsAlerts) => setPrefs((p) => ({ ...p, smsAlerts }))}
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
            checked={prefs.autoLogout}
            onCheckedChange={(autoLogout) =>
              setPrefs((p) => ({ ...p, autoLogout }))
            }
          />
        </CardContent>
      </Card>

      <SectionHeader title="Display" description="Appearance and localization." />
      <PortalSettingsToggle
        id="dark-mode"
        label="Dark mode"
        description="Use a darker color scheme"
        checked={prefs.darkMode}
        onCheckedChange={(darkMode) => setPrefs((p) => ({ ...p, darkMode }))}
      />
    </PageShell>
  );
}
