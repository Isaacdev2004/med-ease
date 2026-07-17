import {
  PortalActionButton,
  PortalListCard,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import { PageShell, SectionHeader } from '@/shared/components';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';

const threads = [
  {
    id: 'm1',
    primary: 'Dr. Adebayo — Care plan update',
    secondary: 'Please review the revised goals before discharge.',
    badge: 'Unread',
  },
  {
    id: 'm2',
    primary: 'Pharmacy — Refill ready',
    secondary: 'Your prescription is ready for pickup.',
    badge: '2h ago',
  },
  {
    id: 'm3',
    primary: 'Lab — Results available',
    secondary: 'Chemistry panel results are now in your portal.',
    badge: 'Yesterday',
  },
];

export default function MessagesPage() {
  return (
    <PageShell
      title="Messages"
      subtitle="Secure conversations with your care team."
      primaryAction={
        <PortalActionButton
          label="Compose message"
          successTitle="Message sent"
        />
      }
    >
      <PortalListCard
        title="Inbox"
        items={threads}
        actionLabel="Mark all read"
      />
      <SectionHeader title="Compose" />
      <div className="grid gap-3 max-w-xl">
        <Input placeholder="To: care team member" />
        <Input placeholder="Subject" />
        <Textarea placeholder="Write your message…" rows={4} />
        <PortalActionButton
          label="Send message"
          successTitle="Message delivered"
        />
      </div>
    </PageShell>
  );
}
