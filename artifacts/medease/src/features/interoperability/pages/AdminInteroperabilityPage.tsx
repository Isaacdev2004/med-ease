import { useLocation } from 'wouter';

import { InteroperabilityShell } from '@/features/interoperability/components/InteroperabilityShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'interoperability' | 'fhir-servers' | 'interop-hl7' | 'interop-dicom-admin' | 'interop-cda' | 'smart-apps' | 'api-gateway' | 'terminology' | 'integration-audit' | 'interoperability-analytics';

function resolveSegment(location: string): Segment {
  if (location.includes('/fhir-servers')) return 'fhir-servers';
  if (location.includes('/interop-hl7')) return 'interop-hl7';
  if (location.includes('/interop-dicom-admin')) return 'interop-dicom-admin';
  if (location.includes('/interop-cda')) return 'interop-cda';
  if (location.includes('/smart-apps')) return 'smart-apps';
  if (location.includes('/api-gateway')) return 'api-gateway';
  if (location.includes('/terminology')) return 'terminology';
  if (location.includes('/integration-audit')) return 'integration-audit';
  if (location.includes('/interoperability-analytics')) return 'interoperability-analytics';
  return 'interoperability';
}

const TITLES: Record<Segment, string> = {
  interoperability: 'Integration Hub',
  'fhir-servers': 'FHIR Servers',
  'interop-hl7': 'HL7 Messages',
  'interop-dicom-admin': 'DICOM Administration',
  'interop-cda': 'CDA Documents',
  'smart-apps': 'SMART Applications',
  'api-gateway': 'API Gateway',
  terminology: 'Terminology Services',
  'integration-audit': 'Integration Audit',
  'interoperability-analytics': 'Interoperability Analytics',
};

export default function AdminInteroperabilityPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return <InteroperabilityShell basePath={resolveModuleBasePath(location, segment)} variant="admin" title={TITLES[segment]} />;
}
