import { useState } from 'react';
import { Link } from 'wouter';
import {
  FileText,
  HeartPulse,
  Shield,
  Syringe,
  Landmark,
} from 'lucide-react';

import {
  MegaProfileEditor,
  MegaProfileView,
  megaProfileCompletion,
  type MegaProfileId,
} from '@/features/patient-records/components/MegaProfileEditor';
import { nestedModuleTabHref } from '@/shared/hooks/use-portal-path';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';

export const MEGA_PROFILES = [
  {
    id: 'general' as const satisfies MegaProfileId,
    label: 'Général',
    description: 'Identité, contacts, langue, personne de confiance.',
    segment: 'profile',
    icon: FileText,
  },
  {
    id: 'administratif' as const satisfies MegaProfileId,
    label: 'Administratif',
    description: 'Adresse, assurance, mutuelle, médecins.',
    segment: 'summary',
    icon: Landmark,
  },
  {
    id: 'urgence' as const satisfies MegaProfileId,
    label: 'Urgence',
    description: 'Groupe sanguin, allergies graves, consignes critiques.',
    segment: 'emergency',
    icon: Shield,
  },
  {
    id: 'physique' as const satisfies MegaProfileId,
    label: 'Physique',
    description: 'Taille, poids, mobilité, aides techniques.',
    segment: 'vitals',
    icon: HeartPulse,
  },
  {
    id: 'vaccination' as const satisfies MegaProfileId,
    label: 'Vaccination',
    description: 'Carnet vaccinal — dates, lots, prochaines doses.',
    segment: 'immunizations',
    icon: Syringe,
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
  const [, setTick] = useState(0);
  const completion = megaProfileCompletion(patientId);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          Mega carnet — 5 profils
        </h2>
        <p className="text-sm text-muted-foreground">
          Formulaires Studio : créer, modifier et consulter chaque profil.
        </p>
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-xs text-muted-foreground">
            <span>Complétude du profil</span>
            <span>{completion} %</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
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
                  triggerLabel={
                    profile.id === 'vaccination'
                      ? 'Ajouter une vaccination'
                      : 'Créer / Modifier'
                  }
                  onSaved={() => setTick((t) => t + 1)}
                />
                <Button asChild size="sm" variant="outline" className="w-full">
                  <Link href={nestedModuleTabHref(basePath, profile.segment)}>
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
