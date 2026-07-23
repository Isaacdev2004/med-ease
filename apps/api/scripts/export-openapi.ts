import 'reflect-metadata';

import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Module } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { HealthCheckService } from '@nestjs/terminus';
import { stringify } from 'yaml';

import { HealthController } from '../src/health/health.controller';
import {
  HealthService,
  StorageHealthIndicator,
  OpenSearchHealthIndicator,
  PostgresHealthIndicator,
  RedisHealthIndicator,
} from '../src/health/health.service';
import { IamController } from '../src/iam/iam.controller';
import { IamService } from '../src/iam/iam.service';
import { PatientsController } from '../src/patients/patients.controller';
import { PatientsService } from '../src/patients/patients.service';

const noop = async () => ({ status: 'ok' });

@Module({
  controllers: [HealthController, IamController, PatientsController],
  providers: [
    { provide: IamService, useValue: {} },
    { provide: PatientsService, useValue: {} },
    { provide: HealthService, useValue: { check: noop } },
    { provide: HealthCheckService, useValue: { check: noop } },
    { provide: PostgresHealthIndicator, useValue: { isHealthy: noop } },
    { provide: RedisHealthIndicator, useValue: { isHealthy: noop } },
    { provide: StorageHealthIndicator, useValue: { isHealthy: noop } },
    { provide: OpenSearchHealthIndicator, useValue: { isHealthy: noop } },
  ],
})
class OpenApiModule {}

async function exportOpenApi(): Promise<void> {
  const app = await NestFactory.create(OpenApiModule, { logger: false });

  const config = new DocumentBuilder()
    .setTitle('Api')
    .setDescription('Med-Ease enterprise healthcare platform API')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  document.components ??= {};
  document.components.schemas ??= {};
  document.components.schemas.HealthStatus = {
    type: 'object',
    properties: {
      status: { type: 'string' },
    },
    required: ['status'],
  };
  document.components.schemas.HealthCheckResponse = {
    type: 'object',
    properties: {
      status: { type: 'string' },
    },
    required: ['status'],
  };
  document.components.schemas.JsonObject = {
    type: 'object',
    additionalProperties: true,
  };

  const outputPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../../../lib/api-spec/openapi.yaml',
  );

  writeFileSync(
    outputPath,
    stringify(document, {
      singleQuote: true,
      lineWidth: 0,
    }),
  );
  await app.close();

  console.log(`OpenAPI spec written to ${outputPath}`);
}

exportOpenApi().catch((error: unknown) => {
  console.error('Failed to export OpenAPI spec:', error);
  process.exitCode = 1;
});
