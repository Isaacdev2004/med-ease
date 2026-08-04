import { bindEnterpriseRepository } from '@/services/enterprise';
import { cdssMockRepository } from '@/services/cdss/repository.mock';

export const cdssRepository = bindEnterpriseRepository(
  'cdss',
  cdssMockRepository,
);
