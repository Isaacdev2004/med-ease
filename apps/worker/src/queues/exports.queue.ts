import { QUEUE_NAMES, type QueueDefinition } from '@medease/queue';

import { createStubProcessor } from './create-stub-processor.js';

export const exportsQueueDefinition: QueueDefinition = {
  name: QUEUE_NAMES.EXPORTS,
  processor: createStubProcessor(QUEUE_NAMES.EXPORTS),
};
