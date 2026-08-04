import { bindEnterpriseRepository } from '@/services/enterprise';
import { apiPlatformMockRepository } from '@/services/api-platform/repository.mock';

export const apiPlatformRepository = bindEnterpriseRepository(
  'api-platform',
  apiPlatformMockRepository,
);
