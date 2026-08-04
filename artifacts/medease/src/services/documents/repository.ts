import { bindEnterpriseRepository } from '@/services/enterprise';
import { documentMockRepository } from '@/services/documents/repository.mock';

export const documentRepository = bindEnterpriseRepository(
  'documents',
  documentMockRepository,
);
