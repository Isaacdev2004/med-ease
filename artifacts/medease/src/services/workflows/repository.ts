import { bindEnterpriseRepository } from '@/services/enterprise';
import { workflowMockRepository } from '@/services/workflows/repository.mock';

export const workflowRepository = bindEnterpriseRepository(
  'workflows',
  workflowMockRepository,
);
