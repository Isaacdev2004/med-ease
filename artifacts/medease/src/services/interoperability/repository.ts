import { bindEnterpriseRepository } from '@/services/enterprise';
import { interoperabilityMockRepository } from '@/services/interoperability/repository.mock';

export const interoperabilityRepository = bindEnterpriseRepository(
  'interoperability',
  interoperabilityMockRepository,
);
