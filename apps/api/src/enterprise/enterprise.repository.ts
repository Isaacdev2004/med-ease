import { Injectable } from '@nestjs/common';
import {
  normalizePagination,
  PrismaService,
  TenantAwareRepository,
  toPaginatedResult,
} from '@medease/prisma';
import { newId } from '@medease/uuid';
import { NotFoundError } from '@workspace/repository-transport/errors';
import { RequestContextService } from '../tenant/request-context.service';

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

@Injectable()
export class EnterpriseRepository extends TenantAwareRepository {
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

  async getSnapshot(module: string, kind: string, scopeKey = '') {
    return this.prisma.runInTransaction(async (tx) => {
      const row = await tx.enterpriseSnapshot.findFirst({
        where: {
          tenantId: this.tenantId,
          module,
          kind,
          scopeKey: scopeKey || '',
        },
      });
      if (row) return row.payload;

      // Fallback: synthesize a minimal live snapshot from record counts
      const grouped = await tx.enterpriseRecord.groupBy({
        by: ['resourceType'],
        where: { tenantId: this.tenantId, module },
        _count: { _all: true },
      });
      const counts = Object.fromEntries(
        grouped.map((g) => [g.resourceType, g._count._all]),
      );
      return {
        module,
        kind,
        generatedAt: new Date().toISOString(),
        counts,
        ...counts,
      };
    });
  }

  async listResources(
    module: string,
    resourceType: string,
    query: {
      q?: string;
      status?: string;
      page?: number;
      pageSize?: number;
      id?: string;
      facilityId?: string;
      departmentId?: string;
      department?: string;
      partnerId?: string;
      tenantId?: string;
      framework?: string;
    },
  ) {
    const { page, pageSize, skip, take } = normalizePagination(query);
    const payloadFilters: Array<[string, string]> = [];
    for (const key of [
      'facilityId',
      'departmentId',
      'department',
      'partnerId',
      'tenantId',
      'framework',
    ] as const) {
      const value = query[key];
      if (value) payloadFilters.push([key, value]);
    }

    return this.prisma.runInTransaction(async (tx) => {
      if (query.id) {
        const one = await tx.enterpriseRecord.findFirst({
          where: {
            id: query.id,
            tenantId: this.tenantId,
            module,
            resourceType,
          },
        });
        const items = one ? [one.payload] : [];
        return toPaginatedResult(items, items.length, 1, 1);
      }

      const where = {
        tenantId: this.tenantId,
        module,
        resourceType,
        ...(query.status ? { status: query.status } : {}),
        ...(query.q
          ? {
              OR: [
                { title: { contains: query.q, mode: 'insensitive' as const } },
                { externalKey: { contains: query.q, mode: 'insensitive' as const } },
                { status: { contains: query.q, mode: 'insensitive' as const } },
              ],
            }
          : {}),
      };

      // When payload filters are present, over-fetch then filter in memory
      // (JSON path filters vary by Postgres / Prisma version).
      const fetchTake = payloadFilters.length ? Math.max(take * 20, 200) : take;
      const fetchSkip = payloadFilters.length ? 0 : skip;

      const [rows, totalUnfiltered] = await Promise.all([
        tx.enterpriseRecord.findMany({
          where,
          orderBy: [{ updatedAt: 'desc' }],
          skip: fetchSkip,
          take: fetchTake,
        }),
        tx.enterpriseRecord.count({ where }),
      ]);

      let payloads = rows.map((r) => r.payload);
      if (payloadFilters.length) {
        payloads = payloads.filter((payload) => {
          const row = asRecord(payload);
          return payloadFilters.every(([key, value]) => {
            const cell = row[key];
            return cell != null && String(cell) === value;
          });
        });
        const pageItems = payloads.slice(skip, skip + take);
        return toPaginatedResult(pageItems, payloads.length, page, pageSize);
      }

      return toPaginatedResult(
        payloads,
        totalUnfiltered,
        page,
        pageSize,
      );
    });
  }

  async getResource(module: string, resourceType: string, id: string) {
    return this.prisma.runInTransaction(async (tx) => {
      const row = await tx.enterpriseRecord.findFirst({
        where: { id, tenantId: this.tenantId, module, resourceType },
      });
      if (!row) throw new NotFoundError(`${resourceType} not found`);
      return row.payload;
    });
  }

  async runAction(module: string, action: string, args: unknown[]) {
    return this.prisma.runInTransaction(async (tx) => {
      const now = new Date().toISOString();
      const actor = this.actorId();

      // Generic create: first arg is payload object with optional resourceType
      if (action.startsWith('create') || action.startsWith('upload') || action === 'send' || action === 'broadcast') {
        const input = asRecord(args[0]);
        const resourceType =
          typeof input.resourceType === 'string'
            ? input.resourceType
            : action.replace(/^create|^upload/, '').replace(/^[A-Z]/, (c) => c.toLowerCase()) || 'items';
        const id = newId();
        const payload = {
          ...input,
          id,
          createdAt: now,
          updatedAt: now,
          createdBy: actor,
        };
        await tx.enterpriseRecord.create({
          data: {
            id,
            tenantId: this.tenantId,
            module,
            resourceType: this.toKebab(resourceType),
            title: typeof input.title === 'string' ? input.title : typeof input.name === 'string' ? input.name : undefined,
            status: typeof input.status === 'string' ? input.status : 'active',
            payload,
            createdBy: actor,
          },
        });
        return payload;
      }

      // Generic id-targeted updates
      const idArg = args.find((a) => typeof a === 'string') as string | undefined;
      if (idArg) {
        const existing = await tx.enterpriseRecord.findFirst({
          where: { id: idArg, tenantId: this.tenantId, module },
        });
        if (!existing) throw new NotFoundError('Record not found');
        const prev = asRecord(existing.payload);
        const patch = args.find((a) => a && typeof a === 'object' && !Array.isArray(a));
        const next: Record<string, unknown> = {
          ...prev,
          ...(patch ? asRecord(patch) : {}),
          updatedAt: now,
          updatedBy: actor,
        };
        if (action.startsWith('archive') || action === 'cancel' || action === 'reject') {
          next.status = 'archived';
        }
        if (action.startsWith('approve') || action === 'activate' || action === 'publish') {
          next.status = 'active';
        }
        if (action.startsWith('complete') || action === 'close') {
          next.status = 'completed';
        }
        if (action === 'suspendTenant' || action === 'suspend') next.status = 'suspended';
        if (action === 'activateTenant' || action === 'activate') next.status = 'active';
        if (action === 'markRead' || action === 'acknowledgeAlert') {
          next.read = true;
          next.acknowledged = true;
        }

        await tx.enterpriseRecord.update({
          where: { id: existing.id },
          data: {
            payload: next as object,
            status: typeof next.status === 'string' ? next.status : existing.status,
            updatedBy: actor,
          },
        });
        return next;
      }

      return {
        ok: true,
        module,
        action,
        args,
        at: now,
      };
    });
  }

  private toKebab(value: string) {
    return value
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/[_\s]+/g, '-')
      .toLowerCase();
  }

  async listNotifications(filters?: {
    unreadOnly?: boolean;
    page?: number;
    pageSize?: number;
  }) {
    const { page, pageSize, skip, take } = normalizePagination(filters ?? {});
    const userId = this.actorId();
    return this.prisma.runInTransaction(async (tx) => {
      const where = {
        tenantId: this.tenantId,
        OR: [{ userId: null }, { userId }],
        ...(filters?.unreadOnly ? { read: false } : {}),
      };
      const [rows, total] = await Promise.all([
        tx.appNotification.findMany({
          where,
          orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
          skip,
          take,
        }),
        tx.appNotification.count({ where }),
      ]);
      return toPaginatedResult(
        rows.map((r) => ({
          id: r.id,
          title: r.title,
          message: r.message,
          type: r.type,
          priority: r.priority,
          category: r.category,
          timestamp: r.createdAt.toISOString(),
          read: r.read,
          pinned: r.pinned,
          ...(asRecord(r.payload)),
        })),
        total,
        page,
        pageSize,
      );
    });
  }

  async markNotificationRead(id: string) {
    return this.prisma.runInTransaction(async (tx) => {
      const row = await tx.appNotification.findFirst({
        where: { id, tenantId: this.tenantId },
      });
      if (!row) throw new NotFoundError('Notification not found');
      const updated = await tx.appNotification.update({
        where: { id },
        data: { read: true },
      });
      return {
        id: updated.id,
        title: updated.title,
        message: updated.message,
        type: updated.type,
        priority: updated.priority,
        category: updated.category,
        timestamp: updated.createdAt.toISOString(),
        read: updated.read,
        pinned: updated.pinned,
      };
    });
  }

  async markAllNotificationsRead() {
    return this.prisma.runInTransaction(async (tx) => {
      const userId = this.actorId();
      const result = await tx.appNotification.updateMany({
        where: {
          tenantId: this.tenantId,
          read: false,
          OR: [{ userId: null }, { userId }],
        },
        data: { read: true },
      });
      return { updated: result.count };
    });
  }

  async getPreferences() {
    return this.prisma.runInTransaction(async (tx) => {
      const userId = this.actorId();
      const rows = await tx.userPreference.findMany({
        where: { tenantId: this.tenantId, userId },
      });
      const prefs: Record<string, unknown> = {
        emailAlerts: true,
        smsAlerts: false,
        darkMode: false,
        autoLogout: true,
      };
      for (const row of rows) {
        prefs[row.key] = row.value;
      }
      return prefs;
    });
  }

  async putPreferences(prefs: Record<string, unknown>) {
    return this.prisma.runInTransaction(async (tx) => {
      const userId = this.actorId();
      for (const [key, value] of Object.entries(prefs)) {
        if (key === 'preferences') continue;
        const existing = await tx.userPreference.findFirst({
          where: { tenantId: this.tenantId, userId, key },
        });
        if (existing) {
          await tx.userPreference.update({
            where: { id: existing.id },
            data: { value: value as object },
          });
        } else {
          await tx.userPreference.create({
            data: {
              id: newId(),
              tenantId: this.tenantId,
              userId,
              key,
              value: value as object,
            },
          });
        }
      }
      return this.getPreferences();
    });
  }
}
