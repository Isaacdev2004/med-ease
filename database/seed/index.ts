import { coreSeed } from './core';
import { clinicalSeed } from './clinical';
import { iamSeed } from './iam';
import { identitySeed } from './identity';
import { operationsSeed } from './operations';
import { runSeedModules } from './types';

async function main() {
  const dryRun = process.env.SEED_DRY_RUN === 'true';

  await runSeedModules([coreSeed, identitySeed, iamSeed, clinicalSeed, operationsSeed], { dryRun });

  console.log(JSON.stringify({ level: 'info', msg: 'Seed framework complete', dryRun }));
}

main().catch((error) => {
  console.error(JSON.stringify({ level: 'error', msg: 'Seed failed', error: String(error) }));
  process.exit(1);
});
