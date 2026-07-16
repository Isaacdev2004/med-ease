import { Link, useLocation } from 'wouter';
import { Shield } from 'lucide-react';

import { ROUTES } from '@/config/routes';
import { DEMO_CREDENTIALS_HINT } from '@/services/auth/demo-users';
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

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, error, clearError, authState } = useAuth();

  const form = useZodForm<LoginFormValues>(loginSchema, {
    email: 'patient@medease.health',
    password: 'demo',
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

  return (
    <>
      <Form {...form}>
        <FormContainer
          onSubmit={form.handleSubmit(onSubmit)}
          primaryAction={
            <LoadingButton
              className="w-full h-11 text-base shadow-md"
              type="submit"
              loading={form.formState.isSubmitting || authState === 'authenticating'}
            >
              Sign In Securely
            </LoadingButton>
          }
        >
          <TextField
            control={form.control}
            name="email"
            label="Email Address or ID"
            placeholder="name@example.com"
            type="email"
            required
          />
          <PasswordField
            control={form.control}
            name="password"
            label="Password"
            required
          />
          <div className="text-right -mt-2">
            <Link
              href={ROUTES.forgotPassword}
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
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
            label="Remember this device for 30 days"
          />
        </FormContainer>
      </Form>

      <div className="mt-8 pt-6 border-t flex flex-col items-center justify-center gap-4">
        <div className="flex items-center text-xs text-muted-foreground font-medium bg-muted px-3 py-1.5 rounded-full">
          <Shield className="w-3.5 h-3.5 mr-1.5 text-primary" />
          HIPAA Compliant Secure Portal
        </div>
        <p className="text-xs text-center text-muted-foreground">{DEMO_CREDENTIALS_HINT}</p>
        <p className="text-sm text-center text-muted-foreground">
          New to Med&apos;ease?{' '}
          <Link href={ROUTES.register} className="text-primary font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </>
  );
}
