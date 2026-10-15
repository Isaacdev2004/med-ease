import { useEffect } from 'react';
import { Link } from 'wouter';

import { usePatientId } from '@/features/patient-records/hooks/use-patient-records';
import { MegaProfileSummary } from '@/features/patient-records/components/MegaProfileSummary';
import {
  MegaProfileEditor,
  MegaProfileView,
} from '@/features/patient-records/components/MegaProfileEditor';
import { migrateMegaProfileStorage } from '@/features/patient-records/lib/mega-profile-migrate';
import { useAuth } from '@/services/auth/auth-context';
import { LoadingView, PageShell } from '@/shared/components';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

/** Compte → Profil : synchronisé avec le Profil général du Mega carnet. */
export default function ProfilePage() {
  const { user } = useAuth();
  const resolveQuery = usePatientId();
  const patientId = resolveQuery.data ?? undefined;

  useEffect(() => {
    if (user?.id && patientId) {
      migrateMegaProfileStorage(user.id, patientId);
    }
  }, [user?.id, patientId]);

  if (resolveQuery.isLoading) {
    return (
      <PageShell title="Mon profil">
        <LoadingView label="Chargement du profil…" />
      </PageShell>
    );
  }

  if (!patientId) {
    return (
      <PageShell title="Mon profil">
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Impossible de résoudre votre dossier patient. Reconnectez-vous.
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Mon profil"
      subtitle="Identité et coordonnées — synchronisé avec le Mega carnet."
      primaryAction={
        <div className="flex flex-wrap gap-2">
          <MegaProfileEditor
            patientId={patientId}
            profileId="general"
            triggerLabel="Modifier le profil général"
          />
          <Button asChild variant="outline" size="sm">
            <Link href="/records">Ouvrir le Mega carnet</Link>
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <MegaProfileSummary patientId={patientId} />
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Détail — profil général</CardTitle>
          </CardHeader>
          <CardContent>
            <MegaProfileView patientId={patientId} profileId="general" />
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
