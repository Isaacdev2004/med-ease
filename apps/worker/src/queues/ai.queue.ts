import { QUEUE_NAMES, type QueueDefinition } from '@medease/queue';

import { createStubProcessor } from './create-stub-processor.js';

export const aiQueueDefinition: QueueDefinition = {
  name: QUEUE_NAMES.AI,
  processor: createStubProcessor(QUEUE_NAMES.AI),
};
