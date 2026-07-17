import {
  createDomainEvent,
  type DomainEvent,
  type DomainEventContext,
} from '../domain-event';

export const AppointmentEventType = {
  AppointmentCancelled: 'AppointmentCancelled',
} as const;

/** Appointment domain events (reserved for future modules). */
export const AppointmentEvents = {
  appointmentCancelled: (
    payload: {
      appointmentId: string;
      tenantId?: string;
      facilityId?: string;
      reason?: string;
    },
    context?: DomainEventContext,
  ): DomainEvent =>
    createDomainEvent(AppointmentEventType.AppointmentCancelled, payload, {
      ...context,
      tenantId: context?.tenantId ?? payload.tenantId,
      facilityId: context?.facilityId ?? payload.facilityId,
    }),
};
