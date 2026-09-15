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
    return <LoadingView label="Chargement des paramètres…" />;
  }

  return (
    <PageShell
      title="Paramètres"
      subtitle="Notifications, sécurité et affichage."
      primaryAction={
        <PortalActionButton
          label={save.isPending ? 'Enregistrement…' : 'Enregistrer'}
          successTitle="Paramètres enregistrés"
          onClick={() => {
            if (useApiAuth) save.mutate();
          }}
        />
      }
    >
      <SectionHeader
        title="Notifications"
        description="Choisissez comment recevoir les alertes."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <PortalSettingsToggle
          id="email-alerts"
          label="Alertes e-mail"
          description="Notifications importantes sur votre parcours"
          checked={prefs.emailAlerts}
          onCheckedChange={(emailAlerts) =>
            setPrefs((p) => ({ ...p, emailAlerts }))
          }
        />
        <PortalSettingsToggle
          id="sms-alerts"
          label="Alertes SMS"
          description="Urgences uniquement"
          checked={prefs.smsAlerts}
          onCheckedChange={(smsAlerts) => setPrefs((p) => ({ ...p, smsAlerts }))}
        />
      </div>

      <SectionHeader
        title="Sécurité"
        description="Authentification et session."
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sécurité du compte</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <PortalFormField
            id="current-password"
            label="Mot de passe actuel"
            type="password"
          />
          <PortalFormField
            id="new-password"
            label="Nouveau mot de passe"
            type="password"
          />
          <PortalSettingsToggle
            id="auto-logout"
            label="Déconnexion automatique"
            description="Se déconnecter après 30 min d’inactivité"
            checked={prefs.autoLogout}
            onCheckedChange={(autoLogout) =>
              setPrefs((p) => ({ ...p, autoLogout }))
            }
          />
        </CardContent>
      </Card>

      <SectionHeader title="Affichage" description="Apparence de l’interface." />
      <PortalSettingsToggle
        id="dark-mode"
        label="Mode sombre"
        description="Utiliser un thème sombre"
        checked={prefs.darkMode}
        onCheckedChange={(darkMode) => setPrefs((p) => ({ ...p, darkMode }))}
      />
    </PageShell>
  );
}
