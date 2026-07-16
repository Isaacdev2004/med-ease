import type { PatientStatus } from '@medease/patients-contract';

import { patientsService } from '@/services/patients';

export interface ProfessionalPatientSummary {
  id: string;
  fullName: string;
  mrn: string;
  status: 'active' | 'inactive' | 'observation';
  lastVisit?: string;
  department?: string;
}

function mapPatientSummary(patient: {
  patientId: string;
  fullName: string;
  mrn: string;
  status: PatientStatus;
}): ProfessionalPatientSummary {
  return {
    id: patient.patientId,
    fullName: patient.fullName,
    mrn: patient.mrn,
    status: patient.status,
  };
}

export const professionalService = {
  async listPatients(filters?: { status?: string }): Promise<ProfessionalPatientSummary[]> {
    const result = await patientsService.listPatients({
      status: filters?.status as PatientStatus | undefined,
      page: 1,
      pageSize: 100,
    });
    return result.items.map(mapPatientSummary);
  },
};
