import type { ChatMessage, ClinicalNote, SessionAttachment, TelemedicineSession } from '@/services/telemedicine/types';

export function toFhirEncounter(session: TelemedicineSession) {
  return {
    resourceType: 'Encounter' as const,
    id: session.encounterId ?? session.sessionId,
    status: session.status === 'completed' ? 'finished' : 'in-progress',
    class: { code: 'VR', display: 'virtual' },
    subject: { reference: `Patient/${session.patientId}` },
    participant: [{ individual: { reference: `Practitioner/${session.clinicianId}` } }],
    period: { start: session.actualStart ?? session.scheduledStart, end: session.actualEnd },
  };
}

export function toFhirCommunication(message: ChatMessage) {
  return {
    resourceType: 'Communication' as const,
    id: message.id,
    status: 'completed',
    subject: { reference: `Patient/${message.senderId}` },
    sent: message.sentAt,
    payload: [{ contentString: message.content }],
  };
}

export function toFhirCommunicationRequest(session: TelemedicineSession) {
  return {
    resourceType: 'CommunicationRequest' as const,
    id: `cr-${session.sessionId}`,
    status: 'active',
    subject: { reference: `Patient/${session.patientId}` },
    requester: { reference: `Practitioner/${session.clinicianId}` },
  };
}

export function toFhirMedia(recording: { id: string; sessionId: string; storageUrl?: string }) {
  return {
    resourceType: 'Media' as const,
    id: recording.id,
    status: 'completed',
    content: { url: recording.storageUrl },
  };
}

export function toFhirDocumentReference(attachment: SessionAttachment) {
  return {
    resourceType: 'DocumentReference' as const,
    id: attachment.id,
    status: 'current',
    type: { text: attachment.type },
    content: [{ attachment: { url: attachment.url, title: attachment.name } }],
  };
}

export function toFhirAppointment(session: TelemedicineSession) {
  return {
    resourceType: 'Appointment' as const,
    id: session.appointmentId,
    status: session.status === 'cancelled' ? 'cancelled' : 'booked',
    start: session.scheduledStart,
    end: session.scheduledEnd,
    participant: [
      { actor: { reference: `Patient/${session.patientId}` } },
      { actor: { reference: `Practitioner/${session.clinicianId}` } },
    ],
  };
}

export function toFhirClinicalNote(note: ClinicalNote) {
  return {
    resourceType: 'DocumentReference' as const,
    id: note.id,
    status: note.status === 'signed' ? 'current' : 'preliminary',
    type: { text: 'Clinical Note SOAP' },
    content: [{ attachment: { title: 'SOAP Note', creation: note.createdAt } }],
  };
}
