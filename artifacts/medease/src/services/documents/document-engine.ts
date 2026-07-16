import type { Document, DocumentStatus } from '@/services/documents/types';

export function isDocumentAccessible(doc: Document, userId: string, permissions: string[]): boolean {
  if (doc.status === 'deleted') return false;
  if (permissions.includes('documents.admin')) return true;
  if (doc.uploadedBy === userId) return true;
  return permissions.includes('documents.read');
}

export function canModifyDocument(doc: Document, userId: string, permissions: string[]): boolean {
  if (doc.status === 'legal_hold') return permissions.includes('documents.admin');
  if (permissions.includes('documents.write') || permissions.includes('documents.admin')) return true;
  return doc.uploadedBy === userId && permissions.includes('documents.upload');
}

export function nextDocumentStatus(current: DocumentStatus, action: 'archive' | 'restore' | 'delete'): DocumentStatus {
  if (action === 'archive') return 'archived';
  if (action === 'restore') return 'active';
  return 'deleted';
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
