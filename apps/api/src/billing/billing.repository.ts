import { Injectable } from '@nestjs/common';

import type {
  BillingDashboard,
  BillingFilters,
  BillingRepositoryContract,
  ClaimListResult,
  CreateInvoiceInput,
  InsuranceClaim,
  InsurancePolicy,
  InvoiceListResult,
  OutstandingBalance,
  PatientInvoice,
  Payment,
  PaymentListResult,
  PaymentTimelineEntry,
  ReceiptListResult,
  RecordPaymentInput,
  Refund,
  RefundListResult,
  RefundPaymentInput,
  SubmitClaimInput,
  UpdateInvoiceInput,
} from '@medease/billing-contract';
import {
  normalizePagination,
  PrismaService,
  TenantAwareRepository,
  toPaginatedResult,
} from '@medease/prisma';
import { newId } from '@medease/uuid';
import { ValidationError } from '@workspace/repository-transport/errors';

import { RequestContextService } from '../tenant/request-context.service';
import {
  assertClaimFound,
  assertInvoiceFound,
  assertPaymentFound,
  mapBillingRepositoryError,
  toContractPaginated,
} from './billing.helpers';
import {
  fromCents,
  mapClaim,
  mapInvoice,
  mapPayment,
  mapPolicy,
  mapReceipt,
  mapRefund,
  toCents,
} from './mappers/billing.mapper';
import {
  buildClaimWhere,
  buildInvoiceWhere,
  buildPaymentWhere,
} from './queries/billing.queries';

@Injectable()
export class BillingRepository
  extends TenantAwareRepository
  implements BillingRepositoryContract
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {
    super();
  }

  searchInvoices(filters: BillingFilters = {}): Promise<InvoiceListResult> {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const where = buildInvoiceWhere(this.tenantId, filters);
    return this.prisma.runInTransaction(async (tx) => {
      const [items, total] = await Promise.all([
        tx.patientInvoice.findMany({
          where,
          include: { lineItems: true },
          skip,
          take,
          orderBy: [{ issuedAt: 'desc' }, { createdAt: 'desc' }],
        }),
        tx.patientInvoice.count({ where }),
      ]);
      return toContractPaginated(
        toPaginatedResult(items.map(mapInvoice), total, page, pageSize),
      );
    });
  }

  async getInvoice(invoiceId: string): Promise<PatientInvoice> {
    return this.prisma.runInTransaction(async (tx) => {
      const row = await tx.patientInvoice.findFirst({
        where: { id: invoiceId, tenantId: this.tenantId },
        include: { lineItems: true },
      });
      assertInvoiceFound(row, invoiceId);
      return mapInvoice(row);
    });
  }

  async createInvoice(input: CreateInvoiceInput): Promise<PatientInvoice> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        if (!input.lineItems.length) {
          throw new ValidationError('At least one line item is required');
        }

        const lineDefs = input.lineItems.map((item, index) => {
          const unitPriceCents = toCents(item.unitPrice);
          const amountCents = toCents(item.quantity * item.unitPrice);
          return {
            id: newId(),
            tenantId: this.tenantId,
            category: item.category,
            description: item.description,
            code: item.code,
            quantity: item.quantity,
            unitPriceCents,
            amountCents,
            sortOrder: index,
          };
        });

        const subtotalCents = lineDefs.reduce(
          (sum, item) => sum + item.amountCents,
          0n,
        );
        const now = new Date();
        const dueAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const invoiceId = newId();
        const invoiceNumber = `INV-${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, '0')}-${invoiceId.slice(-6).toUpperCase()}`;

        const row = await tx.patientInvoice.create({
          data: {
            id: invoiceId,
            tenantId: this.tenantId,
            invoiceNumber,
            patientId: input.patientId,
            patientName: input.patientName,
            facilityId: input.facilityId,
            facilityName: input.facilityName,
            providerId: input.providerId,
            providerName: input.providerName,
            insurancePolicyId: input.insuranceId,
            status: 'issued',
            currencyCode: input.currency ?? 'EUR',
            subtotalCents,
            discountCents: 0n,
            taxCents: 0n,
            totalCents: subtotalCents,
            paidCents: 0n,
            balanceCents: subtotalCents,
            notes: input.notes,
            issuedAt: now,
            dueAt,
            createdBy: this.actorId(),
            lineItems: { create: lineDefs },
          },
          include: { lineItems: true },
        });
        return mapInvoice(row);
      });
    } catch (error) {
      mapBillingRepositoryError(error);
    }
  }

  async updateInvoice(input: UpdateInvoiceInput): Promise<PatientInvoice> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.patientInvoice.findFirst({
          where: { id: input.invoiceId, tenantId: this.tenantId },
          include: { lineItems: true },
        });
        assertInvoiceFound(existing, input.invoiceId);

        let subtotalCents = existing.subtotalCents;
        let totalCents = existing.totalCents;
        let balanceCents = existing.balanceCents;

        if (input.lineItems) {
          await tx.invoiceLineItem.deleteMany({
            where: { invoiceId: input.invoiceId, tenantId: this.tenantId },
          });
          const lineDefs = input.lineItems.map((item, index) => {
            const unitPriceCents = toCents(item.unitPrice);
            const amountCents = toCents(item.quantity * item.unitPrice);
            return {
              id: newId(),
              tenantId: this.tenantId,
              invoiceId: input.invoiceId,
              category: item.category,
              description: item.description,
              code: item.code,
              quantity: item.quantity,
              unitPriceCents,
              amountCents,
              sortOrder: index,
            };
          });
          await tx.invoiceLineItem.createMany({ data: lineDefs });
          subtotalCents = lineDefs.reduce(
            (sum, item) => sum + item.amountCents,
            0n,
          );
          totalCents = subtotalCents - existing.discountCents + existing.taxCents;
          balanceCents = totalCents - existing.paidCents;
          if (balanceCents < 0n) balanceCents = 0n;
        }

        const row = await tx.patientInvoice.update({
          where: { id: input.invoiceId },
          data: {
            notes: input.notes ?? existing.notes,
            status: input.status ?? existing.status,
            subtotalCents,
            totalCents,
            balanceCents,
            updatedBy: this.actorId(),
            version: { increment: 1 },
          },
          include: { lineItems: true },
        });
        return mapInvoice(row);
      });
    } catch (error) {
      mapBillingRepositoryError(error);
    }
  }

  async deleteInvoice(invoiceId: string): Promise<boolean> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.patientInvoice.findFirst({
          where: { id: invoiceId, tenantId: this.tenantId },
        });
        assertInvoiceFound(existing, invoiceId);
        if (existing.paidCents > 0n) {
          throw new ValidationError('Cannot delete an invoice with payments');
        }
        await tx.patientInvoice.delete({ where: { id: invoiceId } });
        return true;
      });
    } catch (error) {
      mapBillingRepositoryError(error);
    }
  }

  searchClaims(filters: BillingFilters = {}): Promise<ClaimListResult> {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const where = buildClaimWhere(this.tenantId, filters);
    return this.prisma.runInTransaction(async (tx) => {
      const [items, total] = await Promise.all([
        tx.insuranceClaim.findMany({
          where,
          skip,
          take,
          orderBy: [{ createdAt: 'desc' }],
        }),
        tx.insuranceClaim.count({ where }),
      ]);
      return toContractPaginated(
        toPaginatedResult(items.map(mapClaim), total, page, pageSize),
      );
    });
  }

  async getClaim(claimId: string): Promise<InsuranceClaim> {
    return this.prisma.runInTransaction(async (tx) => {
      const row = await tx.insuranceClaim.findFirst({
        where: { id: claimId, tenantId: this.tenantId },
      });
      assertClaimFound(row, claimId);
      return mapClaim(row);
    });
  }

  async submitClaim(input: SubmitClaimInput): Promise<InsuranceClaim> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        if (!input.diagnosisCodes.length || !input.procedureCodes.length) {
          throw new ValidationError(
            'Diagnosis and procedure codes are required',
          );
        }
        const now = new Date();
        const row = await tx.insuranceClaim.create({
          data: {
            id: newId(),
            tenantId: this.tenantId,
            patientId: input.patientId,
            patientName: input.patientName,
            invoiceId: input.invoiceId,
            facilityId: input.facilityId,
            providerId: input.providerId,
            payer: input.payer,
            policyNumber: input.policyNumber,
            diagnosisCodes: input.diagnosisCodes,
            procedureCodes: input.procedureCodes,
            medications: input.medications ?? [],
            laboratoryOrders: input.laboratoryOrders ?? [],
            radiologyOrders: input.radiologyOrders ?? [],
            totalClaimCents: toCents(input.totalClaim),
            deductibleCents: toCents(input.deductible ?? 0),
            copayCents: toCents(input.copay ?? 0),
            coinsuranceCents: toCents(input.coinsurance ?? 0),
            currencyCode: input.currency ?? 'EUR',
            status: 'submitted',
            submissionDate: now,
            createdBy: this.actorId(),
          },
        });
        return mapClaim(row);
      });
    } catch (error) {
      mapBillingRepositoryError(error);
    }
  }

  async approveClaim(
    claimId: string,
    approvedAmount?: number,
  ): Promise<InsuranceClaim> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.insuranceClaim.findFirst({
          where: { id: claimId, tenantId: this.tenantId },
        });
        assertClaimFound(existing, claimId);
        const approvedCents =
          approvedAmount != null
            ? toCents(approvedAmount)
            : existing.totalClaimCents;
        const deniedCents = existing.totalClaimCents - approvedCents;
        const row = await tx.insuranceClaim.update({
          where: { id: claimId },
          data: {
            status:
              approvedCents >= existing.totalClaimCents
                ? 'approved'
                : 'partially_approved',
            approvedCents,
            deniedCents: deniedCents > 0n ? deniedCents : 0n,
            adjudicationDate: new Date(),
            updatedBy: this.actorId(),
            version: { increment: 1 },
          },
        });
        return mapClaim(row);
      });
    } catch (error) {
      mapBillingRepositoryError(error);
    }
  }

  async denyClaim(claimId: string, reason: string): Promise<InsuranceClaim> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.insuranceClaim.findFirst({
          where: { id: claimId, tenantId: this.tenantId },
        });
        assertClaimFound(existing, claimId);
        const row = await tx.insuranceClaim.update({
          where: { id: claimId },
          data: {
            status: 'denied',
            deniedCents: existing.totalClaimCents,
            approvedCents: 0n,
            denialReason: reason,
            adjudicationDate: new Date(),
            updatedBy: this.actorId(),
            version: { increment: 1 },
          },
        });
        return mapClaim(row);
      });
    } catch (error) {
      mapBillingRepositoryError(error);
    }
  }

  async resubmitClaim(claimId: string): Promise<InsuranceClaim> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.insuranceClaim.findFirst({
          where: { id: claimId, tenantId: this.tenantId },
        });
        assertClaimFound(existing, claimId);
        const row = await tx.insuranceClaim.update({
          where: { id: claimId },
          data: {
            status: 'resubmitted',
            submissionDate: new Date(),
            denialReason: null,
            adjudicationDate: null,
            updatedBy: this.actorId(),
            version: { increment: 1 },
          },
        });
        return mapClaim(row);
      });
    } catch (error) {
      mapBillingRepositoryError(error);
    }
  }

  async recordPayment(input: RecordPaymentInput): Promise<Payment> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const invoice = await tx.patientInvoice.findFirst({
          where: { id: input.invoiceId, tenantId: this.tenantId },
        });
        assertInvoiceFound(invoice, input.invoiceId);
        if (input.amount <= 0) {
          throw new ValidationError('Payment amount must be positive');
        }

        const amountCents = toCents(input.amount);
        const now = new Date();
        const paymentId = newId();
        const payment = await tx.payment.create({
          data: {
            id: paymentId,
            tenantId: this.tenantId,
            invoiceId: invoice.id,
            patientId: invoice.patientId,
            facilityId: invoice.facilityId,
            providerId: invoice.providerId,
            amountCents,
            currencyCode: input.currency ?? invoice.currencyCode,
            method: input.method,
            status: 'completed',
            reference: `PAY-${paymentId.slice(-8).toUpperCase()}`,
            paidAt: now,
            installmentNumber: input.installmentNumber,
            totalInstallments: input.totalInstallments,
            notes: input.notes,
            createdBy: this.actorId(),
          },
        });

        const paidCents = invoice.paidCents + amountCents;
        let balanceCents = invoice.totalCents - paidCents;
        if (balanceCents < 0n) balanceCents = 0n;
        const status =
          balanceCents === 0n
            ? 'paid'
            : paidCents > 0n
              ? 'partial'
              : invoice.status;

        await tx.patientInvoice.update({
          where: { id: invoice.id },
          data: {
            paidCents,
            balanceCents,
            status,
            paymentMethod: input.method,
            updatedBy: this.actorId(),
            version: { increment: 1 },
          },
        });

        await tx.receipt.create({
          data: {
            id: newId(),
            tenantId: this.tenantId,
            paymentId,
            invoiceId: invoice.id,
            patientId: invoice.patientId,
            receiptNumber: `RCP-${paymentId.slice(-8).toUpperCase()}`,
            amountCents,
            currencyCode: payment.currencyCode,
            paymentMethod: input.method,
            issuedAt: now,
            downloadUrl: `/api/billing/receipts/${paymentId}/download`,
          },
        });

        return mapPayment(payment);
      });
    } catch (error) {
      mapBillingRepositoryError(error);
    }
  }

  async refundPayment(input: RefundPaymentInput): Promise<Refund> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const payment = await tx.payment.findFirst({
          where: { id: input.paymentId, tenantId: this.tenantId },
        });
        assertPaymentFound(payment, input.paymentId);
        if (input.amount <= 0) {
          throw new ValidationError('Refund amount must be positive');
        }

        const amountCents = toCents(input.amount);
        if (amountCents > payment.amountCents) {
          throw new ValidationError('Refund exceeds payment amount');
        }

        const now = new Date();
        const refund = await tx.refund.create({
          data: {
            id: newId(),
            tenantId: this.tenantId,
            paymentId: payment.id,
            invoiceId: payment.invoiceId,
            patientId: payment.patientId,
            amountCents,
            currencyCode: payment.currencyCode,
            reason: input.reason,
            status: 'completed',
            processedAt: now,
            createdBy: this.actorId(),
          },
        });

        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status:
              amountCents >= payment.amountCents
                ? 'refunded'
                : 'partially_refunded',
          },
        });

        const invoice = await tx.patientInvoice.findFirst({
          where: { id: payment.invoiceId, tenantId: this.tenantId },
        });
        if (invoice) {
          const paidCents =
            invoice.paidCents > amountCents
              ? invoice.paidCents - amountCents
              : 0n;
          const balanceCents = invoice.totalCents - paidCents;
          await tx.patientInvoice.update({
            where: { id: invoice.id },
            data: {
              paidCents,
              balanceCents,
              status: paidCents === 0n ? 'issued' : 'partial',
              updatedBy: this.actorId(),
              version: { increment: 1 },
            },
          });
        }

        return mapRefund(refund);
      });
    } catch (error) {
      mapBillingRepositoryError(error);
    }
  }

  getPayments(filters: BillingFilters = {}): Promise<PaymentListResult> {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const where = buildPaymentWhere(this.tenantId, filters);
    return this.prisma.runInTransaction(async (tx) => {
      const [items, total] = await Promise.all([
        tx.payment.findMany({
          where,
          skip,
          take,
          orderBy: [{ paidAt: 'desc' }],
        }),
        tx.payment.count({ where }),
      ]);
      return toContractPaginated(
        toPaginatedResult(items.map(mapPayment), total, page, pageSize),
      );
    });
  }

  getReceipts(filters: BillingFilters = {}): Promise<ReceiptListResult> {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const where: {
      tenantId: string;
      patientId?: string;
    } = { tenantId: this.tenantId };
    if (filters.patientId) where.patientId = filters.patientId;
    return this.prisma.runInTransaction(async (tx) => {
      const [items, total] = await Promise.all([
        tx.receipt.findMany({
          where,
          skip,
          take,
          orderBy: [{ issuedAt: 'desc' }],
        }),
        tx.receipt.count({ where }),
      ]);
      return toContractPaginated(
        toPaginatedResult(items.map(mapReceipt), total, page, pageSize),
      );
    });
  }

  getRefunds(filters: BillingFilters = {}): Promise<RefundListResult> {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const where: {
      tenantId: string;
      patientId?: string;
    } = { tenantId: this.tenantId };
    if (filters.patientId) where.patientId = filters.patientId;
    return this.prisma.runInTransaction(async (tx) => {
      const [items, total] = await Promise.all([
        tx.refund.findMany({
          where,
          skip,
          take,
          orderBy: [{ createdAt: 'desc' }],
        }),
        tx.refund.count({ where }),
      ]);
      return toContractPaginated(
        toPaginatedResult(items.map(mapRefund), total, page, pageSize),
      );
    });
  }

  getInsurance(patientId?: string): Promise<InsurancePolicy[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const rows = await tx.insurancePolicy.findMany({
        where: {
          tenantId: this.tenantId,
          ...(patientId ? { patientId } : {}),
        },
        orderBy: [{ coverageStart: 'desc' }],
      });
      return rows.map(mapPolicy);
    });
  }

  getDashboard(
    patientId?: string,
    providerId?: string,
    facilityId?: string,
  ): Promise<BillingDashboard> {
    return this.prisma.runInTransaction(async (tx) => {
      const scope: {
        tenantId: string;
        patientId?: string;
        providerId?: string;
        facilityId?: string;
      } = { tenantId: this.tenantId };
      if (patientId) scope.patientId = patientId;
      if (providerId) scope.providerId = providerId;
      if (facilityId) scope.facilityId = facilityId;

      const now = new Date();
      const startOfDay = new Date(now);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const startOfMonth = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
      );

      const [
        dailyPayments,
        monthlyPayments,
        outstanding,
        paidInvoices,
        pendingClaims,
        deniedClaims,
        refunds,
        recentInvoices,
        recentClaims,
        recentPayments,
      ] = await Promise.all([
        tx.payment.findMany({
          where: {
            ...scope,
            status: 'completed',
            paidAt: { gte: startOfDay },
          },
        }),
        tx.payment.findMany({
          where: {
            ...scope,
            status: 'completed',
            paidAt: { gte: startOfMonth },
          },
        }),
        tx.patientInvoice.aggregate({
          where: {
            ...scope,
            status: { in: ['issued', 'partial', 'overdue'] },
          },
          _sum: { balanceCents: true },
        }),
        tx.patientInvoice.count({
          where: { ...scope, status: 'paid' },
        }),
        tx.insuranceClaim.count({
          where: {
            ...scope,
            status: { in: ['submitted', 'pending', 'resubmitted'] },
          },
        }),
        tx.insuranceClaim.count({
          where: {
            ...scope,
            status: { in: ['denied', 'rejected'] },
          },
        }),
        tx.refund.aggregate({
          where: {
            tenantId: this.tenantId,
            ...(patientId ? { patientId } : {}),
            status: 'completed',
          },
          _sum: { amountCents: true },
        }),
        tx.patientInvoice.findMany({
          where: scope,
          include: { lineItems: true },
          orderBy: [{ createdAt: 'desc' }],
          take: 5,
        }),
        tx.insuranceClaim.findMany({
          where: scope,
          orderBy: [{ createdAt: 'desc' }],
          take: 5,
        }),
        tx.payment.findMany({
          where: scope,
          orderBy: [{ paidAt: 'desc' }],
          take: 5,
        }),
      ]);

      const dailyRevenue = dailyPayments.reduce(
        (sum, p) => sum + fromCents(p.amountCents),
        0,
      );
      const monthlyRevenue = monthlyPayments.reduce(
        (sum, p) => sum + fromCents(p.amountCents),
        0,
      );
      const outstandingBalances = fromCents(
        outstanding._sum.balanceCents ?? 0n,
      );
      const refundTotal = fromCents(refunds._sum.amountCents ?? 0n);
      const grossRevenue = monthlyRevenue;
      const netRevenue = Math.max(0, grossRevenue - refundTotal);
      const collectionRate =
        grossRevenue + outstandingBalances > 0
          ? Math.round(
              (grossRevenue / (grossRevenue + outstandingBalances)) * 100,
            )
          : 100;

      return {
        dailyRevenue,
        monthlyRevenue,
        outstandingBalances,
        paidInvoices,
        pendingClaims,
        deniedClaims,
        refunds: refundTotal,
        collectionRate,
        netRevenue,
        grossRevenue,
        recentInvoices: recentInvoices.map(mapInvoice),
        recentClaims: recentClaims.map(mapClaim),
        recentPayments: recentPayments.map(mapPayment),
      };
    });
  }

  getOutstandingBalances(patientId?: string): Promise<OutstandingBalance[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const invoices = await tx.patientInvoice.findMany({
        where: {
          tenantId: this.tenantId,
          ...(patientId ? { patientId } : {}),
          status: { in: ['issued', 'partial', 'overdue'] },
          balanceCents: { gt: 0n },
        },
        orderBy: [{ dueAt: 'asc' }],
      });

      const byPatient = new Map<
        string,
        {
          patientId: string;
          patientName: string;
          totalOutstanding: number;
          oldestDueDate: string;
          invoiceCount: number;
          currency: OutstandingBalance['currency'];
        }
      >();

      for (const invoice of invoices) {
        const existing = byPatient.get(invoice.patientId);
        const due = (invoice.dueAt ?? invoice.createdAt).toISOString();
        if (!existing) {
          byPatient.set(invoice.patientId, {
            patientId: invoice.patientId,
            patientName: invoice.patientName,
            totalOutstanding: fromCents(invoice.balanceCents),
            oldestDueDate: due,
            invoiceCount: 1,
            currency: (invoice.currencyCode as OutstandingBalance['currency']) || 'EUR',
          });
        } else {
          existing.totalOutstanding += fromCents(invoice.balanceCents);
          existing.invoiceCount += 1;
          if (due < existing.oldestDueDate) existing.oldestDueDate = due;
        }
      }

      return [...byPatient.values()];
    });
  }

  getPaymentTimeline(invoiceId: string): Promise<PaymentTimelineEntry[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const invoice = await tx.patientInvoice.findFirst({
        where: { id: invoiceId, tenantId: this.tenantId },
      });
      assertInvoiceFound(invoice, invoiceId);

      const [payments, claims, refunds] = await Promise.all([
        tx.payment.findMany({
          where: { tenantId: this.tenantId, invoiceId },
          orderBy: [{ paidAt: 'asc' }],
        }),
        tx.insuranceClaim.findMany({
          where: { tenantId: this.tenantId, invoiceId },
          orderBy: [{ createdAt: 'asc' }],
        }),
        tx.refund.findMany({
          where: { tenantId: this.tenantId, invoiceId },
          orderBy: [{ createdAt: 'asc' }],
        }),
      ]);

      const entries: PaymentTimelineEntry[] = [
        {
          id: invoice.id,
          invoiceId,
          type: 'invoice',
          date: (invoice.issuedAt ?? invoice.createdAt).toISOString(),
          title: `Invoice ${invoice.invoiceNumber}`,
          description: `Issued — ${invoice.status}`,
          amount: fromCents(invoice.totalCents),
          status: invoice.status,
        },
        ...payments.map((payment) => ({
          id: payment.id,
          invoiceId,
          type: 'payment' as const,
          date: payment.paidAt.toISOString(),
          title: `Payment ${payment.reference}`,
          description: `${payment.method} — ${payment.status}`,
          amount: fromCents(payment.amountCents),
          status: payment.status,
        })),
        ...claims.map((claim) => ({
          id: claim.id,
          invoiceId,
          type: 'claim' as const,
          date: (claim.submissionDate ?? claim.createdAt).toISOString(),
          title: `Claim ${claim.payer}`,
          description: claim.status,
          amount: fromCents(claim.totalClaimCents),
          status: claim.status,
        })),
        ...refunds.map((refund) => ({
          id: refund.id,
          invoiceId,
          type: 'refund' as const,
          date: (refund.processedAt ?? refund.createdAt).toISOString(),
          title: 'Refund',
          description: refund.reason,
          amount: fromCents(refund.amountCents),
          status: refund.status,
        })),
      ];

      return entries.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
    });
  }

  private actorId(): string {
    return (
      this.requestContext.require().userId ??
      '00000000-0000-0000-0000-000000000000'
    );
  }
}
