import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appToast } from '@/services/api/toast';
import { queryKeys } from '@/services/api/query-keys';
import { telemedicineOfflineQueue } from '@/services/telemedicine/offline-sync';
import { telemedicineService } from '@/services/telemedicine/telemedicine.service';
import type {
  SaveClinicalNoteInput,
  SendMessageInput,
  UploadFileInput,
} from '@/services/telemedicine/types';

function runOrQueue(label: string, execute: () => Promise<unknown>) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    telemedicineOfflineQueue.enqueue({
      label,
      execute: () => execute().then(() => undefined),
    });
    appToast.offline('Telemedicine update queued until you are back online.');
    return Promise.resolve(null);
  }
  return execute();
}

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.telemedicine.all });
}

export function useTelemedicineMutations() {
  const client = useQueryClient();

  const joinSession = useMutation({
    mutationFn: ({
      sessionId,
      participantId,
    }: {
      sessionId: string;
      participantId: string;
    }) =>
      runOrQueue('Join session', () =>
        telemedicineService.joinSession(sessionId, participantId),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Joined session.' });
    },
  });

  const leaveSession = useMutation({
    mutationFn: (sessionId: string) =>
      runOrQueue('Leave session', () =>
        telemedicineService.leaveSession(sessionId),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Left session.' });
    },
  });

  const sendMessage = useMutation({
    mutationFn: (input: SendMessageInput) =>
      runOrQueue('Send message', () => telemedicineService.sendMessage(input)),
    onSuccess: () => invalidateAll(client),
  });

  const uploadFile = useMutation({
    mutationFn: (input: UploadFileInput) =>
      runOrQueue('Upload file', () => telemedicineService.uploadFile(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'File uploaded.' });
    },
  });

  const startRecording = useMutation({
    mutationFn: ({
      sessionId,
      consent,
    }: {
      sessionId: string;
      consent: boolean;
    }) =>
      runOrQueue('Start recording', () =>
        telemedicineService.recordSession(sessionId, consent),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Recording started.' });
    },
  });

  const stopRecording = useMutation({
    mutationFn: (sessionId: string) =>
      runOrQueue('Stop recording', () =>
        telemedicineService.stopRecording(sessionId),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Recording stopped.' });
    },
  });

  const saveClinicalNote = useMutation({
    mutationFn: (input: SaveClinicalNoteInput) =>
      runOrQueue('Save note', () =>
        telemedicineService.saveClinicalNote(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Clinical note saved.' });
    },
  });

  const admitWaitingRoom = useMutation({
    mutationFn: (entryId: string) =>
      runOrQueue('Admit patient', () =>
        telemedicineService.admitWaitingRoom(entryId),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Patient admitted.' });
    },
  });

  const rejectWaitingRoom = useMutation({
    mutationFn: (entryId: string) =>
      runOrQueue('Reject patient', () =>
        telemedicineService.rejectWaitingRoom(entryId),
      ),
    onSuccess: () => invalidateAll(client),
  });

  const muteParticipant = useMutation({
    mutationFn: ({
      participantId,
      muted,
    }: {
      participantId: string;
      muted: boolean;
    }) =>
      runOrQueue('Mute', () =>
        telemedicineService.muteParticipant(participantId, muted),
      ),
    onSuccess: () => invalidateAll(client),
  });

  const toggleVideo = useMutation({
    mutationFn: ({
      participantId,
      enabled,
    }: {
      participantId: string;
      enabled: boolean;
    }) =>
      runOrQueue('Toggle video', () =>
        telemedicineService.toggleVideo(participantId, enabled),
      ),
    onSuccess: () => invalidateAll(client),
  });

  const startScreenShare = useMutation({
    mutationFn: (participantId: string) =>
      runOrQueue('Screen share', () =>
        telemedicineService.startScreenShare(participantId),
      ),
    onSuccess: () => invalidateAll(client),
  });

  const stopScreenShare = useMutation({
    mutationFn: (participantId: string) =>
      runOrQueue('Stop screen share', () =>
        telemedicineService.stopScreenShare(participantId),
      ),
    onSuccess: () => invalidateAll(client),
  });

  const exportVisit = useMutation({
    mutationFn: ({
      sessionId,
      format,
    }: {
      sessionId: string;
      format: 'pdf' | 'fhir' | 'json';
    }) =>
      runOrQueue('Export visit', () =>
        telemedicineService.exportVisit(sessionId, format),
      ),
    onSuccess: () => appToast.success({ title: 'Visit exported.' }),
  });

  const shareVisit = useMutation({
    mutationFn: ({
      sessionId,
      sharedWith,
    }: {
      sessionId: string;
      sharedWith: string;
    }) =>
      runOrQueue('Share visit', () =>
        telemedicineService.shareVisit(sessionId, sharedWith),
      ),
    onSuccess: () => appToast.success({ title: 'Visit shared.' }),
  });

  const toggleFavorite = useMutation({
    mutationFn: ({
      sessionId,
      userId,
    }: {
      sessionId: string;
      userId: string;
    }) =>
      runOrQueue('Toggle favorite', () =>
        telemedicineService.toggleFavorite(sessionId, userId),
      ),
    onSuccess: () => invalidateAll(client),
  });

  return {
    joinSession,
    leaveSession,
    sendMessage,
    uploadFile,
    startRecording,
    stopRecording,
    saveClinicalNote,
    admitWaitingRoom,
    rejectWaitingRoom,
    muteParticipant,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    exportVisit,
    shareVisit,
    toggleFavorite,
  };
}
