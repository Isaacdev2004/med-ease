import { Link } from 'wouter';
import { Shield, Mail } from 'lucide-react';

import { ROUTES } from '@/config/routes';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { useApiAuth } from '@/services/auth/auth-service';

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
  if (useApiAuth) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Invite-only access
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Med'ease accounts are provisioned by your organization administrator.
            If you received an invitation, use the link in your email to set
            your password.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Already activated?{' '}
          <Link
            href={ROUTES.login}
            className="text-primary font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
        <div className="pt-6 border-t flex justify-center">
          <div className="flex items-center text-xs text-muted-foreground font-medium bg-muted px-3 py-1.5 rounded-full">
            <Shield className="w-3.5 h-3.5 mr-1.5 text-primary" />
            Contact your administrator for access
          </div>
        </div>
      </div>
    );
  }

  return <RegisterForm copy={copy} loginHref={ROUTES.login} />;
}
