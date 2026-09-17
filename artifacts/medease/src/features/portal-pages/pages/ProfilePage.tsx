import { Link } from 'wouter';

import {
  MegaProfileEditor,
  MegaProfileView,
  loadMegaProfile,
} from '@/features/patient-records/components/MegaProfileEditor';
import { useAuth } from '@/services/auth/auth-context';
import { PageShell } from '@/shared/components';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

/** Compte → Profil : lié au Profil général du Mega carnet (patient). */
export default function ProfilePage() {
  const { user } = useAuth();
  const patientId =
    user?.id ?? '01930000-0000-7000-8000-000000000301';
  const general = loadMegaProfile(patientId, 'general');
  const photo = general?.photoDataUrl;
  const displayName =
    [general?.firstName, general?.lastName].filter(Boolean).join(' ') ||
    user?.fullName ||
    'Patient';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <PageShell
      title="Mon profil"
      subtitle="Identité et coordonnées — synchronisé avec le Profil général du Mega carnet."
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
      <Card>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <Avatar className="h-16 w-16">
            {photo ? <AvatarImage src={photo} alt={displayName} /> : null}
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{displayName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {general?.email || user?.email || '—'}
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <MegaProfileView patientId={patientId} profileId="general" />
          <p className="text-xs text-muted-foreground">
            Les modifications passent par le formulaire Studio du Profil général
            (photo, identité, contacts).
          </p>
        </CardContent>
      </Card>
    </PageShell>
  );
}
