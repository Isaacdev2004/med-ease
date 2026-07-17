export type Currency = 'EUR' | 'USD' | 'GBP' | 'NGN' | 'XOF';
export type ProcurementDepartment =
  | 'pharmacy'
  | 'laboratory'
  | 'radiology'
  | 'facility'
  | 'biomedical'
  | 'general'
  | 'admin';
export type VendorCategory =
  | 'medical'
  | 'laboratory'
  | 'radiology'
  | 'equipment'
  | 'pharmaceutical'
  | 'international'
  | 'local'
  | 'consumables';
export type RequisitionStatus =
  | 'draft'
  | 'submitted'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'converted';
export type RFQStatus = 'draft' | 'open' | 'closed' | 'awarded' | 'cancelled';
export type POStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'ordered'
  | 'partially_received'
  | 'received'
  | 'closed'
  | 'cancelled';
export type InvoiceStatus =
  | 'draft'
  | 'pending_match'
  | 'matched'
  | 'approved'
  | 'paid'
  | 'disputed'
  | 'cancelled';
export type ContractStatus =
  'draft' | 'active' | 'expiring' | 'expired' | 'terminated' | 'renewed';
export type DeliveryStatus =
  'scheduled' | 'in_transit' | 'delivered' | 'delayed' | 'cancelled';
export type ReceiptStatus = 'pending' | 'partial' | 'complete' | 'rejected';
export type ApprovalStatus =
  'pending' | 'approved' | 'rejected' | 'delegated' | 'escalated';
export type Incoterm =
  | 'EXW'
  | 'FCA'
  | 'CPT'
  | 'CIP'
  | 'DAP'
  | 'DPU'
  | 'DDP'
  | 'FAS'
  | 'FOB'
  | 'CFR'
  | 'CIF';
export type PaymentTerms =
  | 'net_15'
  | 'net_30'
  | 'net_45'
  | 'net_60'
  | 'net_90'
  | 'due_on_receipt'
  | 'prepaid';

export interface ProcurementFilters {
  q?: string;
  department?: ProcurementDepartment;
  status?: string;
  supplierId?: string;
  costCenterId?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Supplier {
  supplierId: string;
  name: string;
  code: string;
  category: VendorCategory;
  contactEmail: string;
  contactPhone: string;
  address: string;
  country: string;
  isInternational: boolean;
  isPreferred: boolean;
  rating: number;
  onTimeDeliveryRate: number;
  qualityScore: number;
  priceScore: number;
  riskScore: number;
  complianceScore: number;
  totalOrders: number;
  totalSpend: number;
  currency: Currency;
  paymentTerms: PaymentTerms;
  status: 'active' | 'inactive' | 'blocked';
  certifications: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Vendor extends Supplier {
  vendorId: string;
  taxId?: string;
  incoterms?: Incoterm;
}

export interface SpendCategory {
  categoryId: string;
  name: string;
  code: string;
  department: ProcurementDepartment;
  budgetAllocated: number;
  budgetSpent: number;
}

export interface CostCenter {
  costCenterId: string;
  code: string;
  name: string;
  department: ProcurementDepartment;
  facilityId: string;
  managerId: string;
  budgetId?: string;
}

export interface Budget {
  budgetId: string;
  name: string;
  fiscalYear: number;
  department: ProcurementDepartment;
  costCenterId: string;
  allocated: number;
  committed: number;
  spent: number;
  remaining: number;
  currency: Currency;
  status: 'active' | 'frozen' | 'closed';
}

export interface PurchaseRequest {
  requestId: string;
  requisitionNumber: string;
  title: string;
  department: ProcurementDepartment;
  requesterId: string;
  requesterName: string;
  costCenterId: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: RequisitionStatus;
  lineItems: PurchaseRequestLine[];
  totalEstimate: number;
  currency: Currency;
  justification?: string;
  neededBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseRequestLine {
  lineId: string;
  description: string;
  sku?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  spendCategoryId: string;
}

export interface PurchaseRequisition extends PurchaseRequest {
  requisitionId: string;
  approvalWorkflowId?: string;
}

export interface ApprovalStep {
  stepId: string;
  role: string;
  approverId?: string;
  approverName?: string;
  status: ApprovalStatus;
  threshold?: number;
  signedAt?: string;
  comments?: string;
}

export interface ApprovalWorkflow {
  workflowId: string;
  entityType: 'requisition' | 'purchase_order' | 'invoice' | 'contract';
  entityId: string;
  steps: ApprovalStep[];
  currentStep: number;
  status: ApprovalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RFQ {
  rfqId: string;
  rfqNumber: string;
  title: string;
  department: ProcurementDepartment;
  status: RFQStatus;
  requisitionId?: string;
  invitedSuppliers: string[];
  lineItems: RFQLine[];
  deadline: string;
  responses: RFQResponse[];
  awardedSupplierId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RFQLine {
  lineId: string;
  description: string;
  quantity: number;
  unit: string;
  specifications?: string;
}

export interface RFQResponse {
  responseId: string;
  rfqId: string;
  supplierId: string;
  supplierName: string;
  lineQuotes: { lineId: string; unitPrice: number; leadTimeDays: number }[];
  totalQuote: number;
  currency: Currency;
  validUntil: string;
  rank?: number;
  status: 'submitted' | 'shortlisted' | 'awarded' | 'declined';
  submittedAt: string;
}

export interface PurchaseOrderItem {
  lineId: string;
  sku?: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  receivedQuantity: number;
  spendCategoryId?: string;
}

export interface PurchaseOrder {
  purchaseOrderId: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  department: ProcurementDepartment;
  requisitionId?: string;
  rfqId?: string;
  contractId?: string;
  costCenterId: string;
  status: POStatus;
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: Currency;
  paymentTerms: PaymentTerms;
  incoterms?: Incoterm;
  expectedDelivery?: string;
  warehouseId?: string;
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

export interface WarehouseReceiving extends GoodsReceipt {
  inventoryUpdated: boolean;
}

export interface Shipment {
  shipmentId: string;
  purchaseOrderId: string;
  carrier: string;
  trackingNumber: string;
  status: DeliveryStatus;
  origin: string;
  destination: string;
  estimatedArrival: string;
  actualArrival?: string;
}

export interface Delivery {
  deliveryId: string;
  shipmentId?: string;
  purchaseOrderId: string;
  supplierId: string;
  warehouseId: string;
  status: DeliveryStatus;
  scheduledDate: string;
  deliveredDate?: string;
  items: number;
}

export interface ProcurementInvoice {
  invoiceId: string;
  invoiceNumber: string;
  purchaseOrderId: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  status: InvoiceStatus;
  subtotal: number;
  tax: number;
  total: number;
  currency: Currency;
  invoiceDate: string;
  dueDate: string;
  matchedAmount: number;
  variance: number;
  paymentTerms: PaymentTerms;
}

export interface Contract {
  contractId: string;
  contractNumber: string;
  title: string;
  supplierId: string;
  supplierName: string;
  department: ProcurementDepartment;
  status: ContractStatus;
  type: 'framework' | 'fixed' | 'call_off' | 'service';
  value: number;
  currency: Currency;
  startDate: string;
  endDate: string;
  renewalDate?: string;
  autoRenew: boolean;
  obligations: string[];
  spendToDate: number;
}

export interface FrameworkAgreement extends Contract {
  agreementId: string;
  maxValue: number;
  utilizedValue: number;
}

export interface Tender {
  tenderId: string;
  title: string;
  department: ProcurementDepartment;
  status: 'open' | 'evaluating' | 'awarded' | 'closed';
  value: number;
  deadline: string;
  suppliers: string[];
}

export interface ProcurementPolicy {
  policyId: string;
  name: string;
  department?: ProcurementDepartment;
  approvalThreshold: number;
  requiresRfqAbove: number;
  requiresCeoAbove: number;
  currency: Currency;
}

export interface SupplierScorecard {
  supplierId: string;
  supplierName: string;
  overallScore: number;
  quality: number;
  delivery: number;
  price: number;
  compliance: number;
  risk: number;
  trend: 'up' | 'down' | 'stable';
  rank: number;
}

export interface ProcurementDashboard {
  totalSpend: number;
  pendingApprovals: number;
  openPOs: number;
  openRFQs: number;
  activeContracts: number;
  overdueDeliveries: number;
  invoiceMismatches: number;
  budgetUtilization: number;
  supplierCount: number;
  recentRequests: PurchaseRequest[];
  recentOrders: PurchaseOrder[];
  pendingApprovalItems: ApprovalWorkflow[];
  expiringContracts: Contract[];
}

export interface ProcurementAnalytics {
  spendTrends: { label: string; value: number }[];
  spendByDepartment: { label: string; value: number }[];
  spendByCategory: { label: string; value: number }[];
  supplierRankings: { label: string; value: number }[];
  procurementCycleTime: { label: string; value: number }[];
  budgetVsActual: { label: string; value: number }[];
  invoiceMatchRate: number;
  onTimeDeliveryRate: number;
  savingsAchieved: number;
}

export interface SpendAnalysis {
  totalSpend: number;
  committedSpend: number;
  savings: number;
  byDepartment: { department: ProcurementDepartment; amount: number }[];
  bySupplier: { supplierId: string; name: string; amount: number }[];
}

export interface DemandForecast {
  itemId: string;
  itemName: string;
  department: ProcurementDepartment;
  currentDemand: number;
  projectedDemand: number;
  leadTimeDays: number;
  recommendedOrderDate: string;
  confidence: number;
}

export interface ProcurementPermissions {
  canView: boolean;
  canWrite: boolean;
  canApprove: boolean;
  canManagePOs: boolean;
  canManageRFQ: boolean;
  canManageContracts: boolean;
  canManageSuppliers: boolean;
  canViewAnalytics: boolean;
  canExport: boolean;
  canAdmin: boolean;
}

export interface ProcurementFavorite {
  favoriteId: string;
  userId: string;
  entityType: 'supplier' | 'request' | 'order' | 'contract';
  entityId: string;
  createdAt: string;
}

export interface ProcurementExport {
  format: 'csv' | 'pdf' | 'xlsx';
  generatedAt: string;
  recordCount: number;
}

export interface CreateRequisitionInput {
  title: string;
  department: ProcurementDepartment;
  requesterId: string;
  requesterName: string;
  costCenterId: string;
  priority?: PurchaseRequest['priority'];
  lineItems: Omit<PurchaseRequestLine, 'lineId' | 'total'>[];
  justification?: string;
  neededBy?: string;
}

export interface CreateRFQInput {
  title: string;
  department: ProcurementDepartment;
  requisitionId?: string;
  invitedSuppliers: string[];
  lineItems: Omit<RFQLine, 'lineId'>[];
  deadline: string;
}

export interface CreatePOInput {
  supplierId: string;
  department: ProcurementDepartment;
  requisitionId?: string;
  rfqId?: string;
  costCenterId: string;
  items: Omit<PurchaseOrderItem, 'lineId' | 'total' | 'receivedQuantity'>[];
  paymentTerms?: PaymentTerms;
  expectedDelivery?: string;
  warehouseId?: string;
}

export interface ReceiveGoodsInput {
  purchaseOrderId: string;
  warehouseId: string;
  receivedBy: string;
  lineItems: { lineId: string; receivedQty: number }[];
  notes?: string;
}

export interface CreateInvoiceInput {
  purchaseOrderId: string;
  invoiceNumber: string;
  subtotal: number;
  tax: number;
  invoiceDate: string;
  dueDate: string;
}
