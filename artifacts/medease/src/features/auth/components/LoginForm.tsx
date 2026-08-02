import { Link, useLocation } from 'wouter';
import { Shield } from 'lucide-react';

import { env } from '@/config/env';
import { useApiAuth } from '@/services/auth/auth-service';
import { useAuth } from '@/services/auth/auth-context';
import {
  loginSchema,
  type LoginFormValues,
} from '@/features/auth/validation/auth.schema';
import { LoadingButton } from '@/shared/components/LoadingButton';
import {
  CheckboxField,
  FormContainer,
  PasswordField,
  TextField,
  useZodForm,
} from '@/shared/forms';
import { Form } from '@/shared/ui/form';

export interface LoginFormCopy {
  submitLabel: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  forgotPasswordLabel: string;
  rememberMeLabel: string;
  complianceHint: string;
  devHint: string;
  prodHint: string;
  mockHint: string;
  noAccountLabel: string;
  createAccountLabel: string;
}

interface LoginFormProps {
  copy: LoginFormCopy;
  forgotPasswordHref: string;
  registerHref: string;
}

export function LoginForm({
  copy,
  forgotPasswordHref,
  registerHref,
}: LoginFormProps) {
  const [, setLocation] = useLocation();
  const { login, error, clearError, authState } = useAuth();

  const useDevDefaults = env.isDev;
  const form = useZodForm<LoginFormValues>(loginSchema, {
    email: useDevDefaults
      ? useApiAuth
        ? 'admin@medease.health'
        : 'patient@medease.health'
      : '',
    password: useDevDefaults ? 'demo' : '',
    rememberMe: false,
  });

  async function onSubmit(values: LoginFormValues) {
    clearError();
    try {
      const portalPath = await login(values);
      setLocation(portalPath);
    } catch {
      // Error surfaced via auth context.
    }
  }

  const hint = useApiAuth
    ? env.isDev
      ? copy.devHint
      : copy.prodHint
    : env.isDev
      ? copy.mockHint
      : null;

  return (
    <>
      <Form {...form}>
        <FormContainer
          onSubmit={form.handleSubmit(onSubmit)}
          primaryAction={
            <LoadingButton
              className="w-full h-11 text-base shadow-md"
              type="submit"
              loading={
                form.formState.isSubmitting || authState === 'authenticating'
              }
            >
              {copy.submitLabel}
            </LoadingButton>
          }
        >
          <TextField
            control={form.control}
            name="email"
            label={copy.emailLabel}
            placeholder={copy.emailPlaceholder}
            type="email"
            required
          />
          <PasswordField
            control={form.control}
            name="password"
            label={copy.passwordLabel}
            required
          />
          <div className="text-right -mt-2">
            <Link
              href={forgotPasswordHref}
              className="text-xs font-medium text-primary hover:underline"
            >
              {copy.forgotPasswordLabel}
            </Link>
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error.message}
            </p>
          ) : null}

          <CheckboxField
            control={form.control}
            name="rememberMe"
            label={copy.rememberMeLabel}
          />
        </FormContainer>
      </Form>

      <div className="mt-8 pt-6 border-t flex flex-col items-center justify-center gap-4">
        <div className="flex items-center text-xs text-muted-foreground font-medium bg-muted px-3 py-1.5 rounded-full">
          <Shield className="w-3.5 h-3.5 mr-1.5 text-primary" />
          {copy.complianceHint}
        </div>
        {hint ? (
          <p className="text-xs text-center text-muted-foreground">{hint}</p>
        ) : null}
        <p className="text-sm text-center text-muted-foreground">
          {copy.noAccountLabel}{' '}
          <Link
            href={registerHref}
            className="text-primary font-medium hover:underline"
          >
            {copy.createAccountLabel}
          </Link>
        </p>
      </div>
    </>
  );
}
