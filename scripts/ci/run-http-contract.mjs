#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const apiUrl = `http://127.0.0.1:${process.env.API_PORT ?? '3000'}`;

const result = spawnSync(
  'pnpm',
  ['--filter', '@workspace/medease', 'run', 'test:contract:http'],
  {
    cwd: root,
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      CONTRACT_TEST_API_URL: apiUrl,
    },
  },
);

process.exit(result.status ?? 1);
