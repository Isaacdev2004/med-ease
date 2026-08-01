import { RouteRedirect } from '@/shared/routing/RouteRedirect';
import { ROUTES } from '@/config/routes';

export default function ConnexionRedirect() {
  return <RouteRedirect to={ROUTES.login} />;
}
