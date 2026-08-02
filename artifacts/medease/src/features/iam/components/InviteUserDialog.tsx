import { useMemo, useState } from 'react';
import { UserPlus } from 'lucide-react';
import { z } from 'zod';

import { useIamMutations } from '@/features/iam/mutations/iam.mutations';
import {
  useOrganizations,
  useRoles,
} from '@/features/iam/hooks/use-iam';
import type { IamFilters } from '@/services/iam/types';
import { useAuthOptional } from '@/services/auth/auth-context';
import { LoadingButton } from '@/shared/components/LoadingButton';
import { emailField, requiredString } from '@/shared/forms/zod-messages';
import { useFormSubmit, useZodForm, TextField } from '@/shared/forms';
import { Form } from '@/shared/ui/form';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Label } from '@/shared/ui/label';

const inviteSchema = z.object({
  email: emailField(),
  organizationId: requiredString('Organization'),
  roleId: requiredString('Role'),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

interface InviteUserDialogProps {
  filters?: IamFilters;
}

export function InviteUserDialog({ filters = {} }: InviteUserDialogProps) {
  const [open, setOpen] = useState(false);
  const auth = useAuthOptional();
  const { inviteUser } = useIamMutations();
  const organizations = useOrganizations(filters);
  const roles = useRoles(filters);

  const defaultOrgId = auth?.organization?.id ?? auth?.user?.organizationId ?? '';

  const form = useZodForm<InviteFormValues>(inviteSchema, {
    email: '',
    organizationId: defaultOrgId,
    roleId: '',
  });

  const orgOptions = useMemo(
    () => organizations.data?.items ?? [],
    [organizations.data?.items],
  );

  const roleOptions = useMemo(
    () => roles.data?.items ?? [],
    [roles.data?.items],
  );

  const { submitting, handleSubmit } = useFormSubmit<InviteFormValues>({
    successMessage: 'Invitation sent.',
    errorMessage: 'Unable to send invitation.',
    onSuccess: () => {
      setOpen(false);
      form.reset({
        email: '',
        organizationId: defaultOrgId,
        roleId: '',
      });
    },
    onSubmit: async (values) => {
      const tenantId = filters.tenantId ?? auth?.user?.tenantId;
      if (!tenantId) {
        throw new Error('Tenant scope is required to invite users.');
      }

      await inviteUser.mutateAsync({
        email: values.email,
        tenantId,
        organizationId: values.organizationId,
        roleIds: [values.roleId],
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Invite user
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite user</DialogTitle>
          <DialogDescription>
            Send an email invitation. The recipient sets their password via a
            secure link.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((values) => handleSubmit(values))}
          >
            <TextField
              control={form.control}
              name="email"
              label="Email"
              placeholder="colleague@example.com"
              type="email"
              required
            />

            <div className="space-y-2">
              <Label htmlFor="invite-org">Organization</Label>
              <Select
                value={form.watch('organizationId')}
                onValueChange={(value) =>
                  form.setValue('organizationId', value, { shouldValidate: true })
                }
              >
                <SelectTrigger id="invite-org">
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  {orgOptions.map((org) => (
                    <SelectItem key={org.organizationId} value={org.organizationId}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invite-role">Role</Label>
              <Select
                value={form.watch('roleId')}
                onValueChange={(value) =>
                  form.setValue('roleId', value, { shouldValidate: true })
                }
              >
                <SelectTrigger id="invite-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role.roleId} value={role.roleId}>
                      {role.name.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <LoadingButton type="submit" loading={submitting}>
                Send invitation
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
