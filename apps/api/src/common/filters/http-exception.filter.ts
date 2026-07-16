import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { RepositoryError } from '@workspace/repository-transport/errors';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = resolveHttpStatus(exception);

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception instanceof RepositoryError
          ? exception.message
          : 'Internal server error';

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : ((exceptionResponse as { message?: string | string[] }).message ?? 'Unexpected error');

    if (status >= 500) {
      this.logger.error(
        {
          path: request.url,
          method: request.method,
          status,
          error: exception instanceof Error ? exception.message : String(exception),
        },
        'Unhandled exception',
      );
    }

    response.status(status).json({
      status: 'error',
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}

function resolveHttpStatus(exception: unknown): number {
  if (exception instanceof HttpException) {
    return exception.getStatus();
  }

  if (exception instanceof RepositoryError && exception.status) {
    return exception.status;
  }

  return HttpStatus.INTERNAL_SERVER_ERROR;
}
