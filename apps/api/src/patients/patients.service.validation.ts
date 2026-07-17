import type {
  CreatePatientAllergyInput,
  CreatePatientInput,
  CreatePatientPreferenceInput,
  Patient,
  UpdatePatientInput,
} from '@medease/patients-contract';
import {
  ConflictError,
  ValidationError,
} from '@workspace/repository-transport/errors';

export type RegisterPatientInput = Omit<CreatePatientInput, 'createdBy'>;

export type ValidatePatientMergeInput = {
  sourcePatientId: string;
  targetPatientId: string;
};

export type PatientMergeValidationResult = {
  valid: true;
  sourcePatient: Patient;
  targetPatient: Patient;
};

export function validateRegistrationFields(input: RegisterPatientInput): void {
  if (!input.mrn?.trim()) {
    throw new ValidationError('MRN is required');
  }
  if (!input.fullName?.trim()) {
    throw new ValidationError('Full name is required');
  }
  if (!input.dateOfBirth?.trim()) {
    throw new ValidationError('Date of birth is required');
  }
}

export function validateDuplicateIdentifiersInInput(
  identifiers: RegisterPatientInput['identifiers'],
): void {
  if (!identifiers?.length) {
    return;
  }

  const seen = new Set<string>();
  for (const identifier of identifiers) {
    const key = `${identifier.type}:${identifier.value.trim().toLowerCase()}`;
    if (seen.has(key)) {
      throw new ConflictError('Duplicate identifier in registration input', {
        details: { type: identifier.type, value: identifier.value },
      });
    }
    seen.add(key);
  }

  const primaryIdentifiers = identifiers.filter(
    (identifier) => identifier.isPrimary,
  );
  if (primaryIdentifiers.length > 1) {
    throw new ValidationError('Only one primary identifier is allowed');
  }
}

export function validateUpdateFields(input: UpdatePatientInput): void {
  if (input.mrn !== undefined && !input.mrn.trim()) {
    throw new ValidationError('MRN cannot be empty');
  }
  if (input.fullName !== undefined && !input.fullName.trim()) {
    throw new ValidationError('Full name cannot be empty');
  }
  if (input.dateOfBirth !== undefined && !input.dateOfBirth.trim()) {
    throw new ValidationError('Date of birth cannot be empty');
  }
}

export function assertPatientIsActive(patient: Patient, action: string): void {
  if (patient.deletedAt) {
    throw new ValidationError(`Cannot ${action} an archived patient`, {
      details: { patientId: patient.patientId },
    });
  }
}

export function assertPatientIsArchived(patient: Patient): void {
  if (!patient.deletedAt) {
    throw new ValidationError('Patient is not archived', {
      details: { patientId: patient.patientId },
    });
  }
}

export function assertNotAlreadyArchived(patient: Patient): void {
  if (patient.deletedAt) {
    throw new ValidationError('Patient is already archived', {
      details: { patientId: patient.patientId },
    });
  }
}

export function validateMergeCandidates(
  sourcePatient: Patient,
  targetPatient: Patient,
  input: ValidatePatientMergeInput,
): PatientMergeValidationResult {
  if (input.sourcePatientId === input.targetPatientId) {
    throw new ValidationError('Cannot merge a patient into itself');
  }

  if (sourcePatient.tenantId !== targetPatient.tenantId) {
    throw new ValidationError('Patients must belong to the same tenant');
  }

  assertPatientIsActive(sourcePatient, 'merge');
  assertPatientIsActive(targetPatient, 'merge');

  return {
    valid: true,
    sourcePatient,
    targetPatient,
  };
}

export function validateAllergyInput(input: CreatePatientAllergyInput): void {
  if (!input.allergen?.trim()) {
    throw new ValidationError('Allergen is required');
  }
}

export function validatePreferenceInput(
  input: CreatePatientPreferenceInput,
): void {
  if (input.language !== undefined && !input.language.trim()) {
    throw new ValidationError('Language cannot be empty');
  }
}
