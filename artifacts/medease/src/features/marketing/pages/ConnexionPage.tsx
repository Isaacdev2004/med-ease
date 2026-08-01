import { ROUTES } from '@/config/routes';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { frenchAuthCopy } from '@/features/marketing/content/auth-fr';

export default function ConnexionPage() {
  return (
    <LoginForm
      copy={frenchAuthCopy.connexion.form}
      forgotPasswordHref={ROUTES.forgotPassword}
      registerHref={ROUTES.preInscription}
    />
  );
}
