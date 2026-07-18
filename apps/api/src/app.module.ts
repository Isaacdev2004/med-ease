import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import path from 'node:path';
import { LoggerModule } from 'nestjs-pino';

import { validateConfig } from '@medease/config';
import {
  CORRELATION_ID_HEADER,
  REQUEST_ID_HEADER,
  SERVICE_NAME,
} from '@medease/constants';
import { getLogBindings } from '@medease/observability';
import { createRequestId } from '@medease/logger';

import { AuditModule } from './audit/audit.module';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';
import { IamModule } from './iam/iam.module';
import { PatientsModule } from './patients/patients.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { MedeaseConfigModule } from './config/config.module';
import { TenantModule } from './tenant/tenant.module';
import { HealthModule } from './health/health.module';
import { MedeaseLoggerModule } from './logger/logger.module';
import { ObservabilityModule } from './observability/observability.module';
import { PlatformObservabilityModule } from './observability/platform-observability.module';
import { PrismaModule } from '@medease/prisma';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [
        path.resolve(process.cwd(), '.env'),
        path.resolve(process.cwd(), '../../.env'),
      ],
      validate: validateConfig,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level:
          process.env.LOG_LEVEL ??
          (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
        base: { service: SERVICE_NAME },
        genReqId: (req, res) => {
          const requestId = createRequestId(
            (req.headers[REQUEST_ID_HEADER] as string | undefined) ??
              (req.headers[CORRELATION_ID_HEADER] as string | undefined),
          );
          res.setHeader(REQUEST_ID_HEADER, requestId);
          return requestId;
        },
        customProps: () => getLogBindings(),
        mixin: () => getLogBindings(),
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: 'SYS:standard',
                  ignore: 'pid,hostname',
                },
              }
            : undefined,
      },
    }),
    MedeaseConfigModule,
    AuditModule,
    EventsModule,
    TenantModule,
    AuthorizationModule,
    AuthModule,
    IamModule,
    PatientsModule,
    ObservabilityModule,
    MedeaseLoggerModule,
    PrismaModule,
    HealthModule,
    PlatformObservabilityModule,
  ],
})
export class AppModule {}
