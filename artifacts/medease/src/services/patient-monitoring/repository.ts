import { useApiAuth } from '@/services/auth/auth-service';
import { createHybridRepository } from '@/services/repository-hybrid';
import { patientMonitoringHttpRepository } from '@/services/patient-monitoring/repository.http';
import { patientMonitoringMockRepository } from '@/services/patient-monitoring/repository.mock';

/** Live Nest API with mock fallback when auth is API-backed. */
export const patientMonitoringRepository = useApiAuth
  ? createHybridRepository(
      patientMonitoringHttpRepository,
      patientMonitoringMockRepository,
    )
  : patientMonitoringMockRepository;
