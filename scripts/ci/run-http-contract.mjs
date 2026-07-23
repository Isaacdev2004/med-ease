#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

import { login } from './e2e-helpers.mjs';

const root = process.cwd();
const apiUrl = `http://127.0.0.1:${process.env.API_PORT ?? '3000'}`;

const adminLogin = await login('admin@medease.health');

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
      CONTRACT_TEST_BEARER_TOKEN: adminLogin.token,
    },
  },
);

process.exit(result.status ?? 1);
