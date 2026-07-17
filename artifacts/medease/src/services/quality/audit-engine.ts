import type { AuditRecord } from '@/services/quality/types';

export function averageAuditScore(audits: AuditRecord[]): number {
  const scored = audits.filter((a) => a.score != null);
  if (!scored.length) return 0;
  return Math.round(
    scored.reduce((s, a) => s + (a.score ?? 0), 0) / scored.length,
  );
}

export function openFindingsCount(findings: { status: string }[]): number {
  return findings.filter((f) => f.status !== 'closed').length;
}

export function auditReadiness(audits: AuditRecord[]): number {
  const closed = audits.filter((a) => a.status === 'closed').length;
  return audits.length ? Math.round((closed / audits.length) * 100) : 0;
}
