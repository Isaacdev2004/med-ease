import { RouteRedirect } from '@/shared/routing/RouteRedirect';
import { ROUTES } from '@/config/routes';

export default function PreInscriptionRedirect() {
  return <RouteRedirect to={ROUTES.register} />;
}
