import { Link } from 'wouter';
import { WifiOff } from 'lucide-react';

import { ROUTES } from '@/config/routes';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { useDocumentTitle } from '@/shared/hooks/use-document-title';

export default function Offline() {
  useDocumentTitle('Offline');

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center gap-2">
            <WifiOff className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
            <h1 className="text-2xl font-bold tracking-tight">You are offline</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Check your internet connection and try again.
          </p>
          <Button className="mt-6" onClick={() => window.location.reload()}>
            Retry
          </Button>
          <Button asChild variant="ghost" className="mt-2 w-full">
            <Link href={ROUTES.home}>Return Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
