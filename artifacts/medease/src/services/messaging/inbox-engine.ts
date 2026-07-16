import type { InboxItem } from '@/services/messaging/types';

export function unreadInboxCount(items: InboxItem[]): number {
  return items.filter((i) => !i.isRead).length;
}

export function starredInboxCount(items: InboxItem[]): number {
  return items.filter((i) => i.isStarred).length;
}

export function sortInboxByDate(items: InboxItem[]): InboxItem[] {
  return [...items].sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
}

export function filterUnread(items: InboxItem[]): InboxItem[] {
  return items.filter((i) => !i.isRead);
}
