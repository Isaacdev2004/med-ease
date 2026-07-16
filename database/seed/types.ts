export interface SeedContext {
  dryRun: boolean;
}

export interface SeedModule {
  name: string;
  run(ctx: SeedContext): Promise<void>;
}

export async function runSeedModules(modules: SeedModule[], ctx: SeedContext = { dryRun: false }) {
  for (const seedModule of modules) {
    console.log(JSON.stringify({ level: 'info', msg: 'Seed module start', module: seedModule.name }));
    await seedModule.run(ctx);
    console.log(JSON.stringify({ level: 'info', msg: 'Seed module complete', module: seedModule.name }));
  }
}
