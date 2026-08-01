import { ROUTES } from '@/config/routes';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

const copy = {
  title: 'Create your account',
  description: "Register for secure access to Med'ease healthcare services.",
  submitLabel: 'Complete Registration',
  helpText:
    'Your information is encrypted and handled in compliance with healthcare privacy standards.',
  personalSectionTitle: 'Personal Information',
  securitySectionTitle: 'Security',
  firstNameLabel: 'First Name',
  firstNamePlaceholder: 'Jane',
  lastNameLabel: 'Last Name',
  lastNamePlaceholder: 'Doe',
  emailLabel: 'Email Address',
  emailPlaceholder: 'name@example.com',
  roleLabel: 'I am registering as a…',
  passwordLabel: 'Password',
  passwordDescription:
    'Must be at least 12 characters and include a special character.',
  confirmPasswordLabel: 'Confirm Password',
  complianceHint: 'Your data is encrypted end-to-end',
  hasAccountLabel: 'Already have an account?',
  signInLabel: 'Sign in instead',
  successMessage: 'Registration submitted. Please sign in.',
  errorMessage: 'Unable to complete registration.',
  roleOptions: [
    { label: 'Patient', value: 'patient' },
    { label: 'Healthcare Professional', value: 'professional' },
    { label: 'Facility Administrator', value: 'facility' },
  ],
};

export default function Register() {
  return <RegisterForm copy={copy} loginHref={ROUTES.login} />;
}
