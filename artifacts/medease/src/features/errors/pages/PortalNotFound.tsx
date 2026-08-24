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
  useDocumentTitle('Page introuvable', portalLabel);

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
              Page introuvable
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Cette page du portail {portalLabel.toLowerCase()} n’est pas
            disponible. Vérifiez l’URL ou retournez au tableau de bord.
          </p>
          <Button asChild className="mt-6">
            <Link href={dashboardPath}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au tableau de bord
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
