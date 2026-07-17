import { procurementRepository } from '@/services/procurement/repository';
import type {
  CreateInvoiceInput,
  CreatePOInput,
  CreateRequisitionInput,
  CreateRFQInput,
  ProcurementFilters,
  ReceiveGoodsInput,
} from '@/services/procurement/types';

const DELAY = 250;
async function delay(ms = DELAY) {
  await new Promise((r) => setTimeout(r, ms));
}

export const procurementService = {
  async searchRequests(filters?: ProcurementFilters) {
    await delay();
    return procurementRepository.searchRequests(filters);
  },
  async getRequest(requestId: string) {
    await delay();
    return procurementRepository.getRequest(requestId);
  },
  async createRequisition(input: CreateRequisitionInput) {
    await delay();
    return procurementRepository.createRequisition(input);
  },
  async approveRequest(
    requestId: string,
    approverId: string,
    approverName: string,
  ) {
    await delay();
    return procurementRepository.approveRequest(
      requestId,
      approverId,
      approverName,
    );
  },
  async rejectRequest(
    requestId: string,
    approverId: string,
    approverName: string,
    reason?: string,
  ) {
    await delay();
    return procurementRepository.rejectRequest(
      requestId,
      approverId,
      approverName,
      reason,
    );
  },
  async archiveRequest(requestId: string) {
    await delay();
    return procurementRepository.archiveRequest(requestId);
  },

  async searchOrders(filters?: ProcurementFilters) {
    await delay();
    return procurementRepository.searchOrders(filters);
  },
  async getOrder(purchaseOrderId: string) {
    await delay();
    return procurementRepository.getOrder(purchaseOrderId);
  },
  async createPO(input: CreatePOInput) {
    await delay();
    return procurementRepository.createPO(input);
  },
  async approvePO(
    purchaseOrderId: string,
    approverId: string,
    approverName: string,
  ) {
    await delay();
    return procurementRepository.approvePO(
      purchaseOrderId,
      approverId,
      approverName,
    );
  },
  async receiveGoods(input: ReceiveGoodsInput) {
    await delay();
    return procurementRepository.receiveGoods(input);
  },
  async cancelOrder(purchaseOrderId: string) {
    await delay();
    return procurementRepository.cancelOrder(purchaseOrderId);
  },
  async closeOrder(purchaseOrderId: string) {
    await delay();
    return procurementRepository.closeOrder(purchaseOrderId);
  },

  async searchRFQs(filters?: ProcurementFilters) {
    await delay();
    return procurementRepository.searchRFQs(filters);
  },
  async createRFQ(input: CreateRFQInput) {
    await delay();
    return procurementRepository.createRFQ(input);
  },
  async awardRFQ(rfqId: string, responseId: string) {
    await delay();
    return procurementRepository.awardRFQ(rfqId, responseId);
  },

  async searchSuppliers(filters?: ProcurementFilters) {
    await delay();
    return procurementRepository.searchSuppliers(filters);
  },
  async getSupplier(supplierId: string) {
    await delay();
    return procurementRepository.getSupplier(supplierId);
  },

  async searchContracts(filters?: ProcurementFilters) {
    await delay();
    return procurementRepository.searchContracts(filters);
  },
  async getBudgets(filters?: ProcurementFilters) {
    await delay();
    return procurementRepository.getBudgets(filters);
  },

  async searchReceiving(filters?: ProcurementFilters) {
    await delay();
    return procurementRepository.searchReceiving(filters);
  },
  async searchInvoices(filters?: ProcurementFilters) {
    await delay();
    return procurementRepository.searchInvoices(filters);
  },
  async createInvoice(input: CreateInvoiceInput) {
    await delay();
    return procurementRepository.createInvoice(input);
  },
  async matchInvoice(invoiceId: string) {
    await delay();
    return procurementRepository.matchInvoice(invoiceId);
  },
  async approveInvoice(invoiceId: string) {
    await delay();
    return procurementRepository.approveInvoice(invoiceId);
  },

  async searchDeliveries(filters?: ProcurementFilters) {
    await delay();
    return procurementRepository.searchDeliveries(filters);
  },
  async getShipments(filters?: ProcurementFilters) {
    await delay();
    return procurementRepository.getShipments(filters);
  },

  async getApprovalQueue() {
    await delay();
    return procurementRepository.getApprovalQueue();
  },
  async dashboard(department?: string) {
    await delay();
    return procurementRepository.dashboard(department);
  },
  async analytics() {
    await delay();
    return procurementRepository.analytics();
  },
  async spendAnalysis(department?: string) {
    await delay();
    return procurementRepository.spendAnalysis(department);
  },
  async supplierPerformance() {
    await delay();
    return procurementRepository.supplierPerformance();
  },
  async forecast(department?: string) {
    await delay();
    return procurementRepository.forecast(department);
  },
  async search(query: string, department?: string) {
    await delay();
    return procurementRepository.search(query, department);
  },
  async exportData(format: 'csv' | 'pdf' | 'xlsx') {
    await delay();
    return procurementRepository.exportData(format);
  },
  async favorite(
    userId: string,
    entityType: 'supplier' | 'request' | 'order' | 'contract',
    entityId: string,
  ) {
    await delay();
    return procurementRepository.favorite(userId, entityType, entityId);
  },
  async getFavorites(userId: string) {
    await delay();
    return procurementRepository.getFavorites(userId);
  },
};
