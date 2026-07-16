import {
  AnalyticsPanel,
  ChatPanel,
  ClinicalNotesPanel,
  DeviceCheckCard,
  ParticipantGrid,
  ProviderAvailability,
  RecordingPanel,
  SessionCard,
  SessionTimeline,
  TelemedicineMetrics,
  VideoWindow,
  VirtualWaitingRoom,
  VisitSummaryCard,
} from '@/features/telemedicine/components/TelemedicineComponents';
import {
  useChat,
  useClinicalNotes,
  useDeviceCheck,
  useParticipants,
  useProviderAvailability,
  useRecordings,
  useSession,
  useSessionTimeline,
  useSessions,
  useTelemedicineAnalytics,
  useTelemedicineDashboard,
  useWaitingRoom,
} from '@/features/telemedicine/hooks/use-telemedicine';
import { useTelemedicineMutations } from '@/features/telemedicine/mutations/telemedicine.mutations';
import type { TelemedicineFilters } from '@/services/telemedicine/types';
import { LoadingView } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';
import { Video } from 'lucide-react';

export function DashboardSection({ filters }: { filters?: TelemedicineFilters }) {
  const dashboard = useTelemedicineDashboard(filters?.patientId, filters?.clinicianId);
  if (dashboard.isLoading) return <LoadingView label="Loading telemedicine…" />;
  if (!dashboard.data) return <EmptyState icon={Video} title="No telemedicine data" />;
  return (
    <div className="space-y-6">
      <TelemedicineMetrics dashboard={dashboard.data} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dashboard.data.recentSessions.map((s) => <SessionCard key={s.sessionId} session={s} />)}
      </div>
    </div>
  );
}

export function UpcomingSection({ filters }: { filters?: TelemedicineFilters }) {
  const query = useSessions({ ...filters, status: 'scheduled' });
  if (query.isLoading) return <LoadingView />;
  const items = query.data?.items ?? [];
  if (!items.length) return <EmptyState icon={Video} title="No upcoming visits" />;
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.slice(0, 12).map((s) => <SessionCard key={s.sessionId} session={s} />)}</div>;
}

export function HistorySection({ filters }: { filters?: TelemedicineFilters }) {
  const query = useSessions({ ...filters, status: 'completed' });
  if (query.isLoading) return <LoadingView />;
  const items = query.data?.items ?? [];
  if (!items.length) return <EmptyState icon={Video} title="No visit history" />;
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.slice(0, 12).map((s) => <SessionCard key={s.sessionId} session={s} />)}</div>;
}

export function SessionDetailSection({ sessionId }: { sessionId: string }) {
  const session = useSession(sessionId);
  const participants = useParticipants(sessionId);
  const messages = useChat(sessionId);
  const notes = useClinicalNotes(sessionId);
  const timeline = useSessionTimeline(sessionId);
  const { joinSession, leaveSession } = useTelemedicineMutations();
  if (session.isLoading) return <LoadingView />;
  const s = session.data;
  if (!s) return <EmptyState icon={Video} title="Session not found" />;
  return (
    <div className="space-y-6">
      <VideoWindow session={s} />
      <ParticipantGrid participants={participants.data ?? []} />
      <div className="flex gap-2">
        <button type="button" className="text-sm underline" onClick={() => void joinSession.mutateAsync({ sessionId, participantId: 'self' })}>Join</button>
        <button type="button" className="text-sm underline" onClick={() => void leaveSession.mutateAsync(sessionId)}>Leave</button>
      </div>
      <ChatPanel messages={messages.data ?? []} />
      {(notes.data ?? []).map((n) => <ClinicalNotesPanel key={n.id} note={n} />)}
      <SessionTimeline entries={timeline.data ?? []} />
      <VisitSummaryCard session={s} />
    </div>
  );
}

export function WaitingRoomSection() {
  const query = useWaitingRoom();
  const { admitWaitingRoom, rejectWaitingRoom } = useTelemedicineMutations();
  if (query.isLoading) return <LoadingView />;
  const entries = query.data ?? [];
  if (!entries.length) return <EmptyState icon={Video} title="Waiting room empty" />;
  return (
    <VirtualWaitingRoom
      entries={entries}
      onAdmit={(id) => void admitWaitingRoom.mutateAsync(id)}
      onReject={(id) => void rejectWaitingRoom.mutateAsync(id)}
    />
  );
}

export function DeviceCheckSection({ sessionId }: { sessionId?: string }) {
  const query = useDeviceCheck(sessionId);
  if (query.isLoading) return <LoadingView />;
  if (!query.data) return <EmptyState icon={Video} title="Device check unavailable" />;
  return <DeviceCheckCard result={query.data} />;
}

export function AnalyticsSection() {
  const query = useTelemedicineAnalytics();
  if (query.isLoading) return <LoadingView />;
  if (!query.data) return <EmptyState icon={Video} title="No analytics" />;
  return <AnalyticsPanel analytics={query.data} />;
}

export function AvailabilitySection() {
  const query = useProviderAvailability();
  if (query.isLoading) return <LoadingView />;
  return <ProviderAvailability providers={query.data ?? []} />;
}

export function RecordingsSection({ sessionId }: { sessionId?: string }) {
  const query = useRecordings(sessionId);
  if (query.isLoading) return <LoadingView />;
  const recs = query.data ?? [];
  if (!recs.length) return <EmptyState icon={Video} title="No recordings" />;
  return <div className="grid gap-4 sm:grid-cols-2">{recs.slice(0, 8).map((r) => <RecordingPanel key={r.id} recording={r} />)}</div>;
}

export function SessionsSection({ filters }: { filters?: TelemedicineFilters }) {
  const query = useSessions(filters);
  if (query.isLoading) return <LoadingView />;
  const items = query.data?.items ?? [];
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.slice(0, 15).map((s) => <SessionCard key={s.sessionId} session={s} />)}</div>;
}

export type TelemedicineSection =
  | 'dashboard' | 'upcoming' | 'history' | 'session' | 'device-check'
  | 'waiting-room' | 'current-session' | 'availability' | 'sessions'
  | 'providers' | 'analytics' | 'platform-health' | 'recordings' | 'chat';

export function TelemedicineSectionContent({
  section,
  filters,
  sessionId,
}: {
  section: TelemedicineSection;
  filters?: TelemedicineFilters;
  sessionId?: string;
}) {
  switch (section) {
    case 'upcoming': return <UpcomingSection filters={filters} />;
    case 'history': return <HistorySection filters={filters} />;
    case 'session': return sessionId ? <SessionDetailSection sessionId={sessionId} /> : <DashboardSection filters={filters} />;
    case 'device-check': return <DeviceCheckSection />;
    case 'waiting-room': return <WaitingRoomSection />;
    case 'current-session': return <SessionsSection filters={{ ...filters, status: 'in_progress' }} />;
    case 'availability': case 'providers': return <AvailabilitySection />;
    case 'analytics': case 'platform-health': return <AnalyticsSection />;
    case 'sessions': return <SessionsSection filters={filters} />;
    case 'recordings': return <RecordingsSection sessionId={sessionId} />;
    default: return <DashboardSection filters={filters} />;
  }
}
