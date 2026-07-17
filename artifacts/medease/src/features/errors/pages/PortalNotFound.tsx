import { Link } from 'wouter';
import { AlertCircle, ArrowLeft } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { useDocumentTitle } from '@/shared/hooks/use-document-title';

interface PortalNotFoundProps {
  portalLabel: string;
  dashboardPath: string;
}

export default function PortalNotFound({
  portalLabel,
  dashboardPath,
}: PortalNotFoundProps) {
  useDocumentTitle('Page Not Found', `${portalLabel} Portal`);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center gap-2">
            <AlertCircle
              className="h-7 w-7 text-destructive"
              aria-hidden="true"
            />
            <h1 className="text-2xl font-bold tracking-tight">
              Page not found
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            This {portalLabel.toLowerCase()} portal page is not available. Check
            the URL or return to your dashboard.
          </p>
          <Button asChild className="mt-6">
            <Link href={dashboardPath}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
