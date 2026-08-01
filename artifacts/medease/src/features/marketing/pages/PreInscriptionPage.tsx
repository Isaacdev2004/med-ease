import { ROUTES } from '@/config/routes';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { frenchAuthCopy } from '@/features/marketing/content/auth-fr';

export default function PreInscriptionPage() {
  return (
    <RegisterForm
      copy={frenchAuthCopy.preInscription.form}
      loginHref={ROUTES.connexion}
    />
  );
}
