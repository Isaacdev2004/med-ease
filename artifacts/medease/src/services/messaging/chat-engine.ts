import type { ChatMessage, ChatThread } from '@/services/messaging/types';

export function totalUnreadThreads(threads: ChatThread[]): number {
  return threads.reduce((sum, t) => sum + t.unreadCount, 0);
}

export function secureThreadCount(threads: ChatThread[]): number {
  return threads.filter((t) => t.isSecure).length;
}

export function sortThreadsByActivity(threads: ChatThread[]): ChatThread[] {
  return [...threads].sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
}

export function threadMessages(messages: ChatMessage[], threadId: string): ChatMessage[] {
  return messages
    .filter((m) => m.threadId === threadId)
    .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
}
