import type {
  LabDiagnosticReport,
  LabObservation,
  LabOrder,
} from '@/services/laboratory/types';

export function toFhirServiceRequest(order: LabOrder) {
  return {
    resourceType: 'ServiceRequest',
    id: order.id,
    status:
      order.status === 'cancelled'
        ? 'revoked'
        : order.status === 'completed'
          ? 'completed'
          : 'active',
    intent: 'order',
    priority: order.priority,
    code: { text: order.testNames.join(', ') },
    subject: { reference: `Patient/${order.patientId}` },
    requester: { display: order.orderingPhysician },
    authoredOn: order.createdAt,
    reasonCode: order.diagnosis ? [{ text: order.diagnosis }] : undefined,
    note: order.notes ? [{ text: order.notes }] : undefined,
  };
}

export function toFhirDiagnosticReport(report: LabDiagnosticReport) {
  return {
    resourceType: 'DiagnosticReport',
    id: report.id,
    status: report.status === 'released' ? 'final' : 'preliminary',
    code: { text: report.title },
    subject: { reference: `Patient/${report.patientId}` },
    effectiveDateTime: report.releasedAt ?? report.createdAt,
    result: report.observationIds.map((id) => ({
      reference: `Observation/${id}`,
    })),
    performer: report.verifiedBy ? [{ display: report.verifiedBy }] : undefined,
  };
}

export function toFhirObservation(obs: LabObservation) {
  return {
    resourceType: 'Observation',
    id: obs.id,
    status: 'final',
    code: {
      coding: [
        {
          system: 'http://loinc.org',
          code: obs.loincCode,
          display: obs.testName,
        },
      ],
    },
    subject: { reference: `Patient/${obs.patientId}` },
    effectiveDateTime: obs.resultedAt ?? obs.collectedAt,
    valueQuantity:
      obs.numericValue != null
        ? { value: obs.numericValue, unit: obs.unit }
        : undefined,
    valueString: obs.numericValue == null ? obs.value : undefined,
    referenceRange: [{ text: obs.referenceRange }],
    interpretation: [{ text: obs.flag }],
  };
}
