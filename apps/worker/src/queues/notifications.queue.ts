import { QUEUE_NAMES, type QueueDefinition } from '@medease/queue';

import { createStubProcessor } from './create-stub-processor.js';

export const notificationsQueueDefinition: QueueDefinition = {
  name: QUEUE_NAMES.NOTIFICATIONS,
  processor: createStubProcessor(QUEUE_NAMES.NOTIFICATIONS),
};
