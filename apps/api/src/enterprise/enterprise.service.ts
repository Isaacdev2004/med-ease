import { Injectable } from '@nestjs/common';
import { EnterpriseRepository } from './enterprise.repository';

@Injectable()
export class EnterpriseService {
  constructor(private readonly repository: EnterpriseRepository) {}

  getDashboard(module: string, scopeKey?: string) {
    return this.repository.getSnapshot(module, 'dashboard', scopeKey);
  }

  getAnalytics(module: string, scopeKey?: string) {
    return this.repository.getSnapshot(module, 'analytics', scopeKey);
  }

  listResources(
    module: string,
    resourceType: string,
    query: {
      q?: string;
      status?: string;
      page?: number;
      pageSize?: number;
      id?: string;
    },
  ) {
    return this.repository.listResources(module, resourceType, query);
  }

  getResource(module: string, resourceType: string, id: string) {
    return this.repository.getResource(module, resourceType, id);
  }

  runAction(
    module: string,
    action: string,
    args: unknown[],
  ) {
    return this.repository.runAction(module, action, args);
  }

  listNotifications(filters?: {
    unreadOnly?: boolean;
    page?: number;
    pageSize?: number;
  }) {
    return this.repository.listNotifications(filters);
  }

  markNotificationRead(id: string) {
    return this.repository.markNotificationRead(id);
  }

  markAllNotificationsRead() {
    return this.repository.markAllNotificationsRead();
  }

  getPreferences() {
    return this.repository.getPreferences();
  }

  putPreferences(prefs: Record<string, unknown>) {
    return this.repository.putPreferences(prefs);
  }
}
