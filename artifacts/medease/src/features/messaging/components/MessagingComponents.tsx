import { format } from 'date-fns';
import {
  BarChart3,
  Bell,
  Mail,
  Megaphone,
  MessageSquare,
  Radio,
  Send,
  Shield,
  Smartphone,
  Zap,
} from 'lucide-react';

import type {
  Announcement,
  Broadcast,
  Campaign,
  ChannelConfig,
  ChatMessage,
  ChatThread,
  DeliveryRecord,
  InboxItem,
  Integration,
  Message,
  MessageTemplate,
  MessagingAnalytics,
  MessagingDashboard,
  SecureMessage,
} from '@/services/messaging/types';
import { BarChartPanel } from '@/shared/charts';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

const statusVariant = { draft: 'secondary', queued: 'secondary', sent: 'default', delivered: 'default', read: 'outline', failed: 'destructive', bounced: 'destructive' } as const;
const healthVariant = { healthy: 'default', degraded: 'secondary', offline: 'destructive' } as const;
const channelIcons: Record<string, typeof Mail> = { email: Mail, sms: Smartphone, push: Bell, whatsapp: MessageSquare, teams: MessageSquare, slack: MessageSquare, in_app: Bell };

export function DashboardPanel({ dashboard }: { dashboard: MessagingDashboard }) {
  const metrics = [
    { label: 'Total Messages', value: dashboard.totalMessages.toLocaleString(), icon: Send },
    { label: 'Unread Inbox', value: dashboard.unreadInbox.toLocaleString(), icon: Mail },
    { label: 'Active Campaigns', value: dashboard.activeCampaigns.toLocaleString(), icon: Megaphone },
    { label: 'Pending Deliveries', value: dashboard.pendingDeliveries.toLocaleString(), icon: Zap },
    { label: 'Channel Health', value: `${dashboard.channelHealthScore}%`, icon: Radio },
    { label: 'Delivery Rate', value: `${dashboard.deliveryRate}%`, icon: BarChart3 },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-4 flex items-center gap-3">
              <m.icon className="h-8 w-8 text-primary shrink-0" />
              <div><p className="text-2xl font-bold">{m.value}</p><p className="text-xs text-muted-foreground">{m.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
      <BarChartPanel title="Message Volume" data={dashboard.messageTrend} />
      <BarChartPanel title="Messages by Channel" data={dashboard.channelBreakdown} />
    </div>
  );
}

export function InboxPanel({ items, onMarkRead }: { items: InboxItem[]; onMarkRead?: (inboxId: string) => void }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Inbox</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {items.length === 0 ? <p className="text-sm text-muted-foreground">No messages.</p> : items.slice(0, 12).map((item) => (
          <div key={item.inboxId} className="flex justify-between gap-2 text-sm border-b pb-2 last:border-0">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {!item.isRead && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                <span className={`font-medium truncate ${item.isRead ? 'text-muted-foreground' : ''}`}>{item.subject}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{item.preview}</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <Badge variant="outline" className="capitalize">{item.channel.replace('_', ' ')}</Badge>
              {!item.isRead && onMarkRead && (
                <button type="button" className="text-xs text-primary underline" onClick={() => onMarkRead(item.inboxId)}>Mark read</button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const priorityVariant = { normal: 'outline', important: 'secondary', critical: 'destructive' } as const;
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{announcement.title}</span>
          <Badge variant={priorityVariant[announcement.priority]} className="capitalize">{announcement.priority}</Badge>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{announcement.body}</p>
        <div className="flex gap-1">
          <Badge variant="outline" className="capitalize">{announcement.audience}</Badge>
          <span className="text-xs text-muted-foreground">{announcement.readCount} reads</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function ChatPanel({ threads, messages }: { threads: ChatThread[]; messages: ChatMessage[] }) {
  const active = threads[0];
  const threadMessages = active ? messages.filter((m) => m.threadId === active.threadId) : [];
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader><CardTitle className="text-base">Threads</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {threads.slice(0, 8).map((t) => (
            <div key={t.threadId} className="text-sm border rounded p-2 flex justify-between gap-2">
              <span className="font-medium truncate">{t.title}</span>
              {t.unreadCount > 0 && <Badge>{t.unreadCount}</Badge>}
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader><CardTitle className="text-base">{active?.title ?? 'Select a thread'}</CardTitle></CardHeader>
        <CardContent className="space-y-2 max-h-64 overflow-y-auto">
          {threadMessages.map((m) => (
            <div key={m.chatMessageId} className="text-sm border-b pb-2 last:border-0">
              <p className="text-xs text-muted-foreground">{format(new Date(m.sentAt), 'MMM d, HH:mm')}</p>
              <p>{m.body}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function SecureMessageCard({ message }: { message: SecureMessage }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium flex items-center gap-1"><Shield className="h-4 w-4" /> {message.subject}</span>
          <Badge variant={statusVariant[message.status]} className="capitalize">{message.status}</Badge>
        </div>
        <Badge variant="outline" className="uppercase">{message.encryptionLevel}</Badge>
        <p className="text-xs text-muted-foreground line-clamp-2">{message.body}</p>
      </CardContent>
    </Card>
  );
}

export function BroadcastPanel({ broadcasts }: { broadcasts: Broadcast[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base flex items-center gap-2"><Megaphone className="h-5 w-5" /> Broadcasts</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {broadcasts.slice(0, 8).map((b) => (
          <div key={b.broadcastId} className="text-sm border-b pb-2 last:border-0">
            <div className="flex justify-between gap-2">
              <span className="font-medium">{b.title}</span>
              <Badge className="capitalize">{b.status}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{b.audience} · {b.deliveredCount}/{b.recipientCount} delivered</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ChannelCard({ channel }: { channel: ChannelConfig }) {
  const Icon = channelIcons[channel.channel] ?? Radio;
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium flex items-center gap-1"><Icon className="h-4 w-4" /> {channel.name}</span>
          <Badge variant={healthVariant[channel.health]} className="capitalize">{channel.health}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">{channel.provider}</p>
        <p className="text-xs">{channel.sentToday.toLocaleString()} / {channel.dailyLimit.toLocaleString()} today · {channel.failureRate}% fail</p>
      </CardContent>
    </Card>
  );
}

export function TemplateCard({ template }: { template: MessageTemplate }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{template.name}</span>
          <Badge variant={template.isActive ? 'default' : 'secondary'}>{template.isActive ? 'Active' : 'Inactive'}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">{template.subject}</p>
        <div className="flex gap-1 flex-wrap">
          <Badge variant="outline" className="capitalize">{template.channel.replace('_', ' ')}</Badge>
          <Badge variant="outline">{template.category}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">{template.usageCount} uses</p>
      </CardContent>
    </Card>
  );
}

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{campaign.name}</span>
          <Badge className="capitalize">{campaign.status}</Badge>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1">{campaign.description}</p>
        <p className="text-xs">{campaign.deliveredCount.toLocaleString()} / {campaign.sentCount.toLocaleString()} delivered · {campaign.openRate}% open</p>
      </CardContent>
    </Card>
  );
}

export function DeliveryTimeline({ deliveries }: { deliveries: DeliveryRecord[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Delivery Tracking</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {deliveries.slice(0, 10).map((d) => (
          <div key={d.deliveryId} className="flex justify-between text-sm border-b pb-2 last:border-0">
            <div>
              <p className="font-medium">{d.messageId}</p>
              <p className="text-xs text-muted-foreground">{d.recipientId} · {d.channel.replace('_', ' ')} · {d.attempts} attempt(s)</p>
            </div>
            <div className="text-right">
              <Badge variant={statusVariant[d.status]} className="capitalize">{d.status}</Badge>
              {d.deliveredAt && <p className="text-xs text-muted-foreground mt-1">{format(new Date(d.deliveredAt), 'MMM d, HH:mm')}</p>}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function MessagingAnalyticsPanel({ analytics }: { analytics: MessagingAnalytics }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: 'Delivery Rate', value: `${analytics.deliveryRate}%` },
          { label: 'Open Rate', value: `${analytics.openRate}%` },
          { label: 'Click Rate', value: `${analytics.clickRate}%` },
          { label: 'Bounce Rate', value: `${analytics.bounceRate}%` },
          { label: 'Avg Delivery (ms)', value: analytics.avgDeliveryTimeMs.toLocaleString() },
          { label: 'Messages/Day', value: analytics.messagesSentDaily.toLocaleString() },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <BarChartPanel title="Channel Performance" data={analytics.channelPerformance} />
      <BarChartPanel title="Campaign Performance" data={analytics.campaignPerformance} />
    </div>
  );
}

export function IntegrationCard({ integration }: { integration: Integration }) {
  const statusVariant = { connected: 'default', disconnected: 'secondary', error: 'destructive' } as const;
  return (
    <Card>
      <CardContent className="pt-4 text-sm flex justify-between gap-2">
        <div>
          <p className="font-medium">{integration.name}</p>
          <p className="text-xs text-muted-foreground">{integration.provider} · {integration.channel.replace('_', ' ')}</p>
        </div>
        <Badge variant={statusVariant[integration.status]} className="capitalize">{integration.status}</Badge>
      </CardContent>
    </Card>
  );
}

export function MessageCard({ message }: { message: Message }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{message.subject}</span>
          <Badge variant={statusVariant[message.status]} className="capitalize">{message.status}</Badge>
        </div>
        <Badge variant="outline" className="capitalize">{message.channel.replace('_', ' ')}</Badge>
        <p className="text-xs text-muted-foreground line-clamp-2">{message.body}</p>
      </CardContent>
    </Card>
  );
}

export function ExportToolbar({ onExport }: { onExport: (format: 'csv' | 'pdf' | 'xlsx') => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={() => onExport('csv')}><BarChart3 className="h-4 w-4 mr-1" /> Export CSV</Button>
      <Button variant="outline" size="sm" onClick={() => onExport('pdf')}>Export PDF</Button>
      <Button variant="outline" size="sm" onClick={() => onExport('xlsx')}>Export XLSX</Button>
    </div>
  );
}
