import { Link } from 'wouter';
import { AlertCircle, Home } from 'lucide-react';

import { ROUTES } from '@/config/routes';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { useDocumentTitle } from '@/shared/hooks/use-document-title';

export default function NotFound() {
  useDocumentTitle('Page Not Found');

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle
              className="h-8 w-8 text-destructive"
              aria-hidden="true"
            />
            <h1 className="text-2xl font-bold tracking-tight">
              404 — Page Not Found
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            The page you requested does not exist or may have moved.
          </p>
          <div className="mt-6 flex gap-2">
            <Button asChild variant="outline">
              <Link href={ROUTES.home}>
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button asChild>
              <Link href={ROUTES.login}>Sign In</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
