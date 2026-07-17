import type {
  ChatMessage,
  SendMessageInput,
} from '@/services/telemedicine/types';

const typingSessions = new Set<string>();

export function setTyping(
  sessionId: string,
  userId: string,
  isTyping: boolean,
) {
  const key = `${sessionId}:${userId}`;
  if (isTyping) typingSessions.add(key);
  else typingSessions.delete(key);
}

export function getTypingUsers(sessionId: string): string[] {
  return [...typingSessions]
    .filter((k) => k.startsWith(`${sessionId}:`))
    .map((k) => k.split(':')[1]!);
}

export function buildMessage(input: SendMessageInput): ChatMessage {
  return {
    id: `msg-${Date.now()}`,
    sessionId: input.sessionId,
    senderId: input.senderId,
    senderName: input.senderName,
    receiverId: input.receiverId,
    content: input.content,
    sentAt: new Date().toISOString(),
    deliveryStatus: 'sent',
  };
}

export function searchMessages(messages: ChatMessage[], query: string) {
  const q = query.toLowerCase();
  return messages.filter((m) => m.content.toLowerCase().includes(q));
}

export function exportMessages(messages: ChatMessage[]) {
  return messages
    .map((m) => `[${m.sentAt}] ${m.senderName}: ${m.content}`)
    .join('\n');
}
