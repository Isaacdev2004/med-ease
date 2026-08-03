import { useApiAuth } from '@/services/auth/auth-service';
import { telemedicineHttpRepository } from '@/services/telemedicine/repository.http';
import { telemedicineMockRepository } from '@/services/telemedicine/repository.mock';

/** Live Nest API when auth is API-backed; mock for local demo mode. */
export const telemedicineRepository = useApiAuth
  ? telemedicineHttpRepository
  : telemedicineMockRepository;
