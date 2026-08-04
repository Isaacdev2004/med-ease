import { bindEnterpriseRepository } from '@/services/enterprise';
import { researchMockRepository } from '@/services/research/repository.mock';

export const researchRepository = bindEnterpriseRepository(
  'research',
  researchMockRepository,
);
