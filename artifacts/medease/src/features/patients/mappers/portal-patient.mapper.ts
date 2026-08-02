import type { PatientRow } from '@/features/portal-pages/data/mock-data';
import type { Patient } from '@medease/patients-contract';

function mapPortalStatus(status: Patient['status']): PatientRow['status'] {
  if (status === 'observation') return 'observation';
  if (status === 'inactive') return 'discharged';
  return 'stable';
}

export function mapPatientToPortalRow(patient: Patient): PatientRow {
  return {
    id: patient.patientId,
    name: patient.fullName,
    mrn: patient.mrn,
    ward: 'General Medicine',
    attending: '—',
    status: mapPortalStatus(patient.status),
  };
}

export function mapPatientsToPortalRows(patients: Patient[]): PatientRow[] {
  return patients.map(mapPatientToPortalRow);
}
