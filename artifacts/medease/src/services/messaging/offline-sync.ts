type QueuedMutation = { label: string; execute: () => Promise<void> };

class MessagingOfflineQueue {
  private queue: QueuedMutation[] = [];
  enqueue(item: QueuedMutation) { this.queue.push(item); }
  async flush() {
    const pending = [...this.queue];
    this.queue = [];
    for (const item of pending) {
      try { await item.execute(); }
      catch { this.queue.unshift(item); }
    }
  }
}

export const messagingOfflineQueue = new MessagingOfflineQueue();
