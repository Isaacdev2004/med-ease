import { Injectable } from '@nestjs/common';

import { ALL_PERMISSIONS, hashPassword } from '@medease/auth';
import type {
  AssignRoleInput,
  CreatePolicyInput,
  CreateUserInput,
  DelegateAccessInput,
  EndBreakGlassInput,
  GrantConsentInput,
  IamAnalytics,
  IamDashboard,
  IamFavorite,
  IamFilters,
  InviteUserInput,
  PaginatedResult,
  RevokeSessionInput,
  ShareIamInput,
  StartBreakGlassInput,
} from '@medease/iam-contract';
import {
  buildExportResult,
  normalizePagination,
  Prisma,
  PrismaService,
  TenantAwareRepository,
  toContractPaginated,
  toPaginatedResult,
} from '@medease/prisma';
import { newId } from '@medease/uuid';

import {
  generateClientSecret,
  matchQ,
  randomTempPassword,
} from './iam.helpers';
import {
  mapApiKey,
  mapAuditEvent,
  mapBreakGlass,
  mapConsent,
  mapDelegation,
  mapLoginAttempt,
  mapMfaDevice,
  mapOAuthClient,
  mapOidcProvider,
  mapOrganization,
  mapPermission,
  mapPolicy,
  mapProxyAccess,
  mapRiskScore,
  mapRole,
  mapSamlProvider,
  mapSecurityIncident,
  mapSession,
  mapTenant,
  mapTrustedDevice,
  mapUser,
} from './iam.mapper';

const USER_INCLUDE = {
  roleAssignments: { include: { role: true } },
} as const;

@Injectable()
export class IamRepository extends TenantAwareRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  /** login_attempts is system-only under RLS; scope reads to tenant users via system context. */
  private async withTenantLoginAttempts<T>(
    scopeTenantId: string,
    fn: (tx: Prisma.TransactionClient, tenantFilter: Prisma.LoginAttemptWhereInput) => Promise<T>,
  ): Promise<T> {
    return this.prisma.runInSystemTransaction(async (tx) => {
      const tenantUsers = await tx.user.findMany({
        where: { tenantId: scopeTenantId },
        select: { id: true, email: true },
      });

      const tenantFilter: Prisma.LoginAttemptWhereInput =
        tenantUsers.length === 0
          ? { id: '00000000-0000-0000-0000-000000000000' }
          : {
              OR: [
                { userId: { in: tenantUsers.map((user) => user.id) } },
                { email: { in: tenantUsers.map((user) => user.email) } },
              ],
            };

      return fn(tx, tenantFilter);
    });
  }

  async dashboard(tenantId?: string): Promise<IamDashboard> {
    const scopeTenantId = tenantId ?? this.tenantId;
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const loginMetrics = await this.withTenantLoginAttempts(scopeTenantId, async (tx, tenantFilter) => {
      const [failedLogins24h, logins] = await Promise.all([
        tx.loginAttempt.count({
          where: { AND: [tenantFilter, { success: false, attemptedAt: { gte: since24h } }] },
        }),
        tx.loginAttempt.findMany({
          where: { AND: [tenantFilter, { attemptedAt: { gte: since24h } }] },
          select: { attemptedAt: true, success: true },
          take: 500,
        }),
      ]);

      return { failedLogins24h, logins };
    });

    return this.prisma.runInTransaction(async (tx) => {
      const [
        totalUsers,
        activeSessions,
        mfaUsers,
        activePolicies,
        openIncidents,
        breakGlassActive,
        sessions,
        incidents,
        auditLogs,
      ] = await Promise.all([
        tx.user.count({ where: { tenantId: scopeTenantId } }),
        tx.userSession.count({ where: { tenantId: scopeTenantId, status: 'active' } }),
        tx.user.count({ where: { tenantId: scopeTenantId, mfaEnabled: true } }),
        tx.iamPolicyRecord.count({
          where: {
            enabled: true,
            OR: [{ tenantId: null }, { tenantId: scopeTenantId }],
          },
        }),
        tx.securityIncident.count({ where: { status: { not: 'resolved' } } }),
        tx.breakGlassEvent.count({ where: { tenantId: scopeTenantId, status: 'active' } }),
        tx.userSession.findMany({
          where: { tenantId: scopeTenantId },
          select: { startedAt: true },
          take: 500,
        }),
        tx.securityIncident.findMany({
          where: { status: { not: 'resolved' } },
          orderBy: { detectedAt: 'desc' },
          take: 5,
        }),
        tx.iamAuditLog.findMany({
          where: { OR: [{ tenantId: null }, { tenantId: scopeTenantId }] },
          orderBy: { createdAt: 'desc' },
          take: 8,
        }),
      ]);

      const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const sessionTrend = dayLabels.map((label, index) => ({
        label,
        value: Math.max(0, Math.round(sessions.length / 7) + index * 2),
      }));

      const hourLabels = ['00h', '04h', '08h', '12h', '16h', '20h'];
      const loginTrend = hourLabels.map((label, index) => ({
        label,
        value: Math.max(0, Math.round(loginMetrics.logins.length / 6) + index * 3),
      }));

      return {
        totalUsers,
        activeSessions,
        mfaAdoptionRate: totalUsers === 0 ? 0 : Math.round((mfaUsers / totalUsers) * 100),
        failedLogins24h: loginMetrics.failedLogins24h,
        activePolicies,
        openIncidents,
        breakGlassActive,
        sessionTrend,
        loginTrend,
        recentIncidents: incidents.map(mapSecurityIncident),
        recentAudit: auditLogs.map(mapAuditEvent),
      };
    });
  }

  async analytics(tenantId?: string): Promise<IamAnalytics> {
    const dashboard = await this.dashboard(tenantId);
    const scopeTenantId = tenantId ?? this.tenantId;

    const loginSample = await this.withTenantLoginAttempts(scopeTenantId, async (tx, tenantFilter) =>
      tx.loginAttempt.findMany({
        where: tenantFilter,
        take: 200,
        select: { success: true },
      }),
    );

    return this.prisma.runInTransaction(async (tx) => {
      const [users, sessions, policies, breakGlass, consents, riskScores, auditCount] =
        await Promise.all([
          tx.user.count({ where: { tenantId: scopeTenantId } }),
          tx.userSession.findMany({
            where: { tenantId: scopeTenantId },
            select: { startedAt: true, lastActivityAt: true },
            take: 200,
          }),
          tx.iamPolicyRecord.findMany({
            where: { OR: [{ tenantId: null }, { tenantId: scopeTenantId }] },
            select: { effect: true },
          }),
          tx.breakGlassEvent.count({ where: { tenantId: scopeTenantId } }),
          tx.consentRecord.findMany({ where: { tenantId: scopeTenantId }, select: { status: true } }),
          tx.riskScore.findMany({ where: { tenantId: scopeTenantId }, select: { score: true } }),
          tx.iamAuditLog.count({ where: { tenantId: scopeTenantId } }),
        ]);

      const avgDuration =
        sessions.length === 0
          ? 0
          : sessions.reduce((sum, session) => {
              const minutes =
                (session.lastActivityAt.getTime() - session.startedAt.getTime()) / 60_000;
              return sum + Math.max(0, minutes);
            }, 0) / sessions.length;

      const activeConsents = consents.filter((consent) => consent.status === 'active').length;
      const consentComplianceRate =
        consents.length === 0 ? 100 : Math.round((activeConsents / consents.length) * 100);

      const riskAverage =
        riskScores.length === 0
          ? 0
          : Math.round(
              (riskScores.reduce((sum, score) => sum + score.score, 0) / riskScores.length) * 100,
            );

      return {
        authenticationSuccessRate: Math.round(
          (loginSample.filter((login) => login.success).length / Math.max(loginSample.length, 1)) *
            100,
        ),
        mfaEnrollmentRate: dashboard.mfaAdoptionRate,
        averageSessionDuration: Math.round(avgDuration),
        policyDenialRate: Math.round(
          (policies.filter((policy) => policy.effect === 'deny').length /
            Math.max(policies.length, 1)) *
            100,
        ),
        breakGlassUsage: breakGlass * 10,
        consentComplianceRate,
        riskScoreAverage: riskAverage,
        authTrend: dashboard.loginTrend,
        accessByModule: [
          { label: 'Clinical', value: users * 80 },
          { label: 'Operations', value: users * 60 },
          { label: 'Intelligence', value: users * 40 },
          { label: 'IAM', value: auditCount * 10 },
          { label: 'Platform', value: users * 30 },
        ],
        incidentTrend: ['W1', 'W2', 'W3', 'W4'].map((label, index) => ({
          label,
          value: dashboard.openIncidents / 4 + index * 5,
        })),
      };
    });
  }

  async getUsers(filters?: IamFilters): Promise<PaginatedResult<ReturnType<typeof mapUser>>> {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const tenantId = filters?.tenantId ?? this.tenantId;

    return this.prisma.runInTransaction(async (tx) => {
      const where: Prisma.UserWhereInput = { tenantId };
      if (filters?.organizationId) where.organizationId = filters.organizationId;
      if (filters?.status) where.status = filters.status as Prisma.UserWhereInput['status'];
      if (filters?.q) {
        where.OR = [
          { email: { contains: filters.q, mode: 'insensitive' } },
          { fullName: { contains: filters.q, mode: 'insensitive' } },
          { id: filters.q },
        ];
      }

      const [items, total] = await Promise.all([
        tx.user.findMany({ where, skip, take, include: USER_INCLUDE, orderBy: { createdAt: 'desc' } }),
        tx.user.count({ where }),
      ]);

      return toContractPaginated(
        toPaginatedResult(items.map(mapUser), total, page, pageSize),
      );
    });
  }

  async getUser(userId: string) {
    return this.prisma.runInTransaction(async (tx) => {
      const user = await tx.user.findFirst({
        where: { id: userId, tenantId: this.tenantId },
        include: USER_INCLUDE,
      });
      return user ? mapUser(user) : null;
    });
  }

  async getTenants(filters?: IamFilters): Promise<PaginatedResult<ReturnType<typeof mapTenant>>> {
    const { page, pageSize, skip, take } = normalizePagination(filters);

    return this.prisma.runInTransaction(async (tx) => {
      const where: Prisma.TenantWhereInput = { id: this.tenantId };
      if (filters?.q) {
        where.OR = [
          { name: { contains: filters.q, mode: 'insensitive' } },
          { slug: { contains: filters.q, mode: 'insensitive' } },
        ];
      }

      const [tenants, total] = await Promise.all([
        tx.tenant.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
        tx.tenant.count({ where }),
      ]);

      const mapped = await Promise.all(
        tenants.map(async (tenant) => {
          const [organizations, users] = await Promise.all([
            tx.organization.count({ where: { tenantId: tenant.id } }),
            tx.user.count({ where: { tenantId: tenant.id } }),
          ]);
          return mapTenant(tenant, { organizations, users });
        }),
      );

      return toContractPaginated(toPaginatedResult(mapped, total, page, pageSize));
    });
  }

  async getOrganizations(filters?: IamFilters) {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const tenantId = filters?.tenantId ?? this.tenantId;

    return this.prisma.runInTransaction(async (tx) => {
      const where: Prisma.OrganizationWhereInput = { tenantId };
      if (filters?.q) {
        where.name = { contains: filters.q, mode: 'insensitive' };
      }

      const [items, total] = await Promise.all([
        tx.organization.findMany({ where, skip, take, orderBy: { name: 'asc' } }),
        tx.organization.count({ where }),
      ]);

      return toContractPaginated(
        toPaginatedResult(items.map((org) => mapOrganization(org)), total, page, pageSize),
      );
    });
  }

  async getRoles(filters?: IamFilters) {
    const { page, pageSize, skip, take } = normalizePagination(filters);

    return this.prisma.runInTransaction(async (tx) => {
      const where: Prisma.IamRoleRecordWhereInput = {
        OR: [{ tenantId: null }, { tenantId: this.tenantId }],
      };
      if (filters?.q) {
        where.AND = [
          {
            OR: [
              { name: { contains: filters.q, mode: 'insensitive' } },
              { description: { contains: filters.q, mode: 'insensitive' } },
            ],
          },
        ];
      }

      const [items, total] = await Promise.all([
        tx.iamRoleRecord.findMany({ where, skip, take, orderBy: { name: 'asc' } }),
        tx.iamRoleRecord.count({ where }),
      ]);

      return toContractPaginated(toPaginatedResult(items.map(mapRole), total, page, pageSize));
    });
  }

  async getPermissions(filters?: IamFilters) {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    let items = ALL_PERMISSIONS.map((name, index) => mapPermission(name, index));

    if (filters?.q) {
      items = items.filter((permission) =>
        matchQ(filters.q, permission.name, permission.module, permission.description),
      );
    }

    const total = items.length;
    const pageItems = items.slice(skip, skip + take);
    return toContractPaginated(toPaginatedResult(pageItems, total, page, pageSize));
  }

  async getPolicies(filters?: IamFilters) {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const tenantId = filters?.tenantId ?? this.tenantId;

    return this.prisma.runInTransaction(async (tx) => {
      const where: Prisma.IamPolicyRecordWhereInput = {
        OR: [{ tenantId: null }, { tenantId }],
      };
      if (filters?.q) {
        where.AND = [
          {
            OR: [
              { name: { contains: filters.q, mode: 'insensitive' } },
              { resource: { contains: filters.q, mode: 'insensitive' } },
            ],
          },
        ];
      }

      const [items, total] = await Promise.all([
        tx.iamPolicyRecord.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
        tx.iamPolicyRecord.count({ where }),
      ]);

      return toContractPaginated(toPaginatedResult(items.map(mapPolicy), total, page, pageSize));
    });
  }

  async getSessions(filters?: IamFilters) {
    const { page, pageSize, skip, take } = normalizePagination(filters);

    return this.prisma.runInTransaction(async (tx) => {
      const where: Prisma.UserSessionWhereInput = { tenantId: this.tenantId };
      if (filters?.userId) where.userId = filters.userId;
      if (filters?.status) where.status = filters.status as Prisma.UserSessionWhereInput['status'];

      const [items, total] = await Promise.all([
        tx.userSession.findMany({ where, skip, take, orderBy: { startedAt: 'desc' } }),
        tx.userSession.count({ where }),
      ]);

      return toContractPaginated(toPaginatedResult(items.map(mapSession), total, page, pageSize));
    });
  }

  async getLoginHistory(filters?: IamFilters) {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const scopeTenantId = filters?.tenantId ?? this.tenantId;

    return this.withTenantLoginAttempts(scopeTenantId, async (tx, tenantFilter) => {
      const extra: Prisma.LoginAttemptWhereInput = {};
      if (filters?.userId) extra.userId = filters.userId;
      if (filters?.q) extra.email = { contains: filters.q, mode: 'insensitive' };

      const where: Prisma.LoginAttemptWhereInput =
        Object.keys(extra).length > 0 ? { AND: [tenantFilter, extra] } : tenantFilter;

      const [items, total] = await Promise.all([
        tx.loginAttempt.findMany({ where, skip, take, orderBy: { attemptedAt: 'desc' } }),
        tx.loginAttempt.count({ where }),
      ]);

      return toContractPaginated(
        toPaginatedResult(items.map(mapLoginAttempt), total, page, pageSize),
      );
    });
  }

  async getMfaDevices(filters?: IamFilters) {
    const { page, pageSize, skip, take } = normalizePagination(filters);

    return this.prisma.runInTransaction(async (tx) => {
      const where: Prisma.MfaDeviceWhereInput = { tenantId: this.tenantId };
      if (filters?.userId) where.userId = filters.userId;

      const [items, total] = await Promise.all([
        tx.mfaDevice.findMany({ where, skip, take, orderBy: { registeredAt: 'desc' } }),
        tx.mfaDevice.count({ where }),
      ]);

      return toContractPaginated(toPaginatedResult(items.map(mapMfaDevice), total, page, pageSize));
    });
  }

  async getTrustedDevices(filters?: IamFilters) {
    const { page, pageSize, skip, take } = normalizePagination(filters);

    return this.prisma.runInTransaction(async (tx) => {
      const where: Prisma.TrustedDeviceWhereInput = { tenantId: this.tenantId };
      if (filters?.userId) where.userId = filters.userId;

      const [items, total] = await Promise.all([
        tx.trustedDevice.findMany({ where, skip, take, orderBy: { lastSeenAt: 'desc' } }),
        tx.trustedDevice.count({ where }),
      ]);

      return toContractPaginated(
        toPaginatedResult(items.map(mapTrustedDevice), total, page, pageSize),
      );
    });
  }

  async getOauthClients(filters?: IamFilters) {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const tenantId = filters?.tenantId ?? this.tenantId;

    return this.prisma.runInTransaction(async (tx) => {
      const where: Prisma.OAuthClientWhereInput = { tenantId };
      if (filters?.q) {
        where.OR = [
          { name: { contains: filters.q, mode: 'insensitive' } },
          { id: filters.q },
        ];
      }

      const [items, total] = await Promise.all([
        tx.oAuthClient.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
        tx.oAuthClient.count({ where }),
      ]);

      return toContractPaginated(toPaginatedResult(items.map(mapOAuthClient), total, page, pageSize));
    });
  }

  async getApiKeys(filters?: IamFilters) {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const tenantId = filters?.tenantId ?? this.tenantId;

    return this.prisma.runInTransaction(async (tx) => {
      const where: Prisma.ApiKeyWhereInput = { tenantId };
      if (filters?.q) {
        where.OR = [
          { name: { contains: filters.q, mode: 'insensitive' } },
          { id: filters.q },
          { prefix: { contains: filters.q, mode: 'insensitive' } },
        ];
      }

      const [items, total] = await Promise.all([
        tx.apiKey.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
        tx.apiKey.count({ where }),
      ]);

      return toContractPaginated(toPaginatedResult(items.map(mapApiKey), total, page, pageSize));
    });
  }

  async getConsents(filters?: IamFilters) {
    const { page, pageSize, skip, take } = normalizePagination(filters);

    return this.prisma.runInTransaction(async (tx) => {
      const where: Prisma.ConsentRecordWhereInput = { tenantId: this.tenantId };
      if (filters?.userId) where.granteeId = filters.userId;
      if (filters?.patientId) where.patientId = filters.patientId;

      const [items, total] = await Promise.all([
        tx.consentRecord.findMany({ where, skip, take, orderBy: { grantedAt: 'desc' } }),
        tx.consentRecord.count({ where }),
      ]);

      return toContractPaginated(toPaginatedResult(items.map(mapConsent), total, page, pageSize));
    });
  }

  async getDelegations(filters?: IamFilters) {
    const { page, pageSize, skip, take } = normalizePagination(filters);

    return this.prisma.runInTransaction(async (tx) => {
      const where: Prisma.DelegationRecordWhereInput = { tenantId: this.tenantId };
      if (filters?.userId) {
        where.OR = [{ delegatorId: filters.userId }, { delegateId: filters.userId }];
      }

      const [items, total] = await Promise.all([
        tx.delegationRecord.findMany({ where, skip, take, orderBy: { startsAt: 'desc' } }),
        tx.delegationRecord.count({ where }),
      ]);

      return toContractPaginated(
        toPaginatedResult(items.map(mapDelegation), total, page, pageSize),
      );
    });
  }

  async getProxyAccess(filters?: IamFilters) {
    const { page, pageSize, skip, take } = normalizePagination(filters);

    return this.prisma.runInTransaction(async (tx) => {
      const where: Prisma.ProxyAccessWhereInput = { tenantId: this.tenantId };
      if (filters?.patientId) where.patientId = filters.patientId;

      const [items, total] = await Promise.all([
        tx.proxyAccess.findMany({ where, skip, take, orderBy: { grantedAt: 'desc' } }),
        tx.proxyAccess.count({ where }),
      ]);

      return toContractPaginated(
        toPaginatedResult(items.map(mapProxyAccess), total, page, pageSize),
      );
    });
  }

  async getBreakGlass(filters?: IamFilters) {
    const { page, pageSize, skip, take } = normalizePagination(filters);

    return this.prisma.runInTransaction(async (tx) => {
      const where: Prisma.BreakGlassEventWhereInput = { tenantId: this.tenantId };
      if (filters?.userId) where.userId = filters.userId;
      if (filters?.status) where.status = filters.status;

      const [items, total] = await Promise.all([
        tx.breakGlassEvent.findMany({ where, skip, take, orderBy: { startedAt: 'desc' } }),
        tx.breakGlassEvent.count({ where }),
      ]);

      return toContractPaginated(
        toPaginatedResult(items.map(mapBreakGlass), total, page, pageSize),
      );
    });
  }

  async getAuditEvents(filters?: IamFilters) {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const tenantId = filters?.tenantId ?? this.tenantId;

    return this.prisma.runInTransaction(async (tx) => {
      const where: Prisma.IamAuditLogWhereInput = {
        OR: [{ tenantId: null }, { tenantId }],
      };
      if (filters?.userId) where.actorId = filters.userId;
      if (filters?.q) {
        where.AND = [
          {
            OR: [
              { action: { contains: filters.q, mode: 'insensitive' } },
              { resourceType: { contains: filters.q, mode: 'insensitive' } },
            ],
          },
        ];
      }

      const [items, total] = await Promise.all([
        tx.iamAuditLog.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
        tx.iamAuditLog.count({ where }),
      ]);

      return toContractPaginated(toPaginatedResult(items.map(mapAuditEvent), total, page, pageSize));
    });
  }

  async getSecurityIncidents(filters?: IamFilters) {
    const { page, pageSize, skip, take } = normalizePagination(filters);

    return this.prisma.runInTransaction(async (tx) => {
      const where: Prisma.SecurityIncidentWhereInput = {};
      if (filters?.status) where.status = filters.status;

      const [items, total] = await Promise.all([
        tx.securityIncident.findMany({ where, skip, take, orderBy: { detectedAt: 'desc' } }),
        tx.securityIncident.count({ where }),
      ]);

      return toContractPaginated(
        toPaginatedResult(items.map(mapSecurityIncident), total, page, pageSize),
      );
    });
  }

  async getRiskScores(filters?: IamFilters) {
    const { page, pageSize, skip, take } = normalizePagination(filters);

    return this.prisma.runInTransaction(async (tx) => {
      const where: Prisma.RiskScoreWhereInput = { tenantId: this.tenantId };
      if (filters?.userId) where.userId = filters.userId;

      const [items, total] = await Promise.all([
        tx.riskScore.findMany({ where, skip, take, orderBy: { assessedAt: 'desc' } }),
        tx.riskScore.count({ where }),
      ]);

      return toContractPaginated(toPaginatedResult(items.map(mapRiskScore), total, page, pageSize));
    });
  }

  async getSamlProviders(filters?: IamFilters) {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const tenantId = filters?.tenantId ?? this.tenantId;

    return this.prisma.runInTransaction(async (tx) => {
      const where: Prisma.SamlProviderWhereInput = { tenantId };

      const [items, total] = await Promise.all([
        tx.samlProvider.findMany({ where, skip, take, orderBy: { name: 'asc' } }),
        tx.samlProvider.count({ where }),
      ]);

      return toContractPaginated(
        toPaginatedResult(items.map(mapSamlProvider), total, page, pageSize),
      );
    });
  }

  async getOidcProviders(filters?: IamFilters) {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const tenantId = filters?.tenantId ?? this.tenantId;

    return this.prisma.runInTransaction(async (tx) => {
      const where: Prisma.OidcProviderWhereInput = { tenantId };

      const [items, total] = await Promise.all([
        tx.oidcProvider.findMany({ where, skip, take, orderBy: { name: 'asc' } }),
        tx.oidcProvider.count({ where }),
      ]);

      return toContractPaginated(
        toPaginatedResult(items.map(mapOidcProvider), total, page, pageSize),
      );
    });
  }

  async createUser(input: CreateUserInput) {
    const passwordHash = await hashPassword(randomTempPassword());

    return this.prisma.runInTransaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          id: newId(),
          email: input.email.trim().toLowerCase(),
          fullName: input.displayName,
          tenantId: input.tenantId,
          organizationId: input.organizationId,
          passwordHash,
          role: 'physician',
          status: 'pending',
          roleAssignments: {
            create: input.roleIds.map((roleId) => ({
              roleId,
            })),
          },
        },
        include: USER_INCLUDE,
      });

      return mapUser(user);
    });
  }

  async inviteUser(input: InviteUserInput) {
    return this.createUser({
      ...input,
      displayName: input.email.split('@')[0] ?? 'Invited User',
    });
  }

  async lockAccount(userId: string) {
    return this.prisma.runInTransaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: userId, tenantId: this.tenantId },
        data: { status: 'locked' },
        include: USER_INCLUDE,
      });
      return mapUser(user);
    });
  }

  async unlockAccount(userId: string) {
    return this.prisma.runInTransaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: userId, tenantId: this.tenantId },
        data: { status: 'active', lockedUntil: null, failedLoginCount: 0 },
        include: USER_INCLUDE,
      });
      return mapUser(user);
    });
  }

  async assignRole(input: AssignRoleInput) {
    return this.prisma.runInTransaction(async (tx) => {
      const user = await tx.user.findFirstOrThrow({
        where: { id: input.userId, tenantId: this.tenantId },
        include: USER_INCLUDE,
      });

      await tx.userRoleAssignment.upsert({
        where: { userId_roleId: { userId: input.userId, roleId: input.roleId } },
        create: { userId: input.userId, roleId: input.roleId },
        update: {},
      });

      const refreshed = await tx.user.findFirstOrThrow({
        where: { id: input.userId },
        include: USER_INCLUDE,
      });

      return mapUser(refreshed);
    });
  }

  async removeRole(input: AssignRoleInput) {
    return this.prisma.runInTransaction(async (tx) => {
      const user = await tx.user.findFirstOrThrow({
        where: { id: input.userId, tenantId: this.tenantId },
        include: USER_INCLUDE,
      });

      await tx.userRoleAssignment.deleteMany({
        where: { userId: input.userId, roleId: input.roleId },
      });

      const refreshed = await tx.user.findFirstOrThrow({
        where: { id: input.userId },
        include: USER_INCLUDE,
      });

      return mapUser(refreshed);
    });
  }

  async createPolicy(input: CreatePolicyInput) {
    return this.prisma.runInTransaction(async (tx) => {
      const policy = await tx.iamPolicyRecord.create({
        data: {
          id: newId(),
          name: input.name,
          description: input.description,
          effect: input.effect,
          resource: input.resource,
          action: input.action,
          tenantId: input.tenantId ?? this.tenantId,
          enabled: true,
        },
      });

      return mapPolicy(policy);
    });
  }

  async enableMfa(userId: string) {
    return this.prisma.runInTransaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: userId, tenantId: this.tenantId },
        data: { mfaEnabled: true },
        include: USER_INCLUDE,
      });
      return mapUser(user);
    });
  }

  async disableMfa(userId: string) {
    return this.prisma.runInTransaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: userId, tenantId: this.tenantId },
        data: { mfaEnabled: false },
        include: USER_INCLUDE,
      });
      return mapUser(user);
    });
  }

  async revokeSession(input: RevokeSessionInput) {
    return this.prisma.runInTransaction(async (tx) => {
      const session = await tx.userSession.update({
        where: { id: input.sessionId, tenantId: this.tenantId },
        data: { status: 'revoked', revokedAt: new Date() },
      });
      return mapSession(session);
    });
  }

  async createOAuthClient(name: string, tenantId: string) {
    return this.prisma.runInTransaction(async (tx) => {
      const client = await tx.oAuthClient.create({
        data: {
          id: newId(),
          name,
          tenantId,
          clientSecret: generateClientSecret(),
          redirectUris: ['https://localhost/callback'],
          scopes: ['openid', 'profile'],
          status: 'active',
        },
      });

      return mapOAuthClient(client);
    });
  }

  async rotateApiKey(keyId: string) {
    return this.prisma.runInTransaction(async (tx) => {
      const key = await tx.apiKey.update({
        where: { id: keyId, tenantId: this.tenantId },
        data: {
          prefix: `mk_${Date.now().toString(36).slice(0, 8)}`,
          createdAt: new Date(),
        },
      });

      return mapApiKey(key);
    });
  }

  async grantConsent(input: GrantConsentInput) {
    return this.prisma.runInTransaction(async (tx) => {
      const consent = await tx.consentRecord.create({
        data: {
          id: newId(),
          tenantId: this.tenantId,
          patientId: input.patientId,
          granteeId: input.granteeId,
          purpose: input.purpose,
          status: 'active',
          expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
        },
      });

      return mapConsent(consent);
    });
  }

  async revokeConsent(consentId: string) {
    return this.prisma.runInTransaction(async (tx) => {
      const consent = await tx.consentRecord.update({
        where: { id: consentId, tenantId: this.tenantId },
        data: { status: 'revoked', revokedAt: new Date() },
      });

      return mapConsent(consent);
    });
  }

  async delegateAccess(input: DelegateAccessInput) {
    return this.prisma.runInTransaction(async (tx) => {
      const delegation = await tx.delegationRecord.create({
        data: {
          id: newId(),
          tenantId: this.tenantId,
          delegatorId: input.delegatorId,
          delegateId: input.delegateId,
          scope: input.scope,
          endsAt: new Date(input.endsAt),
          status: 'active',
        },
      });

      return mapDelegation(delegation);
    });
  }

  async startBreakGlass(input: StartBreakGlassInput) {
    return this.prisma.runInTransaction(async (tx) => {
      const event = await tx.breakGlassEvent.create({
        data: {
          id: newId(),
          tenantId: this.tenantId,
          userId: input.userId,
          patientId: input.patientId,
          reason: input.reason,
          status: 'active',
        },
      });

      return mapBreakGlass(event);
    });
  }

  async endBreakGlass(input: EndBreakGlassInput) {
    return this.prisma.runInTransaction(async (tx) => {
      const event = await tx.breakGlassEvent.update({
        where: { id: input.eventId, tenantId: this.tenantId },
        data: { status: 'ended', endedAt: new Date() },
      });

      return mapBreakGlass(event);
    });
  }

  async search(query: string, tenantId?: string) {
    const scopeTenantId = tenantId ?? this.tenantId;

    return this.prisma.runInTransaction(async (tx) => {
      const users = await tx.user.findMany({
        where: {
          tenantId: scopeTenantId,
          OR: [
            { email: { contains: query, mode: 'insensitive' } },
            { fullName: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: USER_INCLUDE,
        take: 10,
      });

      const policies = await tx.iamPolicyRecord.findMany({
        where: {
          OR: [{ tenantId: null }, { tenantId: scopeTenantId }],
          name: { contains: query, mode: 'insensitive' },
        },
        take: 10,
      });

      return {
        users: users.map(mapUser),
        policies: policies.map(mapPolicy),
      };
    });
  }

  async exportData(format: 'csv' | 'pdf' | 'xlsx') {
    return this.prisma.runInTransaction(async (tx) => {
      const [userCount, policyCount] = await Promise.all([
        tx.user.count({ where: { tenantId: this.tenantId } }),
        tx.iamPolicyRecord.count({
          where: { OR: [{ tenantId: null }, { tenantId: this.tenantId }] },
        }),
      ]);

      return buildExportResult(format, userCount + policyCount);
    });
  }

  async favorite(
    userId: string,
    entityType: IamFavorite['entityType'],
    entityId: string,
  ): Promise<IamFavorite> {
    return this.prisma.runInTransaction(async (tx) => {
      const favorite = await tx.iamFavorite.upsert({
        where: {
          userId_entityType_entityId: { userId, entityType, entityId },
        },
        create: {
          id: newId(),
          userId,
          entityType,
          entityId,
        },
        update: {},
      });

      return {
        userId: favorite.userId,
        entityType: favorite.entityType as IamFavorite['entityType'],
        entityId: favorite.entityId,
        createdAt: favorite.createdAt.toISOString(),
      };
    });
  }

  async getFavorites(userId: string): Promise<IamFavorite[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const favorites = await tx.iamFavorite.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      return favorites.map((favorite: Prisma.IamFavoriteGetPayload<object>) => ({
        userId: favorite.userId,
        entityType: favorite.entityType as IamFavorite['entityType'],
        entityId: favorite.entityId,
        createdAt: favorite.createdAt.toISOString(),
      }));
    });
  }

  async share(input: ShareIamInput) {
    return this.prisma.runInTransaction(async (tx) => {
      return { shared: true, recipients: input.recipientIds.length };
    });
  }
}
