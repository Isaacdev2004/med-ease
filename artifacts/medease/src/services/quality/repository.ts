import { bindEnterpriseRepository } from '@/services/enterprise';
import { qualityMockRepository } from '@/services/quality/repository.mock';

export const qualityRepository = bindEnterpriseRepository(
  'quality',
  qualityMockRepository,
);
