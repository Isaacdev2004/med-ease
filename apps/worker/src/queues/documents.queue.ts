import { QUEUE_NAMES, type QueueDefinition } from '@medease/queue';

import { createStubProcessor } from './create-stub-processor.js';

export const documentsQueueDefinition: QueueDefinition = {
  name: QUEUE_NAMES.DOCUMENTS,
  processor: createStubProcessor(QUEUE_NAMES.DOCUMENTS),
};
