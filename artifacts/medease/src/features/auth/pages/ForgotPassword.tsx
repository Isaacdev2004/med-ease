import { Link } from 'wouter';
import { Shield, ArrowLeft } from 'lucide-react';

import { ROUTES } from '@/config/routes';
import { appToast } from '@/services/api/toast';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/features/auth/validation/auth.schema';
import { LoadingButton } from '@/shared/components/LoadingButton';
import {
  FormContainer,
  TextField,
  useFormSubmit,
  useZodForm,
} from '@/shared/forms';
import { Form } from '@/shared/ui/form';

export default function ForgotPassword() {
  const form = useZodForm<ForgotPasswordFormValues>(forgotPasswordSchema, {
    email: '',
  });

  const { submitting, handleSubmit } = useFormSubmit<ForgotPasswordFormValues>({
    successMessage: 'If an account exists, a reset link has been sent.',
    errorMessage: 'Unable to send reset link. Please try again.',
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
    },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    await handleSubmit(values);
    appToast.info({
      title: 'Check your inbox',
      description: `We sent instructions to ${values.email} if it matches an account.`,
    });
  }

  return (
    <>
      <Form {...form}>
        <FormContainer
          title="Reset your password"
          description="Enter the email associated with your account and we'll send recovery instructions."
          onSubmit={form.handleSubmit(onSubmit)}
          primaryAction={
            <LoadingButton
              className="w-full h-11 text-base shadow-md"
              type="submit"
              loading={submitting}
            >
              Send Reset Link
            </LoadingButton>
          }
        >
          <TextField
            control={form.control}
            name="email"
            label="Email Address"
            placeholder="name@example.com"
            type="email"
            required
          />
        </FormContainer>
      </Form>

      <div className="mt-8 pt-6 border-t flex flex-col items-center justify-center gap-4">
        <Link
          href={ROUTES.login}
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to login
        </Link>
        <div className="flex items-center text-xs text-muted-foreground font-medium bg-muted px-3 py-1.5 rounded-full mt-2">
          <Shield className="w-3.5 h-3.5 mr-1.5 text-primary" />
          Secure Account Recovery
        </div>
      </div>
    </>
  );
}
