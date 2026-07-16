import { QUEUE_NAMES, type QueueDefinition } from '@medease/queue';

import { createStubProcessor } from './create-stub-processor.js';

export const emailsQueueDefinition: QueueDefinition = {
  name: QUEUE_NAMES.EMAILS,
  processor: createStubProcessor(QUEUE_NAMES.EMAILS),
};
