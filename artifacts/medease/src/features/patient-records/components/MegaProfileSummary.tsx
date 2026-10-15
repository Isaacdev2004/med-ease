import { useMemo } from 'react';

import {
  MegaProfileEditor,
  loadMegaProfile,
  megaProfileCompletion,
} from '@/features/patient-records/components/MegaProfileEditor';
import { useMegaProfileRevision } from '@/features/patient-records/lib/mega-profile-events';
import { isGeneralProfileComplete } from '@/features/patient-records/lib/mega-profile-migrate';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export function MegaProfileSummary({ patientId }: { patientId: string }) {
  const revision = useMegaProfileRevision(patientId);
  const general = useMemo(
    () => loadMegaProfile(patientId, 'general'),
    [patientId, revision],
  );
  const completion = useMemo(
    () => megaProfileCompletion(patientId),
    [patientId, revision],
  );
  const complete = isGeneralProfileComplete(patientId);

  const displayName = complete
    ? [general?.firstName, general?.lastName].filter(Boolean).join(' ')
    : '';
  const initials = displayName
    ? displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  if (!complete) {
    return (
      <Card className="border-dashed border-primary/40 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Créez votre profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Votre Mega carnet est vierge. Commencez par le profil général (nom,
            prénom, date de naissance, contacts).
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <MegaProfileEditor
              patientId={patientId}
              profileId="general"
              triggerLabel="Créer mon profil général"
            />
            <span className="text-xs">Complétion : {completion} %</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
        <Avatar className="h-14 w-14">
          {general?.photoDataUrl ? (
            <AvatarImage src={general.photoDataUrl} alt={displayName} />
          ) : null}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <CardTitle className="text-xl">{displayName}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {[general?.birthDate, general?.city].filter(Boolean).join(' · ') ||
              'Profil général'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Complétion du profil : {completion} %
          </p>
        </div>
        <MegaProfileEditor
          patientId={patientId}
          profileId="general"
          triggerLabel="Modifier"
        />
      </CardHeader>
      <CardContent className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Téléphone', value: general?.phone },
          { label: 'E-mail', value: general?.email },
          { label: 'Adresse', value: general?.address },
          { label: 'Langue', value: general?.language },
        ]
          .filter((row) => row.value)
          .map((row) => (
            <div key={row.label}>
              <p className="text-muted-foreground">{row.label}</p>
              <p className="font-medium">{row.value}</p>
            </div>
          ))}
      </CardContent>
    </Card>
  );
}
