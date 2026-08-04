import type { QueryParams } from '@workspace/repository-transport';
import { httpTransport } from '@workspace/repository-transport';

import type {
  CreateInvoiceInput,
  CreatePOInput,
  CreateRequisitionInput,
  CreateRFQInput,
  Currency,
  GoodsReceipt,
  POStatus,
  ProcurementDepartment,
  ProcurementExport,
  ProcurementFavorite,
  ProcurementFilters,
  PurchaseOrder,
  ReceiveGoodsInput,
  ReceiptStatus,
  RFQ,
  RFQStatus,
  Supplier,
} from '@/services/procurement/types';

const PROC_BASE = '/api/procurement';
const INV_BASE = '/api/inventory';

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function emptyPage(page = 1, pageSize = 25) {
  return { items: [] as never[], total: 0, page, pageSize };
}

function filtersToQuery(filters?: ProcurementFilters): QueryParams | undefined {
  if (!filters) return undefined;
  return {
    q: filters.q,
    department: filters.department,
    status: filters.status,
    supplierId: filters.supplierId,
    page: filters.page,
    pageSize: filters.pageSize,
  };
}

function mapPoStatus(status: string): POStatus {
  if (status === 'partial') return 'partially_received';
  return (status as POStatus) || 'draft';
}

function mapInventoryPo(raw: unknown): PurchaseOrder {
  const row = asRecord(raw);
  const items = Array.isArray(row.items) ? row.items : [];
  return {
    purchaseOrderId: asString(row.purchaseOrderId),
    poNumber: asString(row.poNumber),
    supplierId: asString(row.supplierId),
    supplierName: asString(row.supplierName),
    department: asString(row.department, 'general') as ProcurementDepartment,
    status: mapPoStatus(asString(row.status, 'draft')),
    items: items.map((item) => {
      const line = asRecord(item);
      return {
        lineId: asString(line.lineId),
        sku: asOptionalString(line.sku),
        description: asString(line.itemName || line.description),
        quantity: asNumber(line.quantity),
        unit: 'ea',
        unitPrice: asNumber(line.unitPrice),
        total: asNumber(line.quantity) * asNumber(line.unitPrice),
        receivedQuantity: asNumber(line.receivedQuantity),
      };
    }),
    subtotal: asNumber(row.subtotal),
    tax: asNumber(row.tax),
    shipping: 0,
    total: asNumber(row.total),
    currency: 'EUR' as Currency,
    paymentTerms: 'net_30',
    expectedDelivery: asOptionalString(row.expectedDelivery),
    warehouseId: undefined,
    costCenterId: 'cc-default',
    createdAt: asString(row.createdAt),
    updatedAt: asString(row.updatedAt),
  };
}

function mapSupplier(raw: unknown): Supplier {
  const row = asRecord(raw);
  const now = new Date().toISOString();
  return {
    supplierId: asString(row.supplierId),
    name: asString(row.name),
    code: asString(row.code, asString(row.supplierId).slice(-6).toUpperCase()),
    category: 'medical',
    contactEmail: asString(row.contactEmail),
    contactPhone: asString(row.contactPhone),
    address: asString(row.address),
    country: 'FR',
    isInternational: false,
    isPreferred: asNumber(row.rating) >= 4.5,
    rating: asNumber(row.rating),
    onTimeDeliveryRate: asNumber(row.onTimeDeliveryRate),
    qualityScore: asNumber(row.rating) * 20,
    priceScore: 75,
    riskScore: 20,
    complianceScore: 90,
    totalOrders: asNumber(row.totalOrders),
    totalSpend: 0,
    currency: 'EUR',
    paymentTerms: 'net_30',
    status: asString(row.status, 'active') === 'active' ? 'active' : 'inactive',
    certifications: [],
    createdAt: now,
    updatedAt: now,
  };
}

function mapRfq(raw: unknown): RFQ {
  const row = asRecord(raw);
  return {
    rfqId: asString(row.rfqId),
    rfqNumber: asString(row.rfqNumber),
    title: asString(row.title),
    department: asString(row.department, 'general') as ProcurementDepartment,
    status: asString(row.status, 'draft') as RFQStatus,
    requisitionId: asOptionalString(row.requisitionId),
    invitedSuppliers: Array.isArray(row.invitedSuppliers)
      ? (row.invitedSuppliers as string[])
      : [],
    lineItems: Array.isArray(row.lineItems)
      ? row.lineItems.map((l) => {
          const line = asRecord(l);
          return {
            lineId: asString(line.lineId),
            description: asString(line.description),
            quantity: asNumber(line.quantity),
            unit: asString(line.unit, 'ea'),
            specifications: asOptionalString(line.specifications),
          };
        })
      : [],
    deadline: asString(row.deadline),
    responses: Array.isArray(row.responses)
      ? row.responses.map((r) => {
          const resp = asRecord(r);
          return {
            responseId: asString(resp.responseId),
            rfqId: asString(resp.rfqId),
            supplierId: asString(resp.supplierId),
            supplierName: asString(resp.supplierName),
            lineQuotes: Array.isArray(resp.lineQuotes)
              ? (resp.lineQuotes as RFQ['responses'][0]['lineQuotes'])
              : [],
            totalQuote: asNumber(resp.totalQuote),
            currency: (asString(resp.currency, 'EUR') as Currency) || 'EUR',
            validUntil: asString(resp.validUntil),
            rank: typeof resp.rank === 'number' ? resp.rank : undefined,
            status: asString(resp.status, 'submitted') as RFQ['responses'][0]['status'],
            submittedAt: asString(resp.submittedAt),
          };
        })
      : [],
    awardedSupplierId: asOptionalString(row.awardedSupplierId),
    createdAt: asString(row.createdAt),
    updatedAt: asString(row.updatedAt),
  };
}

function mapReceipt(raw: unknown): GoodsReceipt {
  const row = asRecord(raw);
  return {
    receiptId: asString(row.receiptId),
    receiptNumber: asString(row.receiptNumber),
    purchaseOrderId: asString(row.purchaseOrderId),
    poNumber: asString(row.poNumber),
    supplierId: asString(row.supplierId),
    warehouseId: asString(row.warehouseId),
    status: asString(row.status, 'pending') as ReceiptStatus,
    lineItems: Array.isArray(row.lineItems)
      ? row.lineItems.map((l) => {
          const line = asRecord(l);
          return {
            lineId: asString(line.lineId),
            description: asString(line.description),
            orderedQty: asNumber(line.orderedQty),
            receivedQty: asNumber(line.receivedQty),
          };
        })
      : [],
    receivedBy: asString(row.receivedBy),
    receivedAt: asString(row.receivedAt),
    notes: asOptionalString(row.notes),
  };
}

class ProcurementHttpRepository {
  private readonly transport = httpTransport;
  private favorites: ProcurementFavorite[] = [];
  private nextId = 1;

  searchRequests(filters?: ProcurementFilters) {
    return emptyPage(filters?.page, filters?.pageSize);
  }

  getRequest() {
    return null;
  }

  createRequisition(_input: CreateRequisitionInput) {
    throw new Error('Requisitions are not available on the live API yet');
  }

  approveRequest() {
    return null;
  }

  rejectRequest() {
    return null;
  }

  archiveRequest() {
    return null;
  }

  searchOrders(filters?: ProcurementFilters) {
    return this.transport
      .get(`${INV_BASE}/purchase-orders`, { query: filtersToQuery(filters) })
      .then((raw: unknown) => {
        const row = asRecord(raw);
        return {
          items: Array.isArray(row.items) ? row.items.map(mapInventoryPo) : [],
          total: asNumber(row.total),
          page: asNumber(row.page, filters?.page ?? 1),
          pageSize: asNumber(row.pageSize, filters?.pageSize ?? 25),
        };
      });
  }

  async getOrder(purchaseOrderId: string) {
    const page = await this.searchOrders({ q: purchaseOrderId, pageSize: 50 });
    return (
      page.items.find((o: PurchaseOrder) => o.purchaseOrderId === purchaseOrderId) ?? null
    );
  }

  createPO(input: CreatePOInput) {
    return this.transport
      .post(`${INV_BASE}/purchase-orders`, {
        body: {
          supplierId: input.supplierId,
          department: input.department,
          items: input.items.map((i) => ({
            sku: i.sku ?? 'CUSTOM',
            itemName: i.description,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
          requestedBy: 'Procurement',
        },
      })
      .then(mapInventoryPo);
  }

  async approvePO(purchaseOrderId: string) {
    try {
      return mapInventoryPo(
        await this.transport.post(
          `${INV_BASE}/purchase-orders/${purchaseOrderId}/approve`,
          { body: {} },
        ),
      );
    } catch {
      return null;
    }
  }

  async receiveGoods(input: ReceiveGoodsInput) {
    try {
      return mapReceipt(
        await this.transport.post(`${PROC_BASE}/goods-receipts`, {
          body: input,
        }),
      );
    } catch {
      return null;
    }
  }

  cancelOrder() {
    return null;
  }

  closeOrder() {
    return null;
  }

  searchRFQs(filters?: ProcurementFilters) {
    return this.transport
      .get(`${PROC_BASE}/rfqs`, { query: filtersToQuery(filters) })
      .then((raw: unknown) => {
        const row = asRecord(raw);
        return {
          items: Array.isArray(row.items) ? row.items.map(mapRfq) : [],
          total: asNumber(row.total),
          page: asNumber(row.page, filters?.page ?? 1),
          pageSize: asNumber(row.pageSize, filters?.pageSize ?? 25),
        };
      });
  }

  createRFQ(input: CreateRFQInput) {
    return this.transport
      .post(`${PROC_BASE}/rfqs`, { body: input })
      .then(mapRfq);
  }

  async awardRFQ(rfqId: string, responseId: string) {
    try {
      return mapRfq(
        await this.transport.post(`${PROC_BASE}/rfqs/${rfqId}/award`, {
          body: { responseId },
        }),
      );
    } catch {
      return null;
    }
  }

  async searchSuppliers(filters?: ProcurementFilters) {
    const raw = await this.transport.get(`${INV_BASE}/suppliers`);
    let items = Array.isArray(raw) ? raw.map(mapSupplier) : [];
    if (filters?.q) {
      const q = filters.q.toLowerCase();
      items = items.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.contactEmail.toLowerCase().includes(q),
      );
    }
    return {
      items,
      total: items.length,
      page: filters?.page ?? 1,
      pageSize: filters?.pageSize ?? 25,
    };
  }

  async getSupplier(supplierId: string) {
    const page = await this.searchSuppliers({ pageSize: 100 });
    return page.items.find((s) => s.supplierId === supplierId) ?? null;
  }

  searchContracts(filters?: ProcurementFilters) {
    return emptyPage(filters?.page, filters?.pageSize);
  }

  getBudgets(filters?: ProcurementFilters) {
    return emptyPage(filters?.page, filters?.pageSize);
  }

  searchReceiving(filters?: ProcurementFilters) {
    return this.transport
      .get(`${PROC_BASE}/goods-receipts`, { query: filtersToQuery(filters) })
      .then((raw: unknown) => {
        const row = asRecord(raw);
        return {
          items: Array.isArray(row.items)
            ? row.items.map((r: unknown) => ({
                ...mapReceipt(r),
                inventoryUpdated: true,
              }))
            : [],
          total: asNumber(row.total),
          page: asNumber(row.page, filters?.page ?? 1),
          pageSize: asNumber(row.pageSize, filters?.pageSize ?? 25),
        };
      });
  }

  searchInvoices(filters?: ProcurementFilters) {
    return emptyPage(filters?.page, filters?.pageSize);
  }

  createInvoice(_input: CreateInvoiceInput) {
    throw new Error('Procurement invoices are not available on the live API yet');
  }

  matchInvoice() {
    return null;
  }

  approveInvoice() {
    return null;
  }

  searchDeliveries(filters?: ProcurementFilters) {
    return emptyPage(filters?.page, filters?.pageSize);
  }

  getShipments(filters?: ProcurementFilters) {
    return emptyPage(filters?.page, filters?.pageSize);
  }

  getApprovalQueue() {
    return [];
  }

  async dashboard(department?: string) {
    const [orders, rfqs, suppliers] = await Promise.all([
      this.searchOrders({ department: department as ProcurementDepartment | undefined, pageSize: 5 }),
      this.searchRFQs({ department: department as ProcurementDepartment | undefined, pageSize: 5 }),
      this.searchSuppliers({ pageSize: 50 }),
    ]);
    return {
      totalSpend: orders.items.reduce((s: number, o: PurchaseOrder) => s + o.total, 0),
      pendingApprovals: orders.items.filter((o: PurchaseOrder) => o.status === 'pending_approval').length,
      openPOs: orders.items.filter((o: PurchaseOrder) =>
        ['approved', 'ordered', 'partially_received'].includes(o.status),
      ).length,
      openRFQs: rfqs.items.filter((r: RFQ) => r.status === 'open').length,
      activeContracts: 0,
      overdueDeliveries: 0,
      invoiceMismatches: 0,
      budgetUtilization: 0,
      supplierCount: suppliers.total,
      recentRequests: [],
      recentOrders: orders.items,
      pendingApprovalItems: [],
      expiringContracts: [],
    };
  }

  analytics() {
    return {
      spendTrends: [],
      spendByDepartment: [],
      spendByCategory: [],
      supplierRankings: [],
      procurementCycleTime: [],
      budgetVsActual: [],
      invoiceMatchRate: 0,
      onTimeDeliveryRate: 0,
      savingsAchieved: 0,
    };
  }

  spendAnalysis() {
    return [];
  }

  async supplierPerformance() {
    const suppliers = await this.searchSuppliers({ pageSize: 20 });
    return suppliers.items.map((s, i) => ({
      supplierId: s.supplierId,
      supplierName: s.name,
      overallScore: s.rating * 20,
      quality: s.qualityScore,
      delivery: s.onTimeDeliveryRate,
      price: s.priceScore,
      compliance: s.complianceScore,
      risk: s.riskScore,
      trend: 'stable' as const,
      rank: i + 1,
    }));
  }

  forecast() {
    return [];
  }

  async search(query: string, department?: string) {
    const [orders, rfqs, suppliers] = await Promise.all([
      this.searchOrders({
        q: query,
        department: department as ProcurementDepartment | undefined,
        pageSize: 10,
      }),
      this.searchRFQs({
        q: query,
        department: department as ProcurementDepartment | undefined,
        pageSize: 10,
      }),
      this.searchSuppliers({ q: query, pageSize: 10 }),
    ]);
    return {
      orders: orders.items,
      rfqs: rfqs.items,
      suppliers: suppliers.items,
      requests: [],
    };
  }

  exportData(format: 'csv' | 'pdf' | 'xlsx'): ProcurementExport {
    return {
      format,
      generatedAt: new Date().toISOString(),
      recordCount: 0,
    };
  }

  favorite(
    userId: string,
    entityType: ProcurementFavorite['entityType'],
    entityId: string,
  ) {
    const fav: ProcurementFavorite = {
      favoriteId: `fav-${String(++this.nextId)}`,
      userId,
      entityType,
      entityId,
      createdAt: new Date().toISOString(),
    };
    this.favorites.push(fav);
    return fav;
  }

  getFavorites(userId: string) {
    return this.favorites.filter((f) => f.userId === userId);
  }
}

export const procurementHttpRepository = new ProcurementHttpRepository();
