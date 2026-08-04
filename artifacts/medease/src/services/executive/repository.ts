import { bindEnterpriseRepository } from '@/services/enterprise';
import { executiveMockRepository } from '@/services/executive/repository.mock';

export const executiveRepository = bindEnterpriseRepository(
  'executive',
  executiveMockRepository,
);
