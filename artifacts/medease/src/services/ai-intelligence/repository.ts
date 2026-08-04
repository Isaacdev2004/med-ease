import { bindEnterpriseRepository } from '@/services/enterprise';
import { aiIntelligenceMockRepository } from '@/services/ai-intelligence/repository.mock';

export const aiIntelligenceRepository = bindEnterpriseRepository(
  'ai-intelligence',
  aiIntelligenceMockRepository,
);
