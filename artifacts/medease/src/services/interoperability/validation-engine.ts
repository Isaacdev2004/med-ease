import type { ValidationResult, ValidationStatus } from '@/services/interoperability/types';

export function validateResource(format: 'fhir' | 'hl7' | 'cda' | 'dicom' | 'json', issueCount: number): ValidationStatus {
  if (issueCount === 0) return 'valid';
  if (issueCount <= 2) return 'warning';
  return 'invalid';
}

export function buildValidationResult(
  resourceType: string,
  resourceId: string,
  issues: string[],
): ValidationResult {
  return {
    validationId: `val-${Date.now()}`,
    resourceType,
    resourceId,
    status: validateResource('fhir', issues.length),
    issueCount: issues.length,
    validatedAt: new Date().toISOString(),
    issues,
  };
}
