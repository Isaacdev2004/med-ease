import type { Approval, ApprovalStatus } from '@/services/workflows/types';

export function approvalTurnaroundHours(approvals: Approval[]): number {
  const completed = approvals.filter((a) => a.status === 'approved' || a.status === 'rejected');
  if (completed.length === 0) return 0;
  return Math.round(completed.reduce((s, a) => s + (Date.now() - new Date(a.createdAt).getTime()) / 3600000, 0) / completed.length);
}

export function nextApprovalStatus(action: 'approve' | 'reject' | 'escalate'): ApprovalStatus {
  if (action === 'approve') return 'approved';
  if (action === 'reject') return 'rejected';
  return 'escalated';
}

export function isApprovalComplete(approval: Approval): boolean {
  return approval.status === 'approved' || approval.status === 'rejected';
}
