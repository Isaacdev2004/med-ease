#!/usr/bin/env node
/**
 * Enforces coverage gates for packages with unit tests.
 * Default package gate: line coverage >= 80%.
 * Critical source files: line coverage >= 90%.
 */
import { spawnSync } from 'node:child_process';

const DEFAULT_MIN_LINE = Number(process.env.COVERAGE_MIN_LINE ?? 80);
const CRITICAL_MIN_LINE = Number(process.env.COVERAGE_CRITICAL_MIN_LINE ?? 90);

/** Per-package critical source file patterns (regex) requiring higher coverage. */
const CRITICAL_SOURCES = {
  '@medease/queue': [/queue-job\.envelope\.ts\s+\|\s+([\d.]+)/],
};

function parseAggregateLineCoverage(output) {
  const match = output.match(/all files\s+\|\s+([\d.]+)/);
  return match ? Number(match[1]) : null;
}

function parseCriticalLineCoverage(output, patterns) {
  for (const pattern of patterns) {
    const match = output.match(pattern);
    if (match) {
      return Number(match[1]);
    }
  }
  return null;
}

function runPackageCoverage(packageName) {
  const result = spawnSync(
    'pnpm',
    ['--filter', packageName, 'run', 'test:coverage'],
    {
      encoding: 'utf8',
      shell: true,
    },
  );

  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  process.stdout.write(output);

  if (result.status !== 0) {
    console.error(`\nCoverage run failed for ${packageName}`);
    process.exit(result.status ?? 1);
  }

  const aggregateLine = parseAggregateLineCoverage(output);
  if (aggregateLine === null) {
    console.error(`\nCould not parse aggregate coverage for ${packageName}`);
    process.exit(1);
  }

  if (aggregateLine < DEFAULT_MIN_LINE) {
    console.error(
      `\nCoverage gate failed for ${packageName}: ${aggregateLine}% line coverage (required ${DEFAULT_MIN_LINE}%)`,
    );
    process.exit(1);
  }

  console.log(
    `\n✓ ${packageName}: ${aggregateLine}% aggregate line coverage (required ${DEFAULT_MIN_LINE}%)`,
  );

  const criticalPatterns = CRITICAL_SOURCES[packageName];
  if (criticalPatterns) {
    const criticalLine = parseCriticalLineCoverage(output, criticalPatterns);
    if (criticalLine === null) {
      console.error(
        `\nCould not parse critical source coverage for ${packageName}`,
      );
      process.exit(1);
    }
    if (criticalLine < CRITICAL_MIN_LINE) {
      console.error(
        `\nCritical coverage gate failed for ${packageName}: ${criticalLine}% line coverage (required ${CRITICAL_MIN_LINE}%)`,
      );
      process.exit(1);
    }
    console.log(
      `✓ ${packageName}: ${criticalLine}% critical source line coverage (required ${CRITICAL_MIN_LINE}%)`,
    );
  }
}

const packages = ['@medease/queue'];

for (const pkg of packages) {
  runPackageCoverage(pkg);
}

console.log('\nAll coverage gates passed.');
