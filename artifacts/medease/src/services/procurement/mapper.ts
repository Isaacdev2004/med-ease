import type { Contract, PurchaseOrder, PurchaseRequest, Supplier } from '@/services/procurement/types';

/** FHIR R5 SupplyRequest stub */
export function toFhirSupplyRequest(request: PurchaseRequest) {
  return {
    resourceType: 'SupplyRequest',
    id: request.requestId,
    status: request.status === 'approved' ? 'active' : 'draft',
    category: { coding: [{ code: request.department }] },
    priority: request.priority,
    itemCodeableConcept: { text: request.title },
    quantity: { value: request.lineItems.reduce((s, l) => s + l.quantity, 0) },
    occurrenceDateTime: request.neededBy,
    authoredOn: request.createdAt,
  };
}

/** FHIR R5 SupplyDelivery stub */
export function toFhirSupplyDelivery(po: PurchaseOrder) {
  return {
    resourceType: 'SupplyDelivery',
    id: po.purchaseOrderId,
    status: po.status === 'received' ? 'completed' : 'in-progress',
    supplier: { display: po.supplierName },
    type: { text: po.department },
    suppliedItem: po.items.map((i) => ({ itemCodeableConcept: { text: i.description }, quantity: { value: i.quantity } })),
  };
}

/** FHIR Invoice stub */
export function toFhirInvoice(invoice: { invoiceId: string; invoiceNumber: string; total: number; status: string }) {
  return {
    resourceType: 'Invoice',
    id: invoice.invoiceId,
    identifier: [{ value: invoice.invoiceNumber }],
    status: invoice.status,
    totalNet: { value: invoice.total, currency: 'EUR' },
  };
}

/** FHIR Organization stub for supplier */
export function toFhirOrganization(supplier: Supplier) {
  return {
    resourceType: 'Organization',
    id: supplier.supplierId,
    name: supplier.name,
    type: [{ coding: [{ code: supplier.category }] }],
    telecom: [{ system: 'email', value: supplier.contactEmail }, { system: 'phone', value: supplier.contactPhone }],
    address: [{ text: supplier.address, country: supplier.country }],
  };
}

/** FHIR Contract stub */
export function toFhirContract(contract: Contract) {
  return {
    resourceType: 'Contract',
    id: contract.contractId,
    identifier: [{ value: contract.contractNumber }],
    status: contract.status,
    subject: [{ display: contract.title }],
    applies: { start: contract.startDate, end: contract.endDate },
  };
}
