import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DomainEventBus, UserEvents } from '@medease/events';
import type {
  AssignRoleInput,
  CreatePolicyInput,
  CreateUserInput,
  DelegateAccessInput,
  EndBreakGlassInput,
  GrantConsentInput,
  IamFavorite,
  IamFilters,
  InviteUserInput,
  RevokeSessionInput,
  ShareIamInput,
  StartBreakGlassInput,
} from '@medease/iam-contract';

import { RequestContextService } from '../tenant/request-context.service';
import { IamRepository } from './iam.repository';

@Injectable()
export class IamService {
  constructor(
    private readonly repository: IamRepository,
    private readonly requestContext: RequestContextService,
    private readonly eventBus: DomainEventBus,
  ) {}

  private resolveTenantId(tenantId?: string): string {
    const contextTenantId = this.requestContext.requireTenantId();
    if (tenantId && tenantId !== contextTenantId) {
      throw new BadRequestException('Tenant scope mismatch');
    }
    return tenantId ?? contextTenantId;
  }

  private assertTenantScope(tenantId: string): void {
    const contextTenantId = this.requestContext.requireTenantId();
    if (tenantId !== contextTenantId) {
      throw new BadRequestException('Tenant scope mismatch');
    }
  }

  private async requireUser(userId: string) {
    const user = await this.repository.getUser(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  dashboard(tenantId?: string) {
    return this.repository.dashboard(this.resolveTenantId(tenantId));
  }

  analytics(tenantId?: string) {
    return this.repository.analytics(this.resolveTenantId(tenantId));
  }

  getUsers(filters?: IamFilters) {
    if (filters?.tenantId) this.assertTenantScope(filters.tenantId);
    return this.repository.getUsers(filters);
  }

  async getUser(userId: string) {
    const user = await this.repository.getUser(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  getTenants(filters?: IamFilters) {
    return this.repository.getTenants(filters);
  }

  getOrganizations(filters?: IamFilters) {
    if (filters?.tenantId) this.assertTenantScope(filters.tenantId);
    return this.repository.getOrganizations(filters);
  }

  getRoles(filters?: IamFilters) {
    return this.repository.getRoles(filters);
  }

  getPermissions(filters?: IamFilters) {
    return this.repository.getPermissions(filters);
  }

  getPolicies(filters?: IamFilters) {
    if (filters?.tenantId) this.assertTenantScope(filters.tenantId);
    return this.repository.getPolicies(filters);
  }

  getSessions(filters?: IamFilters) {
    return this.repository.getSessions(filters);
  }

  getLoginHistory(filters?: IamFilters) {
    return this.repository.getLoginHistory(filters);
  }

  getMfaDevices(filters?: IamFilters) {
    return this.repository.getMfaDevices(filters);
  }

  getTrustedDevices(filters?: IamFilters) {
    return this.repository.getTrustedDevices(filters);
  }

  getOauthClients(filters?: IamFilters) {
    if (filters?.tenantId) this.assertTenantScope(filters.tenantId);
    return this.repository.getOauthClients(filters);
  }

  getApiKeys(filters?: IamFilters) {
    if (filters?.tenantId) this.assertTenantScope(filters.tenantId);
    return this.repository.getApiKeys(filters);
  }

  getConsents(filters?: IamFilters) {
    return this.repository.getConsents(filters);
  }

  getDelegations(filters?: IamFilters) {
    return this.repository.getDelegations(filters);
  }

  getProxyAccess(filters?: IamFilters) {
    return this.repository.getProxyAccess(filters);
  }

  getBreakGlass(filters?: IamFilters) {
    return this.repository.getBreakGlass(filters);
  }

  getAuditEvents(filters?: IamFilters) {
    if (filters?.tenantId) this.assertTenantScope(filters.tenantId);
    return this.repository.getAuditEvents(filters);
  }

  getSecurityIncidents(filters?: IamFilters) {
    return this.repository.getSecurityIncidents(filters);
  }

  getRiskScores(filters?: IamFilters) {
    return this.repository.getRiskScores(filters);
  }

  getSamlProviders(filters?: IamFilters) {
    if (filters?.tenantId) this.assertTenantScope(filters.tenantId);
    return this.repository.getSamlProviders(filters);
  }

  getOidcProviders(filters?: IamFilters) {
    if (filters?.tenantId) this.assertTenantScope(filters.tenantId);
    return this.repository.getOidcProviders(filters);
  }

  async createUser(input: CreateUserInput) {
    this.assertTenantScope(input.tenantId);
    const user = await this.repository.createUser(input);
    await this.eventBus.publish(
      UserEvents.userCreated({
        resourceType: 'user',
        resourceId: user.userId,
        tenantId: input.tenantId,
      }),
    );
    return user;
  }

  async inviteUser(input: InviteUserInput) {
    return this.createUser({
      ...input,
      displayName: input.email.split('@')[0] ?? 'Invited User',
    });
  }

  async lockAccount(userId: string) {
    const existing = await this.requireUser(userId);
    try {
      const user = await this.repository.lockAccount(userId);
      await this.eventBus.publish(
        UserEvents.userAccountLocked({
          resourceType: 'user',
          resourceId: userId,
          tenantId: existing.tenantId,
        }),
      );
      return user;
    } catch {
      throw new NotFoundException('User not found');
    }
  }

  async unlockAccount(userId: string) {
    const existing = await this.requireUser(userId);
    try {
      const user = await this.repository.unlockAccount(userId);
      await this.eventBus.publish(
        UserEvents.userAccountUnlocked({
          resourceType: 'user',
          resourceId: userId,
          tenantId: existing.tenantId,
        }),
      );
      return user;
    } catch {
      throw new NotFoundException('User not found');
    }
  }

  async assignRole(input: AssignRoleInput) {
    const existing = await this.requireUser(input.userId);
    try {
      const user = await this.repository.assignRole(input);
      await this.eventBus.publish(
        UserEvents.roleAssigned({
          resourceType: 'role',
          resourceId: input.roleId,
          tenantId: existing.tenantId,
        }),
      );
      return user;
    } catch {
      throw new NotFoundException('User not found');
    }
  }

  async removeRole(input: AssignRoleInput) {
    const existing = await this.requireUser(input.userId);
    try {
      const user = await this.repository.removeRole(input);
      await this.eventBus.publish(
        UserEvents.roleRemoved({
          resourceType: 'role',
          resourceId: input.roleId,
          tenantId: existing.tenantId,
        }),
      );
      return user;
    } catch {
      throw new NotFoundException('User not found');
    }
  }

  async createPolicy(input: CreatePolicyInput) {
    if (input.tenantId) this.assertTenantScope(input.tenantId);
    const policy = await this.repository.createPolicy(input);
    await this.eventBus.publish(
      UserEvents.policyCreated({
        resourceType: 'policy',
        resourceId: policy.policyId,
        tenantId: input.tenantId ?? this.requestContext.requireTenantId(),
      }),
    );
    return policy;
  }

  async enableMfa(userId: string) {
    const existing = await this.requireUser(userId);
    try {
      const user = await this.repository.enableMfa(userId);
      await this.eventBus.publish(
        UserEvents.mfaEnabled({
          resourceType: 'user',
          resourceId: userId,
          tenantId: existing.tenantId,
        }),
      );
      return user;
    } catch {
      throw new NotFoundException('User not found');
    }
  }

  async disableMfa(userId: string) {
    const existing = await this.requireUser(userId);
    try {
      const user = await this.repository.disableMfa(userId);
      await this.eventBus.publish(
        UserEvents.mfaDisabled({
          resourceType: 'user',
          resourceId: userId,
          tenantId: existing.tenantId,
        }),
      );
      return user;
    } catch {
      throw new NotFoundException('User not found');
    }
  }

  async revokeSession(input: RevokeSessionInput) {
    try {
      const session = await this.repository.revokeSession(input);
      await this.eventBus.publish(
        UserEvents.sessionRevoked({
          resourceType: 'session',
          resourceId: session.sessionId,
          tenantId: this.requestContext.requireTenantId(),
        }),
      );
      return session;
    } catch {
      throw new NotFoundException('Session not found');
    }
  }

  async createOAuthClient(name: string, tenantId: string) {
    this.assertTenantScope(tenantId);
    const client = await this.repository.createOAuthClient(name, tenantId);
    await this.eventBus.publish(
      UserEvents.oauthClientCreated({
        resourceType: 'client',
        resourceId: client.clientId,
        tenantId,
      }),
    );
    return client;
  }

  async rotateApiKey(keyId: string) {
    try {
      const key = await this.repository.rotateApiKey(keyId);
      await this.eventBus.publish(
        UserEvents.apiKeyRotated({
          resourceType: 'api_key',
          resourceId: keyId,
          tenantId: key.tenantId,
        }),
      );
      return key;
    } catch {
      throw new NotFoundException('API key not found');
    }
  }

  async grantConsent(input: GrantConsentInput) {
    const consent = await this.repository.grantConsent(input);
    await this.eventBus.publish(
      UserEvents.consentGranted({
        resourceType: 'consent',
        resourceId: consent.consentId,
      }),
    );
    return consent;
  }

  async revokeConsent(consentId: string) {
    try {
      const consent = await this.repository.revokeConsent(consentId);
      await this.eventBus.publish(
        UserEvents.consentRevoked({
          resourceType: 'consent',
          resourceId: consentId,
        }),
      );
      return consent;
    } catch {
      throw new NotFoundException('Consent not found');
    }
  }

  async delegateAccess(input: DelegateAccessInput) {
    const delegation = await this.repository.delegateAccess(input);
    await this.eventBus.publish(
      UserEvents.accessDelegated({
        resourceType: 'delegation',
        resourceId: delegation.delegationId,
      }),
    );
    return delegation;
  }

  async startBreakGlass(input: StartBreakGlassInput) {
    const event = await this.repository.startBreakGlass(input);
    await this.eventBus.publish(
      UserEvents.breakGlassStarted({
        resourceType: 'break_glass',
        resourceId: event.eventId,
      }),
    );
    return event;
  }

  async endBreakGlass(input: EndBreakGlassInput) {
    try {
      const event = await this.repository.endBreakGlass(input);
      await this.eventBus.publish(
        UserEvents.breakGlassEnded({
          resourceType: 'break_glass',
          resourceId: event.eventId,
        }),
      );
      return event;
    } catch {
      throw new NotFoundException('Break-glass event not found');
    }
  }

  search(query: string, tenantId?: string) {
    return this.repository.search(query, this.resolveTenantId(tenantId));
  }

  async exportData(format: 'csv' | 'pdf' | 'xlsx') {
    const result = await this.repository.exportData(format);
    await this.eventBus.publish(
      UserEvents.dataExported({
        resourceType: 'iam',
        tenantId: this.requestContext.requireTenantId(),
        metadata: { format },
      }),
    );
    return result;
  }

  favorite(
    userId: string,
    entityType: IamFavorite['entityType'],
    entityId: string,
  ) {
    return this.repository.favorite(userId, entityType, entityId);
  }

  getFavorites(userId: string) {
    return this.repository.getFavorites(userId);
  }

  async share(input: ShareIamInput) {
    const result = await this.repository.share(input);
    await this.eventBus.publish(
      UserEvents.entityShared({
        resourceType: input.entityType,
        resourceId: input.entityId,
      }),
    );
    return result;
  }
}
