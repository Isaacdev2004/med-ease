import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { IamRepositoryContract } from '@medease/iam-contract';
import {
  expectPagination,
  expectRejectsWithErrorName,
  expectSearchMatch,
  type RepositoryContractCapabilities,
} from '@medease/repository-contract-test';
import { NotFoundError } from '@workspace/repository-transport';

import { iamContractFixtures } from './fixtures/iam.fixtures';

export interface IamRepositoryContractContext {
  name: string;
  repository: IamRepositoryContract;
  fixtures?: typeof iamContractFixtures;
  capabilities?: RepositoryContractCapabilities;
}

export function iamRepositoryContract(ctx: IamRepositoryContractContext): void {
  const fixtures = ctx.fixtures ?? iamContractFixtures;
  const capabilities = ctx.capabilities ?? {
    mutations: true,
    search: true,
    favorites: true,
    export: true,
  };

  describe(`${ctx.name} IAM repository contract`, () => {
    it('returns paginated users', async () => {
      const result = await ctx.repository.getUsers({
        page: fixtures.page,
        pageSize: fixtures.pageSize,
      });

      expectPagination(result, { page: fixtures.page, pageSize: fixtures.pageSize });
      assert.ok(result.items.length > 0);
      assert.ok(result.items[0]?.userId);
      assert.ok(result.items[0]?.email);
    });

    it('filters users by tenant', async () => {
      const result = await ctx.repository.getUsers({
        tenantId: fixtures.tenantId,
        page: 1,
        pageSize: 25,
      });

      assert.ok(result.items.every((user) => user.tenantId === fixtures.tenantId));
    });

    it('supports search', async () => {
      if (!capabilities.search) return;

      const result = await ctx.repository.getUsers({
        q: fixtures.searchQuery,
        page: 1,
        pageSize: 25,
      });

      assert.ok(
        result.items.every((user) =>
          expectSearchMatch(user.email, fixtures.searchQuery, [user.email, user.displayName]),
        ),
      );
    });

    it('gets an existing user by id', async () => {
      const user = await ctx.repository.getUser(fixtures.existingUserId);
      assert.equal(user.userId, fixtures.existingUserId);
      assert.ok(user.email);
    });

    it('throws NotFoundError for missing users', async () => {
      await expectRejectsWithErrorName(
        ctx.repository.getUser(fixtures.missingUserId),
        NotFoundError.name,
      );
    });

    it('returns dashboard metrics', async () => {
      const dashboard = await ctx.repository.dashboard(fixtures.tenantId);
      assert.ok(typeof dashboard.totalUsers === 'number');
      assert.ok(Array.isArray(dashboard.recentAudit));
    });

    it('returns analytics metrics', async () => {
      const analytics = await ctx.repository.analytics(fixtures.tenantId);
      assert.ok(typeof analytics.authenticationSuccessRate === 'number');
      assert.ok(Array.isArray(analytics.authTrend));
    });

    it('lists roles and permissions', async () => {
      const roles = await ctx.repository.getRoles({ page: 1, pageSize: 10 });
      const permissions = await ctx.repository.getPermissions({ page: 1, pageSize: 10 });
      expectPagination(roles, { page: 1, pageSize: 10 });
      expectPagination(permissions, { page: 1, pageSize: 10 });
    });

    if (capabilities.search) {
      it('searches users and policies', async () => {
        const result = await ctx.repository.search(fixtures.searchQuery, fixtures.tenantId);
        assert.ok(Array.isArray(result.users));
        assert.ok(Array.isArray(result.policies));
      });
    }

    if (capabilities.favorites) {
      it('favorites and lists favorites', async () => {
        const favorite = await ctx.repository.favorite(
          fixtures.existingUserId,
          'user',
          fixtures.existingUserId,
        );
        assert.equal(favorite.entityId, fixtures.existingUserId);

        const favorites = await ctx.repository.getFavorites(fixtures.existingUserId);
        assert.ok(favorites.some((item) => item.entityId === fixtures.existingUserId));
      });
    }

    if (capabilities.export) {
      it('exports IAM data', async () => {
        const result = await ctx.repository.exportData('csv');
        assert.equal(result.format, 'csv');
        assert.ok(result.exportedAt);
        assert.ok(typeof result.recordCount === 'number');
      });
    }

    if (capabilities.mutations) {
      it('creates and locks a user', async () => {
        const created = await ctx.repository.createUser({
          email: `contract-${Date.now()}@medease.health`,
          displayName: 'Contract Test User',
          tenantId: fixtures.tenantId,
          organizationId: fixtures.organizationId,
          roleIds: [fixtures.roleId],
        });

        assert.ok(created.userId);
        assert.equal(created.status, 'pending');

        const locked = await ctx.repository.lockAccount(created.userId);
        assert.equal(locked.status, 'locked');

        const unlocked = await ctx.repository.unlockAccount(created.userId);
        assert.equal(unlocked.status, 'active');
      });
    }
  });
}
