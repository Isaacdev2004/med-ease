export interface RuntimeBuildInfo {
  applicationVersion: string;
  gitCommit: string;
  buildTimestamp: string | null;
  environment: string;
  schemaVersion: string;
  migrationVersion: string;
}

export interface RuntimeBuildInfoInput {
  serviceVersion?: string;
  gitCommit?: string;
  buildTimestamp?: string;
  environment?: string;
  schemaVersion?: string;
  migrationVersion?: string;
}

export function resolveRuntimeBuildInfo(input: RuntimeBuildInfoInput = {}): RuntimeBuildInfo {
  return {
    applicationVersion:
      input.serviceVersion ??
      process.env.APP_VERSION ??
      process.env.npm_package_version ??
      '0.0.0',
    gitCommit: input.gitCommit ?? process.env.GIT_COMMIT ?? 'unknown',
    buildTimestamp: input.buildTimestamp ?? process.env.BUILD_TIMESTAMP ?? null,
    environment: input.environment ?? process.env.NODE_ENV ?? 'development',
    schemaVersion: input.schemaVersion ?? process.env.SCHEMA_VERSION ?? 'foundation',
    migrationVersion:
      input.migrationVersion ?? process.env.MIGRATION_VERSION ?? '20260716000000_foundation',
  };
}
