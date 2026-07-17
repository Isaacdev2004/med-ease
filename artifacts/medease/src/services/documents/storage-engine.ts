export function estimateStorageGb(
  documentCount: number,
  avgSizeBytes: number,
): number {
  return Math.round(((documentCount * avgSizeBytes) / 1024 ** 3) * 100) / 100;
}

export function storagePath(
  tenantId: string,
  documentId: string,
  version: number,
): string {
  return `tenants/${tenantId}/documents/${documentId}/v${version}`;
}

export function isAllowedMimeType(mime: string): boolean {
  const allowed = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  return allowed.includes(mime) || mime.startsWith('text/');
}
