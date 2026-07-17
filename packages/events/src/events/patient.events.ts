import {
  createDomainEvent,
  type DomainEvent,
  type DomainEventContext,
} from '../domain-event';

export const PatientEventType = {
  PatientRegistered: 'PatientRegistered',

  PatientUpdated: 'PatientUpdated',

  PatientArchived: 'PatientArchived',

  PatientRestored: 'PatientRestored',

  PatientMerged: 'PatientMerged',

  PatientViewed: 'PatientViewed',

  PatientAllergyAdded: 'PatientAllergyAdded',

  PatientPreferenceUpdated: 'PatientPreferenceUpdated',
} as const;

export type PatientEventTypeName =
  (typeof PatientEventType)[keyof typeof PatientEventType];

export type PatientResourcePayload = {
  patientId: string;

  tenantId?: string;

  facilityId?: string;

  metadata?: Record<string, unknown>;
};

export type PatientViewedPayload = PatientResourcePayload & {
  resourceType: string;

  resourceId?: string;
};

export type PatientMergePayload = {
  sourcePatientId: string;

  targetPatientId: string;

  tenantId?: string;

  facilityId?: string;

  metadata?: Record<string, unknown>;
};

function patientEvent(
  type: PatientEventTypeName,

  payload: PatientResourcePayload,

  context?: DomainEventContext,
): DomainEvent {
  return createDomainEvent(type, payload, {
    ...context,

    tenantId: context?.tenantId ?? payload.tenantId,

    facilityId: context?.facilityId ?? payload.facilityId,
  });
}

/** Clinical patient domain events. */

export const PatientEvents = {
  patientRegistered: (
    payload: PatientResourcePayload,
    context?: DomainEventContext,
  ) => patientEvent(PatientEventType.PatientRegistered, payload, context),

  patientUpdated: (
    payload: PatientResourcePayload,
    context?: DomainEventContext,
  ) => patientEvent(PatientEventType.PatientUpdated, payload, context),

  patientArchived: (
    payload: PatientResourcePayload,
    context?: DomainEventContext,
  ) => patientEvent(PatientEventType.PatientArchived, payload, context),

  patientRestored: (
    payload: PatientResourcePayload,
    context?: DomainEventContext,
  ) => patientEvent(PatientEventType.PatientRestored, payload, context),

  patientMerged: (payload: PatientMergePayload, context?: DomainEventContext) =>
    createDomainEvent(PatientEventType.PatientMerged, payload, {
      ...context,

      tenantId: context?.tenantId ?? payload.tenantId,

      facilityId: context?.facilityId ?? payload.facilityId,
    }),

  patientViewed: (
    payload: PatientViewedPayload,
    context?: DomainEventContext,
  ): DomainEvent =>
    createDomainEvent(PatientEventType.PatientViewed, payload, {
      ...context,

      tenantId: context?.tenantId ?? payload.tenantId,

      facilityId: context?.facilityId ?? payload.facilityId,
    }),

  patientAllergyAdded: (
    payload: PatientResourcePayload,
    context?: DomainEventContext,
  ) => patientEvent(PatientEventType.PatientAllergyAdded, payload, context),

  patientPreferenceUpdated: (
    payload: PatientResourcePayload,
    context?: DomainEventContext,
  ) =>
    patientEvent(PatientEventType.PatientPreferenceUpdated, payload, context),
};
