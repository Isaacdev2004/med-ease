import { useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { FileQuestion } from 'lucide-react';

import { ComparisonDrawer } from '@/features/medical-library/components/ComparisonDrawer';
import { FavoriteButton } from '@/features/medical-library/components/FavoriteButton';
import { MedicationHeader } from '@/features/medical-library/components/MedicationHeader';
import { MedicationProfile } from '@/features/medical-library/components/MedicationProfile';
import {
  useMedication,
  useMedicationFavorites,
  useRelatedMedications,
} from '@/features/medical-library/hooks/use-medical-library';
import { getMedicationIdFromPath } from '@/features/medical-library/utils/medical-library-path';
import { LoadingView, PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';
import { Button } from '@/shared/ui/button';

export default function MedicationProfilePage() {
  const [location] = useLocation();
  const [compareOpen, setCompareOpen] = useState(false);
  const medicationId = getMedicationIdFromPath(location) ?? '';
  const portalBase = '';
  const backHref = '/medical-library';

  const medicationQuery = useMedication(medicationId);
  const relatedQuery = useRelatedMedications(medicationId);
  const favoritesQuery = useMedicationFavorites();

  const isFavorite = useMemo(
    () => (favoritesQuery.data ?? []).some((m) => m.id === medicationId),
    [favoritesQuery.data, medicationId],
  );

  if (medicationQuery.isLoading) {
    return (
      <PageShell title="Fiche médicament">
        <LoadingView label="Chargement de la fiche…" />
      </PageShell>
    );
  }

  if (!medicationQuery.data) {
    return (
      <PageShell title="Fiche médicament">
        <EmptyState
          icon={FileQuestion}
          title="Médicament introuvable"
          description="Ce médicament n'est pas dans la bibliothèque ou vous n'avez pas l'autorisation de le consulter."
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={medicationQuery.data.name}
      subtitle="Fiche de référence médicament (nom, DCI, posologie)"
    >
      <MedicationHeader
        medication={medicationQuery.data}
        backHref={backHref}
        actions={
          <>
            <FavoriteButton
              medicationId={medicationId}
              isFavorite={isFavorite}
              size="sm"
            />
            <Button size="sm" onClick={() => setCompareOpen(true)}>
              Comparer
            </Button>
          </>
        }
      />
      <ComparisonDrawer
        open={compareOpen}
        onOpenChange={setCompareOpen}
        primary={medicationQuery.data}
        candidates={relatedQuery.data ?? []}
      />
      <div className="mt-8">
        <MedicationProfile
          medication={medicationQuery.data}
          related={relatedQuery.data ?? []}
          portalBase={portalBase}
        />
      </div>
    </PageShell>
  );
}
