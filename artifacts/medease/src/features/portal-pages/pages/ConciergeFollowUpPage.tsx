import { useQuery } from '@tanstack/react-query';

import { httpTransport } from '@workspace/repository-transport';
import { useApiAuth } from '@/services/auth/auth-service';
import { PageShell, LoadingView } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

type ConciergeLead = {
  id: string;
  ctaId: string;
  email: string | null;
  fields: Record<string, unknown>;
  createdAt: string;
  status: string;
};

async function fetchConciergeLeads(): Promise<ConciergeLead[]> {
  const raw = (await httpTransport.get('/api/marketing/leads', {
    query: { ctaId: 'concierge' },
  })) as { items?: ConciergeLead[] };
  return Array.isArray(raw?.items) ? raw.items : [];
}

export default function ConciergeFollowUpPage() {
  const query = useQuery({
    queryKey: ['marketing', 'leads', 'concierge'],
    queryFn: fetchConciergeLeads,
    enabled: useApiAuth,
  });

  return (
    <PageShell
      title="Conciergerie — suivi patient"
      subtitle="Demandes créées depuis /conciergerie, avec suivi et notification e-mail."
    >
      {query.isLoading ? <LoadingView label="Chargement des demandes…" /> : null}
      {!query.isLoading && (query.data?.length ?? 0) === 0 ? (
        <EmptyState
          title="Aucune demande"
          description="Soumettez une demande sur la page Conciergerie pour la voir apparaître ici."
        />
      ) : null}
      <div className="grid gap-3">
        {(query.data ?? []).map((lead) => (
          <Card key={lead.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">
                {String(lead.fields?.fullName ?? lead.email ?? 'Demande conciergerie')}
              </CardTitle>
              <Badge variant="secondary">{lead.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
              <p>E-mail : {lead.email ?? '—'}</p>
              <p>Créée le : {new Date(lead.createdAt).toLocaleString('fr-FR')}</p>
              <p>
                Message :{' '}
                {String(
                  lead.fields?.message ??
                    lead.fields?.need ??
                    lead.fields?.organization ??
                    '—',
                )}
              </p>
              <p className="text-xs">
                Notification e-mail envoyée à la boîte commerciale configurée
                (MARKETING_LEADS_NOTIFY_EMAIL).
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
