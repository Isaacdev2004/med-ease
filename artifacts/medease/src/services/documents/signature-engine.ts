import type { SignatureRequest, SignatureStatus } from '@/services/documents/types';

export function signatureCompletionRate(requests: SignatureRequest[]): number {
  const completed = requests.filter((r) => r.status === 'signed').length;
  if (requests.length === 0) return 100;
  return Math.round((completed / requests.length) * 100);
}

export function nextSignatureStatus(action: 'sign' | 'decline' | 'expire'): SignatureStatus {
  if (action === 'sign') return 'signed';
  if (action === 'decline') return 'declined';
  return 'expired';
}

export function isSignatureOverdue(request: SignatureRequest): boolean {
  return request.status === 'pending' && new Date(request.dueDate).getTime() < Date.now();
}
