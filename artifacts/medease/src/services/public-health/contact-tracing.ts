import type { ContactTracingRecord } from '@/services/public-health/types';

export function contactCompletionRate(
  contacts: ContactTracingRecord[],
): number {
  if (contacts.length === 0) return 100;
  const cleared = contacts.filter((c) => c.status === 'cleared').length;
  return Math.round((cleared / contacts.length) * 100);
}

export function requiresFollowUp(contact: ContactTracingRecord): boolean {
  return contact.status === 'identified' || contact.status === 'notified';
}

export function toFhirRelatedPerson(contact: ContactTracingRecord) {
  return {
    resourceType: 'RelatedPerson',
    id: contact.contactId,
    patient: { reference: `Patient/${contact.patientId}` },
    name: [{ text: contact.contactName }],
    relationship: [{ coding: [{ code: 'contact' }] }],
  };
}
