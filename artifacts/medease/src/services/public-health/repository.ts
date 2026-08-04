import { bindEnterpriseRepository } from '@/services/enterprise';
import { publicHealthMockRepository } from '@/services/public-health/repository.mock';

export const publicHealthRepository = bindEnterpriseRepository(
  'public-health',
  publicHealthMockRepository,
);
