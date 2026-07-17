import { useLocation } from 'wouter';

import { MedicationSectionContent } from '@/features/medications/components/MedicationSections';
import { getMedicationSectionFromPath } from '@/features/medications/components/MedicationTabs';
import { MedicationsShell } from '@/features/medications/components/MedicationsShell';
import { PageShell } from '@/shared/components';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

const PROFESSIONAL_SEGMENTS = [
  'medications',
  'prescriptions',
  'reconciliation',
  'administration',
  'analytics',
] as const;

function getPatientId(pathname: string): string | undefined {
  const segments = pathname.split('/').filter(Boolean);
  const idx = segments.indexOf('patient');
  return idx >= 0 ? segments[idx + 1] : undefined;
}

function resolveProfessionalSegment(
  location: string,
): (typeof PROFESSIONAL_SEGMENTS)[number] {
  for (const segment of PROFESSIONAL_SEGMENTS) {
    if (location.includes(`/${segment}`)) return segment;
  }
  return 'prescriptions';
}

export default function ProfessionalPrescriptionsPage() {
  const [location] = useLocation();
  const patientId = getPatientId(location);

  if (location.includes('/patient/') && patientId) {
    const section = getMedicationSectionFromPath(location);
    const basePath = `/patient/${patientId}/medications`;

    if (location.includes('/prescribe') || location.includes('/history')) {
      return (
        <PageShell
          title={
            location.includes('/prescribe')
              ? 'Prescribe Medication'
              : 'Medication History'
          }
          subtitle={`Patient ${patientId}`}
        >
          <MedicationSectionContent section={section} filters={{ patientId }} />
        </PageShell>
      );
    }

    return (
      <MedicationsShell
        basePath={basePath}
        variant="clinician"
        title="Patient Medications"
        patientId={patientId}
      />
    );
  }

  const segment = resolveProfessionalSegment(location);
  const basePath = resolveModuleBasePath(location, segment);
  const titles: Record<(typeof PROFESSIONAL_SEGMENTS)[number], string> = {
    medications: 'Medications Overview',
    prescriptions: 'Prescriptions',
    reconciliation: 'Medication Reconciliation',
    administration: 'Medication Administration',
    analytics: 'Medication Analytics',
  };

  return (
    <MedicationsShell
      basePath={basePath}
      variant="clinician"
      title={titles[segment]}
    />
  );
}
