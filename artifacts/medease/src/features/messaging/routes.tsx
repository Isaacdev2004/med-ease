import type { RouteDefinition } from '@/config/routes/types';

const professionalPage = () => import('@/features/messaging/pages/ProfessionalMessagingPage');
const facilityPage = () => import('@/features/messaging/pages/FacilityMessagingPage');
const adminPage = () => import('@/features/messaging/pages/AdminMessagingPage');

export function createProfessionalMessagingRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  return [
    { path: '/messaging', title: 'Messaging', breadcrumb: 'Messaging', analyticsName: `${analyticsPrefix}_messaging`, lazy: professionalPage, nav, permission: 'messaging.read', featureFlag: 'messaging' },
    { path: '/inbox', title: 'Inbox', breadcrumb: 'Inbox', analyticsName: `${analyticsPrefix}_inbox`, lazy: professionalPage, permission: 'messaging.read', featureFlag: 'messaging' },
    { path: '/announcements', title: 'Announcements', breadcrumb: 'Announcements', analyticsName: `${analyticsPrefix}_announcements`, lazy: professionalPage, permission: 'messaging.read', featureFlag: 'messaging' },
  ];
}

export function createFacilityMessagingRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  return [
    { path: '/messaging', title: 'Messaging', breadcrumb: 'Messaging', analyticsName: `${analyticsPrefix}_messaging`, lazy: facilityPage, nav, permission: 'messaging.read', featureFlag: 'messaging' },
    { path: '/broadcasts', title: 'Broadcasts', breadcrumb: 'Broadcasts', analyticsName: `${analyticsPrefix}_broadcasts`, lazy: facilityPage, permission: 'messaging.send', featureFlag: 'messaging' },
    { path: '/message-templates', title: 'Message Templates', breadcrumb: 'Templates', analyticsName: `${analyticsPrefix}_message_templates`, lazy: facilityPage, permission: 'messaging.templates', featureFlag: 'messaging' },
  ];
}

export function createAdminMessagingRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  const page = adminPage;
  const flag = 'messaging' as const;
  return [
    { path: '/messaging', title: 'Messaging Hub', breadcrumb: 'Messaging', analyticsName: `${analyticsPrefix}_messaging`, lazy: page, nav, permission: 'messaging.read', featureFlag: flag },
    { path: '/message-center', title: 'Message Center', breadcrumb: 'Center', analyticsName: `${analyticsPrefix}_message_center`, lazy: page, permission: 'messaging.read', featureFlag: flag },
    { path: '/channels', title: 'Channels', breadcrumb: 'Channels', analyticsName: `${analyticsPrefix}_channels`, lazy: page, permission: 'messaging.channels', featureFlag: flag },
    { path: '/templates', title: 'Templates', breadcrumb: 'Templates', analyticsName: `${analyticsPrefix}_templates`, lazy: page, permission: 'messaging.templates', featureFlag: flag },
    { path: '/campaigns', title: 'Campaigns', breadcrumb: 'Campaigns', analyticsName: `${analyticsPrefix}_campaigns`, lazy: page, permission: 'messaging.campaigns', featureFlag: flag },
    { path: '/delivery-tracking', title: 'Delivery Tracking', breadcrumb: 'Delivery', analyticsName: `${analyticsPrefix}_delivery_tracking`, lazy: page, permission: 'messaging.analytics', featureFlag: flag },
    { path: '/messaging-analytics', title: 'Messaging Analytics', breadcrumb: 'Analytics', analyticsName: `${analyticsPrefix}_messaging_analytics`, lazy: page, permission: 'messaging.analytics', featureFlag: flag },
    { path: '/integrations', title: 'Integrations', breadcrumb: 'Integrations', analyticsName: `${analyticsPrefix}_integrations`, lazy: page, permission: 'messaging.admin', featureFlag: flag },
  ];
}
