import { copyFileSync, existsSync } from 'node:fs';
import { execSync, spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const dockerDir = join(scriptDir, '..');
const envExample = join(dockerDir, '.env.example');
const envFile = join(dockerDir, '.env');

function checkDockerEngine() {
  const result = spawnSync('docker', ['info'], {
    encoding: 'utf8',
    shell: true,
  });

  if (result.status === 0) {
    return;
  }

  const stderr = `${result.stderr ?? ''}${result.stdout ?? ''}`.trim();

  console.error('\nDocker engine is not reachable.\n');
  console.error(stderr || 'Unknown Docker error');
  console.error(`
This is a Docker Desktop issue — not a Med-Ease compose configuration problem.

On Windows, try these steps in order:

  1. Quit Docker Desktop completely (system tray → Quit Docker Desktop)
  2. In PowerShell (Admin):  wsl --shutdown
  3. Start Docker Desktop again and wait until it shows "Engine running"
  4. Verify:  docker info
  5. Retry:   pnpm docker:bootstrap

If it still fails:

  • Docker Desktop → Settings → General → ensure "Use the WSL 2 based engine" is enabled
  • Docker Desktop → Check for updates (CLI/API mismatch can cause 500 errors)
  • Docker Desktop → Troubleshoot → Restart Docker Desktop
  • Last resort: Troubleshoot → Reset to factory defaults (removes local images/volumes)

Once \`docker info\` succeeds, the stack should start normally.
`);
  process.exit(1);
}

if (!existsSync(envFile)) {
  copyFileSync(envExample, envFile);
  console.log('Created docker/.env from docker/.env.example');
}

checkDockerEngine();

const composeArgs = [
  'compose',
  '-f',
  'compose.yml',
  '-f',
  'compose.override.yml',
  '--env-file',
  '.env',
  'up',
  '-d',
  '--build',
];

try {
  execSync(`docker ${composeArgs.join(' ')}`, {
    cwd: dockerDir,
    stdio: 'inherit',
    shell: true,
  });
} catch {
  console.error(
    '\nCompose failed. Run `docker compose ps` from docker/ for details.',
  );
  process.exit(1);
}

console.log(
  '\nBootstrap complete. Run `pnpm docker:ps` or `pnpm docker:verify` to check health.',
);
