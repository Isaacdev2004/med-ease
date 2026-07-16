import { QUEUE_NAMES, type QueueDefinition } from '@medease/queue';

import { createStubProcessor } from './create-stub-processor.js';

export const interoperabilityQueueDefinition: QueueDefinition = {
  name: QUEUE_NAMES.INTEROPERABILITY,
  processor: createStubProcessor(QUEUE_NAMES.INTEROPERABILITY),
};
