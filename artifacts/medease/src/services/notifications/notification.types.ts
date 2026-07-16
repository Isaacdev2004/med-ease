export type NotificationType =
  | 'information'
  | 'success'
  | 'warning'
  | 'critical'
  | 'emergency'
  | 'reminder'
  | 'approval_required'
  | 'assignment'
  | 'transfer'
  | 'medication'
  | 'appointment'
  | 'system_maintenance'
  | 'security'
  | 'offline_sync'
  | 'realtime_update';

export type NotificationPriority =
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'informational';

export type NotificationCategory =
  | 'clinical'
  | 'administrative'
  | 'system'
  | 'medication'
  | 'appointment'
  | 'transfer'
  | 'admission'
  | 'security'
  | 'audit';

export type NotificationActionType =
  | 'open'
  | 'mark_read'
  | 'mark_unread'
  | 'archive'
  | 'delete'
  | 'snooze'
  | 'pin'
  | 'view_details'
  | 'dismiss';

export interface NotificationActor {
  id: string;
  name: string;
}

export interface NotificationTarget {
  type: string;
  id: string;
  label?: string;
  href?: string;
}

export interface NotificationAction {
  id: string;
  label: string;
  type: NotificationActionType;
}

export interface MedNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  category: NotificationCategory;
  timestamp: string;
  read: boolean;
  pinned?: boolean;
  archived?: boolean;
  actor?: NotificationActor;
  organizationId?: string;
  target?: NotificationTarget;
  metadata?: Record<string, unknown>;
}

export type ActivityEventCategory =
  | 'appointment'
  | 'transfer'
  | 'admission'
  | 'medication'
  | 'profile'
  | 'care_pathway'
  | 'bed'
  | 'audit'
  | 'system';

export interface ActivityEvent {
  id: string;
  title: string;
  description?: string;
  category: ActivityEventCategory;
  timestamp: string;
  actor?: string;
  organization?: string;
  status?: 'completed' | 'current' | 'pending' | 'cancelled';
  href?: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  description?: string;
  dueAt: string;
  type: 'medication' | 'appointment' | 'transfer' | 'follow_up' | 'vaccination' | 'review';
  priority: NotificationPriority;
}

export type RealtimeEventType =
  | 'patient_updated'
  | 'appointment_created'
  | 'appointment_cancelled'
  | 'transfer_requested'
  | 'transfer_accepted'
  | 'transfer_completed'
  | 'medication_updated'
  | 'bed_availability_changed'
  | 'notification_created'
  | 'care_pathway_updated'
  | 'emergency_triggered';

export interface RealtimeEvent<T = unknown> {
  type: RealtimeEventType;
  payload: T;
  organizationId: string;
  timestamp: string;
}

export interface NotificationFilters {
  q?: string;
  category?: NotificationCategory | '';
  priority?: NotificationPriority | '';
  unread?: boolean;
  pinned?: boolean;
}
