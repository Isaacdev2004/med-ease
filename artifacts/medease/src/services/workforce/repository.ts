import { bindEnterpriseRepository } from '@/services/enterprise';
import { workforceMockRepository } from '@/services/workforce/repository.mock';

export const workforceRepository = bindEnterpriseRepository(
  'workforce',
  workforceMockRepository,
);
