import { Link } from 'wouter';

import { getPortalLoginPathFromPathname } from '@/config/routes/portal-login';
import { absoluteAppPath } from '@/shared/hooks/use-portal-path';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { useDocumentTitle } from '@/shared/hooks/use-document-title';
import { useLocation } from 'wouter';

export default function SessionExpired() {
  const [location] = useLocation();
  useDocumentTitle('Session Expired');
  const loginHref = absoluteAppPath(getPortalLoginPathFromPathname(location));

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="space-y-4 pt-0">
        <p className="text-sm text-muted-foreground">
          Your session has expired for security reasons. Sign in again to
          continue where you left off.
        </p>
        <Button asChild className="w-full">
          <Link href={loginHref}>Sign In</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
