/** Canonical BullMQ queue names — hyphenated (BullMQ 5+ rejects `:` in names). */
export const QUEUE_NAMES = {
  EMAILS: 'medease-emails',
  NOTIFICATIONS: 'medease-notifications',
  EXPORTS: 'medease-exports',
  DOCUMENTS: 'medease-documents',
  AI: 'medease-ai',
  INTEROPERABILITY: 'medease-interoperability',
  SCHEDULED: 'medease-scheduled',
  AUDIT: 'medease-audit',
  WEBHOOKS: 'medease-webhooks',
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

export const ALL_QUEUE_NAMES = Object.values(QUEUE_NAMES);

export function deadLetterQueueName(queueName: string): string {
  return `${queueName}-dlq`;
}

export const BOOTSTRAP_JOB_NAME = 'bootstrap.ping';
