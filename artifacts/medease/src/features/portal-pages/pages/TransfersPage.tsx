import {
  PortalDataTableSection,
  PortalMetricsGrid,
  PortalStatusBadge,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import { TransferRequestDialog, downloadLiaisonLetterPdf } from '@/features/portal-pages/components/TransferRequestDialog';
import {
  useCancelTransfer,
  useCompleteTransfer,
  useTransfers,
} from '@/features/admissions/hooks/use-admissions';
import { toTransferRow } from '@/services/admissions/types';
import type { DataTableColumn } from '@/shared/components';
import { PageShell } from '@/shared/components';
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';

type TransferRow = ReturnType<typeof toTransferRow>;

const columns: DataTableColumn<TransferRow>[] = [
  { id: 'patient', header: 'Patient', cell: (row) => row.patient },
  { id: 'from', header: 'Origine', cell: (row) => row.fromWard },
  { id: 'to', header: 'Destination', cell: (row) => row.toWard },
  { id: 'requestedAt', header: 'Demandé le', cell: (row) => row.requestedAt },
  {
    id: 'status',
    header: 'Statut',
    cell: (row) => <PortalStatusBadge label={row.status} />,
  },
];

export default function TransfersPage() {
  const transfersQuery = useTransfers();
  const completeTransfer = useCompleteTransfer();
  const cancelTransfer = useCancelTransfer();

  const transfers = (transfersQuery.data ?? []).map(toTransferRow);
  const raw = transfersQuery.data ?? [];
  const active = transfers.filter(
    (row) => row.status === 'requested' || row.status === 'in-transit',
  ).length;
  const completed = transfers.filter((row) => row.status === 'completed').length;

  return (
    <PageShell
      title="Transferts"
      subtitle="Coordonner les transferts inter-services et inter-établissements."
      primaryAction={<TransferRequestDialog />}
    >
      <PortalMetricsGrid
        columns={3}
        metrics={[
          { title: 'Transferts actifs', value: active, status: 'observation' },
          { title: 'Terminés', value: completed, status: 'stable' },
          { title: 'Total', value: transfers.length },
        ]}
      />

      <PortalDataTableSection
        title="Demandes de transfert"
        description="Suivi du statut jusqu’à réception par l’établissement destinataire."
        actionLabel="Actualiser"
        columns={columns}
        data={transfers}
        getRowId={(row) => row.id}
        rowActions={(row) => {
          const full = raw.find((t) => t.id === row.id);
          return (
            <>
              {full ? (
                <DropdownMenuItem
                  onClick={() => downloadLiaisonLetterPdf(full)}
                >
                  Télécharger lettre de liaison
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem
                onClick={() => {
                  completeTransfer.mutate(row.id);
                }}
              >
                Marquer terminé
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  cancelTransfer.mutate(row.id);
                }}
              >
                Annuler le transfert
              </DropdownMenuItem>
            </>
          );
        }}
      />
    </PageShell>
  );
}
