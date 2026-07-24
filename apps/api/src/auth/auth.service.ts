import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request, Response } from 'express';

import {
  generateRefreshToken,
  getPermissionsForRole,
  mapUserStatusToFrontend,
  parseDurationToMs,
  parseDurationToSeconds,
  REFRESH_COOKIE_NAME,
  verifyPassword,
  type IdentityRole,
  type JwtAccessPayload,
  type LoginResultDto,
} from '@medease/auth';
import { PrismaService } from '@medease/prisma';
import { newId } from '@medease/uuid';

import { MedeaseConfigService } from '../config/config.service';
import { PermissionService } from '../authorization/permission.service';
import { AuthHttpException } from './auth.exceptions';
import type { LoginDto } from './dto/auth.dto';
import { RefreshTokenStore } from './refresh-token.store';
import { SecurityEventService } from './security-event.service';

export interface RequestMeta {
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: MedeaseConfigService,
    private readonly refreshStore: RefreshTokenStore,
    private readonly securityEvents: SecurityEventService,
    private readonly permissionService: PermissionService,
  ) {}

  async login(
    dto: LoginDto,
    res: Response,
    meta: RequestMeta,
  ): Promise<LoginResultDto> {
    const email = dto.email.trim().toLowerCase();

    const user = await this.prisma.runInSystemTransaction(async (tx) =>
      tx.user.findFirst({
        where: { email },
        include: { organization: true, tenant: true },
      }),
    );

    if (!user) {
      await this.recordFailedLogin(null, email, 'invalid_credentials', meta);
      throw AuthHttpException.invalidCredentials();
    }

    if (user.status === 'inactive') {
      await this.recordFailedLogin(user.id, email, 'account_disabled', meta);
      throw AuthHttpException.accountDisabled();
    }

    if (
      user.status === 'locked' ||
      (user.lockedUntil && user.lockedUntil > new Date())
    ) {
      await this.recordFailedLogin(user.id, email, 'account_locked', meta);
      throw AuthHttpException.accountLocked();
    }

    const passwordValid = await verifyPassword(dto.password, user.passwordHash);
    if (!passwordValid) {
      await this.handleFailedPassword(user.id, email, meta);
      throw AuthHttpException.invalidCredentials();
    }

    await this.prisma.runInSystemTransaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: {
          failedLoginCount: 0,
          lockedUntil: null,
          lastLoginAt: new Date(),
        },
      });

      await tx.loginAttempt.create({
        data: {
          id: newId(),
          userId: user.id,
          email,
          success: true,
          ipAddress: meta.ipAddress,
          userAgent: meta.userAgent,
        },
      });
    });

    const result = await this.createSession(
      user,
      dto.rememberMe ?? false,
      meta,
    );
    this.setRefreshCookie(res, result.refreshToken, result.refreshMaxAgeMs);

    await this.securityEvents.record({
      eventType: 'login_success',
      tenantId: user.tenantId,
      userId: user.id,
      sessionId: result.sessionId,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return result.loginResult;
  }

  resolveRefreshToken(
    cookieToken: string | undefined,
    bodyToken: string | undefined,
  ): string | undefined {
    return bodyToken?.trim() || cookieToken;
  }

  async refresh(
    refreshToken: string | undefined,
    res: Response,
    meta: RequestMeta,
  ) {
    if (!refreshToken) {
      throw AuthHttpException.sessionExpired();
    }

    const record = await this.refreshStore.consume(refreshToken);
    if (!record) {
      throw AuthHttpException.sessionExpired();
    }

    if (await this.refreshStore.isFamilyRevoked(record.familyId)) {
      await this.revokeSession(record.sessionId);
      throw AuthHttpException.sessionExpired();
    }

    const session = await this.prisma.runInSystemTransaction(async (tx) =>
      tx.userSession.findUnique({
        where: { id: record.sessionId },
        include: {
          user: { include: { organization: true } },
        },
      }),
    );

    if (
      !session ||
      session.status !== 'active' ||
      session.expiresAt <= new Date()
    ) {
      throw AuthHttpException.sessionExpired();
    }

    const access = await this.issueAccessToken(session.user, session.id);
    const newRefreshToken = generateRefreshToken();
    const refreshTtlSeconds = this.refreshTtlSeconds(record.rememberMe);

    await this.refreshStore.store(
      newRefreshToken,
      {
        ...record,
        version: record.version + 1,
      },
      refreshTtlSeconds,
    );

    this.setRefreshCookie(res, newRefreshToken, refreshTtlSeconds * 1_000);

    await this.prisma.runInSystemTransaction(async (tx) => {
      await tx.userSession.update({
        where: { id: session.id },
        data: { lastActivityAt: new Date() },
      });
    });

    await this.securityEvents.record({
      eventType: 'token_refresh',
      tenantId: session.tenantId,
      userId: session.userId,
      sessionId: session.id,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return {
      accessToken: access.token,
      expiresAt: access.expiresAt,
      refreshToken: newRefreshToken,
    };
  }

  async logout(
    refreshToken: string | undefined,
    meta: RequestMeta,
  ): Promise<void> {
    if (!refreshToken) {
      return;
    }

    const record = await this.refreshStore.consume(refreshToken);
    if (!record) {
      return;
    }

    await this.revokeSession(record.sessionId);
    this.permissionService.invalidateSession(record.sessionId);

    await this.securityEvents.record({
      eventType: 'logout',
      tenantId: record.tenantId,
      userId: record.userId,
      sessionId: record.sessionId,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });
  }

  async getMe(userId: string): Promise<LoginResultDto> {
    const user = await this.prisma.runInTransaction(async (tx) =>
      tx.user.findUnique({
        where: { id: userId },
        include: { organization: true },
      }),
    );

    if (!user) {
      throw AuthHttpException.sessionExpired();
    }

    return {
      user: this.toAuthUser(user),
      session: {
        accessToken: '',
        expiresAt: Date.now(),
      },
      organization: {
        id: user.organization.id,
        name: user.organization.name,
        slug: user.organization.slug,
      },
    };
  }

  buildPayload(
    user: {
      id: string;
      email: string;
      role: IdentityRole;
      tenantId: string;
      organizationId: string;
    },
    sessionId: string,
  ): JwtAccessPayload {
    return {
      sub: user.id,
      email: user.email,
      role: user.role as IdentityRole,
      tenantId: user.tenantId,
      organizationId: user.organizationId,
      permissions: getPermissionsForRole(user.role as IdentityRole),
      sessionId,
      deviceTrust: false,
    };
  }

  private async createSession(
    user: {
      id: string;
      email: string;
      role: string;
      tenantId: string;
      organizationId: string;
      fullName: string;
      locale: string;
      timezone: string;
      avatarUrl: string | null;
      status: string;
      lastLoginAt: Date | null;
      organization: { id: string; name: string; slug: string };
    },
    rememberMe: boolean,
    meta: RequestMeta,
  ) {
    const sessionId = newId();
    const familyId = newId();
    const refreshToken = generateRefreshToken();
    const refreshMaxAgeMs = this.refreshTtlMs(rememberMe);
    const expiresAt = new Date(Date.now() + refreshMaxAgeMs);

    await this.prisma.runInSystemTransaction(async (tx) => {
      await tx.userSession.create({
        data: {
          id: sessionId,
          userId: user.id,
          tenantId: user.tenantId,
          ipAddress: meta.ipAddress,
          userAgent: meta.userAgent,
          refreshFamilyId: familyId,
          rememberMe,
          expiresAt,
        },
      });
    });

    await this.refreshStore.store(
      refreshToken,
      {
        sessionId,
        userId: user.id,
        tenantId: user.tenantId,
        familyId,
        rememberMe,
        version: 1,
      },
      Math.floor(refreshMaxAgeMs / 1_000),
    );

    const access = await this.issueAccessToken(user, sessionId);

    return {
      sessionId,
      refreshToken,
      refreshMaxAgeMs,
      loginResult: {
        user: this.toAuthUser(user),
        session: {
          accessToken: access.token,
          expiresAt: access.expiresAt,
          rememberMe,
          refreshToken,
        },
        organization: {
          id: user.organization.id,
          name: user.organization.name,
          slug: user.organization.slug,
        },
      } satisfies LoginResultDto,
    };
  }

  private async issueAccessToken(
    user: {
      id: string;
      email: string;
      role: string;
      tenantId: string;
      organizationId: string;
    },
    sessionId: string,
  ) {
    const expiresIn = parseDurationToSeconds(this.config.auth.accessExpiry);
    const payload = this.buildPayload(
      {
        id: user.id,
        email: user.email,
        role: user.role as IdentityRole,
        tenantId: user.tenantId,
        organizationId: user.organizationId,
      },
      sessionId,
    );

    const token = await this.jwtService.signAsync(payload, {
      expiresIn,
    });

    return {
      token,
      expiresAt: Date.now() + parseDurationToMs(this.config.auth.accessExpiry),
    };
  }

  private toAuthUser(user: {
    id: string;
    email: string;
    fullName: string;
    avatarUrl: string | null;
    role: string;
    tenantId: string;
    organizationId: string;
    locale: string;
    timezone: string;
    lastLoginAt: Date | null;
    status: string;
  }) {
    const role = user.role as IdentityRole;
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      avatar: user.avatarUrl ?? undefined,
      role,
      tenantId: user.tenantId,
      organizationId: user.organizationId,
      permissions: getPermissionsForRole(role),
      locale: user.locale,
      timezone: user.timezone,
      lastLogin: user.lastLoginAt?.toISOString(),
      status: mapUserStatusToFrontend(user.status),
    };
  }

  private async handleFailedPassword(
    userId: string,
    email: string,
    meta: RequestMeta,
  ) {
    const user = await this.prisma.runInSystemTransaction(async (tx) => {
      const updated = await tx.user.update({
        where: { id: userId },
        data: { failedLoginCount: { increment: 1 } },
      });

      const shouldLock =
        updated.failedLoginCount >= this.config.auth.maxFailedAttempts;
      if (shouldLock) {
        const lockedUntil = new Date(
          Date.now() + this.config.auth.lockoutMinutes * 60_000,
        );
        return tx.user.update({
          where: { id: userId },
          data: { status: 'locked', lockedUntil },
        });
      }

      return updated;
    });

    if (user.status === 'locked') {
      await this.securityEvents.record({
        eventType: 'account_locked',
        tenantId: user.tenantId,
        userId,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        metadata: { failedLoginCount: user.failedLoginCount },
      });
    }

    await this.recordFailedLogin(userId, email, 'invalid_credentials', meta);
  }

  private async recordFailedLogin(
    userId: string | null,
    email: string,
    reason: string,
    meta: RequestMeta,
  ) {
    await this.prisma.runInSystemTransaction(async (tx) => {
      await tx.loginAttempt.create({
        data: {
          id: newId(),
          userId: userId ?? undefined,
          email,
          success: false,
          reason,
          ipAddress: meta.ipAddress,
          userAgent: meta.userAgent,
        },
      });
    });

    await this.securityEvents.record({
      eventType: 'login_failure',
      userId: userId ?? undefined,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      metadata: { email, reason },
    });
  }

  private async revokeSession(sessionId: string) {
    await this.prisma.runInSystemTransaction(async (tx) => {
      await tx.userSession.updateMany({
        where: { id: sessionId, status: 'active' },
        data: { status: 'revoked', revokedAt: new Date() },
      });
    });
  }

  private refreshTtlMs(rememberMe: boolean) {
    return parseDurationToMs(
      rememberMe
        ? this.config.auth.refreshRememberExpiry
        : this.config.auth.refreshExpiry,
    );
  }

  private refreshTtlSeconds(rememberMe: boolean) {
    return Math.floor(this.refreshTtlMs(rememberMe) / 1_000);
  }

  setRefreshCookie(res: Response, token: string, maxAgeMs: number) {
    res.cookie(REFRESH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: this.config.auth.cookieSecure,
      sameSite: 'strict',
      domain: this.config.auth.cookieDomain,
      maxAge: maxAgeMs,
      path: '/api/auth',
    });
  }

  clearRefreshCookie(res: Response) {
    res.clearCookie(REFRESH_COOKIE_NAME, {
      httpOnly: true,
      secure: this.config.auth.cookieSecure,
      sameSite: 'strict',
      domain: this.config.auth.cookieDomain,
      path: '/api/auth',
    });
  }

  static extractMeta(req: Request): RequestMeta {
    return {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    };
  }
}
