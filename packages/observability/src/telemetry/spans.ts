import { context, propagation, trace, SpanStatusCode, type Span } from '@opentelemetry/api';

import { getRequestContext, runWithRequestContext, type RequestContext } from '../context';

export function getActiveTraceContext(): Pick<RequestContext, 'traceId' | 'spanId'> {
  const span = trace.getActiveSpan();
  if (!span) {
    return {};
  }

  const spanContext = span.spanContext();
  if (!spanContext.traceId) {
    return {};
  }

  return {
    traceId: spanContext.traceId,
    spanId: spanContext.spanId,
  };
}

export function enrichContext(base: Partial<RequestContext>): RequestContext {
  const current = getRequestContext();
  return {
    requestId: base.requestId ?? current?.requestId ?? '',
    correlationId: base.correlationId ?? current?.correlationId ?? '',
    roles: base.roles ?? current?.roles ?? [],
    permissions: base.permissions ?? current?.permissions ?? [],
    ...current,
    ...base,
    ...getActiveTraceContext(),
  };
}

export function injectTraceHeaders(headers: Record<string, string>): Record<string, string> {
  const carrier: Record<string, string> = { ...headers };
  propagation.inject(context.active(), carrier);
  return carrier;
}

export function extractTraceContext(headers: Record<string, string | string[] | undefined>) {
  const carrier: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (typeof value === 'string') {
      carrier[key] = value;
    }
  }
  return propagation.extract(context.active(), carrier);
}

export async function runWithSpan<T>(
  name: string,
  attributes: Record<string, string | number | boolean | undefined>,
  fn: (span: Span) => Promise<T>,
): Promise<T> {
  const tracer = trace.getTracer('medease-platform');
  return tracer.startActiveSpan(name, async (span) => {
    for (const [key, value] of Object.entries(attributes)) {
      if (value !== undefined) {
        span.setAttribute(key, value);
      }
    }

    const current = getRequestContext();
    const merged = enrichContext(current ?? { requestId: '', correlationId: '', roles: [], permissions: [] });

    try {
      return await runWithRequestContext(merged, () => fn(span));
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : String(error),
      });
      throw error;
    } finally {
      span.end();
    }
  });
}
