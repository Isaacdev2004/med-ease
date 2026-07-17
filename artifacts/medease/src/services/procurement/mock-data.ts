import type {
  ApprovalWorkflow,
  Budget,
  Contract,
  CostCenter,
  Delivery,
  GoodsReceipt,
  ProcurementDashboard,
  ProcurementInvoice,
  PurchaseOrder,
  PurchaseOrderItem,
  PurchaseRequest,
  RFQ,
  RFQResponse,
  Shipment,
  Supplier,
  SpendCategory,
} from '@/services/procurement/types';

const DEPARTMENTS = [
  'pharmacy',
  'laboratory',
  'radiology',
  'facility',
  'biomedical',
  'general',
] as const;
const VENDOR_CATS = [
  'medical',
  'laboratory',
  'radiology',
  'equipment',
  'pharmaceutical',
  'international',
  'local',
  'consumables',
] as const;
const REQ_STATUSES = [
  'draft',
  'submitted',
  'pending_approval',
  'approved',
  'rejected',
  'cancelled',
  'converted',
] as const;
const PO_STATUSES = [
  'draft',
  'pending_approval',
  'approved',
  'ordered',
  'partially_received',
  'received',
  'closed',
  'cancelled',
] as const;
const RFQ_STATUSES = [
  'draft',
  'open',
  'closed',
  'awarded',
  'cancelled',
] as const;
const INV_STATUSES = [
  'draft',
  'pending_match',
  'matched',
  'approved',
  'paid',
  'disputed',
  'cancelled',
] as const;
const CONTRACT_STATUSES = [
  'draft',
  'active',
  'expiring',
  'expired',
  'terminated',
  'renewed',
] as const;
const DELIVERY_STATUSES = [
  'scheduled',
  'in_transit',
  'delivered',
  'delayed',
  'cancelled',
] as const;
const COUNTRIES = [
  'France',
  'Germany',
  'USA',
  'UK',
  'Nigeria',
  'India',
  'China',
  'Netherlands',
];
const UNITS = ['each', 'box', 'vial', 'pack', 'kit', 'bottle'];

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function daysFromNow(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

export const MOCK_SPEND_CATEGORIES: SpendCategory[] = Array.from(
  { length: 50 },
  (_, i) => ({
    categoryId: `spc-${String(i + 1).padStart(3, '0')}`,
    name: [
      'Medications',
      'Reagents',
      'Imaging Supplies',
      'Equipment',
      'Consumables',
      'Maintenance',
    ][i % 6]!,
    code: `SC-${String(i + 1).padStart(3, '0')}`,
    department: DEPARTMENTS[i % DEPARTMENTS.length]!,
    budgetAllocated: 50000 + (i % 20) * 10000,
    budgetSpent: 10000 + (i % 15) * 5000,
  }),
);

export const MOCK_COST_CENTERS: CostCenter[] = Array.from(
  { length: 500 },
  (_, i) => ({
    costCenterId: `cc-${String(i + 1).padStart(4, '0')}`,
    code: `CC-${String(i + 1).padStart(4, '0')}`,
    name: `Cost Center ${i + 1}`,
    department: DEPARTMENTS[i % DEPARTMENTS.length]!,
    facilityId: `fac-${String((i % 25) + 1).padStart(3, '0')}`,
    managerId: `mgr-${String((i % 50) + 1).padStart(3, '0')}`,
    budgetId: `bud-${String((i % 300) + 1).padStart(4, '0')}`,
  }),
);

export const MOCK_BUDGETS: Budget[] = Array.from({ length: 300 }, (_, i) => {
  const allocated = 100000 + (i % 50) * 25000;
  const spent = Math.round(allocated * (0.2 + (i % 60) / 100));
  const committed = Math.round(allocated * 0.15);
  return {
    budgetId: `bud-${String(i + 1).padStart(4, '0')}`,
    name: `FY2025 ${DEPARTMENTS[i % DEPARTMENTS.length]} Budget ${(i % 10) + 1}`,
    fiscalYear: 2025,
    department: DEPARTMENTS[i % DEPARTMENTS.length]!,
    costCenterId: MOCK_COST_CENTERS[i % MOCK_COST_CENTERS.length]!.costCenterId,
    allocated,
    committed,
    spent,
    remaining: allocated - spent - committed,
    currency: 'EUR',
    status: i % 40 === 0 ? 'frozen' : 'active',
  };
});

export const MOCK_SUPPLIERS: Supplier[] = Array.from(
  { length: 3000 },
  (_, i) => {
    const isIntl = i % 5 === 0;
    const cat = VENDOR_CATS[i % VENDOR_CATS.length]!;
    return {
      supplierId: `sup-${String(i + 1).padStart(5, '0')}`,
      name: `${isIntl ? 'Global' : 'Local'} ${['MedSupply', 'PharmaCore', 'LabTech', 'BioEquip', 'HealthParts'][i % 5]} ${i + 1}`,
      code: `SUP-${String(i + 1).padStart(5, '0')}`,
      category: cat,
      contactEmail: `procurement${i + 1}@supplier.example.com`,
      contactPhone: `+33 1 ${String(10000000 + i).slice(0, 8)}`,
      address: `${100 + (i % 200)} Rue Commerce`,
      country: COUNTRIES[i % COUNTRIES.length]!,
      isInternational: isIntl,
      isPreferred: i % 12 === 0,
      rating: 3 + (i % 20) / 10,
      onTimeDeliveryRate: 70 + (i % 30),
      qualityScore: 65 + (i % 35),
      priceScore: 60 + (i % 40),
      riskScore: 10 + (i % 40),
      complianceScore: 70 + (i % 30),
      totalOrders: 5 + (i % 500),
      totalSpend: 10000 + (i % 1000) * 500,
      currency: 'EUR',
      paymentTerms: (['net_30', 'net_45', 'net_60', 'net_15'] as const)[i % 4]!,
      status: i % 100 === 0 ? 'inactive' : 'active',
      certifications:
        i % 3 === 0 ? ['ISO 13485', 'GDP'] : i % 5 === 0 ? ['ISO 9001'] : [],
      createdAt: daysAgo(365 - (i % 365)),
      updatedAt: daysAgo(i % 30),
    };
  },
);

function buildRequestLine(reqIdx: number, lineIdx: number) {
  const qty = 10 + ((reqIdx + lineIdx) % 50);
  const unitPrice = 5 + ((reqIdx * lineIdx) % 200);
  return {
    lineId: `req-${reqIdx}-line-${lineIdx}`,
    description: `Item ${lineIdx + 1} for requisition ${reqIdx}`,
    sku: `SKU-${reqIdx}-${lineIdx}`,
    quantity: qty,
    unit: UNITS[(reqIdx + lineIdx) % UNITS.length]!,
    unitPrice,
    total: qty * unitPrice,
    spendCategoryId:
      MOCK_SPEND_CATEGORIES[(reqIdx + lineIdx) % MOCK_SPEND_CATEGORIES.length]!
        .categoryId,
  };
}

export const MOCK_PURCHASE_REQUESTS: PurchaseRequest[] = Array.from(
  { length: 15000 },
  (_, i) => {
    const lines = Array.from({ length: 1 + (i % 4) }, (_, j) =>
      buildRequestLine(i, j),
    );
    const total = lines.reduce((s, l) => s + l.total, 0);
    const dept = DEPARTMENTS[i % DEPARTMENTS.length]!;
    return {
      requestId: `req-${String(i + 1).padStart(5, '0')}`,
      requisitionNumber: `PR-${20250000 + i}`,
      title: `${dept} requisition ${i + 1}`,
      department: dept,
      requesterId: `usr-${String((i % 100) + 1).padStart(3, '0')}`,
      requesterName: `Requester ${(i % 100) + 1}`,
      costCenterId:
        MOCK_COST_CENTERS[i % MOCK_COST_CENTERS.length]!.costCenterId,
      priority: (['low', 'normal', 'high', 'urgent'] as const)[i % 4]!,
      status: REQ_STATUSES[i % REQ_STATUSES.length]!,
      lineItems: lines,
      totalEstimate: total,
      currency: 'EUR',
      justification: i % 3 === 0 ? 'Restock critical supplies' : undefined,
      neededBy: daysFromNow(7 + (i % 30)),
      createdAt: daysAgo(i % 180),
      updatedAt: daysAgo(i % 14),
    };
  },
);

export const MOCK_RFQS: RFQ[] = Array.from({ length: 8000 }, (_, i) => {
  const dept = DEPARTMENTS[i % DEPARTMENTS.length]!;
  const lines = Array.from({ length: 1 + (i % 3) }, (_, j) => ({
    lineId: `rfq-${i}-line-${j}`,
    description: `RFQ item ${j + 1}`,
    quantity: 20 + ((i + j) % 80),
    unit: UNITS[(i + j) % UNITS.length]!,
    specifications: j === 0 ? 'Hospital grade' : undefined,
  }));
  const supplierCount = 2 + (i % 4);
  const responses: RFQResponse[] = Array.from(
    { length: supplierCount },
    (_, r) => {
      const sup = MOCK_SUPPLIERS[(i + r) % MOCK_SUPPLIERS.length]!;
      const quotes = lines.map((l) => ({
        lineId: l.lineId,
        unitPrice: 10 + ((i + r) % 50),
        leadTimeDays: 3 + ((i + r) % 14),
      }));
      const total = quotes.reduce(
        (s, q, idx) => s + q.unitPrice * lines[idx]!.quantity,
        0,
      );
      return {
        responseId: `rfqr-${i}-${r}`,
        rfqId: `rfq-${String(i + 1).padStart(5, '0')}`,
        supplierId: sup.supplierId,
        supplierName: sup.name,
        lineQuotes: quotes,
        totalQuote: total,
        currency: 'EUR',
        validUntil: daysFromNow(14),
        rank: r + 1,
        status: (['submitted', 'shortlisted', 'awarded', 'declined'] as const)[
          r % 4
        ]!,
        submittedAt: daysAgo(5 + (r % 10)),
      };
    },
  );
  return {
    rfqId: `rfq-${String(i + 1).padStart(5, '0')}`,
    rfqNumber: `RFQ-${20250000 + i}`,
    title: `${dept} RFQ ${i + 1}`,
    department: dept,
    status: RFQ_STATUSES[i % RFQ_STATUSES.length]!,
    requisitionId:
      i % 3 === 0
        ? MOCK_PURCHASE_REQUESTS[i % MOCK_PURCHASE_REQUESTS.length]!.requestId
        : undefined,
    invitedSuppliers: responses.map((r) => r.supplierId),
    lineItems: lines,
    deadline: daysFromNow(7 + (i % 21)),
    responses,
    awardedSupplierId: i % 5 === 0 ? responses[0]?.supplierId : undefined,
    createdAt: daysAgo(30 + (i % 60)),
    updatedAt: daysAgo(i % 10),
  };
});

function buildPOItems(poIdx: number): PurchaseOrderItem[] {
  const count = 1 + (poIdx % 5);
  return Array.from({ length: count }, (_, j) => {
    const qty = 10 + ((poIdx + j) % 100);
    const unitPrice = 15 + ((poIdx * j) % 150);
    return {
      lineId: `po-${poIdx}-line-${j}`,
      sku: `SKU-PO-${poIdx}-${j}`,
      description: `PO line ${j + 1}`,
      quantity: qty,
      unit: UNITS[(poIdx + j) % UNITS.length]!,
      unitPrice,
      total: qty * unitPrice,
      receivedQuantity: Math.floor(qty * ((poIdx % 10) / 10)),
      spendCategoryId:
        MOCK_SPEND_CATEGORIES[(poIdx + j) % MOCK_SPEND_CATEGORIES.length]!
          .categoryId,
    };
  });
}

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = Array.from(
  { length: 10000 },
  (_, i) => {
    const sup = MOCK_SUPPLIERS[i % MOCK_SUPPLIERS.length]!;
    const items = buildPOItems(i);
    const subtotal = items.reduce((s, l) => s + l.total, 0);
    const tax = Math.round(subtotal * 0.2);
    const shipping = 50 + (i % 200);
    const dept = DEPARTMENTS[i % DEPARTMENTS.length]!;
    return {
      purchaseOrderId: `po-${String(i + 1).padStart(5, '0')}`,
      poNumber: `PO-${20250000 + i}`,
      supplierId: sup.supplierId,
      supplierName: sup.name,
      department: dept,
      requisitionId:
        i % 4 === 0
          ? MOCK_PURCHASE_REQUESTS[i % MOCK_PURCHASE_REQUESTS.length]!.requestId
          : undefined,
      rfqId: i % 6 === 0 ? MOCK_RFQS[i % MOCK_RFQS.length]!.rfqId : undefined,
      contractId:
        i % 8 === 0
          ? `con-${String((i % 5000) + 1).padStart(5, '0')}`
          : undefined,
      costCenterId:
        MOCK_COST_CENTERS[i % MOCK_COST_CENTERS.length]!.costCenterId,
      status: PO_STATUSES[i % PO_STATUSES.length]!,
      items,
      subtotal,
      tax,
      shipping,
      total: subtotal + tax + shipping,
      currency: 'EUR',
      paymentTerms: sup.paymentTerms,
      incoterms: i % 5 === 0 ? 'DDP' : 'EXW',
      expectedDelivery: daysFromNow(5 + (i % 30)),
      warehouseId: `wh-${String((i % 250) + 1).padStart(3, '0')}`,
      createdAt: daysAgo(60 + (i % 120)),
      updatedAt: daysAgo(i % 7),
    };
  },
);

export const MOCK_INVOICES: ProcurementInvoice[] = Array.from(
  { length: 12000 },
  (_, i) => {
    const po = MOCK_PURCHASE_ORDERS[i % MOCK_PURCHASE_ORDERS.length]!;
    const variance = i % 10 === 0 ? po.total * 0.05 : 0;
    return {
      invoiceId: `pinv-${String(i + 1).padStart(5, '0')}`,
      invoiceNumber: `PINV-${20250000 + i}`,
      purchaseOrderId: po.purchaseOrderId,
      poNumber: po.poNumber,
      supplierId: po.supplierId,
      supplierName: po.supplierName,
      status: INV_STATUSES[i % INV_STATUSES.length]!,
      subtotal: po.subtotal,
      tax: po.tax,
      total: po.total + variance,
      currency: 'EUR',
      invoiceDate: daysAgo(30 + (i % 60)),
      dueDate: daysFromNow(15 + (i % 45)),
      matchedAmount: po.total,
      variance,
      paymentTerms: po.paymentTerms,
    };
  },
);

export const MOCK_CONTRACTS: Contract[] = Array.from(
  { length: 5000 },
  (_, i) => {
    const sup = MOCK_SUPPLIERS[i % MOCK_SUPPLIERS.length]!;
    const value = 50000 + (i % 500) * 10000;
    const dept = DEPARTMENTS[i % DEPARTMENTS.length]!;
    const endDays = i % 20 === 0 ? 15 : 90 + (i % 365);
    return {
      contractId: `con-${String(i + 1).padStart(5, '0')}`,
      contractNumber: `CON-${20250000 + i}`,
      title: `${dept} framework agreement ${i + 1}`,
      supplierId: sup.supplierId,
      supplierName: sup.name,
      department: dept,
      status:
        endDays <= 30
          ? 'expiring'
          : CONTRACT_STATUSES[i % CONTRACT_STATUSES.length]!,
      type: (['framework', 'fixed', 'call_off', 'service'] as const)[i % 4]!,
      value,
      currency: 'EUR',
      startDate: daysAgo(365),
      endDate: daysFromNow(endDays),
      renewalDate: daysFromNow(endDays - 30),
      autoRenew: i % 3 === 0,
      obligations: ['Delivery SLA 98%', 'Quality audit annually'],
      spendToDate: Math.round(value * (0.3 + (i % 50) / 100)),
    };
  },
);

export const MOCK_GOODS_RECEIPTS: GoodsReceipt[] = Array.from(
  { length: 3000 },
  (_, i) => {
    const po = MOCK_PURCHASE_ORDERS[i % MOCK_PURCHASE_ORDERS.length]!;
    return {
      receiptId: `gr-${String(i + 1).padStart(5, '0')}`,
      receiptNumber: `GR-${20250000 + i}`,
      purchaseOrderId: po.purchaseOrderId,
      poNumber: po.poNumber,
      supplierId: po.supplierId,
      warehouseId: po.warehouseId ?? `wh-001`,
      status: (['pending', 'partial', 'complete', 'rejected'] as const)[i % 4]!,
      lineItems: po.items.map((l) => ({
        lineId: l.lineId,
        description: l.description,
        orderedQty: l.quantity,
        receivedQty: l.receivedQuantity,
      })),
      receivedBy: `receiver-${(i % 20) + 1}`,
      receivedAt: daysAgo(i % 30),
      notes: i % 5 === 0 ? 'Partial delivery — backorder expected' : undefined,
    };
  },
);

export const MOCK_SHIPMENTS: Shipment[] = Array.from(
  { length: 2500 },
  (_, i) => {
    const po = MOCK_PURCHASE_ORDERS[i % MOCK_PURCHASE_ORDERS.length]!;
    const status = DELIVERY_STATUSES[i % DELIVERY_STATUSES.length]!;
    return {
      shipmentId: `shp-${String(i + 1).padStart(5, '0')}`,
      purchaseOrderId: po.purchaseOrderId,
      carrier: ['DHL', 'FedEx', 'UPS', 'Local Courier'][i % 4]!,
      trackingNumber: `TRK${202500000 + i}`,
      status,
      origin: MOCK_SUPPLIERS[i % MOCK_SUPPLIERS.length]!.country,
      destination: 'Paris, France',
      estimatedArrival: daysFromNow(2 + (i % 14)),
      actualArrival: status === 'delivered' ? daysAgo(i % 5) : undefined,
    };
  },
);

export const MOCK_DELIVERIES: Delivery[] = Array.from(
  { length: 2500 },
  (_, i) => {
    const po = MOCK_PURCHASE_ORDERS[i % MOCK_PURCHASE_ORDERS.length]!;
    const status = DELIVERY_STATUSES[i % DELIVERY_STATUSES.length]!;
    return {
      deliveryId: `del-${String(i + 1).padStart(5, '0')}`,
      shipmentId: MOCK_SHIPMENTS[i % MOCK_SHIPMENTS.length]!.shipmentId,
      purchaseOrderId: po.purchaseOrderId,
      supplierId: po.supplierId,
      warehouseId: po.warehouseId ?? 'wh-001',
      status,
      scheduledDate: daysFromNow(1 + (i % 10)),
      deliveredDate: status === 'delivered' ? daysAgo(i % 7) : undefined,
      items: po.items.length,
    };
  },
);

export const MOCK_APPROVALS: ApprovalWorkflow[] = Array.from(
  { length: 2000 },
  (_, i) => {
    const entityType = (
      ['requisition', 'purchase_order', 'invoice', 'contract'] as const
    )[i % 4]!;
    const steps = [
      {
        stepId: 's1',
        role: 'Department Head',
        approverName: 'Dept Head',
        status: 'approved' as ApprovalWorkflow['steps'][0]['status'],
        signedAt: daysAgo(3),
      },
      {
        stepId: 's2',
        role: 'Finance',
        approverName: i % 3 === 0 ? undefined : 'Finance Officer',
        status: (i % 3 === 0
          ? 'pending'
          : 'approved') as ApprovalWorkflow['steps'][0]['status'],
        threshold: 5000,
      },
      {
        stepId: 's3',
        role: 'CEO',
        status: (i % 7 === 0
          ? 'pending'
          : 'approved') as ApprovalWorkflow['steps'][0]['status'],
        threshold: 50000,
      },
    ];
    return {
      workflowId: `wf-${String(i + 1).padStart(5, '0')}`,
      entityType,
      entityId:
        entityType === 'requisition'
          ? MOCK_PURCHASE_REQUESTS[i % 500]!.requestId
          : MOCK_PURCHASE_ORDERS[i % 500]!.purchaseOrderId,
      steps,
      currentStep: i % 3,
      status: i % 5 === 0 ? 'pending' : 'approved',
      createdAt: daysAgo(10 + (i % 20)),
      updatedAt: daysAgo(i % 5),
    };
  },
);

export function buildProcurementDashboard(
  department?: string,
): ProcurementDashboard {
  let requests = MOCK_PURCHASE_REQUESTS;
  let orders = MOCK_PURCHASE_ORDERS;
  if (department) {
    requests = requests.filter((r) => r.department === department);
    orders = orders.filter((o) => o.department === department);
  }
  const totalSpend = orders.reduce((s, o) => s + o.total, 0);
  const pendingApprovals = MOCK_APPROVALS.filter(
    (a) => a.status === 'pending',
  ).length;
  const openPOs = orders.filter((o) =>
    ['approved', 'ordered', 'partially_received'].includes(o.status),
  ).length;
  const openRFQs = MOCK_RFQS.filter((r) => r.status === 'open').length;
  const activeContracts = MOCK_CONTRACTS.filter(
    (c) => c.status === 'active' || c.status === 'expiring',
  ).length;
  const overdueDeliveries = MOCK_DELIVERIES.filter(
    (d) => d.status === 'delayed',
  ).length;
  const invoiceMismatches = MOCK_INVOICES.filter(
    (i) => i.variance > 0 || i.status === 'disputed',
  ).length;
  const budgetUtil = Math.round(
    MOCK_BUDGETS.reduce((s, b) => s + (b.spent / b.allocated) * 100, 0) /
      MOCK_BUDGETS.length,
  );

  return {
    totalSpend: Math.round(totalSpend),
    pendingApprovals,
    openPOs,
    openRFQs,
    activeContracts,
    overdueDeliveries,
    invoiceMismatches,
    budgetUtilization: budgetUtil,
    supplierCount: MOCK_SUPPLIERS.filter((s) => s.status === 'active').length,
    recentRequests: requests.slice(0, 8),
    recentOrders: orders.slice(0, 8),
    pendingApprovalItems: MOCK_APPROVALS.filter(
      (a) => a.status === 'pending',
    ).slice(0, 6),
    expiringContracts: MOCK_CONTRACTS.filter(
      (c) => c.status === 'expiring',
    ).slice(0, 6),
  };
}
