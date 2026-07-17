import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  runWithRequestContext,
  createBaseRequestContext,
} from '@medease/observability';
import type { AuditPublisher } from '@medease/audit';

import { DomainEventBus } from './domain-event-bus';
import { UserEvents } from './events/user.events';
import { createAuditHandler } from './handlers/audit.handler';

describe('DomainEventBus', () => {
  it('dispatches events to registered handlers', async () => {
    const published: string[] = [];
    const publisher = {
      publishAsync: (event: { eventType: string }) => {
        published.push(event.eventType);
      },
    } as unknown as AuditPublisher;

    const bus = new DomainEventBus();
    bus.register(createAuditHandler(publisher));

    await runWithRequestContext(
      {
        ...createBaseRequestContext({
          requestId: 'req-1',
          correlationId: 'corr-1',
        }),
        tenantId: 'tenant-a',
        userId: 'admin-1',
        roles: [],
        permissions: [],
      },
      async () => {
        await bus.publish(
          UserEvents.roleAssigned({
            resourceType: 'role',
            resourceId: 'role-1',
            tenantId: 'tenant-a',
          }),
        );
      },
    );

    assert.deepEqual(published, ['RoleAssigned']);
  });

  it('publishMany processes events in order', async () => {
    const order: string[] = [];
    const publisher = {
      publishAsync: (event: { eventType: string }) => {
        order.push(event.eventType);
      },
    } as unknown as AuditPublisher;

    const bus = new DomainEventBus();
    bus.register(createAuditHandler(publisher));

    await bus.publishMany([
      UserEvents.userCreated({
        resourceType: 'user',
        resourceId: 'user-1',
        tenantId: 'tenant-a',
      }),
      UserEvents.roleAssigned({
        resourceType: 'role',
        resourceId: 'role-1',
        tenantId: 'tenant-a',
      }),
    ]);

    assert.deepEqual(order, ['UserCreated', 'RoleAssigned']);
  });

  it('ignores unregistered event types without failing', async () => {
    const bus = new DomainEventBus();
    bus.register(
      createAuditHandler({
        publishAsync: () => undefined,
      } as unknown as AuditPublisher),
    );

    await bus.publish({
      id: 'evt-1',
      type: 'UnknownEvent',
      occurredAt: new Date(),
      payload: {},
    });
  });
});
