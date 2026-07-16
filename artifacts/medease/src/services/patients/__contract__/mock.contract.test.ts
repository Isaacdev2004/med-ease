import { patientsRepositoryContract } from './repository.contract';
import { patientsContractFixtures } from './fixtures/patients.fixtures';
import { patientsMockRepository } from '../repository.mock';

patientsRepositoryContract({
  name: 'mock',
  repository: patientsMockRepository,
  fixtures: patientsContractFixtures,
});
