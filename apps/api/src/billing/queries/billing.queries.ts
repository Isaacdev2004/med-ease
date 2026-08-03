import type { BillingFilters } from '@medease/billing-contract';
import type { Prisma } from '@medease/prisma';

export function buildInvoiceWhere(
  tenantId: string,
  filters: BillingFilters = {},
): Prisma.PatientInvoiceWhereInput {
  const where: Prisma.PatientInvoiceWhereInput = { tenantId };
  if (filters.patientId) where.patientId = filters.patientId;
  if (filters.providerId) where.providerId = filters.providerId;
  if (filters.facilityId) where.facilityId = filters.facilityId;
  if (filters.status) {
    where.status = filters.status as Prisma.EnumInvoiceStatusFilter['equals'];
  }
  if (filters.from || filters.to) {
    where.issuedAt = {};
    if (filters.from) where.issuedAt.gte = new Date(filters.from);
    if (filters.to) where.issuedAt.lte = new Date(filters.to);
  }
  if (filters.q) {
    where.OR = [
      { invoiceNumber: { contains: filters.q, mode: 'insensitive' } },
      { patientName: { contains: filters.q, mode: 'insensitive' } },
    ];
  }
  return where;
}

export function buildClaimWhere(
  tenantId: string,
  filters: BillingFilters = {},
): Prisma.InsuranceClaimWhereInput {
  const where: Prisma.InsuranceClaimWhereInput = { tenantId };
  if (filters.patientId) where.patientId = filters.patientId;
  if (filters.providerId) where.providerId = filters.providerId;
  if (filters.facilityId) where.facilityId = filters.facilityId;
  if (filters.status) {
    where.status = filters.status as Prisma.EnumClaimStatusFilter['equals'];
  }
  if (filters.q) {
    where.OR = [
      { payer: { contains: filters.q, mode: 'insensitive' } },
      { policyNumber: { contains: filters.q, mode: 'insensitive' } },
      { patientName: { contains: filters.q, mode: 'insensitive' } },
    ];
  }
  return where;
}

export function buildPaymentWhere(
  tenantId: string,
  filters: BillingFilters = {},
): Prisma.PaymentWhereInput {
  const where: Prisma.PaymentWhereInput = { tenantId };
  if (filters.patientId) where.patientId = filters.patientId;
  if (filters.providerId) where.providerId = filters.providerId;
  if (filters.facilityId) where.facilityId = filters.facilityId;
  if (filters.status) {
    where.status =
      filters.status as Prisma.EnumBillingPaymentStatusFilter['equals'];
  }
  if (filters.q) {
    where.OR = [
      { reference: { contains: filters.q, mode: 'insensitive' } },
      { notes: { contains: filters.q, mode: 'insensitive' } },
    ];
  }
  return where;
}
