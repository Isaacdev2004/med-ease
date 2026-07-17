import type {
  CreateRFQInput,
  RFQ,
  RFQResponse,
} from '@/services/procurement/types';

export function buildRFQ(
  input: CreateRFQInput,
  rfqId: string,
  rfqNumber: string,
): RFQ {
  return {
    rfqId,
    rfqNumber,
    title: input.title,
    department: input.department,
    status: 'open',
    requisitionId: input.requisitionId,
    invitedSuppliers: input.invitedSuppliers,
    lineItems: input.lineItems.map((l, i) => ({
      ...l,
      lineId: `${rfqId}-line-${i}`,
    })),
    deadline: input.deadline,
    responses: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function rankQuotations(responses: RFQResponse[]): RFQResponse[] {
  return [...responses]
    .sort((a, b) => a.totalQuote - b.totalQuote)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}

export function compareQuotations(responses: RFQResponse[]) {
  const ranked = rankQuotations(responses);
  const lowest = ranked[0];
  const highest = ranked[ranked.length - 1];
  const savings =
    highest && lowest ? highest.totalQuote - lowest.totalQuote : 0;
  return { ranked, savings, recommended: lowest?.responseId };
}

export function awardRFQ(rfq: RFQ, responseId: string): RFQ {
  const response = rfq.responses.find((r) => r.responseId === responseId);
  return {
    ...rfq,
    status: 'awarded',
    awardedSupplierId: response?.supplierId,
    responses: rfq.responses.map((r) => ({
      ...r,
      status:
        r.responseId === responseId
          ? 'awarded'
          : r.status === 'awarded'
            ? r.status
            : 'declined',
    })),
    updatedAt: new Date().toISOString(),
  };
}

export function declineResponse(rfq: RFQ, responseId: string): RFQ {
  return {
    ...rfq,
    responses: rfq.responses.map((r) =>
      r.responseId === responseId ? { ...r, status: 'declined' } : r,
    ),
    updatedAt: new Date().toISOString(),
  };
}

export function addRFQResponse(rfq: RFQ, response: RFQResponse): RFQ {
  return {
    ...rfq,
    responses: [...rfq.responses, response],
    updatedAt: new Date().toISOString(),
  };
}
