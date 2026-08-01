import { ROUTES } from '@/config/routes';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { DEMO_CREDENTIALS_HINT } from '@/services/auth/demo-users';

const copy = {
  submitLabel: 'Sign In Securely',
  emailLabel: 'Email Address or ID',
  emailPlaceholder: 'name@example.com',
  passwordLabel: 'Password',
  forgotPasswordLabel: 'Forgot password?',
  rememberMeLabel: 'Remember this device for 30 days',
  complianceHint: 'HIPAA Compliant Secure Portal',
  devHint:
    'Development: sign in with seeded users (e.g. admin@medease.health / demo).',
  prodHint: 'Sign in with your organization credentials.',
  mockHint: DEMO_CREDENTIALS_HINT,
  noAccountLabel: "New to Med'ease?",
  createAccountLabel: 'Create an account',
};

export default function Login() {
  return (
    <LoginForm
      copy={copy}
      forgotPasswordHref={ROUTES.forgotPassword}
      registerHref={ROUTES.register}
    />
  );
}
