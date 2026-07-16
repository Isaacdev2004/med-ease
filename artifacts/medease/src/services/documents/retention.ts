import type { Document, RetentionPolicy } from '@/services/documents/types';

export function isRetentionDue(doc: Document, policy: RetentionPolicy): boolean {
  const uploaded = new Date(doc.uploadedAt).getTime();
  const due = uploaded + policy.retentionDays * 86400000;
  return Date.now() >= due;
}

export function retentionComplianceRate(docs: Document[], policies: RetentionPolicy[]): number {
  const governed = docs.filter((d) => d.retentionPolicyId);
  if (governed.length === 0) return 100;
  const compliant = governed.filter((d) => {
    const policy = policies.find((p) => p.policyId === d.retentionPolicyId);
    return !policy || !isRetentionDue(d, policy) || d.status === 'archived';
  });
  return Math.round((compliant.length / governed.length) * 100);
}
