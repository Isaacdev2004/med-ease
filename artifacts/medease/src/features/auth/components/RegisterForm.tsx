import { Link, useLocation } from 'wouter';
import { Shield } from 'lucide-react';

import {
  registerSchema,
  type RegisterFormValues,
} from '@/features/auth/validation/auth.schema';
import { LoadingButton } from '@/shared/components/LoadingButton';
import {
  FormContainer,
  FormFieldGroup,
  FormSection,
  PasswordField,
  SelectField,
  TextField,
  useFormSubmit,
  useZodForm,
} from '@/shared/forms';
import { Form } from '@/shared/ui/form';

export interface RegisterFormCopy {
  title: string;
  description: string;
  submitLabel: string;
  helpText: string;
  personalSectionTitle: string;
  securitySectionTitle: string;
  firstNameLabel: string;
  firstNamePlaceholder: string;
  lastNameLabel: string;
  lastNamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  roleLabel: string;
  passwordLabel: string;
  passwordDescription: string;
  confirmPasswordLabel: string;
  complianceHint: string;
  hasAccountLabel: string;
  signInLabel: string;
  successMessage: string;
  errorMessage: string;
  roleOptions: ReadonlyArray<{ label: string; value: string }>;
}

interface RegisterFormProps {
  copy: RegisterFormCopy;
  loginHref: string;
}

export function RegisterForm({ copy, loginHref }: RegisterFormProps) {
  const [, setLocation] = useLocation();
  const form = useZodForm<RegisterFormValues>(registerSchema, {
    firstName: '',
    lastName: '',
    email: '',
    role: 'patient',
    password: '',
    confirmPassword: '',
  });

  const { submitting, handleSubmit } = useFormSubmit<RegisterFormValues>({
    successMessage: copy.successMessage,
    errorMessage: copy.errorMessage,
    onSuccess: () => setLocation(loginHref),
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
    },
  });

  return (
    <>
      <Form {...form}>
        <FormContainer
          title={copy.title}
          description={copy.description}
          onSubmit={form.handleSubmit((values) => handleSubmit(values))}
          primaryAction={
            <LoadingButton
              className="w-full h-11 text-base shadow-md"
              type="submit"
              loading={submitting}
            >
              {copy.submitLabel}
            </LoadingButton>
          }
          helpText={copy.helpText}
        >
          <FormSection title={copy.personalSectionTitle}>
            <FormFieldGroup columns={2}>
              <TextField
                control={form.control}
                name="firstName"
                label={copy.firstNameLabel}
                placeholder={copy.firstNamePlaceholder}
                required
              />
              <TextField
                control={form.control}
                name="lastName"
                label={copy.lastNameLabel}
                placeholder={copy.lastNamePlaceholder}
                required
              />
            </FormFieldGroup>
            <TextField
              control={form.control}
              name="email"
              label={copy.emailLabel}
              placeholder={copy.emailPlaceholder}
              type="email"
              required
            />
            <SelectField
              control={form.control}
              name="role"
              label={copy.roleLabel}
              options={[...copy.roleOptions]}
              required
            />
          </FormSection>

          <FormSection title={copy.securitySectionTitle}>
            <PasswordField
              control={form.control}
              name="password"
              label={copy.passwordLabel}
              description={copy.passwordDescription}
              required
            />
            <PasswordField
              control={form.control}
              name="confirmPassword"
              label={copy.confirmPasswordLabel}
              required
            />
          </FormSection>
        </FormContainer>
      </Form>

      <div className="mt-8 pt-6 border-t flex flex-col items-center justify-center gap-4">
        <div className="flex items-center text-xs text-muted-foreground font-medium bg-muted px-3 py-1.5 rounded-full">
          <Shield className="w-3.5 h-3.5 mr-1.5 text-primary" />
          {copy.complianceHint}
        </div>
        <p className="text-sm text-center text-muted-foreground">
          {copy.hasAccountLabel}{' '}
          <Link
            href={loginHref}
            className="text-primary font-medium hover:underline"
          >
            {copy.signInLabel}
          </Link>
        </p>
      </div>
    </>
  );
}
