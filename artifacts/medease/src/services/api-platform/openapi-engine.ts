import type { ApiEndpoint, OpenApiSpec } from '@/services/api-platform/types';

export function buildOpenApiPath(endpoint: ApiEndpoint): string {
  return `${endpoint.method.toLowerCase()} ${endpoint.path}`;
}

export function activeEndpointCount(endpoints: ApiEndpoint[]): number {
  return endpoints.filter((e) => e.status === 'active').length;
}

export function endpointsByModule(
  endpoints: ApiEndpoint[],
): Record<string, number> {
  return endpoints.reduce<Record<string, number>>((acc, e) => {
    acc[e.module] = (acc[e.module] ?? 0) + 1;
    return acc;
  }, {});
}

export function validateOpenApiSpec(spec: OpenApiSpec): boolean {
  return spec.endpointCount > 0 && Boolean(spec.version);
}

export function generateOpenApiPreview(
  spec: OpenApiSpec,
  endpoints: ApiEndpoint[],
): string {
  const lines = [
    `openapi: 3.0.3`,
    `info:`,
    `  title: ${spec.title}`,
    `  version: ${spec.version}`,
    `paths:`,
  ];
  endpoints.slice(0, 5).forEach((e) => {
    lines.push(`  ${e.path}:`);
    lines.push(`    ${e.method.toLowerCase()}:`);
    lines.push(`      summary: ${e.description.slice(0, 60)}`);
  });
  if (endpoints.length > 5)
    lines.push(`  # ... ${endpoints.length - 5} more endpoints`);
  return lines.join('\n');
}
