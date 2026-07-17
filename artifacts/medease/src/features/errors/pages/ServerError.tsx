import { Link } from 'wouter';
import { ServerCrash } from 'lucide-react';

import { ROUTES } from '@/config/routes';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { useDocumentTitle } from '@/shared/hooks/use-document-title';

export default function ServerError() {
  useDocumentTitle('Server Error');

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center gap-2">
            <ServerCrash
              className="h-8 w-8 text-destructive"
              aria-hidden="true"
            />
            <h1 className="text-2xl font-bold tracking-tight">
              500 — Server Error
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Something went wrong on our end. Please try again later.
          </p>
          <Button asChild className="mt-6">
            <Link href={ROUTES.home}>Return Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
