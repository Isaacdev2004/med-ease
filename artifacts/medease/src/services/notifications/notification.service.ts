import type {
  ActivityEvent,
  MedNotification,
  NotificationFilters,
  ReminderItem,
} from '@/services/notifications/notification.types';

const MOCK_NOTIFICATIONS: MedNotification[] = [
  {
    id: 'n-1',
    title: 'Appointment reminder',
    message: 'Cardiology visit tomorrow at 10:00 AM with Dr. Emily Chen.',
    type: 'appointment',
    priority: 'high',
    category: 'appointment',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    read: false,
    actor: { id: 'sys', name: 'Scheduling System' },
    target: {
      type: 'appointment',
      id: 'apt-1',
      label: 'Cardiology Visit',
      href: '/patient/appointments/apt-1',
    },
  },
  {
    id: 'n-2',
    title: 'Transfer request pending approval',
    message:
      'Sarah Jenkins transfer from Mount Sinai to NYU Langone requires review.',
    type: 'transfer',
    priority: 'critical',
    category: 'transfer',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    read: false,
    pinned: true,
    actor: { id: 'u-2', name: 'Dispatch Unit A' },
    target: {
      type: 'transfer',
      id: 'tr-1',
      label: 'Transfer #TR-1029',
      href: '/transport/transfer-requests',
    },
  },
  {
    id: 'n-3',
    title: 'Medication refill approved',
    message: 'Atorvastatin 20mg refill is ready for pickup.',
    type: 'medication',
    priority: 'medium',
    category: 'medication',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    read: true,
    actor: { id: 'ph-1', name: 'Central Pharmacy' },
  },
  {
    id: 'n-4',
    title: 'Bed availability update',
    message: 'ICU ward A-102 is now available.',
    type: 'realtime_update',
    priority: 'medium',
    category: 'clinical',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    read: false,
  },
  {
    id: 'n-5',
    title: 'Scheduled maintenance',
    message: 'Platform maintenance tonight 11:00 PM – 1:00 AM EST.',
    type: 'system_maintenance',
    priority: 'low',
    category: 'system',
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    read: true,
  },
  {
    id: 'n-6',
    title: 'Critical vitals alert',
    message: 'Patient Robert Taylor — elevated heart rate detected.',
    type: 'critical',
    priority: 'critical',
    category: 'clinical',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    read: false,
    pinned: true,
    actor: { id: 'mon-1', name: 'Vitals Monitor' },
  },
];

const MOCK_ACTIVITY: ActivityEvent[] = [
  {
    id: 'a-1',
    title: 'Transfer requested',
    description: 'Sarah Jenkins — Mount Sinai → NYU Langone',
    category: 'transfer',
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    actor: 'Dispatch Unit A',
    status: 'pending',
  },
  {
    id: 'a-2',
    title: 'Appointment scheduled',
    description: 'Cardiology follow-up for James Wilson',
    category: 'appointment',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    actor: 'Dr. Emily Chen',
    status: 'current',
  },
  {
    id: 'a-3',
    title: 'Medication dosage updated',
    description: 'Atorvastatin adjusted to 20mg daily',
    category: 'medication',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    actor: 'Dr. Emily Chen',
    status: 'completed',
  },
  {
    id: 'a-4',
    title: 'Bed assigned',
    description: 'ICU A-102 assigned to Robert Taylor',
    category: 'bed',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    actor: 'Facility Admin',
    status: 'completed',
  },
];

const MOCK_REMINDERS: ReminderItem[] = [
  {
    id: 'r-1',
    title: 'Take Atorvastatin',
    description: '20mg at bedtime',
    dueAt: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
    type: 'medication',
    priority: 'high',
  },
  {
    id: 'r-2',
    title: 'Cardiology follow-up',
    description: 'Tomorrow at 10:00 AM',
    dueAt: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString(),
    type: 'appointment',
    priority: 'medium',
  },
];

let store: MedNotification[] = [...MOCK_NOTIFICATIONS];

function applyFilters(items: MedNotification[], filters?: NotificationFilters) {
  let result = items.filter((item) => !item.archived);

  if (filters?.unread) result = result.filter((item) => !item.read);
  if (filters?.pinned) result = result.filter((item) => item.pinned);
  if (filters?.category)
    result = result.filter((item) => item.category === filters.category);
  if (filters?.priority)
    result = result.filter((item) => item.priority === filters.priority);
  if (filters?.q?.trim()) {
    const q = filters.q.trim().toLowerCase();
    result = result.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q) ||
        item.actor?.name.toLowerCase().includes(q),
    );
  }

  return result.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}

export const notificationService = {
  async list(
    userId: string,
    filters?: NotificationFilters,
  ): Promise<MedNotification[]> {
    void userId;
    await delay(200);
    return applyFilters(store, filters);
  },

  async unreadCount(userId: string): Promise<number> {
    void userId;
    return store.filter((item) => !item.read && !item.archived).length;
  },

  async markRead(userId: string, ids: string[]): Promise<MedNotification[]> {
    void userId;
    store = store.map((item) =>
      ids.includes(item.id) ? { ...item, read: true } : item,
    );
    return applyFilters(store);
  },

  async markUnread(userId: string, ids: string[]): Promise<MedNotification[]> {
    void userId;
    store = store.map((item) =>
      ids.includes(item.id) ? { ...item, read: false } : item,
    );
    return applyFilters(store);
  },

  async archive(userId: string, ids: string[]): Promise<MedNotification[]> {
    void userId;
    store = store.map((item) =>
      ids.includes(item.id) ? { ...item, archived: true, read: true } : item,
    );
    return applyFilters(store);
  },

  async pin(
    userId: string,
    id: string,
    pinned: boolean,
  ): Promise<MedNotification[]> {
    void userId;
    store = store.map((item) => (item.id === id ? { ...item, pinned } : item));
    return applyFilters(store);
  },

  async markAllRead(userId: string): Promise<MedNotification[]> {
    void userId;
    store = store.map((item) => ({ ...item, read: true }));
    return applyFilters(store);
  },

  async dismiss(userId: string, id: string): Promise<MedNotification[]> {
    void userId;
    store = store.filter((item) => item.id !== id);
    return applyFilters(store);
  },

  async add(
    userId: string,
    notification: MedNotification,
  ): Promise<MedNotification[]> {
    void userId;
    store = [
      notification,
      ...store.filter((item) => item.id !== notification.id),
    ];
    return applyFilters(store);
  },

  async listActivity(userId: string): Promise<ActivityEvent[]> {
    void userId;
    await delay(150);
    return [...MOCK_ACTIVITY].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  },

  async listReminders(userId: string): Promise<ReminderItem[]> {
    void userId;
    await delay(100);
    return MOCK_REMINDERS;
  },
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Demo helper — inject a realtime notification for development. */
export function createDemoNotification(
  partial?: Partial<MedNotification>,
): MedNotification {
  return {
    id: `n-${crypto.randomUUID()}`,
    title: partial?.title ?? 'New realtime update',
    message: partial?.message ?? 'A record was updated in your organization.',
    type: partial?.type ?? 'realtime_update',
    priority: partial?.priority ?? 'medium',
    category: partial?.category ?? 'clinical',
    timestamp: new Date().toISOString(),
    read: false,
    ...partial,
  };
}
