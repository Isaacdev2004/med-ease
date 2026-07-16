import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appToast } from '@/services/api/toast';
import { queryKeys } from '@/services/api/query-keys';
import { researchOfflineQueue } from '@/services/research/offline-sync';
import { researchService } from '@/services/research/research.service';
import type {
  CloseDeviationInput,
  CreateInnovationInput,
  CreateTrialInput,
  EnrollParticipantInput,
  RecordAdverseEventInput,
  RecordConsentInput,
  RegisterBiospecimenInput,
  ScheduleVisitInput,
  ShareResearchInput,
  SubmitPublicationInput,
} from '@/services/research/types';

function runOrQueue(label: string, execute: () => Promise<unknown>) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    researchOfflineQueue.enqueue({ label, execute: () => execute().then(() => undefined) });
    appToast.offline('Research update queued until you are back online.');
    return Promise.resolve(null);
  }
  return execute();
}

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.research.all });
}

export function useResearchMutations() {
  const client = useQueryClient();

  const createTrial = useMutation({
    mutationFn: (input: CreateTrialInput) => runOrQueue('Create trial', () => researchService.createTrial(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Clinical trial created.' }); },
  });

  const enrollParticipant = useMutation({
    mutationFn: (input: EnrollParticipantInput) => runOrQueue('Enroll participant', () => researchService.enrollParticipant(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Participant enrolled.' }); },
  });

  const recordConsent = useMutation({
    mutationFn: (input: RecordConsentInput) => runOrQueue('Record consent', () => researchService.recordConsent(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Consent recorded.' }); },
  });

  const scheduleVisit = useMutation({
    mutationFn: (input: ScheduleVisitInput) => runOrQueue('Schedule visit', () => researchService.scheduleVisit(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Study visit scheduled.' }); },
  });

  const recordAdverseEvent = useMutation({
    mutationFn: (input: RecordAdverseEventInput) => runOrQueue('Record adverse event', () => researchService.recordAdverseEvent(input)),
    onSuccess: () => { invalidateAll(client); appToast.info({ title: 'Adverse event reported.' }); },
  });

  const closeDeviation = useMutation({
    mutationFn: (input: CloseDeviationInput) => runOrQueue('Close deviation', () => researchService.closeDeviation(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Protocol deviation closed.' }); },
  });

  const submitPublication = useMutation({
    mutationFn: (input: SubmitPublicationInput) => runOrQueue('Submit publication', () => researchService.submitPublication(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Publication submitted.' }); },
  });

  const registerBiospecimen = useMutation({
    mutationFn: (input: RegisterBiospecimenInput) => runOrQueue('Register biospecimen', () => researchService.registerBiospecimen(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Biospecimen registered.' }); },
  });

  const createInnovation = useMutation({
    mutationFn: (input: CreateInnovationInput) => runOrQueue('Create innovation project', () => researchService.createInnovation(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Innovation project created.' }); },
  });

  const exportData = useMutation({
    mutationFn: (format: 'csv' | 'pdf' | 'xlsx') => runOrQueue('Export research', () => researchService.exportData(format)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Export complete.' }); },
  });

  const favorite = useMutation({
    mutationFn: ({ userId, entityType, entityId }: { userId: string; entityType: 'trial' | 'participant' | 'publication' | 'innovation' | 'grant'; entityId: string }) =>
      runOrQueue('Favorite', () => researchService.favorite(userId, entityType, entityId)),
    onSuccess: () => invalidateAll(client),
  });

  const share = useMutation({
    mutationFn: (input: ShareResearchInput) => runOrQueue('Share research', () => researchService.share(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Research shared.' }); },
  });

  return {
    createTrial,
    enrollParticipant,
    recordConsent,
    scheduleVisit,
    recordAdverseEvent,
    closeDeviation,
    submitPublication,
    registerBiospecimen,
    createInnovation,
    exportData,
    favorite,
    share,
  };
}
