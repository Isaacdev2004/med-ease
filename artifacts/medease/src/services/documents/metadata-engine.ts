import type { DocumentMetadata } from '@/services/documents/types';

export function mergeMetadata(
  existing: DocumentMetadata[],
  incoming: DocumentMetadata[],
): DocumentMetadata[] {
  const map = new Map(existing.map((m) => [m.key, m]));
  for (const item of incoming) map.set(item.key, item);
  return [...map.values()];
}

export function extractSystemMetadata(
  documentId: string,
  module: string,
  patientId?: string,
): DocumentMetadata[] {
  const base: DocumentMetadata[] = [
    {
      metadataId: `${documentId}-mod`,
      documentId,
      key: 'module',
      value: module,
      source: 'system',
    },
  ];
  if (patientId)
    base.push({
      metadataId: `${documentId}-pat`,
      documentId,
      key: 'patientId',
      value: patientId,
      source: 'system',
    });
  return base;
}
