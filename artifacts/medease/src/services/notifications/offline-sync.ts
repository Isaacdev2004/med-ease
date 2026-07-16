type QueuedNotificationAction = {
  id: string;
  label: string;
  execute: () => Promise<void>;
  createdAt: number;
};

const queue: QueuedNotificationAction[] = [];
let flushing = false;

/** Queues notification acknowledgements when offline — replays on reconnect. */
export const notificationOfflineQueue = {
  enqueue(action: Omit<QueuedNotificationAction, 'id' | 'createdAt'>) {
    queue.push({
      ...action,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    });
  },

  size() {
    return queue.length;
  },

  async flush() {
    if (flushing || queue.length === 0 || !navigator.onLine) return;
    flushing = true;

    while (queue.length > 0 && navigator.onLine) {
      const next = queue.shift();
      if (!next) break;
      try {
        await next.execute();
      } catch (error) {
        console.error('[notification-offline-queue] failed', next.label, error);
        queue.unshift(next);
        break;
      }
    }

    flushing = false;
  },
};

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    void notificationOfflineQueue.flush();
  });
}
