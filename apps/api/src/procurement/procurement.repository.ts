import { Injectable } from '@nestjs/common';
import type {
  CreateRfqInput,
  GoodsReceipt,
  PaginatedResult,
  ProcurementFilters,
  ProcurementRepositoryContract,
  ReceiveGoodsInput,
  Rfq,
} from '@medease/procurement-contract';
import {
  normalizePagination,
  PrismaService,
  TenantAwareRepository,
  toPaginatedResult,
} from '@medease/prisma';
import { newId } from '@medease/uuid';
import { NotFoundError, ValidationError } from '@workspace/repository-transport/errors';
import { RequestContextService } from '../tenant/request-context.service';

const RFQ_INCLUDE = { lines: true, responses: true } as const;
const RECEIPT_INCLUDE = { lines: true } as const;

function fromCents(c: bigint | number) {
  return Number(c) / 100;
}

@Injectable()
export class ProcurementRepository
  extends TenantAwareRepository
  implements ProcurementRepositoryContract
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {
    super();
  }

  private actorId() {
    return (
      this.requestContext.require().userId ??
      '00000000-0000-0000-0000-000000000000'
    );
  }

  private mapRfq(row: {
    id: string;
    rfqNumber: string;
    title: string;
    department: string;
    status: string;
    requisitionId: string | null;
    invitedSupplierIds: string[];
    deadline: Date;
    awardedSupplierId: string | null;
    createdAt: Date;
    updatedAt: Date;
    lines: Array<{
      id: string;
      description: string;
      quantity: number;
      unit: string;
      specifications: string | null;
      sortOrder: number;
    }>;
    responses: Array<{
      id: string;
      rfqId: string;
      supplierId: string;
      supplierName: string;
      totalQuoteCents: bigint;
      currencyCode: string;
      validUntil: Date;
      rank: number | null;
      status: string;
      lineQuotes: unknown;
      submittedAt: Date;
    }>;
  }): Rfq {
    return {
      rfqId: row.id,
      rfqNumber: row.rfqNumber,
      title: row.title,
      department: row.department,
      status: row.status as Rfq['status'],
      requisitionId: row.requisitionId ?? undefined,
      invitedSuppliers: row.invitedSupplierIds,
      lineItems: row.lines
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((l) => ({
          lineId: l.id,
          description: l.description,
          quantity: l.quantity,
          unit: l.unit,
          specifications: l.specifications ?? undefined,
        })),
      deadline: row.deadline.toISOString(),
      responses: row.responses.map((r) => ({
        responseId: r.id,
        rfqId: r.rfqId,
        supplierId: r.supplierId,
        supplierName: r.supplierName,
        lineQuotes: Array.isArray(r.lineQuotes)
          ? (r.lineQuotes as { lineId: string; unitPrice: number; leadTimeDays: number }[])
          : [],
        totalQuote: fromCents(r.totalQuoteCents),
        currency: (r.currencyCode as Rfq['responses'][0]['currency']) || 'EUR',
        validUntil: r.validUntil.toISOString(),
        rank: r.rank ?? undefined,
        status: r.status as Rfq['responses'][0]['status'],
        submittedAt: r.submittedAt.toISOString(),
      })),
      awardedSupplierId: row.awardedSupplierId ?? undefined,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  private mapReceipt(row: {
    id: string;
    receiptNumber: string;
    purchaseOrderId: string;
    poNumber: string;
    supplierId: string;
    warehouseId: string;
    status: string;
    receivedBy: string;
    receivedAt: Date;
    notes: string | null;
    lines: Array<{
      id: string;
      description: string;
      orderedQty: number;
      receivedQty: number;
    }>;
  }): GoodsReceipt {
    return {
      receiptId: row.id,
      receiptNumber: row.receiptNumber,
      purchaseOrderId: row.purchaseOrderId,
      poNumber: row.poNumber,
      supplierId: row.supplierId,
      warehouseId: row.warehouseId,
      status: row.status as GoodsReceipt['status'],
      lineItems: row.lines.map((l) => ({
        lineId: l.id,
        description: l.description,
        orderedQty: l.orderedQty,
        receivedQty: l.receivedQty,
      })),
      receivedBy: row.receivedBy,
      receivedAt: row.receivedAt.toISOString(),
      notes: row.notes ?? undefined,
    };
  }

  searchRfqs(filters: ProcurementFilters = {}): Promise<PaginatedResult<Rfq>> {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    return this.prisma.runInTransaction(async (tx) => {
      const where = {
        tenantId: this.tenantId,
        ...(filters.department ? { department: filters.department } : {}),
        ...(filters.status ? { status: filters.status as never } : {}),
        ...(filters.q
          ? {
              OR: [
                { rfqNumber: { contains: filters.q, mode: 'insensitive' as const } },
                { title: { contains: filters.q, mode: 'insensitive' as const } },
              ],
            }
          : {}),
      };
      const [items, total] = await Promise.all([
        tx.rfq.findMany({
          where,
          include: RFQ_INCLUDE,
          skip,
          take,
          orderBy: [{ createdAt: 'desc' }],
        }),
        tx.rfq.count({ where }),
      ]);
      return toPaginatedResult(items.map((r) => this.mapRfq(r)), total, page, pageSize);
    });
  }

  async createRfq(input: CreateRfqInput): Promise<Rfq> {
    if (!input.lineItems.length) throw new ValidationError('At least one line is required');
    return this.prisma.runInTransaction(async (tx) => {
      const id = newId();
      const now = new Date();
      const rfqNumber = `RFQ-${now.getUTCFullYear()}-${id.slice(-6).toUpperCase()}`;
      const row = await tx.rfq.create({
        data: {
          id,
          tenantId: this.tenantId,
          rfqNumber,
          title: input.title,
          department: input.department,
          status: 'open',
          requisitionId: input.requisitionId,
          deadline: new Date(input.deadline),
          invitedSupplierIds: input.invitedSuppliers,
          createdBy: this.actorId(),
          lines: {
            create: input.lineItems.map((l, i) => ({
              id: newId(),
              tenantId: this.tenantId,
              description: l.description,
              quantity: l.quantity,
              unit: l.unit,
              specifications: l.specifications,
              sortOrder: i,
            })),
          },
        },
        include: RFQ_INCLUDE,
      });
      return this.mapRfq(row);
    });
  }

  async awardRfq(rfqId: string, responseId: string): Promise<Rfq> {
    return this.prisma.runInTransaction(async (tx) => {
      const rfq = await tx.rfq.findFirst({
        where: { id: rfqId, tenantId: this.tenantId },
        include: RFQ_INCLUDE,
      });
      if (!rfq) throw new NotFoundError('RFQ not found');
      const response = rfq.responses.find((r) => r.id === responseId);
      if (!response) throw new NotFoundError('RFQ response not found');
      await tx.rfqResponse.updateMany({
        where: { rfqId, tenantId: this.tenantId },
        data: { status: 'declined' },
      });
      await tx.rfqResponse.update({
        where: { id: responseId },
        data: { status: 'awarded', rank: 1 },
      });
      const row = await tx.rfq.update({
        where: { id: rfqId },
        data: {
          status: 'awarded',
          awardedSupplierId: response.supplierId,
        },
        include: RFQ_INCLUDE,
      });
      return this.mapRfq(row);
    });
  }

  searchGoodsReceipts(
    filters: ProcurementFilters = {},
  ): Promise<PaginatedResult<GoodsReceipt>> {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    return this.prisma.runInTransaction(async (tx) => {
      const where = {
        tenantId: this.tenantId,
        ...(filters.status ? { status: filters.status as never } : {}),
        ...(filters.q
          ? {
              OR: [
                { receiptNumber: { contains: filters.q, mode: 'insensitive' as const } },
                { poNumber: { contains: filters.q, mode: 'insensitive' as const } },
              ],
            }
          : {}),
      };
      const [items, total] = await Promise.all([
        tx.goodsReceipt.findMany({
          where,
          include: RECEIPT_INCLUDE,
          skip,
          take,
          orderBy: [{ receivedAt: 'desc' }],
        }),
        tx.goodsReceipt.count({ where }),
      ]);
      return toPaginatedResult(
        items.map((r) => this.mapReceipt(r)),
        total,
        page,
        pageSize,
      );
    });
  }

  async createGoodsReceipt(input: ReceiveGoodsInput): Promise<GoodsReceipt> {
    return this.prisma.runInTransaction(async (tx) => {
      const po = await tx.purchaseOrder.findFirst({
        where: { id: input.purchaseOrderId, tenantId: this.tenantId },
        include: { lines: true },
      });
      if (!po) throw new NotFoundError('Purchase order not found');
      if (!['approved', 'ordered', 'partial'].includes(po.status)) {
        throw new ValidationError(`Cannot receive PO in status ${po.status}`);
      }

      for (const recv of input.lineItems) {
        const line = po.lines.find((l) => l.id === recv.lineId);
        if (!line) continue;
        const nextRecv = line.receivedQuantity + recv.receivedQty;
        await tx.purchaseOrderLine.update({
          where: { id: line.id },
          data: { receivedQuantity: Math.min(nextRecv, line.quantity) },
        });

        const bump = Math.min(recv.receivedQty, line.quantity - line.receivedQuantity);
        if (bump <= 0) continue;
        let item = line.inventoryId
          ? await tx.inventoryItem.findFirst({
              where: { id: line.inventoryId, tenantId: this.tenantId },
            })
          : await tx.inventoryItem.findFirst({
              where: { tenantId: this.tenantId, sku: line.sku },
            });
        if (item) {
          const qty = item.quantityOnHand + bump;
          const status =
            qty <= 0
              ? 'out_of_stock'
              : qty <= item.reorderLevel
                ? 'low_stock'
                : 'active';
          item = await tx.inventoryItem.update({
            where: { id: item.id },
            data: { quantityOnHand: qty, status, updatedBy: this.actorId() },
          });
          await tx.stockMovement.create({
            data: {
              id: newId(),
              tenantId: this.tenantId,
              inventoryId: item.id,
              itemName: item.itemName,
              type: 'receive',
              quantity: bump,
              toLocation: input.warehouseId,
              reference: po.poNumber,
              performedBy: input.receivedBy,
              createdBy: this.actorId(),
            },
          });
        }
      }

      const refreshed = await tx.purchaseOrderLine.findMany({
        where: { purchaseOrderId: po.id, tenantId: this.tenantId },
      });
      const allReceived = refreshed.every((l) => l.receivedQuantity >= l.quantity);
      await tx.purchaseOrder.update({
        where: { id: po.id },
        data: {
          status: allReceived ? 'received' : 'partial',
          receivedDate: allReceived ? new Date() : po.receivedDate,
          updatedBy: this.actorId(),
        },
      });

      const receiptId = newId();
      const now = new Date();
      const receiptNumber = `GR-${now.getUTCFullYear()}-${receiptId.slice(-6).toUpperCase()}`;
      const row = await tx.goodsReceipt.create({
        data: {
          id: receiptId,
          tenantId: this.tenantId,
          receiptNumber,
          purchaseOrderId: po.id,
          poNumber: po.poNumber,
          supplierId: po.supplierId,
          warehouseId: input.warehouseId,
          status: allReceived ? 'complete' : 'partial',
          receivedBy: input.receivedBy,
          receivedAt: now,
          notes: input.notes,
          createdBy: this.actorId(),
          lines: {
            create: refreshed.map((l) => ({
              id: newId(),
              tenantId: this.tenantId,
              poLineId: l.id,
              description: l.itemName,
              orderedQty: l.quantity,
              receivedQty: l.receivedQuantity,
            })),
          },
        },
        include: RECEIPT_INCLUDE,
      });
      return this.mapReceipt(row);
    });
  }
}
