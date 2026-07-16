import { Link, useLocation } from 'wouter';
import { Shield } from 'lucide-react';

import { ROUTES } from '@/config/routes';
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

const ROLE_OPTIONS = [
  { label: 'Patient', value: 'patient' },
  { label: 'Healthcare Professional', value: 'professional' },
  { label: 'Facility Administrator', value: 'facility' },
];

export default function Register() {
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
    successMessage: 'Registration submitted. Please sign in.',
    errorMessage: 'Unable to complete registration.',
    onSuccess: () => setLocation(ROUTES.login),
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
    },
  });

  return (
    <>
      <Form {...form}>
        <FormContainer
          title="Create your account"
          description="Register for secure access to Med'ease healthcare services."
          onSubmit={form.handleSubmit((values) => handleSubmit(values))}
          primaryAction={
            <LoadingButton
              className="w-full h-11 text-base shadow-md"
              type="submit"
              loading={submitting}
            >
              Complete Registration
            </LoadingButton>
          }
          helpText="Your information is encrypted and handled in compliance with healthcare privacy standards."
        >
          <FormSection title="Personal Information">
            <FormFieldGroup columns={2}>
              <TextField
                control={form.control}
                name="firstName"
                label="First Name"
                placeholder="Jane"
                required
              />
              <TextField
                control={form.control}
                name="lastName"
                label="Last Name"
                placeholder="Doe"
                required
              />
            </FormFieldGroup>
            <TextField
              control={form.control}
              name="email"
              label="Email Address"
              placeholder="name@example.com"
              type="email"
              required
            />
            <SelectField
              control={form.control}
              name="role"
              label="I am registering as a…"
              options={ROLE_OPTIONS}
              required
            />
          </FormSection>

          <FormSection title="Security">
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
              label="Confirm Password"
              required
            />
          </FormSection>
        </FormContainer>
      </Form>

      <div className="mt-8 pt-6 border-t flex flex-col items-center justify-center gap-4">
        <div className="flex items-center text-xs text-muted-foreground font-medium bg-muted px-3 py-1.5 rounded-full">
          <Shield className="w-3.5 h-3.5 mr-1.5 text-primary" />
          Your data is encrypted end-to-end
        </div>
        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{' '}
          <Link href={ROUTES.login} className="text-primary font-medium hover:underline">
            Sign in instead
          </Link>
        </p>
      </div>
    </>
  );
}
