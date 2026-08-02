import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Shield } from 'lucide-react';

import { ROUTES } from '@/config/routes';
import {
  acceptInviteSchema,
  type AcceptInviteFormValues,
} from '@/features/auth/validation/auth.schema';
import {
  acceptInvite,
  previewInvite,
} from '@/services/auth/invite-api';
import { AUTH_ERROR_MESSAGES } from '@/services/auth/types';
import { LoadingButton } from '@/shared/components/LoadingButton';
import {
  FormContainer,
  FormFieldGroup,
  PasswordField,
  TextField,
  useFormSubmit,
  useZodForm,
} from '@/shared/forms';
import { Form } from '@/shared/ui/form';
import { EmptyState } from '@/shared/ui/empty-state';

function readTokenFromSearch(): string {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get('token')?.trim() ?? '';
}

export default function AcceptInvite() {
  const [, setLocation] = useLocation();
  const token = readTokenFromSearch();
  const [loadingPreview, setLoadingPreview] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  const form = useZodForm<AcceptInviteFormValues>(acceptInviteSchema, {
    fullName: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!token) {
      setPreviewError(AUTH_ERROR_MESSAGES.invite_invalid);
      setLoadingPreview(false);
      return;
    }

    let cancelled = false;

    previewInvite(token)
      .then((preview) => {
        if (cancelled) return;
        setEmail(preview.email);
        form.setValue('fullName', preview.fullName);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const code =
          error instanceof Error ? error.message : 'invite_invalid';
        setPreviewError(
          AUTH_ERROR_MESSAGES[code] ?? AUTH_ERROR_MESSAGES.invite_invalid,
        );
      })
      .finally(() => {
        if (!cancelled) setLoadingPreview(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const { submitting, handleSubmit } = useFormSubmit<AcceptInviteFormValues>({
    successMessage: 'Account activated. You can sign in now.',
    errorMessage: 'Unable to activate your account.',
    onSuccess: () => setLocation(ROUTES.login),
    onSubmit: async (values) => {
      await acceptInvite({
        token,
        password: values.password,
        fullName: values.fullName?.trim() || undefined,
      });
    },
  });

  if (loadingPreview) {
    return <EmptyState title="Loading invitation…" description="" />;
  }

  if (previewError) {
    return (
      <EmptyState
        title="Invitation unavailable"
        description={previewError}
        action={
          <Link href={ROUTES.login} className="text-primary hover:underline">
            Back to sign in
          </Link>
        }
      />
    );
  }

  return (
    <>
      <Form {...form}>
        <FormContainer
          title="Activate your account"
          description={`Set a password for ${email} to complete your Med'ease invitation.`}
          onSubmit={form.handleSubmit((values) => handleSubmit(values))}
          primaryAction={
            <LoadingButton
              className="w-full h-11 text-base shadow-md"
              type="submit"
              loading={submitting}
            >
              Activate account
            </LoadingButton>
          }
        >
          <FormFieldGroup columns={1}>
            <TextField
              control={form.control}
              name="fullName"
              label="Full name"
              placeholder="Jane Doe"
            />
            <PasswordField
              control={form.control}
              name="password"
              label="Password"
              description="Must be at least 12 characters and include a special character."
              required
            />
            <PasswordField
              control={form.control}
              name="confirmPassword"
              label="Confirm password"
              required
            />
          </FormFieldGroup>
        </FormContainer>
      </Form>

      <div className="mt-8 pt-6 border-t flex flex-col items-center justify-center gap-4">
        <div className="flex items-center text-xs text-muted-foreground font-medium bg-muted px-3 py-1.5 rounded-full">
          <Shield className="w-3.5 h-3.5 mr-1.5 text-primary" />
          Invite-only access
        </div>
        <p className="text-sm text-center text-muted-foreground">
          Already activated?{' '}
          <Link
            href={ROUTES.login}
            className="text-primary font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}
