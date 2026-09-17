import { Link } from 'wouter';

import { MedicationCard } from '@/features/medical-library/components/MedicationCard';
import { MedicationTabs } from '@/features/medical-library/components/MedicationTabs';
import type { MedicationRecord } from '@/services/medical-library/medical-library.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface MedicationProfileProps {
  medication: MedicationRecord;
  related: MedicationRecord[];
  portalBase: string;
}

/** Fiche médicament — champs BDPM / Studio. */
export function MedicationProfile({
  medication,
  related,
  portalBase,
}: MedicationProfileProps) {
  const statusLabel = medication.available
    ? medication.prescriptionRequired
      ? 'Sur ordonnance'
      : 'Disponible'
    : 'Indisponible';

  const rows: { label: string; value: string }[] = [
    { label: 'Nom', value: medication.name },
    { label: 'DCI', value: medication.genericName },
    { label: 'Dosage', value: medication.strength },
    { label: 'Forme', value: medication.dosageForm },
    {
      label: 'Laboratoire',
      value: medication.manufacturer ?? '—',
    },
    {
      label: 'Présentation',
      value: medication.description || medication.administration?.[0] || '—',
    },
    {
      label: 'Indication',
      value: medication.indications.slice(0, 3).join(' · ') || '—',
    },
    {
      label: 'Effets secondaires',
      value: medication.sideEffects.slice(0, 3).join(' · ') || '—',
    },
    { label: 'Statut', value: statusLabel },
    {
      label: 'Notice',
      value:
        medication.patientInformation ||
        medication.professionalInformation ||
        'Notice non fournie (MVP).',
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Fiche médicament</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
            {rows.map((row) => (
              <div key={row.label} className={row.label === 'Notice' || row.label === 'Indication' || row.label === 'Effets secondaires' ? 'sm:col-span-2' : undefined}>
                <p className="text-muted-foreground">{row.label}</p>
                <p className="font-medium whitespace-pre-wrap">{row.value}</p>
              </div>
            ))}
            {medication.bdpmId ? (
              <div className="sm:col-span-2 space-y-1">
                <p className="text-muted-foreground">Identifiant BDPM / CIS</p>
                <p className="font-medium">{medication.bdpmId}</p>
                <a
                  className="text-sm text-primary underline"
                  href={`https://base-donnees-publique.medicaments.gouv.fr/affichageDoc.php?specid=${medication.bdpmId}&typedoc=N`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Voir la notice officielle (BDPM)
                </a>
              </div>
            ) : null}
          </CardContent>
        </Card>
        <MedicationTabs medication={medication} />
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Laboratoire :</span>{' '}
              {medication.manufacturer ?? '—'}
            </p>
            <p>
              <span className="font-medium">Voie :</span> {medication.route}
            </p>
            <p>
              <span className="font-medium">Classe :</span>{' '}
              {medication.therapeuticClass}
            </p>
            <p>
              <span className="font-medium">Mis à jour :</span>{' '}
              {new Date(medication.updatedAt).toLocaleDateString('fr-FR')}
            </p>
          </CardContent>
        </Card>
        {related.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Médicaments liés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {related.map((med) => (
                <Link
                  key={med.id}
                  href={`${portalBase}/medical-library/${med.id}`}
                  className="block text-sm font-medium hover:underline"
                >
                  {med.name}
                </Link>
              ))}
            </CardContent>
          </Card>
        ) : null}
        {related.length > 0 ? (
          <div className="grid gap-3">
            {related.slice(0, 2).map((med) => (
              <MedicationCard
                key={med.id}
                medication={med}
                portalBase={portalBase}
                compact
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
