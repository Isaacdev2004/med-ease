import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appToast } from '@/services/api/toast';
import { queryKeys } from '@/services/api/query-keys';
import { iamOfflineQueue } from '@/services/iam/offline-sync';
import { iamService } from '@/services/iam/iam.service';
import type {
  AssignRoleInput,
  CreatePolicyInput,
  CreateUserInput,
  DelegateAccessInput,
  EndBreakGlassInput,
  GrantConsentInput,
  InviteUserInput,
  RevokeSessionInput,
  ShareIamInput,
  StartBreakGlassInput,
} from '@/services/iam/types';

function runOrQueue(label: string, execute: () => Promise<unknown>) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    iamOfflineQueue.enqueue({
      label,
      execute: () => execute().then(() => undefined),
    });
    appToast.offline('IAM update queued until you are back online.');
    return Promise.resolve(null);
  }
  return execute();
}

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.iam.all });
}

export function useIamMutations() {
  const client = useQueryClient();

  const createUser = useMutation({
    mutationFn: (input: CreateUserInput) =>
      runOrQueue('Create user', () => iamService.createUser(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'User created.' });
    },
  });

  const inviteUser = useMutation({
    mutationFn: (input: InviteUserInput) =>
      runOrQueue('Invite user', () => iamService.inviteUser(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Invitation sent.' });
    },
  });

  const lockAccount = useMutation({
    mutationFn: (userId: string) =>
      runOrQueue('Lock account', () => iamService.lockAccount(userId)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.info({ title: 'Account locked.' });
    },
  });

  const unlockAccount = useMutation({
    mutationFn: (userId: string) =>
      runOrQueue('Unlock account', () => iamService.unlockAccount(userId)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Account unlocked.' });
    },
  });

  const assignRole = useMutation({
    mutationFn: (input: AssignRoleInput) =>
      runOrQueue('Assign role', () => iamService.assignRole(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Role assigned.' });
    },
  });

  const removeRole = useMutation({
    mutationFn: (input: AssignRoleInput) =>
      runOrQueue('Remove role', () => iamService.removeRole(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.info({ title: 'Role removed.' });
    },
  });

  const createPolicy = useMutation({
    mutationFn: (input: CreatePolicyInput) =>
      runOrQueue('Create policy', () => iamService.createPolicy(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Policy created.' });
    },
  });

  const enableMfa = useMutation({
    mutationFn: (userId: string) =>
      runOrQueue('Enable MFA', () => iamService.enableMfa(userId)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'MFA enabled.' });
    },
  });

  const disableMfa = useMutation({
    mutationFn: (userId: string) =>
      runOrQueue('Disable MFA', () => iamService.disableMfa(userId)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.info({ title: 'MFA disabled.' });
    },
  });

  const revokeSession = useMutation({
    mutationFn: (input: RevokeSessionInput) =>
      runOrQueue('Revoke session', () => iamService.revokeSession(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.info({ title: 'Session revoked.' });
    },
  });

  const createOAuthClient = useMutation({
    mutationFn: ({ name, tenantId }: { name: string; tenantId: string }) =>
      runOrQueue('Create OAuth client', () =>
        iamService.createOAuthClient(name, tenantId),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'OAuth client created.' });
    },
  });

  const rotateApiKey = useMutation({
    mutationFn: (keyId: string) =>
      runOrQueue('Rotate API key', () => iamService.rotateApiKey(keyId)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'API key rotated.' });
    },
  });

  const grantConsent = useMutation({
    mutationFn: (input: GrantConsentInput) =>
      runOrQueue('Grant consent', () => iamService.grantConsent(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Consent granted.' });
    },
  });

  const revokeConsent = useMutation({
    mutationFn: (consentId: string) =>
      runOrQueue('Revoke consent', () => iamService.revokeConsent(consentId)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.info({ title: 'Consent revoked.' });
    },
  });

  const delegateAccess = useMutation({
    mutationFn: (input: DelegateAccessInput) =>
      runOrQueue('Delegate access', () => iamService.delegateAccess(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Access delegated.' });
    },
  });

  const startBreakGlass = useMutation({
    mutationFn: (input: StartBreakGlassInput) =>
      runOrQueue('Start break-glass', () => iamService.startBreakGlass(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.warning({ title: 'Break-glass session started.' });
    },
  });

  const endBreakGlass = useMutation({
    mutationFn: (input: EndBreakGlassInput) =>
      runOrQueue('End break-glass', () => iamService.endBreakGlass(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.info({ title: 'Break-glass session ended.' });
    },
  });

  const exportData = useMutation({
    mutationFn: (format: 'csv' | 'pdf' | 'xlsx') =>
      runOrQueue('Export IAM report', () => iamService.exportData(format)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Export complete.' });
    },
  });

  const favorite = useMutation({
    mutationFn: ({
      userId,
      entityType,
      entityId,
    }: {
      userId: string;
      entityType: 'user' | 'role' | 'policy' | 'session' | 'client';
      entityId: string;
    }) =>
      runOrQueue('Favorite', () =>
        iamService.favorite(userId, entityType, entityId),
      ),
    onSuccess: () => invalidateAll(client),
  });

  const share = useMutation({
    mutationFn: (input: ShareIamInput) =>
      runOrQueue('Share IAM resource', () => iamService.share(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Shared successfully.' });
    },
  });

  return {
    createUser,
    inviteUser,
    lockAccount,
    unlockAccount,
    assignRole,
    removeRole,
    createPolicy,
    enableMfa,
    disableMfa,
    revokeSession,
    createOAuthClient,
    rotateApiKey,
    grantConsent,
    revokeConsent,
    delegateAccess,
    startBreakGlass,
    endBreakGlass,
    exportData,
    favorite,
    share,
  };
}
