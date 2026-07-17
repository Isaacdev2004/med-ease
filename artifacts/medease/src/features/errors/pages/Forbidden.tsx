import { Link } from 'wouter';
import { ShieldAlert } from 'lucide-react';

import { ROUTES } from '@/config/routes';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { useDocumentTitle } from '@/shared/hooks/use-document-title';

export default function Forbidden() {
  useDocumentTitle('Access Denied');

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center gap-2">
            <ShieldAlert
              className="h-8 w-8 text-destructive"
              aria-hidden="true"
            />
            <h1 className="text-2xl font-bold tracking-tight">
              403 — Access Denied
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            You do not have permission to view this page. Contact your
            administrator if you believe this is an error.
          </p>
          <div className="mt-6 flex gap-2">
            <Button asChild variant="outline">
              <Link href={ROUTES.home}>Return Home</Link>
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
