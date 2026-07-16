type QueuedAction = { label: string; execute: () => Promise<void> };

class PatientRecordOfflineQueue {
  private queue: QueuedAction[] = [];

  enqueue(action: QueuedAction) {
    this.queue.push(action);
  }

  async flush() {
    const pending = [...this.queue];
    this.queue = [];
    for (const action of pending) {
      await action.execute();
    }
  }

  size() {
    return this.queue.length;
  }
}

export const patientRecordOfflineQueue = new PatientRecordOfflineQueue();
