import { useApiAuth } from '@/services/auth/auth-service';
import { medicalLibraryHttpRepository } from '@/services/medical-library/repository.http';
import { medicalLibraryMockRepository } from '@/services/medical-library/repository.mock';

export const medicalLibraryRepository = useApiAuth
  ? medicalLibraryHttpRepository
  : medicalLibraryMockRepository;
