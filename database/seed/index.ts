import { loadDatabaseEnv } from '../load-env.js';
import { coreSeed } from './core';
import { clinicalSeed } from './clinical';
import { directoryMedicalLibrarySeed } from './directory-medical-library';
import { laboratorySeed } from './laboratory';
import { radiologySeed } from './radiology';
import { monitoringSeed } from './monitoring';
import { telemedicineSeed } from './telemedicine';
import { billingSeed } from './billing';
import { inventorySeed } from './inventory';
import { procurementSeed } from './procurement';
import { financeSeed } from './finance';
import { enterpriseSeed } from './enterprise';
import { iamSeed } from './iam';
import { identitySeed } from './identity';
import { operationsSeed } from './operations';
import { runSeedModules } from './types';

async function main() {
  loadDatabaseEnv();
  const dryRun = process.env.SEED_DRY_RUN === 'true';

  await runSeedModules(
    [
      coreSeed,
      identitySeed,
      iamSeed,
      clinicalSeed,
      directoryMedicalLibrarySeed,
      laboratorySeed,
      radiologySeed,
      monitoringSeed,
      telemedicineSeed,
      billingSeed,
      inventorySeed,
      procurementSeed,
      financeSeed,
      enterpriseSeed,
      operationsSeed,
    ],
    { dryRun },
  );

  console.log(
    JSON.stringify({ level: 'info', msg: 'Seed framework complete', dryRun }),
  );
}

main().catch((error) => {
  console.error(
    JSON.stringify({
      level: 'error',
      msg: 'Seed failed',
      error: String(error),
    }),
  );
  process.exit(1);
});
