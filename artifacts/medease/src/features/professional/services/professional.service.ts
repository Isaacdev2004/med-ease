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
  async listPatients(filters?: {
    status?: string;
    q?: string;
  }): Promise<ProfessionalPatientSummary[]> {
    const baseFilters = {
      status: filters?.status as PatientStatus | undefined,
      page: 1,
      pageSize: 100,
    };

    const query = filters?.q?.trim();
    const result = query
      ? await patientsService.searchPatients({ ...baseFilters, q: query })
      : await patientsService.listPatients(baseFilters);

    return result.items.map(mapPatientSummary);
  },
};
