import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'prisma/config';

const directory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  schema: path.join(directory, 'prisma'),
  migrations: {
    seed: 'tsx seed/index.ts',
  },
});
