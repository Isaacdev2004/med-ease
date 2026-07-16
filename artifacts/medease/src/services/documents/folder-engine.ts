import type { DocumentFolder } from '@/services/documents/types';

export function buildFolderPath(folders: DocumentFolder[], folderId: string): string {
  const folder = folders.find((f) => f.folderId === folderId);
  if (!folder) return '/';
  if (!folder.parentId) return `/${folder.name}`;
  return `${buildFolderPath(folders, folder.parentId)}/${folder.name}`;
}

export function childFolders(folders: DocumentFolder[], parentId?: string): DocumentFolder[] {
  return folders.filter((f) => f.parentId === parentId);
}
