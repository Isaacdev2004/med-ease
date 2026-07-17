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
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';

import type { JwtAccessPayload } from '@medease/auth';

import { AuthenticationRequiredException } from '../authorization/authorization.exceptions';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../authorization/guards/permissions.guard';
import { PermissionService } from '../authorization/permission.service';
import { PolicyService } from '../authorization/policy.service';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';

const testUser: JwtAccessPayload = {
  sub: '01930000-0000-7000-8000-000000000103',
  email: 'doctor@medease.health',
  role: 'platform_admin',
  tenantId: '01930000-0000-7000-8000-000000000001',
  organizationId: '01930000-0000-7000-8000-000000000002',
  permissions: [],
  sessionId: 'session-test',
  deviceTrust: false,
};

const samplePatient = {
  patientId: '01930000-0000-7000-8000-000000000301',
  tenantId: '01930000-0000-7000-8000-000000000001',
  mrn: 'MRN-10293',
  fullName: 'Sarah Jenkins',
  dateOfBirth: '1985-03-14',
  gender: 'female',
  status: 'active',
  fhirResourceId: '01930000-0000-7000-8000-000000000301',
  createdBy: '01930000-0000-7000-8000-000000000101',
  createdAt: '2026-07-01T10:00:00.000Z',
  updatedAt: '2026-07-16T10:00:00.000Z',
  version: 1,
};

const patientsServiceMock = {
  listPatients: async () => ({
    items: [samplePatient],
    total: 1,
    page: 1,
    pageSize: 25,
  }),
  searchPatients: async () => ({
    items: [samplePatient],
    total: 1,
    page: 1,
    pageSize: 25,
  }),
  getPatient: async () => samplePatient,
  registerPatient: async () => samplePatient,
  updatePatient: async () => ({
    ...samplePatient,
    fullName: 'Sarah J.',
    version: 2,
  }),
  archivePatient: async () => ({
    ...samplePatient,
    status: 'inactive',
    deletedAt: '2026-07-16T12:00:00.000Z',
  }),
  restorePatient: async () => samplePatient,
  validateMerge: async () => ({
    valid: true as const,
    sourcePatient: samplePatient,
    targetPatient: {
      ...samplePatient,
      patientId: '01930000-0000-7000-8000-000000000302',
    },
  }),
  exportPatients: async () => ({
    format: 'csv' as const,
    exportedAt: '2026-07-16T12:00:00.000Z',
    recordCount: 1,
  }),
  getIdentifiers: async () => [],
  getContacts: async () => [],
  getAddresses: async () => [],
  getEmergencyContacts: async () => [],
  getAllergies: async () => [],
  getPreferences: async () => null,
  addAllergy: async () => ({
    allergyId: '01930000-0000-7000-8000-000000000401',
    tenantId: samplePatient.tenantId,
    patientId: samplePatient.patientId,
    allergen: 'Penicillin',
    type: 'drug',
    severity: 'severe',
    notedAt: '2026-07-16T10:00:00.000Z',
    createdAt: '2026-07-16T10:00:00.000Z',
    updatedAt: '2026-07-16T10:00:00.000Z',
  }),
  updatePreferences: async () => ({
    preferenceId: '01930000-0000-7000-8000-000000003107',
    tenantId: samplePatient.tenantId,
    patientId: samplePatient.patientId,
    language: 'en-US',
    createdAt: '2026-07-16T10:00:00.000Z',
    updatedAt: '2026-07-16T10:00:00.000Z',
  }),
};

@Module({
  controllers: [PatientsController],
  providers: [
    PermissionService,
    PolicyService,
    { provide: PatientsService, useValue: patientsServiceMock },
  ],
})
class PatientsControllerTestModule {}

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
    imports: [PatientsControllerTestModule],
  })
    .overrideGuard(JwtAuthGuard)
    .useClass(authenticated ? TestAuthGuard : RejectAuthGuard)
    .compile();

  const app = moduleRef.createNestApplication();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
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

describe('PatientsController integration', () => {
  let app: INestApplication;

  before(async () => {
    app = await createTestApp(true);
  });

  after(async () => {
    await app.close();
  });

  it('GET /api/patients returns paginated patients when authorized', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/patients')
      .expect(200);

    assert.equal(response.body.total, 1);
    assert.equal(response.body.items[0].patientId, samplePatient.patientId);
  });

  it('GET /api/patients/search returns search results', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/patients/search')
      .query({ q: 'Sarah' })
      .expect(200);

    assert.equal(response.body.items[0].fullName, 'Sarah Jenkins');
  });

  it('GET /api/patients/:patientId returns a patient', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/patients/${samplePatient.patientId}`)
      .expect(200);

    assert.equal(response.body.mrn, samplePatient.mrn);
  });

  it('POST /api/patients registers a patient', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/patients')
      .send({
        mrn: 'MRN-90001',
        fullName: 'Jane Doe',
        dateOfBirth: '1990-01-01',
      })
      .expect(201);

    assert.equal(response.body.patientId, samplePatient.patientId);
  });

  it('PATCH /api/patients/:patientId updates a patient', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/api/patients/${samplePatient.patientId}`)
      .send({ fullName: 'Sarah J.' })
      .expect(200);

    assert.equal(response.body.version, 2);
  });

  it('DELETE /api/patients/:patientId archives a patient', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/api/patients/${samplePatient.patientId}`)
      .expect(200);

    assert.equal(response.body.status, 'inactive');
  });

  it('POST /api/patients/:patientId/restore restores a patient', async () => {
    const response = await request(app.getHttpServer())
      .post(`/api/patients/${samplePatient.patientId}/restore`)
      .expect(200);

    assert.equal(response.body.patientId, samplePatient.patientId);
  });

  it('POST /api/patients/validate-merge validates merge candidates', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/patients/validate-merge')
      .send({
        sourcePatientId: samplePatient.patientId,
        targetPatientId: '01930000-0000-7000-8000-000000000302',
      })
      .expect(200);

    assert.equal(response.body.valid, true);
  });

  it('POST /api/patients/export exports patients', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/patients/export')
      .send({ format: 'csv' })
      .expect(200);

    assert.equal(response.body.format, 'csv');
    assert.equal(response.body.recordCount, 1);
  });

  it('GET /api/patients rejects unauthenticated requests', async () => {
    const unauthenticatedApp = await createTestApp(false);

    try {
      await request(unauthenticatedApp.getHttpServer())
        .get('/api/patients')
        .expect(401);
    } finally {
      await unauthenticatedApp.close();
    }
  });
});
