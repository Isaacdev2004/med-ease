import type { ContentIndex, Document } from '@/services/documents/types';

export function searchDocuments(docs: Document[], query: string): Document[] {
  const q = query.toLowerCase();
  return docs.filter((d) =>
    d.title.toLowerCase().includes(q)
    || d.fileName.toLowerCase().includes(q)
    || d.module.toLowerCase().includes(q)
    || d.tags.some((t) => t.toLowerCase().includes(q)),
  );
}

export function searchIndex(indices: ContentIndex[], query: string): ContentIndex[] {
  const q = query.toLowerCase();
  return indices.filter((i) => i.title.toLowerCase().includes(q) || i.snippet.toLowerCase().includes(q));
}
