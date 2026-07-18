#!/usr/bin/env node
/**
 * Windows-friendly API dev: compile with Nest/tsc (preserves DI metadata),
 * then run dist/main.js with Node's file watcher.
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const apiRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const mainPath = path.join(apiRoot, 'dist/main.js');

function run(command, args, label) {
  const child = spawn(command, args, {
    cwd: apiRoot,
    stdio: 'inherit',
    shell: true,
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    if (code && code !== 0) {
      console.error(`[dev:stable] ${label} exited with code ${code}`);
      process.exit(code);
    }
  });

  return child;
}

function shutdown(children) {
  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  }
}

console.log('[dev:stable] Building API...');
const initialBuild = run('nest', ['build'], 'initial build');

initialBuild.on('exit', (code) => {
  if (code !== 0) {
    process.exit(code ?? 1);
  }

  if (!existsSync(mainPath)) {
    console.error('[dev:stable] Build succeeded but dist/main.js is missing');
    process.exit(1);
  }

  console.log('[dev:stable] Starting node --watch dist/main.js');
  const server = run('node', ['--watch', 'dist/main.js'], 'server');

  console.log('[dev:stable] Starting tsc --watch');
  const compiler = run(
    'tsc',
    ['-p', 'tsconfig.build.json', '--watch', '--preserveWatchOutput'],
    'compiler',
  );

  const children = [compiler, server];

  process.on('SIGINT', () => {
    shutdown(children);
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    shutdown(children);
    process.exit(0);
  });
});
