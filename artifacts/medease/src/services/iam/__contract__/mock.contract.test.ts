import { iamRepositoryContract } from './repository.contract';
import { iamContractFixtures } from './fixtures/iam.fixtures';
import { iamMockRepository } from '../repository.mock';

iamRepositoryContract({
  name: 'mock',
  repository: iamMockRepository,
  fixtures: iamContractFixtures,
});
