import { useLocation } from 'wouter';

import { InteroperabilityShell } from '@/features/interoperability/components/InteroperabilityShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment =
  'interoperability' | 'external-records' | 'interop-fhir' | 'interop-dicom';

function resolveSegment(location: string): Segment {
  if (location.includes('/external-records')) return 'external-records';
  if (location.includes('/interop-fhir')) return 'interop-fhir';
  if (location.includes('/interop-dicom')) return 'interop-dicom';
  return 'interoperability';
}

const TITLES: Record<Segment, string> = {
  interoperability: 'Integration Status',
  'external-records': 'External Records',
  'interop-fhir': 'FHIR Exchange',
  'interop-dicom': 'DICOM Exchange',
};

export default function ProfessionalInteroperabilityPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return (
    <InteroperabilityShell
      basePath={resolveModuleBasePath(location, segment)}
      variant="professional"
      title={TITLES[segment]}
    />
  );
}
