import { bindEnterpriseRepository } from '@/services/enterprise';
import { messagingMockRepository } from '@/services/messaging/repository.mock';

export const messagingRepository = bindEnterpriseRepository(
  'messaging',
  messagingMockRepository,
);
