const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

for (const lockfile of ['package-lock.json', 'yarn.lock']) {
  const lockPath = path.join(root, lockfile);
  if (fs.existsSync(lockPath)) {
    fs.unlinkSync(lockPath);
  }
}

const userAgent = process.env.npm_config_user_agent || '';
if (!userAgent.includes('pnpm')) {
  console.error('Use pnpm instead of npm/yarn to install dependencies.');
  process.exit(1);
}
