import { useApiAuth } from '@/services/auth/auth-service';
import { patientMonitoringHttpRepository } from '@/services/patient-monitoring/repository.http';
import { patientMonitoringMockRepository } from '@/services/patient-monitoring/repository.mock';

/** Live Nest API when auth is API-backed; mock for local demo mode. */
export const patientMonitoringRepository = useApiAuth
  ? patientMonitoringHttpRepository
  : patientMonitoringMockRepository;
