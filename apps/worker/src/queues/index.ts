import { aiQueueDefinition } from './ai.queue.js';
import { auditQueueDefinition } from './audit.queue.js';
import { documentsQueueDefinition } from './documents.queue.js';
import { emailsQueueDefinition } from './emails.queue.js';
import { exportsQueueDefinition } from './exports.queue.js';
import { interoperabilityQueueDefinition } from './interoperability.queue.js';
import { notificationsQueueDefinition } from './notifications.queue.js';
import { scheduledQueueDefinition } from './scheduled.queue.js';
import { webhooksQueueDefinition } from './webhooks.queue.js';

export const allQueueDefinitions = [
  emailsQueueDefinition,
  notificationsQueueDefinition,
  exportsQueueDefinition,
  documentsQueueDefinition,
  aiQueueDefinition,
  interoperabilityQueueDefinition,
  scheduledQueueDefinition,
  auditQueueDefinition,
  webhooksQueueDefinition,
];

export { emailsQueueDefinition } from './emails.queue.js';
export { notificationsQueueDefinition } from './notifications.queue.js';
export { exportsQueueDefinition } from './exports.queue.js';
export { documentsQueueDefinition } from './documents.queue.js';
export { aiQueueDefinition } from './ai.queue.js';
export { interoperabilityQueueDefinition } from './interoperability.queue.js';
export { scheduledQueueDefinition } from './scheduled.queue.js';
export { auditQueueDefinition } from './audit.queue.js';
export { webhooksQueueDefinition } from './webhooks.queue.js';
