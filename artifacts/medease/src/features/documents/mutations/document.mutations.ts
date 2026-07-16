import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appToast } from '@/services/api/toast';
import { queryKeys } from '@/services/api/query-keys';
import { documentOfflineQueue } from '@/services/documents/offline-sync';
import { documentService } from '@/services/documents/document.service';
import type {
  ApplyLegalHoldInput,
  ApplyRetentionInput,
  CreateFolderInput,
  CreateVersionInput,
  MoveDocumentInput,
  RequestSignatureInput,
  ShareDocumentInput,
  ShareDocumentLinkInput,
  SignDocumentInput,
  UploadDocumentInput,
} from '@/services/documents/types';

function runOrQueue(label: string, execute: () => Promise<unknown>) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    documentOfflineQueue.enqueue({ label, execute: () => execute().then(() => undefined) });
    appToast.offline('Document update queued until you are back online.');
    return Promise.resolve(null);
  }
  return execute();
}

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.documents.all });
}

export function useDocumentMutations() {
  const client = useQueryClient();

  const uploadDocument = useMutation({
    mutationFn: (input: UploadDocumentInput) => runOrQueue('Upload document', () => documentService.uploadDocument(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Document uploaded.' }); },
  });

  const createFolder = useMutation({
    mutationFn: (input: CreateFolderInput) => runOrQueue('Create folder', () => documentService.createFolder(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Folder created.' }); },
  });

  const moveDocument = useMutation({
    mutationFn: (input: MoveDocumentInput) => runOrQueue('Move document', () => documentService.moveDocument(input)),
    onSuccess: () => { invalidateAll(client); appToast.info({ title: 'Document moved.' }); },
  });

  const archiveDocument = useMutation({
    mutationFn: (documentId: string) => runOrQueue('Archive document', () => documentService.archiveDocument(documentId)),
    onSuccess: () => { invalidateAll(client); appToast.info({ title: 'Document archived.' }); },
  });

  const restoreDocument = useMutation({
    mutationFn: (documentId: string) => runOrQueue('Restore document', () => documentService.restoreDocument(documentId)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Document restored.' }); },
  });

  const createVersion = useMutation({
    mutationFn: (input: CreateVersionInput) => runOrQueue('Create version', () => documentService.createVersion(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'New version created.' }); },
  });

  const ocrDocument = useMutation({
    mutationFn: (documentId: string) => runOrQueue('OCR document', () => documentService.ocrDocument(documentId)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'OCR complete.' }); },
  });

  const requestSignature = useMutation({
    mutationFn: (input: RequestSignatureInput) => runOrQueue('Request signature', () => documentService.requestSignature(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Signature requested.' }); },
  });

  const signDocument = useMutation({
    mutationFn: (input: SignDocumentInput) => runOrQueue('Sign document', () => documentService.signDocument(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Document signed.' }); },
  });

  const shareDocument = useMutation({
    mutationFn: (input: ShareDocumentInput) => runOrQueue('Share document', () => documentService.shareDocument(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Share link created.' }); },
  });

  const revokeSharing = useMutation({
    mutationFn: (input: ShareDocumentLinkInput) => runOrQueue('Revoke sharing', () => documentService.revokeSharing(input)),
    onSuccess: () => { invalidateAll(client); appToast.info({ title: 'Share link revoked.' }); },
  });

  const applyRetention = useMutation({
    mutationFn: (input: ApplyRetentionInput) => runOrQueue('Apply retention', () => documentService.applyRetention(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Retention policy applied.' }); },
  });

  const applyLegalHold = useMutation({
    mutationFn: (input: ApplyLegalHoldInput) => runOrQueue('Apply legal hold', () => documentService.applyLegalHold(input)),
    onSuccess: () => { invalidateAll(client); appToast.warning({ title: 'Legal hold applied.' }); },
  });

  const exportData = useMutation({
    mutationFn: (format: 'csv' | 'pdf' | 'xlsx') => runOrQueue('Export documents', () => documentService.exportData(format)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Export complete.' }); },
  });

  const favorite = useMutation({
    mutationFn: ({ userId, documentId }: { userId: string; documentId: string }) =>
      runOrQueue('Favorite', () => documentService.favorite(userId, documentId)),
    onSuccess: () => invalidateAll(client),
  });

  return {
    uploadDocument,
    createFolder,
    moveDocument,
    archiveDocument,
    restoreDocument,
    createVersion,
    ocrDocument,
    requestSignature,
    signDocument,
    shareDocument,
    revokeSharing,
    applyRetention,
    applyLegalHold,
    exportData,
    favorite,
  };
}
