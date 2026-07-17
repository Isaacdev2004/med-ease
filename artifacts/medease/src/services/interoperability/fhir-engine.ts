import type {
  FhirResource,
  FhirVersion,
} from '@/services/interoperability/types';

export const FHIR_RESOURCE_TYPES = [
  'Patient',
  'Practitioner',
  'Encounter',
  'Observation',
  'Condition',
  'Procedure',
  'Medication',
  'MedicationRequest',
  'DiagnosticReport',
  'ImagingStudy',
  'ServiceRequest',
  'CarePlan',
  'Appointment',
  'Organization',
  'Location',
  'Coverage',
  'Claim',
  'Device',
  'Group',
  'Measure',
  'MeasureReport',
  'Subscription',
] as const;

export function buildFhirSearchUrl(
  baseUrl: string,
  resourceType: string,
  params?: Record<string, string>,
): string {
  const qs = params ? `?${new URLSearchParams(params).toString()}` : '';
  return `${baseUrl}/${resourceType}${qs}`;
}

export function validateFhirResource(
  resource: Partial<FhirResource>,
  version: FhirVersion,
): boolean {
  return Boolean(
    resource.resourceType && resource.resourceId && version !== undefined,
  );
}

export function bundleEntryCount(entries: unknown[]): number {
  return entries.length;
}
