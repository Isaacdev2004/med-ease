import type { SeedModule } from '../types';

export const operationsSeed: SeedModule = {
  name: 'operations',
  async run(ctx) {
    if (ctx.dryRun) {
      return;
    }
  },
};
