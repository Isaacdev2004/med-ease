export interface TransferRequest {
  id: string;
  patientName: string;
  fromFacility: string;
  toFacility: string;
  status: 'pending' | 'approved' | 'in_transit' | 'completed';
  priority: 'routine' | 'urgent' | 'critical';
  requestedAt: string;
}

const MOCK_TRANSFERS: TransferRequest[] = [
  { id: 'tr-1', patientName: 'Sarah Jenkins', fromFacility: 'Mount Sinai', toFacility: 'NYU Langone', status: 'pending', priority: 'urgent', requestedAt: '2026-07-14T08:30:00' },
  { id: 'tr-2', patientName: 'James Wilson', fromFacility: 'Bellevue', toFacility: 'Mount Sinai', status: 'approved', priority: 'routine', requestedAt: '2026-07-14T07:15:00' },
  { id: 'tr-3', patientName: 'Maria Lopez', fromFacility: 'NYU Langone', toFacility: 'Columbia Presbyterian', status: 'in_transit', priority: 'critical', requestedAt: '2026-07-13T22:00:00' },
  { id: 'tr-4', patientName: 'David Chen', fromFacility: 'Lenox Hill', toFacility: 'Hospital for Special Surgery', status: 'pending', priority: 'routine', requestedAt: '2026-07-14T09:45:00' },
  { id: 'tr-5', patientName: 'Aisha Patel', fromFacility: 'Memorial Sloan Kettering', toFacility: 'Mount Sinai', status: 'completed', priority: 'urgent', requestedAt: '2026-07-12T14:20:00' },
  { id: 'tr-6', patientName: 'Robert Taylor', fromFacility: 'Mount Sinai', toFacility: 'Bellevue', status: 'pending', priority: 'critical', requestedAt: '2026-07-14T10:05:00' },
];

export const transportService = {
  async listPending(filters?: { status?: string }): Promise<TransferRequest[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (!filters?.status) return MOCK_TRANSFERS;
    return MOCK_TRANSFERS.filter((transfer) => transfer.status === filters.status);
  },
};
