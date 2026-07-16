import type { RecordItem } from '@/services/documents/types';

export function classifyRecord(module: string): string {
  const map: Record<string, string> = {
    clinical: 'PHI',
    finance: 'Financial',
    workforce: 'HR',
    quality: 'Compliance',
    research: 'Research',
    legal: 'Legal',
  };
  return map[module] ?? 'General';
}

export function activeRecordsCount(records: RecordItem[]): number {
  return records.filter((r) => r.status === 'active').length;
}
