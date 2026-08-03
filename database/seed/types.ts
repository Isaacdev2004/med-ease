export interface SeedContext {
  dryRun: boolean;
}

export interface SeedModule {
  name: string;
  run(ctx: SeedContext): Promise<void>;
}

export async function runSeedModules(
  modules: SeedModule[],
  ctx: SeedContext = { dryRun: false },
) {
  for (const seedModule of modules) {
    console.log(
      JSON.stringify({
        level: 'info',
        msg: 'Seed module start',
        module: seedModule.name,
      }),
    );
    try {
      await seedModule.run(ctx);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.stack ?? error.message
          : String(error);
      console.error(
        JSON.stringify({
          level: 'error',
          msg: 'Seed module failed',
          module: seedModule.name,
          error: message,
        }),
      );
      throw error;
    }
    console.log(
      JSON.stringify({
        level: 'info',
        msg: 'Seed module complete',
        module: seedModule.name,
      }),
    );
  }
}
