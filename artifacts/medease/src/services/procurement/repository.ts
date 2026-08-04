import { useApiAuth } from '@/services/auth/auth-service';
import { procurementHttpRepository } from '@/services/procurement/repository.http';
import { procurementMockRepository } from '@/services/procurement/repository.mock';

type ProcurementRepository = typeof procurementMockRepository;

/** Live Nest API when auth is API-backed; mock for local demo mode. */
export const procurementRepository: ProcurementRepository = useApiAuth
  ? (procurementHttpRepository as unknown as ProcurementRepository)
  : procurementMockRepository;
