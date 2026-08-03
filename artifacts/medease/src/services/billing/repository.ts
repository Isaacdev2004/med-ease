import { useApiAuth } from '@/services/auth/auth-service';
import { billingHttpRepository } from '@/services/billing/repository.http';
import { billingMockRepository } from '@/services/billing/repository.mock';

type BillingRepository = typeof billingMockRepository;

/** Live Nest API when auth is API-backed; mock for local demo mode. */
export const billingRepository: BillingRepository = useApiAuth
  ? (billingHttpRepository as unknown as BillingRepository)
  : billingMockRepository;
