import { Injectable } from '@nestjs/common';

import type {
  AdjustStockInput,
  CreateInventoryInput,
  CreatePurchaseOrderInput,
  InventoryDashboard,
  InventoryDepartment,
  InventoryFilters,
  InventoryItem,
  InventoryListResult,
  InventoryRepositoryContract,
  InventoryStatus,
  IssueStockInput,
  MovementListResult,
  PurchaseOrder,
  PurchaseOrderListResult,
  ReceiveStockInput,
  Supplier,
  UpdateInventoryInput,
  Warehouse,
} from '@medease/inventory-contract';
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
  assertItemFound,
  assertPurchaseOrderFound,
  assertSupplierFound,
  assertWarehouseFound,
  mapInventoryRepositoryError,
  toContractPaginated,
} from './inventory.helpers';
import {
  deriveStatus,
  mapItem,
  mapMovement,
  mapPurchaseOrder,
  mapSupplier,
  mapWarehouse,
  toCents,
} from './mappers/inventory.mapper';
import { buildItemWhere } from './queries/inventory.queries';

const PO_INCLUDE = { lines: true, supplier: true } as const;

@Injectable()
export class InventoryRepository
  extends TenantAwareRepository
  implements InventoryRepositoryContract
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {
    super();
  }

  searchItems(filters: InventoryFilters = {}): Promise<InventoryListResult> {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const where = buildItemWhere(this.tenantId, filters);
    return this.prisma.runInTransaction(async (tx) => {
      const [items, total] = await Promise.all([
        tx.inventoryItem.findMany({
          where,
          skip,
          take,
          orderBy: [{ updatedAt: 'desc' }],
        }),
        tx.inventoryItem.count({ where }),
      ]);
      return toContractPaginated(
        toPaginatedResult(items.map(mapItem), total, page, pageSize),
      );
    });
  }

  async getItem(inventoryId: string): Promise<InventoryItem> {
    return this.prisma.runInTransaction(async (tx) => {
      const row = await tx.inventoryItem.findFirst({
        where: { id: inventoryId, tenantId: this.tenantId },
      });
      assertItemFound(row, inventoryId);
      return mapItem(row);
    });
  }

  async createItem(input: CreateInventoryInput): Promise<InventoryItem> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const warehouse = await tx.warehouse.findFirst({
          where: { id: input.warehouseId, tenantId: this.tenantId },
        });
        assertWarehouseFound(warehouse, input.warehouseId);

        const qty = input.quantityOnHand ?? 0;
        const reorderLevel = input.reorderLevel ?? 0;
        const status = deriveStatus(qty, 0, reorderLevel, 'active');

        const row = await tx.inventoryItem.create({
          data: {
            id: newId(),
            tenantId: this.tenantId,
            warehouseId: input.warehouseId,
            facilityId: input.facilityId || warehouse.facilityId,
            sku: input.sku,
            barcode: input.barcode ?? '',
            itemName: input.itemName,
            category: input.category,
            department: input.department,
            manufacturer: input.manufacturer ?? '',
            supplierName: input.supplierName ?? '',
            unit: input.unit ?? 'ea',
            purchasePriceCents: toCents(input.purchasePrice ?? 0),
            sellingPriceCents: toCents(input.sellingPrice ?? 0),
            quantityOnHand: qty,
            reservedQuantity: 0,
            reorderLevel,
            reorderQuantity: input.reorderQuantity ?? reorderLevel * 2,
            shelfLocation: input.shelfLocation ?? '',
            batchNumber: input.batchNumber,
            expiryDate: input.expiryDate ? new Date(input.expiryDate) : null,
            coldChain: input.coldChain ?? false,
            status,
            createdBy: this.actorId(),
          },
        });
        return mapItem(row);
      });
    } catch (error) {
      mapInventoryRepositoryError(error);
    }
  }

  async updateItem(input: UpdateInventoryInput): Promise<InventoryItem> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.inventoryItem.findFirst({
          where: { id: input.inventoryId, tenantId: this.tenantId },
        });
        assertItemFound(existing, input.inventoryId);

        const quantityOnHand = input.quantityOnHand ?? existing.quantityOnHand;
        const reorderLevel = input.reorderLevel ?? existing.reorderLevel;
        const status = (input.status ??
          deriveStatus(
            quantityOnHand,
            existing.reservedQuantity,
            reorderLevel,
            existing.status as InventoryStatus,
          )) as InventoryStatus;

        const row = await tx.inventoryItem.update({
          where: { id: input.inventoryId },
          data: {
            itemName: input.itemName ?? existing.itemName,
            reorderLevel,
            quantityOnHand,
            shelfLocation: input.shelfLocation ?? existing.shelfLocation,
            status,
            updatedBy: this.actorId(),
          },
        });
        return mapItem(row);
      });
    } catch (error) {
      mapInventoryRepositoryError(error);
    }
  }

  async receiveStock(input: ReceiveStockInput): Promise<InventoryItem> {
    return this.mutateStock(input.inventoryId, input.quantity, 'receive', {
      reference: input.reference,
      notes: input.notes,
      performedBy: input.performedBy,
    });
  }

  async issueStock(input: IssueStockInput): Promise<InventoryItem> {
    return this.mutateStock(input.inventoryId, -Math.abs(input.quantity), 'issue', {
      reference: input.reference,
      notes: input.notes,
      performedBy: input.performedBy,
    });
  }

  async adjustStock(input: AdjustStockInput): Promise<InventoryItem> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.inventoryItem.findFirst({
          where: { id: input.inventoryId, tenantId: this.tenantId },
        });
        assertItemFound(existing, input.inventoryId);

        if (input.quantity < 0) {
          throw new ValidationError('Adjusted quantity cannot be negative');
        }

        const delta = input.quantity - existing.quantityOnHand;
        const status = deriveStatus(
          input.quantity,
          existing.reservedQuantity,
          existing.reorderLevel,
          existing.status as InventoryStatus,
        );

        const row = await tx.inventoryItem.update({
          where: { id: input.inventoryId },
          data: {
            quantityOnHand: input.quantity,
            status,
            updatedBy: this.actorId(),
          },
        });

        await tx.stockMovement.create({
          data: {
            id: newId(),
            tenantId: this.tenantId,
            inventoryId: input.inventoryId,
            itemName: existing.itemName,
            type: 'adjustment',
            quantity: Math.abs(delta),
            notes: input.notes,
            performedBy: input.performedBy ?? this.actorId(),
            createdBy: this.actorId(),
          },
        });

        return mapItem(row);
      });
    } catch (error) {
      mapInventoryRepositoryError(error);
    }
  }

  getMovements(
    inventoryId?: string,
    filters: InventoryFilters = {},
  ): Promise<MovementListResult> {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const where: {
      tenantId: string;
      inventoryId?: string;
    } = { tenantId: this.tenantId };
    if (inventoryId) where.inventoryId = inventoryId;

    return this.prisma.runInTransaction(async (tx) => {
      const [items, total] = await Promise.all([
        tx.stockMovement.findMany({
          where,
          skip,
          take,
          orderBy: [{ createdAt: 'desc' }],
        }),
        tx.stockMovement.count({ where }),
      ]);
      return toContractPaginated(
        toPaginatedResult(items.map(mapMovement), total, page, pageSize),
      );
    });
  }

  getWarehouses(facilityId?: string): Promise<Warehouse[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const rows = await tx.warehouse.findMany({
        where: {
          tenantId: this.tenantId,
          ...(facilityId ? { facilityId } : {}),
        },
        orderBy: [{ name: 'asc' }],
      });
      return rows.map(mapWarehouse);
    });
  }

  getDashboard(
    facilityId?: string,
    warehouseId?: string,
    department?: InventoryDepartment,
  ): Promise<InventoryDashboard> {
    return this.prisma.runInTransaction(async (tx) => {
      const scope: {
        tenantId: string;
        facilityId?: string;
        warehouseId?: string;
        department?: InventoryDepartment;
      } = { tenantId: this.tenantId };
      if (facilityId) scope.facilityId = facilityId;
      if (warehouseId) scope.warehouseId = warehouseId;
      if (department) scope.department = department;

      const items = await tx.inventoryItem.findMany({ where: scope });
      const now = Date.now();
      const soon = now + 90 * 24 * 60 * 60 * 1000;

      let inventoryValue = 0;
      let lowStockCount = 0;
      let outOfStockCount = 0;
      let expiredCount = 0;
      let expiringSoonCount = 0;

      for (const item of items) {
        inventoryValue +=
          (Number(item.purchasePriceCents) / 100) * item.quantityOnHand;
        if (item.status === 'low_stock') lowStockCount += 1;
        if (item.status === 'out_of_stock') outOfStockCount += 1;
        if (item.status === 'expired') expiredCount += 1;
        if (item.expiryDate) {
          const expiry = item.expiryDate.getTime();
          if (expiry < now) expiredCount += 1;
          else if (expiry <= soon) expiringSoonCount += 1;
        }
      }

      const inventoryIds = items.map((i) => i.id);
      const recent = await tx.stockMovement.findMany({
        where: {
          tenantId: this.tenantId,
          ...(inventoryIds.length
            ? { inventoryId: { in: inventoryIds } }
            : { inventoryId: '00000000-0000-0000-0000-000000000000' }),
        },
        orderBy: [{ createdAt: 'desc' }],
        take: 8,
      });

      return {
        totalItems: items.length,
        inventoryValue,
        lowStockCount,
        outOfStockCount,
        expiredCount,
        expiringSoonCount,
        recentMovements: recent.map(mapMovement),
      };
    });
  }

  private async mutateStock(
    inventoryId: string,
    delta: number,
    type: 'receive' | 'issue' | 'adjustment',
    meta: { reference?: string; notes?: string; performedBy?: string },
  ): Promise<InventoryItem> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.inventoryItem.findFirst({
          where: { id: inventoryId, tenantId: this.tenantId },
        });
        assertItemFound(existing, inventoryId);

        const nextQty = existing.quantityOnHand + delta;
        if (nextQty < 0) {
          throw new ValidationError('Insufficient stock quantity');
        }

        const status = deriveStatus(
          nextQty,
          existing.reservedQuantity,
          existing.reorderLevel,
          existing.status as InventoryStatus,
        );

        const row = await tx.inventoryItem.update({
          where: { id: inventoryId },
          data: {
            quantityOnHand: nextQty,
            status,
            updatedBy: this.actorId(),
          },
        });

        await tx.stockMovement.create({
          data: {
            id: newId(),
            tenantId: this.tenantId,
            inventoryId,
            itemName: existing.itemName,
            type,
            quantity: Math.abs(delta),
            fromLocation: type === 'issue' ? existing.warehouseId : undefined,
            toLocation: type === 'receive' ? existing.warehouseId : undefined,
            reference: meta.reference,
            notes: meta.notes,
            performedBy: meta.performedBy ?? this.actorId(),
            createdBy: this.actorId(),
          },
        });

        return mapItem(row);
      });
    } catch (error) {
      mapInventoryRepositoryError(error);
    }
  }

  private actorId(): string {
    return (
      this.requestContext.require().userId ??
      '00000000-0000-0000-0000-000000000000'
    );
  }

  getSuppliers(): Promise<Supplier[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const rows = await tx.supplier.findMany({
        where: { tenantId: this.tenantId },
        orderBy: [{ name: 'asc' }],
      });
      return rows.map(mapSupplier);
    });
  }

  getPurchaseOrders(
    filters: InventoryFilters = {},
  ): Promise<PurchaseOrderListResult> {
    const { page, pageSize, skip, take } = normalizePagination(filters);

    return this.prisma.runInTransaction(async (tx) => {
      const prismaWhere = {
        tenantId: this.tenantId,
        ...(filters.department ? { department: filters.department } : {}),
        ...(filters.q
          ? {
              OR: [
                { poNumber: { contains: filters.q, mode: 'insensitive' as const } },
                {
                  supplier: {
                    name: { contains: filters.q, mode: 'insensitive' as const },
                  },
                },
              ],
            }
          : {}),
      };
      const [items, total] = await Promise.all([
        tx.purchaseOrder.findMany({
          where: prismaWhere,
          include: PO_INCLUDE,
          skip,
          take,
          orderBy: [{ createdAt: 'desc' }],
        }),
        tx.purchaseOrder.count({ where: prismaWhere }),
      ]);
      return toContractPaginated(
        toPaginatedResult(items.map(mapPurchaseOrder), total, page, pageSize),
      );
    });
  }

  async createPurchaseOrder(
    input: CreatePurchaseOrderInput,
  ): Promise<PurchaseOrder> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        if (!input.items.length) {
          throw new ValidationError('At least one line item is required');
        }
        const supplier = await tx.supplier.findFirst({
          where: { id: input.supplierId, tenantId: this.tenantId },
        });
        assertSupplierFound(supplier, input.supplierId);

        const lineDefs = input.items.map((item, index) => {
          const unitPriceCents = toCents(item.unitPrice);
          return {
            id: newId(),
            tenantId: this.tenantId,
            inventoryId: item.inventoryId,
            sku: item.sku,
            itemName: item.itemName,
            quantity: item.quantity,
            unitPriceCents,
            receivedQuantity: 0,
            sortOrder: index,
          };
        });
        const subtotalCents = lineDefs.reduce(
          (sum, line) => sum + line.unitPriceCents * BigInt(line.quantity),
          0n,
        );
        const taxCents = (subtotalCents * 10n) / 100n;
        const poId = newId();
        const now = new Date();
        const poNumber = `PO-${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, '0')}-${poId.slice(-6).toUpperCase()}`;

        const row = await tx.purchaseOrder.create({
          data: {
            id: poId,
            tenantId: this.tenantId,
            facilityId: input.facilityId,
            supplierId: input.supplierId,
            poNumber,
            department: input.department,
            status: 'pending_approval',
            subtotalCents,
            taxCents,
            totalCents: subtotalCents + taxCents,
            requestedBy: input.requestedBy ?? this.actorId(),
            createdBy: this.actorId(),
            lines: { create: lineDefs },
          },
          include: PO_INCLUDE,
        });

        await tx.supplier.update({
          where: { id: input.supplierId },
          data: { totalOrders: { increment: 1 } },
        });

        return mapPurchaseOrder(row);
      });
    } catch (error) {
      mapInventoryRepositoryError(error);
    }
  }

  async approvePurchaseOrder(purchaseOrderId: string): Promise<PurchaseOrder> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.purchaseOrder.findFirst({
          where: { id: purchaseOrderId, tenantId: this.tenantId },
          include: PO_INCLUDE,
        });
        assertPurchaseOrderFound(existing, purchaseOrderId);
        if (
          existing.status !== 'draft' &&
          existing.status !== 'pending_approval'
        ) {
          throw new ValidationError(
            `Cannot approve purchase order in status ${existing.status}`,
          );
        }
        const row = await tx.purchaseOrder.update({
          where: { id: purchaseOrderId },
          data: {
            status: 'approved',
            approvedBy: this.actorId(),
            orderDate: new Date(),
            updatedBy: this.actorId(),
          },
          include: PO_INCLUDE,
        });
        return mapPurchaseOrder(row);
      });
    } catch (error) {
      mapInventoryRepositoryError(error);
    }
  }

  async receivePurchaseOrder(purchaseOrderId: string): Promise<PurchaseOrder> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.purchaseOrder.findFirst({
          where: { id: purchaseOrderId, tenantId: this.tenantId },
          include: PO_INCLUDE,
        });
        assertPurchaseOrderFound(existing, purchaseOrderId);
        if (
          existing.status !== 'approved' &&
          existing.status !== 'ordered' &&
          existing.status !== 'partial'
        ) {
          throw new ValidationError(
            `Cannot receive purchase order in status ${existing.status}`,
          );
        }

        for (const line of existing.lines) {
          const remaining = line.quantity - line.receivedQuantity;
          if (remaining <= 0) continue;

          let item = line.inventoryId
            ? await tx.inventoryItem.findFirst({
                where: { id: line.inventoryId, tenantId: this.tenantId },
              })
            : await tx.inventoryItem.findFirst({
                where: { tenantId: this.tenantId, sku: line.sku },
              });

          if (item) {
            const nextQty = item.quantityOnHand + remaining;
            const status = deriveStatus(
              nextQty,
              item.reservedQuantity,
              item.reorderLevel,
              item.status as InventoryStatus,
            );
            item = await tx.inventoryItem.update({
              where: { id: item.id },
              data: {
                quantityOnHand: nextQty,
                status,
                updatedBy: this.actorId(),
              },
            });
            await tx.stockMovement.create({
              data: {
                id: newId(),
                tenantId: this.tenantId,
                inventoryId: item.id,
                itemName: item.itemName,
                type: 'receive',
                quantity: remaining,
                toLocation: item.warehouseId,
                reference: existing.poNumber,
                performedBy: this.actorId(),
                createdBy: this.actorId(),
              },
            });
          }

          await tx.purchaseOrderLine.update({
            where: { id: line.id },
            data: { receivedQuantity: line.quantity },
          });
        }

        const row = await tx.purchaseOrder.update({
          where: { id: purchaseOrderId },
          data: {
            status: 'received',
            receivedDate: new Date(),
            updatedBy: this.actorId(),
          },
          include: PO_INCLUDE,
        });
        return mapPurchaseOrder(row);
      });
    } catch (error) {
      mapInventoryRepositoryError(error);
    }
  }
}
