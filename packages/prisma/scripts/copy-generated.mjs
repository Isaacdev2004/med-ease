import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'src', 'generated');
const target = join(root, 'dist', 'generated');

if (!existsSync(source)) {
  console.error(
    'Missing generated Prisma client. Run `pnpm prisma:generate` first.',
  );
  process.exit(1);
}

rmSync(target, { recursive: true, force: true });
mkdirSync(join(root, 'dist'), { recursive: true });
cpSync(source, target, { recursive: true });
console.log('Copied Prisma generated client to dist/generated');
