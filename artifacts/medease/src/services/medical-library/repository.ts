import { useApiAuth } from '@/services/auth/auth-service';
import { medicalLibraryHttpRepository } from '@/services/medical-library/repository.http';
import { medicalLibraryMockRepository } from '@/services/medical-library/repository.mock';
import { createHybridRepository } from '@/services/repository-hybrid';

export const medicalLibraryRepository = useApiAuth
  ? createHybridRepository(
      medicalLibraryHttpRepository,
      medicalLibraryMockRepository,
    )
  : medicalLibraryMockRepository;
