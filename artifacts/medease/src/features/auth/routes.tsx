import { AuthLayout } from '@/app/layouts/AuthLayout';

import Login from '@/features/auth/pages/Login';
import Register from '@/features/auth/pages/Register';
import ForgotPassword from '@/features/auth/pages/ForgotPassword';

export function LoginRoute() {
  return (
    <AuthLayout>
      <Login />
    </AuthLayout>
  );
}

export function RegisterRoute() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join the Med'ease healthcare network."
    >
      <Register />
    </AuthLayout>
  );
}

export function ForgotPasswordRoute() {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll send a secure link to your registered email."
    >
      <ForgotPassword />
    </AuthLayout>
  );
}
