import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

import { CORRELATION_ID_HEADER, REQUEST_ID_HEADER } from '@medease/constants';

import { HTTP_METRICS, type HttpMetrics } from '../../observability/observability.module';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(@Inject(HTTP_METRICS) private readonly httpMetrics: HttpMetrics) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const startedAt = process.hrtime.bigint();

    return next.handle().pipe(
      tap({
        next: () => this.record(request, response, startedAt),
        error: () => this.record(request, response, startedAt),
      }),
    );
  }

  private record(request: Request, response: Response, startedAt: bigint) {
    const durationSeconds = Number(process.hrtime.bigint() - startedAt) / 1_000_000_000;
    const route = request.route?.path ?? request.path ?? 'unknown';
    this.httpMetrics.recordRequest(request.method, route, response.statusCode, durationSeconds);
  }
}

/** Adds response timing headers; ALS context is established in RequestContextMiddleware. */
@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const startedAt = Date.now();

    if (!response.getHeader(REQUEST_ID_HEADER) && request.headers[REQUEST_ID_HEADER]) {
      response.setHeader(REQUEST_ID_HEADER, request.headers[REQUEST_ID_HEADER] as string);
    }
    if (!response.getHeader(CORRELATION_ID_HEADER) && request.headers[CORRELATION_ID_HEADER]) {
      response.setHeader(CORRELATION_ID_HEADER, request.headers[CORRELATION_ID_HEADER] as string);
    }

    return next.handle().pipe(
      tap(() => {
        response.setHeader('x-response-time-ms', String(Date.now() - startedAt));
      }),
    );
  }
}
