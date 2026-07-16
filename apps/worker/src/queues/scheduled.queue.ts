import { QUEUE_NAMES, type QueueDefinition } from '@medease/queue';

import { createStubProcessor } from './create-stub-processor.js';

export const scheduledQueueDefinition: QueueDefinition = {
  name: QUEUE_NAMES.SCHEDULED,
  processor: createStubProcessor(QUEUE_NAMES.SCHEDULED),
};
