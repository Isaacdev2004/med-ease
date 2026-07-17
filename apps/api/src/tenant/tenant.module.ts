import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { RequestContextMiddleware } from './request-context.middleware';
import { RequestContextService } from './request-context.service';
import { TenantMiddleware } from './tenant.middleware';
import { TenantResolver } from './tenant.resolver';

@Global()
@Module({
  providers: [
    RequestContextMiddleware,
    TenantMiddleware,
    RequestContextService,
    TenantResolver,
  ],
  exports: [RequestContextService, TenantResolver],
})
export class TenantModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestContextMiddleware, TenantMiddleware).forRoutes('*');
  }
}
