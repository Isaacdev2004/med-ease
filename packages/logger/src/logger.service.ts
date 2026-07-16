import { randomUUID } from 'node:crypto';

import { getLogBindings } from '@medease/observability';
import pino, { type Logger, type LoggerOptions } from 'pino';

export interface LoggerContext {
  requestId?: string;
  correlationId?: string;
  [key: string]: unknown;
}

export interface CreateLoggerOptions {
  service: string;
  nodeEnv?: string;
  level?: string;
}

export function createLogger(options: CreateLoggerOptions): Logger {
  const isDevelopment = options.nodeEnv !== 'production';

  const loggerOptions: LoggerOptions = {
    level: options.level ?? (isDevelopment ? 'debug' : 'info'),
    base: {
      service: options.service,
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    mixin() {
      return getLogBindings();
    },
  };

  if (isDevelopment) {
    loggerOptions.transport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    };
  }

  return pino(loggerOptions);
}

export function createRequestId(existing?: string): string {
  return existing && existing.trim().length > 0 ? existing : randomUUID();
}

export function withContext(logger: Logger, context: LoggerContext): Logger {
  return logger.child(context);
}
