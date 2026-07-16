import { QUEUE_NAMES, type QueueDefinition } from '@medease/queue';

import { createStubProcessor } from './create-stub-processor.js';

export const webhooksQueueDefinition: QueueDefinition = {
  name: QUEUE_NAMES.WEBHOOKS,
  processor: createStubProcessor(QUEUE_NAMES.WEBHOOKS),
};
