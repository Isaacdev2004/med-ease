import { bindEnterpriseRepository } from '@/services/enterprise';
import { facilitiesMockRepository } from '@/services/facilities/repository.mock';

export const facilitiesRepository = bindEnterpriseRepository(
  'facilities',
  facilitiesMockRepository,
);
