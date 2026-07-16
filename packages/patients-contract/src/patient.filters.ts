import type { PatientStatus } from './patient.types';

export interface PatientFilters {
  q?: string;
  status?: PatientStatus;
  facilityId?: string;
  userId?: string;
  primaryProviderId?: string;
  includeArchived?: boolean;
  page?: number;
  pageSize?: number;
}

export interface PatientSearchFilters extends PatientFilters {
  q: string;
}
