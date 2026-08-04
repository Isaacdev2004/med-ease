import { bindEnterpriseRepository } from '@/services/enterprise';
import { reportingMockRepository } from '@/services/reporting/repository.mock';

export const reportingRepository = bindEnterpriseRepository(
  'reporting',
  reportingMockRepository,
);
