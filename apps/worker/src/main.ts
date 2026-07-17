import './instrumentation.js';
import { bootstrapWorker } from './bootstrap.js';

void bootstrapWorker().catch((error) => {
  console.error(
    JSON.stringify({
      level: 'error',
      msg: 'Worker bootstrap failed',
      error: String(error),
    }),
  );
  process.exit(1);
});
