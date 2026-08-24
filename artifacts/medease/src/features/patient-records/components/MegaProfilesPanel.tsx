import { Link } from 'wouter';
import { FileText, HeartPulse, Shield, Users, Activity } from 'lucide-react';

import {
  MegaProfileEditor,
  MegaProfileView,
  type MegaProfileId,
} from '@/features/patient-records/components/MegaProfileEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';

/** Five fillable/viewable Mega Carnet profiles (client success criterion). */
export const MEGA_PROFILES = [
  {
    id: 'medical' as const satisfies MegaProfileId,
    label: 'Profil médical',
    description: 'Identité, résumé clinique, allergies, traitements.',
    segment: 'profile',
    icon: FileText,
  },
  {
    id: 'emergency' as const satisfies MegaProfileId,
    label: "Profil d'urgence",
    description: 'Contacts d’urgence, directives, alertes critiques.',
    segment: 'emergency',
    icon: Shield,
  },
  {
    id: 'family' as const satisfies MegaProfileId,
    label: 'Profil familial',
    description: 'Antécédents familiaux renseignables et consultables.',
    segment: 'family-history',
    icon: Users,
  },
  {
    id: 'lifestyle' as const satisfies MegaProfileId,
    label: 'Profil mode de vie',
    description: 'Habitudes, activité, facteurs de risque.',
    segment: 'lifestyle',
    icon: Activity,
  },
  {
    id: 'vitals' as const satisfies MegaProfileId,
    label: 'Profil constantes',
    description: 'Constantes vitales et suivi longitudinal.',
    segment: 'vitals',
    icon: HeartPulse,
  },
];

interface MegaProfilesPanelProps {
  basePath: string;
  patientId: string;
}

export function MegaProfilesPanel({
  basePath,
  patientId,
}: MegaProfilesPanelProps) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          Mega carnet — 5 profils
        </h2>
        <p className="text-sm text-muted-foreground">
          Profils renseignables et consultables — créez ou modifiez chaque
          profil, puis consultez le détail.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {MEGA_PROFILES.map((profile) => (
          <Card key={profile.id} className="flex flex-col">
            <CardHeader className="pb-2">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <profile.icon className="h-5 w-5" />
              </div>
              <CardTitle className="text-sm">{profile.label}</CardTitle>
            </CardHeader>
            <CardContent className="mt-auto space-y-3 pt-0">
              <p className="text-xs text-muted-foreground">
                {profile.description}
              </p>
              <MegaProfileView patientId={patientId} profileId={profile.id} />
              <div className="flex flex-col gap-2">
                <MegaProfileEditor
                  patientId={patientId}
                  profileId={profile.id}
                  triggerLabel="Créer / Modifier"
                />
                <Button asChild size="sm" variant="outline" className="w-full">
                  <Link href={`${basePath}/${profile.segment}`}>
                    Consulter la fiche
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
