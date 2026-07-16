import { Link, useLocation } from 'wouter';

import { MedicationDetailSection } from '@/features/medications/components/MedicationSections';
import { InteractionAlert } from '@/features/medications/components/MedicationComponents';
import { useMedication, useMedicationInteractions } from '@/features/medications/hooks/use-medications';
import { LoadingView, PageShell } from '@/shared/components';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';

function getMedicationId(pathname: string): string | undefined {
  const segments = pathname.split('/').filter(Boolean);
  const idx = segments.indexOf('medications');
  if (idx === -1) return undefined;
  const candidate = segments[idx + 1];
  const reserved = new Set(['today', 'calendar', 'history', 'refills', 'reminders', 'logs']);
  if (!candidate || reserved.has(candidate)) return undefined;
  return candidate;
}

export default function MedicationDetailPage() {
  const [location] = useLocation();
  const medicationId = getMedicationId(location);
  const query = useMedication(medicationId);
  const interactions = useMedicationInteractions(query.data?.patientId);
  const listPath = resolveModuleBasePath(location, 'medications');

  if (query.isLoading) {
    return (
      <PageShell title="Medication Details">
        <LoadingView label="Loading medication…" />
      </PageShell>
    );
  }

  if (!query.data) {
    return (
      <PageShell title="Medication Details">
        <EmptyState title="Medication not found" description="Unable to load medication details." />
      </PageShell>
    );
  }

  const relatedInteractions = (interactions.data ?? []).filter(
    (i) => i.active && (i.source === query.data!.name || i.target === query.data!.name),
  );

  return (
    <PageShell
      title={query.data.name}
      subtitle={`${query.data.dose} · ${query.data.frequency}`}
      secondaryActions={
        <Button variant="outline" asChild>
          <Link href={listPath}>Back to medications</Link>
        </Button>
      }
    >
      <div className="space-y-6">
        {relatedInteractions.map((i) => (
          <InteractionAlert key={i.id} interaction={i} />
        ))}
        <MedicationDetailSection medication={query.data} />
      </div>
    </PageShell>
  );
}
