import { useApiAuth } from '@/services/auth/auth-service';
import { directoryHttpRepository } from '@/services/directory/repository.http';
import { directoryMockRepository } from '@/services/directory/repository.mock';
import { createHybridRepository } from '@/services/repository-hybrid';

export const directoryRepository = useApiAuth
  ? createHybridRepository(directoryHttpRepository, directoryMockRepository)
  : directoryMockRepository;
