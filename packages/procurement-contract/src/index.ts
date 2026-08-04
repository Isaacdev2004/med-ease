export type RfqStatus = 'draft' | 'open' | 'closed' | 'awarded' | 'cancelled';
export type RfqResponseStatus =
  'submitted' | 'shortlisted' | 'awarded' | 'declined';
export type ReceiptStatus = 'pending' | 'partial' | 'complete' | 'rejected';
export type Currency = 'EUR' | 'USD' | 'GBP' | 'NGN' | 'XOF';

export interface ProcurementFilters {
  q?: string;
  department?: string;
  status?: string;
  supplierId?: string;
  page?: number;
  pageSize?: number;
}

export interface RfqLine {
  lineId: string;
  description: string;
  quantity: number;
  unit: string;
  specifications?: string;
}

export interface RfqResponse {
  responseId: string;
  rfqId: string;
  supplierId: string;
  supplierName: string;
  lineQuotes: { lineId: string; unitPrice: number; leadTimeDays: number }[];
  totalQuote: number;
  currency: Currency;
  validUntil: string;
  rank?: number;
  status: RfqResponseStatus;
  submittedAt: string;
}

export interface Rfq {
  rfqId: string;
  rfqNumber: string;
  title: string;
  department: string;
  status: RfqStatus;
  requisitionId?: string;
  invitedSuppliers: string[];
  lineItems: RfqLine[];
  deadline: string;
  responses: RfqResponse[];
  awardedSupplierId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoodsReceipt {
  receiptId: string;
  receiptNumber: string;
  purchaseOrderId: string;
  poNumber: string;
  supplierId: string;
  warehouseId: string;
  status: ReceiptStatus;
  lineItems: {
    lineId: string;
    description: string;
    orderedQty: number;
    receivedQty: number;
  }[];
  receivedBy: string;
  receivedAt: string;
  notes?: string;
}

export interface CreateRfqInput {
  title: string;
  department: string;
  requisitionId?: string;
  invitedSuppliers: string[];
  lineItems: Omit<RfqLine, 'lineId'>[];
  deadline: string;
}

export interface ReceiveGoodsInput {
  purchaseOrderId: string;
  warehouseId: string;
  receivedBy: string;
  lineItems: { lineId: string; receivedQty: number }[];
  notes?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ProcurementRepositoryContract {
  searchRfqs(filters?: ProcurementFilters): Promise<PaginatedResult<Rfq>>;
  createRfq(input: CreateRfqInput): Promise<Rfq>;
  awardRfq(rfqId: string, responseId: string): Promise<Rfq>;
  searchGoodsReceipts(
    filters?: ProcurementFilters,
  ): Promise<PaginatedResult<GoodsReceipt>>;
  createGoodsReceipt(input: ReceiveGoodsInput): Promise<GoodsReceipt>;
}
