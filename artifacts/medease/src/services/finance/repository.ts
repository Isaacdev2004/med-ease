import { useApiAuth } from '@/services/auth/auth-service';
import { financeHttpRepository } from '@/services/finance/repository.http';
import { financeMockRepository } from '@/services/finance/repository.mock';

type FinanceRepository = typeof financeMockRepository;

/** Live Nest API when auth is API-backed; mock for local demo mode. */
export const financeRepository: FinanceRepository = useApiAuth
  ? (financeHttpRepository as unknown as FinanceRepository)
  : financeMockRepository;
