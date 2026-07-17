import { Injectable } from '@nestjs/common';

import { auditContextForAuth } from '@medease/audit';
import { createDomainEvent, DomainEventBus, UserEvents } from '@medease/events';

export type SecurityEventTypeName =
  | 'login_success'
  | 'login_failure'
  | 'logout'
  | 'token_refresh'
  | 'token_reuse_detected'
  | 'session_revoked'
  | 'account_locked'
  | 'account_unlocked'
  | 'password_changed';

export interface SecurityEventInput {
  eventType: SecurityEventTypeName;
  tenantId?: string;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class SecurityEventService {
  constructor(private readonly eventBus: DomainEventBus) {}

  async record(input: SecurityEventInput): Promise<void> {
    const context = auditContextForAuth({
      tenantId: input.tenantId,
      userId: input.userId,
      sessionId: input.sessionId,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });

    const authPayload = {
      tenantId: input.tenantId,
      userId: input.userId,
      sessionId: input.sessionId,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      metadata: input.metadata,
    };

    switch (input.eventType) {
      case 'login_success':
        await this.eventBus.publish(
          UserEvents.userLoggedIn(authPayload, context),
        );
        break;
      case 'login_failure':
        await this.eventBus.publish(
          UserEvents.userLoginFailed(authPayload, context),
        );
        break;
      case 'logout':
        await this.eventBus.publish(
          UserEvents.userLoggedOut(authPayload, context),
        );
        break;
      case 'token_refresh':
        await this.eventBus.publish(
          UserEvents.tokenRefreshed(authPayload, context),
        );
        break;
      case 'account_locked':
        await this.eventBus.publish(
          UserEvents.accountLocked(authPayload, context),
        );
        break;
      default:
        await this.eventBus.publish(
          createDomainEvent(
            `SecurityEvent:${input.eventType}`,
            authPayload,
            context,
          ),
        );
        break;
    }
  }
}
