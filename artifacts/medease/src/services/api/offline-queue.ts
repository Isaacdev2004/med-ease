type QueuedMutation = {
  id: string;
  label: string;
  execute: () => Promise<void>;
  createdAt: number;
};

const queue: QueuedMutation[] = [];
let flushing = false;

/** Offline mutation queue — syncs when connection resumes. */
export const offlineMutationQueue = {
  enqueue(mutation: Omit<QueuedMutation, 'id' | 'createdAt'>) {
    queue.push({
      ...mutation,
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
        console.error('[offline-queue] failed', next.label, error);
        queue.unshift(next);
        break;
      }
    }

    flushing = false;
  },
};

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    void offlineMutationQueue.flush();
  });
}
