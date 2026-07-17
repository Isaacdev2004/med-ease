import './instrumentation';
import 'reflect-metadata';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';

import { API_DOCS_PATH, API_PREFIX } from '@medease/constants';
import type { MedeaseEnv } from '@medease/config';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import {
  MetricsInterceptor,
  RequestContextInterceptor,
} from './common/interceptors/request-context.interceptor';
import { HTTP_METRICS } from './observability/observability.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService<MedeaseEnv, true>);
  const nodeEnv = configService.get('NODE_ENV', { infer: true });
  const port = configService.get('PORT', { infer: true });
  const corsOrigin = configService.get('CORS_ORIGIN', { infer: true });
  const helmetEnabled = configService.get('HELMET_ENABLED', { infer: true });

  app.useLogger(app.get(Logger));
  app.setGlobalPrefix(API_PREFIX);

  if (helmetEnabled) {
    app.use(helmet());
  }

  app.use(cookieParser());
  app.use(compression());
  app.enableCors({
    origin:
      corsOrigin === '*'
        ? true
        : corsOrigin.split(',').map((value) => value.trim()),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new RequestContextInterceptor(),
    new MetricsInterceptor(app.get(HTTP_METRICS)),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Med-Ease API')
    .setDescription('Med-Ease enterprise healthcare platform API')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(API_DOCS_PATH, app, document);

  await app.listen(port);

  const logger = app.get(Logger);
  logger.log(`Med-Ease API listening on port ${port} (${nodeEnv})`);
  logger.log(`Swagger docs available at /${API_PREFIX}/${API_DOCS_PATH}`);
}

void bootstrap();
