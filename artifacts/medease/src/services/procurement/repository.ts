import {
  approveStep,
  buildApprovalWorkflow,
  buildRequisitionFromInput,
  rejectStep,
} from '@/services/procurement/approval-engine';
import { awardRFQ, buildRFQ } from '@/services/procurement/rfq-engine';
import { rankSuppliers } from '@/services/procurement/supplier-engine';
import {
  computeProcurementAnalytics,
  computeSpendAnalysis,
} from '@/services/procurement/analytics';
import { forecastProcurementDemand } from '@/services/procurement/forecasting';
import {
  buildProcurementDashboard,
  MOCK_APPROVALS,
  MOCK_BUDGETS,
  MOCK_CONTRACTS,
  MOCK_DELIVERIES,
  MOCK_GOODS_RECEIPTS,
  MOCK_INVOICES,
  MOCK_PURCHASE_ORDERS,
  MOCK_PURCHASE_REQUESTS,
  MOCK_RFQS,
  MOCK_SHIPMENTS,
  MOCK_SUPPLIERS,
} from '@/services/procurement/mock-data';
import type {
  CreateInvoiceInput,
  CreatePOInput,
  CreateRequisitionInput,
  CreateRFQInput,
  ProcurementExport,
  ProcurementFavorite,
  ProcurementFilters,
  ReceiveGoodsInput,
} from '@/services/procurement/types';

function paginate<T>(items: T[], page = 1, pageSize = 25) {
  const start = ((page ?? 1) - 1) * (pageSize ?? 25);
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    page: page ?? 1,
    pageSize: pageSize ?? 25,
  };
}

function matchQ(q: string | undefined, ...fields: (string | undefined)[]) {
  if (!q) return true;
  const lower = q.toLowerCase();
  return fields.some((f) => f?.toLowerCase().includes(lower));
}

class ProcurementRepository {
  private requests = [...MOCK_PURCHASE_REQUESTS];
  private orders = [...MOCK_PURCHASE_ORDERS];
  private rfqs = [...MOCK_RFQS];
  private suppliers = [...MOCK_SUPPLIERS];
  private contracts = [...MOCK_CONTRACTS];
  private budgets = [...MOCK_BUDGETS];
  private invoices = [...MOCK_INVOICES];
  private receipts = [...MOCK_GOODS_RECEIPTS];
  private deliveries = [...MOCK_DELIVERIES];
  private shipments = [...MOCK_SHIPMENTS];
  private approvals = [...MOCK_APPROVALS];
  private favorites: ProcurementFavorite[] = [];
  private nextId = 90000;

  searchRequests(filters?: ProcurementFilters) {
    let items = this.requests;
    if (filters?.department)
      items = items.filter((r) => r.department === filters.department);
    if (filters?.status)
      items = items.filter((r) => r.status === filters.status);
    if (filters?.q)
      items = items.filter((r) =>
        matchQ(filters.q, r.requisitionNumber, r.title, r.requesterName),
      );
    items = [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getRequest(requestId: string) {
    return this.requests.find((r) => r.requestId === requestId) ?? null;
  }

  createRequisition(input: CreateRequisitionInput) {
    const id = `req-${String(++this.nextId)}`;
    const req = buildRequisitionFromInput(
      input,
      id,
      `PR-${20250000 + this.nextId}`,
    );
    this.requests.unshift(req);
    const wf = buildApprovalWorkflow('requisition', id, req.totalEstimate);
    this.approvals.unshift(wf);
    return req;
  }

  approveRequest(requestId: string, approverId: string, approverName: string) {
    const idx = this.requests.findIndex((r) => r.requestId === requestId);
    if (idx < 0) return null;
    this.requests[idx]!.status = 'approved';
    this.requests[idx]!.updatedAt = new Date().toISOString();
    const wfIdx = this.approvals.findIndex((a) => a.entityId === requestId);
    if (wfIdx >= 0)
      this.approvals[wfIdx] = approveStep(
        this.approvals[wfIdx]!,
        approverId,
        approverName,
      );
    return this.requests[idx]!;
  }

  rejectRequest(
    requestId: string,
    approverId: string,
    approverName: string,
    reason?: string,
  ) {
    const idx = this.requests.findIndex((r) => r.requestId === requestId);
    if (idx < 0) return null;
    this.requests[idx]!.status = 'rejected';
    this.requests[idx]!.updatedAt = new Date().toISOString();
    const wfIdx = this.approvals.findIndex((a) => a.entityId === requestId);
    if (wfIdx >= 0)
      this.approvals[wfIdx] = rejectStep(
        this.approvals[wfIdx]!,
        approverId,
        approverName,
        reason,
      );
    return this.requests[idx]!;
  }

  searchOrders(filters?: ProcurementFilters) {
    let items = this.orders;
    if (filters?.department)
      items = items.filter((o) => o.department === filters.department);
    if (filters?.status)
      items = items.filter((o) => o.status === filters.status);
    if (filters?.supplierId)
      items = items.filter((o) => o.supplierId === filters.supplierId);
    if (filters?.q)
      items = items.filter((o) =>
        matchQ(filters.q, o.poNumber, o.supplierName),
      );
    return paginate(
      [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      filters?.page,
      filters?.pageSize,
    );
  }

  getOrder(purchaseOrderId: string) {
    return (
      this.orders.find((o) => o.purchaseOrderId === purchaseOrderId) ?? null
    );
  }

  createPO(input: CreatePOInput) {
    const sup = this.suppliers.find((s) => s.supplierId === input.supplierId);
    const id = `po-${String(++this.nextId)}`;
    const items = input.items.map((l, i) => ({
      ...l,
      lineId: `${id}-line-${i}`,
      total: l.quantity * l.unitPrice,
      receivedQuantity: 0,
    }));
    const subtotal = items.reduce((s, l) => s + l.total, 0);
    const tax = Math.round(subtotal * 0.2);
    const order = {
      purchaseOrderId: id,
      poNumber: `PO-${20250000 + this.nextId}`,
      supplierId: input.supplierId,
      supplierName: sup?.name ?? 'Unknown',
      department: input.department,
      requisitionId: input.requisitionId,
      rfqId: input.rfqId,
      costCenterId: input.costCenterId,
      status: 'pending_approval' as const,
      items,
      subtotal,
      tax,
      shipping: 75,
      total: subtotal + tax + 75,
      currency: 'EUR' as const,
      paymentTerms: input.paymentTerms ?? sup?.paymentTerms ?? 'net_30',
      expectedDelivery: input.expectedDelivery,
      warehouseId: input.warehouseId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.orders.unshift(order);
    this.approvals.unshift(
      buildApprovalWorkflow('purchase_order', id, order.total),
    );
    return order;
  }

  approvePO(purchaseOrderId: string, approverId: string, approverName: string) {
    const idx = this.orders.findIndex(
      (o) => o.purchaseOrderId === purchaseOrderId,
    );
    if (idx < 0) return null;
    this.orders[idx]!.status = 'approved';
    this.orders[idx]!.updatedAt = new Date().toISOString();
    const wfIdx = this.approvals.findIndex(
      (a) => a.entityId === purchaseOrderId,
    );
    if (wfIdx >= 0)
      this.approvals[wfIdx] = approveStep(
        this.approvals[wfIdx]!,
        approverId,
        approverName,
      );
    return this.orders[idx]!;
  }

  receiveGoods(input: ReceiveGoodsInput) {
    const idx = this.orders.findIndex(
      (o) => o.purchaseOrderId === input.purchaseOrderId,
    );
    if (idx < 0) return null;
    const po = this.orders[idx]!;
    for (const rl of input.lineItems) {
      const line = po.items.find((l) => l.lineId === rl.lineId);
      if (line) line.receivedQuantity += rl.receivedQty;
    }
    const allReceived = po.items.every((l) => l.receivedQuantity >= l.quantity);
    po.status = allReceived ? 'received' : 'partially_received';
    po.updatedAt = new Date().toISOString();
    this.orders[idx] = po;
    const receipt = {
      receiptId: `gr-${String(++this.nextId)}`,
      receiptNumber: `GR-${20250000 + this.nextId}`,
      purchaseOrderId: po.purchaseOrderId,
      poNumber: po.poNumber,
      supplierId: po.supplierId,
      warehouseId: input.warehouseId,
      status: allReceived ? ('complete' as const) : ('partial' as const),
      lineItems: po.items.map((l) => ({
        lineId: l.lineId,
        description: l.description,
        orderedQty: l.quantity,
        receivedQty: l.receivedQuantity,
      })),
      receivedBy: input.receivedBy,
      receivedAt: new Date().toISOString(),
      notes: input.notes,
    };
    this.receipts.unshift(receipt);
    return receipt;
  }

  cancelOrder(purchaseOrderId: string) {
    const idx = this.orders.findIndex(
      (o) => o.purchaseOrderId === purchaseOrderId,
    );
    if (idx < 0) return null;
    this.orders[idx]!.status = 'cancelled';
    return this.orders[idx]!;
  }

  closeOrder(purchaseOrderId: string) {
    const idx = this.orders.findIndex(
      (o) => o.purchaseOrderId === purchaseOrderId,
    );
    if (idx < 0) return null;
    this.orders[idx]!.status = 'closed';
    return this.orders[idx]!;
  }

  searchRFQs(filters?: ProcurementFilters) {
    let items = this.rfqs;
    if (filters?.department)
      items = items.filter((r) => r.department === filters.department);
    if (filters?.status)
      items = items.filter((r) => r.status === filters.status);
    if (filters?.q)
      items = items.filter((r) => matchQ(filters.q, r.rfqNumber, r.title));
    return paginate(
      [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      filters?.page,
      filters?.pageSize,
    );
  }

  createRFQ(input: CreateRFQInput) {
    const id = `rfq-${String(++this.nextId)}`;
    const rfq = buildRFQ(input, id, `RFQ-${20250000 + this.nextId}`);
    this.rfqs.unshift(rfq);
    return rfq;
  }

  awardRFQ(rfqId: string, responseId: string) {
    const idx = this.rfqs.findIndex((r) => r.rfqId === rfqId);
    if (idx < 0) return null;
    this.rfqs[idx] = awardRFQ(this.rfqs[idx]!, responseId);
    return this.rfqs[idx]!;
  }

  searchSuppliers(filters?: ProcurementFilters) {
    let items = this.suppliers.filter((s) => s.status === 'active');
    if (filters?.q)
      items = items.filter((s) =>
        matchQ(filters.q, s.name, s.code, s.contactEmail),
      );
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getSupplier(supplierId: string) {
    return this.suppliers.find((s) => s.supplierId === supplierId) ?? null;
  }

  searchContracts(filters?: ProcurementFilters) {
    let items = this.contracts;
    if (filters?.department)
      items = items.filter((c) => c.department === filters.department);
    if (filters?.status)
      items = items.filter((c) => c.status === filters.status);
    if (filters?.supplierId)
      items = items.filter((c) => c.supplierId === filters.supplierId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getBudgets(filters?: ProcurementFilters) {
    let items = this.budgets;
    if (filters?.department)
      items = items.filter((b) => b.department === filters.department);
    if (filters?.costCenterId)
      items = items.filter((b) => b.costCenterId === filters.costCenterId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  searchReceiving(filters?: ProcurementFilters) {
    return paginate(this.receipts, filters?.page, filters?.pageSize);
  }

  searchInvoices(filters?: ProcurementFilters) {
    let items = this.invoices;
    if (filters?.supplierId)
      items = items.filter((i) => i.supplierId === filters.supplierId);
    if (filters?.status)
      items = items.filter((i) => i.status === filters.status);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  createInvoice(input: CreateInvoiceInput) {
    const po = this.orders.find(
      (o) => o.purchaseOrderId === input.purchaseOrderId,
    );
    if (!po) return null;
    const inv = {
      invoiceId: `pinv-${String(++this.nextId)}`,
      invoiceNumber: input.invoiceNumber,
      purchaseOrderId: po.purchaseOrderId,
      poNumber: po.poNumber,
      supplierId: po.supplierId,
      supplierName: po.supplierName,
      status: 'pending_match' as const,
      subtotal: input.subtotal,
      tax: input.tax,
      total: input.subtotal + input.tax,
      currency: 'EUR' as const,
      invoiceDate: input.invoiceDate,
      dueDate: input.dueDate,
      matchedAmount: po.total,
      variance: Math.abs(po.total - (input.subtotal + input.tax)),
      paymentTerms: po.paymentTerms,
    };
    this.invoices.unshift(inv);
    return inv;
  }

  matchInvoice(invoiceId: string) {
    const idx = this.invoices.findIndex((i) => i.invoiceId === invoiceId);
    if (idx < 0) return null;
    this.invoices[idx]!.status = 'matched';
    return this.invoices[idx]!;
  }

  approveInvoice(invoiceId: string) {
    const idx = this.invoices.findIndex((i) => i.invoiceId === invoiceId);
    if (idx < 0) return null;
    this.invoices[idx]!.status = 'approved';
    return this.invoices[idx]!;
  }

  searchDeliveries(filters?: ProcurementFilters) {
    let items = this.deliveries;
    if (filters?.status)
      items = items.filter((d) => d.status === filters.status);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getShipments(filters?: ProcurementFilters) {
    return paginate(this.shipments, filters?.page, filters?.pageSize);
  }

  getApprovalQueue() {
    return this.approvals.filter((a) => a.status === 'pending');
  }

  dashboard(department?: string) {
    return buildProcurementDashboard(department);
  }

  analytics() {
    return computeProcurementAnalytics();
  }

  spendAnalysis(department?: string) {
    return computeSpendAnalysis(department);
  }

  supplierPerformance() {
    return rankSuppliers();
  }

  forecast(department?: string) {
    return forecastProcurementDemand(
      department as Parameters<typeof forecastProcurementDemand>[0],
    );
  }

  search(query: string, department?: string) {
    const filters: ProcurementFilters = {
      q: query,
      department: department as ProcurementFilters['department'],
    };
    return {
      requests: this.searchRequests({ ...filters, pageSize: 5 }).items,
      orders: this.searchOrders({ ...filters, pageSize: 5 }).items,
      suppliers: this.searchSuppliers({ ...filters, pageSize: 5 }).items,
      contracts: this.searchContracts({ ...filters, pageSize: 5 }).items,
    };
  }

  exportData(format: 'csv' | 'pdf' | 'xlsx'): ProcurementExport {
    return {
      format,
      generatedAt: new Date().toISOString(),
      recordCount: this.orders.length,
    };
  }

  favorite(
    userId: string,
    entityType: ProcurementFavorite['entityType'],
    entityId: string,
  ) {
    const fav: ProcurementFavorite = {
      favoriteId: `fav-${Date.now()}`,
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

  archiveRequest(requestId: string) {
    const idx = this.requests.findIndex((r) => r.requestId === requestId);
    if (idx < 0) return null;
    this.requests[idx]!.status = 'cancelled';
    return this.requests[idx]!;
  }
}

export const procurementRepository = new ProcurementRepository();
