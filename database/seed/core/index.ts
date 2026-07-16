import type { SeedModule } from '../types';

/** Core schema seeds — tenants, facilities (Epic 2+). */
export const coreSeed: SeedModule = {
  name: 'core',
  async run(ctx) {
    if (ctx.dryRun) {
      return;
    }
    // Domain seeds added in later epics — no IAM/tenant data in E1-03.
  },
};
