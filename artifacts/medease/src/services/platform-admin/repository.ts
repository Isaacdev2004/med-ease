import { bindEnterpriseRepository } from '@/services/enterprise';
import { platformAdminMockRepository } from '@/services/platform-admin/repository.mock';

export const platformAdminRepository = bindEnterpriseRepository(
  'platform-admin',
  platformAdminMockRepository,
);
