import { toFhirAuditEvent, toFhirProvenance } from '@/services/iam/audit-engine';
import { toFhirConsent } from '@/services/iam/consent-engine';
import type { ConsentRecord, IamAuditEvent, IamUser } from '@/services/iam/types';

export function toFhirPractitioner(user: IamUser) {
  return {
    resourceType: 'Practitioner',
    id: user.userId,
    name: [{ text: user.displayName }],
    telecom: [{ system: 'email', value: user.email }],
  };
}

export function toFhirOrganization(org: { organizationId: string; name: string }) {
  return { resourceType: 'Organization', id: org.organizationId, name: org.name };
}

export function toFhirRelatedPerson(proxy: { proxyId: string; patientId: string; relationship: string }) {
  return {
    resourceType: 'RelatedPerson',
    id: proxy.proxyId,
    patient: { reference: `Patient/${proxy.patientId}` },
    relationship: [{ text: proxy.relationship }],
  };
}

export function mapIamBundle(resources: {
  users?: IamUser[];
  consents?: ConsentRecord[];
  audit?: IamAuditEvent[];
}) {
  const entries: { resource: unknown }[] = [];
  resources.users?.forEach((u) => entries.push({ resource: toFhirPractitioner(u) }));
  resources.consents?.forEach((c) => entries.push({ resource: toFhirConsent(c) }));
  resources.audit?.forEach((a) => entries.push({ resource: toFhirAuditEvent(a) }));
  return { resourceType: 'Bundle', type: 'collection', entry: entries };
}

export { toFhirProvenance };
