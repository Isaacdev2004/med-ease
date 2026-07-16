import { Link } from 'wouter';

import { ROUTES } from '@/config/routes';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { useDocumentTitle } from '@/shared/hooks/use-document-title';

export default function SessionExpired() {
  useDocumentTitle('Session Expired');

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="space-y-4 pt-0">
        <p className="text-sm text-muted-foreground">
          Your session has expired for security reasons. Sign in again to
          continue where you left off.
        </p>
        <Button asChild className="w-full">
          <Link href={ROUTES.login}>Sign In</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
