import {
  AuditEvents,
  auditContextForAuth,
  type AuditPublisher,
  type SecurityEventTypeName,
} from '@medease/audit';

import type { DomainEvent } from '../domain-event';
import type { DomainEventHandler } from '../handler';
import { PatientEventType } from '../events/patient.events';
import {
  UserEventType,
  type AuthEventPayload,
  type ExportEventPayload,
  type ResourceEventPayload,
} from '../events/user.events';

const AUDITED_USER_EVENTS = new Set<string>(Object.values(UserEventType));
const AUDITED_PATIENT_EVENTS = new Set<string>(Object.values(PatientEventType));

function resourcePayload(event: DomainEvent): ResourceEventPayload {
  return event.payload as ResourceEventPayload;
}

function authPayload(event: DomainEvent): AuthEventPayload {
  return event.payload as AuthEventPayload;
}

function authContext(event: DomainEvent) {
  const payload = authPayload(event);
  return auditContextForAuth({
    tenantId: event.tenantId ?? payload.tenantId,
    userId: event.userId ?? payload.userId,
    sessionId: payload.sessionId,
    correlationId: event.correlationId,
    requestId: event.requestId,
    ipAddress: payload.ipAddress,
    userAgent: payload.userAgent,
  });
}

function iamAuditInput(
  event: DomainEvent,
  action: string,
): Parameters<typeof AuditEvents.userCreated>[0] {
  const payload = resourcePayload(event);
  return {
    action,
    resourceType: payload.resourceType,
    resourceId: payload.resourceId,
    tenantId: event.tenantId ?? payload.tenantId,
    metadata: payload.metadata,
  };
}

export function createAuditHandler(
  publisher: AuditPublisher,
): DomainEventHandler {
  return {
    supports(type: string): boolean {
      return (
        AUDITED_USER_EVENTS.has(type) ||
        AUDITED_PATIENT_EVENTS.has(type) ||
        type.startsWith('SecurityEvent:')
      );
    },

    async handle(event: DomainEvent): Promise<void> {
      if (event.type.startsWith('SecurityEvent:')) {
        const eventType = event.type.replace(
          'SecurityEvent:',
          '',
        ) as SecurityEventTypeName;
        publisher.publishAsync({
          eventType: `SecurityEvent:${eventType}`,
          context: authContext(event),
          payload: {
            kind: 'security_event',
            eventType,
            tenantId: event.tenantId ?? authPayload(event).tenantId,
            userId: event.userId ?? authPayload(event).userId,
            sessionId: authPayload(event).sessionId,
            ipAddress: authPayload(event).ipAddress,
            userAgent: authPayload(event).userAgent,
            metadata: authPayload(event).metadata,
          },
        });
        return;
      }

      switch (event.type) {
        case UserEventType.UserCreated:
          publisher.publishAsync(
            AuditEvents.userCreated(iamAuditInput(event, 'create_user')),
          );
          return;
        case UserEventType.UserAccountLocked:
          publisher.publishAsync(
            AuditEvents.accountLockedIam(iamAuditInput(event, 'lock_account')),
          );
          return;
        case UserEventType.UserAccountUnlocked:
          publisher.publishAsync(
            AuditEvents.accountUnlocked(iamAuditInput(event, 'unlock_account')),
          );
          return;
        case UserEventType.RoleAssigned:
          publisher.publishAsync(
            AuditEvents.roleAssigned(iamAuditInput(event, 'assign_role')),
          );
          return;
        case UserEventType.RoleRemoved:
          publisher.publishAsync(
            AuditEvents.roleRemoved(iamAuditInput(event, 'remove_role')),
          );
          return;
        case UserEventType.PolicyCreated:
          publisher.publishAsync(
            AuditEvents.policyCreated(iamAuditInput(event, 'create_policy')),
          );
          return;
        case UserEventType.MfaEnabled:
          publisher.publishAsync(
            AuditEvents.mfaEnabled(iamAuditInput(event, 'enable_mfa')),
          );
          return;
        case UserEventType.MfaDisabled:
          publisher.publishAsync(
            AuditEvents.mfaDisabled(iamAuditInput(event, 'disable_mfa')),
          );
          return;
        case UserEventType.SessionRevoked:
          publisher.publishAsync(
            AuditEvents.sessionRevoked(iamAuditInput(event, 'revoke_session')),
          );
          return;
        case UserEventType.OAuthClientCreated:
          publisher.publishAsync(
            AuditEvents.oauthClientCreated(
              iamAuditInput(event, 'create_oauth_client'),
            ),
          );
          return;
        case UserEventType.ApiKeyRotated:
          publisher.publishAsync(
            AuditEvents.apiKeyRotated(iamAuditInput(event, 'rotate_api_key')),
          );
          return;
        case UserEventType.ConsentGranted:
          publisher.publishAsync(
            AuditEvents.consentGranted(iamAuditInput(event, 'grant_consent')),
          );
          return;
        case UserEventType.ConsentRevoked:
          publisher.publishAsync(
            AuditEvents.consentRevoked(iamAuditInput(event, 'revoke_consent')),
          );
          return;
        case UserEventType.AccessDelegated:
          publisher.publishAsync(
            AuditEvents.accessDelegated(
              iamAuditInput(event, 'delegate_access'),
            ),
          );
          return;
        case UserEventType.BreakGlassStarted:
          publisher.publishAsync(
            AuditEvents.breakGlassStarted(
              iamAuditInput(event, 'start_break_glass'),
            ),
          );
          return;
        case UserEventType.BreakGlassEnded:
          publisher.publishAsync(
            AuditEvents.breakGlassEnded(
              iamAuditInput(event, 'end_break_glass'),
            ),
          );
          return;
        case UserEventType.DataExported: {
          const payload = event.payload as ExportEventPayload;
          publisher.publishAsync(
            AuditEvents.dataExported({
              resourceType: payload.resourceType,
              tenantId: event.tenantId ?? payload.tenantId,
              metadata: payload.metadata,
            }),
          );
          return;
        }
        case UserEventType.EntityShared:
          publisher.publishAsync(
            AuditEvents.entityShared(iamAuditInput(event, 'share')),
          );
          return;
        case UserEventType.UserLoggedIn:
          publisher.publishAsync(
            AuditEvents.userLoggedIn(authPayload(event), authContext(event)),
          );
          return;
        case UserEventType.UserLoginFailed:
          publisher.publishAsync(
            AuditEvents.userLoginFailed(authPayload(event), authContext(event)),
          );
          return;
        case UserEventType.UserLoggedOut:
          publisher.publishAsync(
            AuditEvents.userLoggedOut(authPayload(event), authContext(event)),
          );
          return;
        case UserEventType.TokenRefreshed:
          publisher.publishAsync(
            AuditEvents.tokenRefreshed(authPayload(event), authContext(event)),
          );
          return;
        case UserEventType.AccountLocked:
          publisher.publishAsync(
            AuditEvents.accountLocked(authPayload(event), authContext(event)),
          );
          return;
        case PatientEventType.PatientViewed: {
          const payload = event.payload as {
            patientId: string;
            resourceType: string;
            resourceId?: string;
            tenantId?: string;
            facilityId?: string;
          };
          publisher.publishAsync(
            AuditEvents.patientViewed({
              patientId: payload.patientId,
              resourceType: payload.resourceType,
              resourceId: payload.resourceId,
              tenantId: event.tenantId ?? payload.tenantId,
              facilityId: event.facilityId ?? payload.facilityId,
            }),
          );
          return;
        }
        case PatientEventType.PatientRegistered: {
          const payload = event.payload as {
            patientId: string;
            tenantId?: string;
            facilityId?: string;
            metadata?: Record<string, unknown>;
          };
          publisher.publishAsync(
            AuditEvents.patientRegistered({
              patientId: payload.patientId,
              tenantId: event.tenantId ?? payload.tenantId,
              facilityId: event.facilityId ?? payload.facilityId,
              metadata: payload.metadata,
            }),
          );
          return;
        }
        case PatientEventType.PatientUpdated: {
          const payload = event.payload as {
            patientId: string;
            tenantId?: string;
            facilityId?: string;
            metadata?: Record<string, unknown>;
          };
          publisher.publishAsync(
            AuditEvents.patientUpdated({
              patientId: payload.patientId,
              tenantId: event.tenantId ?? payload.tenantId,
              facilityId: event.facilityId ?? payload.facilityId,
              metadata: payload.metadata,
            }),
          );
          return;
        }
        case PatientEventType.PatientArchived: {
          const payload = event.payload as {
            patientId: string;
            tenantId?: string;
            facilityId?: string;
            metadata?: Record<string, unknown>;
          };
          publisher.publishAsync(
            AuditEvents.patientArchived({
              patientId: payload.patientId,
              tenantId: event.tenantId ?? payload.tenantId,
              facilityId: event.facilityId ?? payload.facilityId,
              metadata: payload.metadata,
            }),
          );
          return;
        }
        case PatientEventType.PatientRestored: {
          const payload = event.payload as {
            patientId: string;
            tenantId?: string;
            facilityId?: string;
            metadata?: Record<string, unknown>;
          };
          publisher.publishAsync(
            AuditEvents.patientRestored({
              patientId: payload.patientId,
              tenantId: event.tenantId ?? payload.tenantId,
              facilityId: event.facilityId ?? payload.facilityId,
              metadata: payload.metadata,
            }),
          );
          return;
        }
        case PatientEventType.PatientMerged: {
          const payload = event.payload as {
            sourcePatientId: string;
            targetPatientId: string;
            tenantId?: string;
            facilityId?: string;
            metadata?: Record<string, unknown>;
          };
          publisher.publishAsync(
            AuditEvents.patientMerged({
              sourcePatientId: payload.sourcePatientId,
              targetPatientId: payload.targetPatientId,
              tenantId: event.tenantId ?? payload.tenantId,
              facilityId: event.facilityId ?? payload.facilityId,
              metadata: payload.metadata,
            }),
          );
          return;
        }
        case PatientEventType.PatientAllergyAdded: {
          const payload = event.payload as {
            patientId: string;
            tenantId?: string;
            facilityId?: string;
            metadata?: Record<string, unknown>;
          };
          publisher.publishAsync(
            AuditEvents.patientAllergyAdded({
              patientId: payload.patientId,
              tenantId: event.tenantId ?? payload.tenantId,
              facilityId: event.facilityId ?? payload.facilityId,
              metadata: payload.metadata,
            }),
          );
          return;
        }
        case PatientEventType.PatientPreferenceUpdated: {
          const payload = event.payload as {
            patientId: string;
            tenantId?: string;
            facilityId?: string;
            metadata?: Record<string, unknown>;
          };
          publisher.publishAsync(
            AuditEvents.patientPreferenceUpdated({
              patientId: payload.patientId,
              tenantId: event.tenantId ?? payload.tenantId,
              facilityId: event.facilityId ?? payload.facilityId,
              metadata: payload.metadata,
            }),
          );
          return;
        }
        default:
          return;
      }
    },
  };
}
