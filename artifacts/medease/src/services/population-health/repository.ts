import { bindEnterpriseRepository } from '@/services/enterprise';
import { populationHealthMockRepository } from '@/services/population-health/repository.mock';

export const populationHealthRepository = bindEnterpriseRepository(
  'population-health',
  populationHealthMockRepository,
);
