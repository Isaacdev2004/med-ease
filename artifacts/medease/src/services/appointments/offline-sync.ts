type QueuedAction = {
  label: string;
  execute: () => Promise<void>;
};

class AppointmentOfflineQueue {
  private queue: QueuedAction[] = [];

  enqueue(action: QueuedAction) {
    this.queue.push(action);
  }

  async flush() {
    const pending = [...this.queue];
    this.queue = [];
    for (const action of pending) {
      try {
        await action.execute();
      } catch {
        this.queue.push(action);
      }
    }
  }

  get size() {
    return this.queue.length;
  }
}

export const appointmentOfflineQueue = new AppointmentOfflineQueue();
