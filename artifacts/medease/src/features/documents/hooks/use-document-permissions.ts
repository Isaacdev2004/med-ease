import { useAuth } from '@/services/auth/auth-context';
import type { DocumentPermissions } from '@/services/documents/types';

export function useDocumentPermissions(): DocumentPermissions {
  const { permissions } = useAuth();
  return {
    canView: permissions.includes('documents.read'),
    canWrite: permissions.includes('documents.write'),
    canUpload: permissions.includes('documents.upload'),
    canDownload: permissions.includes('documents.download'),
    canShare: permissions.includes('documents.share'),
    canArchive: permissions.includes('documents.archive'),
    canRecords: permissions.includes('documents.records'),
    canRetention: permissions.includes('documents.retention'),
    canSignatures: permissions.includes('documents.signatures'),
    canAnalytics: permissions.includes('documents.analytics'),
    canExport: permissions.includes('documents.export'),
    canAdmin: permissions.includes('documents.admin'),
  };
}
