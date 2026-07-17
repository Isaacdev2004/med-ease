import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import 'reflect-metadata';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Module,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';

import type { JwtAccessPayload } from '@medease/auth';

import { AuthenticationRequiredException } from '../authorization/authorization.exceptions';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../authorization/guards/permissions.guard';
import { PermissionService } from '../authorization/permission.service';
import { PolicyService } from '../authorization/policy.service';
import { IamController } from './iam.controller';
import { IamService } from './iam.service';

const testUser: JwtAccessPayload = {
  sub: 'user-physician',
  email: 'doctor@medease.health',
  role: 'platform_admin',
  tenantId: '01930000-0000-7000-8000-000000000001',
  organizationId: '01930000-0000-7000-8000-000000000002',
  permissions: [],
  sessionId: 'session-test',
  deviceTrust: false,
};

const iamServiceMock = {
  getUsers: async () => ({
    items: [{ userId: 'user-1', email: 'doctor@medease.health' }],
    total: 1,
    page: 1,
    pageSize: 25,
  }),
  dashboard: async () => ({
    totalUsers: 1,
    activeSessions: 0,
    mfaAdoptionRate: 0,
    failedLogins24h: 0,
    activePolicies: 0,
    openIncidents: 0,
    breakGlassActive: 0,
    sessionTrend: [],
    loginTrend: [],
    recentIncidents: [],
    recentAudit: [],
  }),
};

@Module({
  controllers: [IamController],
  providers: [
    PermissionService,
    PolicyService,
    { provide: IamService, useValue: iamServiceMock },
  ],
})
class IamControllerTestModule {}

@Injectable()
class TestAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<{ user?: JwtAccessPayload }>();
    request.user = testUser;
    return true;
  }
}

@Injectable()
class RejectAuthGuard implements CanActivate {
  canActivate(): never {
    throw new AuthenticationRequiredException();
  }
}

async function createTestApp(
  authenticated: boolean,
): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [IamControllerTestModule],
  })
    .overrideGuard(JwtAuthGuard)
    .useClass(authenticated ? TestAuthGuard : RejectAuthGuard)
    .compile();

  const app = moduleRef.createNestApplication();
  app.setGlobalPrefix('api');
  app.useGlobalGuards(
    moduleRef.get(JwtAuthGuard),
    new PermissionsGuard(
      new Reflector(),
      moduleRef.get(PermissionService),
      moduleRef.get(PolicyService),
    ),
  );
  await app.init();
  return app;
}

describe('IamController integration', () => {
  let app: INestApplication;

  before(async () => {
    app = await createTestApp(true);
  });

  after(async () => {
    await app.close();
  });

  it('GET /api/iam/users returns paginated users when authorized', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/iam/users')
      .expect(200);

    assert.equal(response.body.total, 1);
    assert.equal(response.body.items[0].userId, 'user-1');
  });

  it('GET /api/iam/dashboard returns dashboard metrics', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/iam/dashboard')
      .expect(200);

    assert.equal(response.body.totalUsers, 1);
  });

  it('GET /api/iam/users rejects unauthenticated requests', async () => {
    const unauthenticatedApp = await createTestApp(false);

    try {
      await request(unauthenticatedApp.getHttpServer())
        .get('/api/iam/users')
        .expect(401);
    } finally {
      await unauthenticatedApp.close();
    }
  });
});
