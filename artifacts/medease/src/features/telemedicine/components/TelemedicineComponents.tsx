import { format } from 'date-fns';
import {
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  Video,
  VideoOff,
  Wifi,
  WifiOff,
} from 'lucide-react';

import type {
  ChatMessage,
  ClinicalNote,
  DeviceCheckResult,
  SessionRecording,
  SessionTimelineEntry,
  TelemedicineAnalytics,
  TelemedicineDashboard,
  TelemedicineSession,
  VideoParticipant,
  WaitingRoomEntry,
} from '@/services/telemedicine/types';
import { BarChartPanel } from '@/shared/charts';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

export function SessionStatusBadge({
  status,
}: {
  status: TelemedicineSession['status'];
}) {
  const variant =
    status === 'completed'
      ? 'default'
      : status === 'in_progress'
        ? 'secondary'
        : status === 'cancelled' || status === 'no_show'
          ? 'destructive'
          : 'outline';
  return (
    <Badge variant={variant} className="capitalize">
      {status.replace('_', ' ')}
    </Badge>
  );
}

export function SessionCard({
  session,
  onJoin,
}: {
  session: TelemedicineSession;
  onJoin?: () => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm">{session.specialty}</CardTitle>
          <SessionStatusBadge status={session.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p className="font-medium">{session.clinicianName}</p>
        <p className="text-muted-foreground">
          {format(new Date(session.scheduledStart), 'EEE, MMM d · HH:mm')}
        </p>
        <p className="text-xs text-muted-foreground">
          Room {session.meetingNumber} · {session.platform}
        </p>
        {(session.status === 'scheduled' || session.status === 'waiting') &&
        onJoin ? (
          <Button size="sm" className="mt-2" onClick={onJoin}>
            <Video className="mr-1 h-3 w-3" />
            Join
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function TelemedicineMetrics({
  dashboard,
}: {
  dashboard: TelemedicineDashboard;
}) {
  const kpis = [
    { label: 'Upcoming', value: dashboard.upcomingSessions },
    { label: 'Active', value: dashboard.activeSessions },
    { label: 'Completed today', value: dashboard.completedToday },
    { label: 'Waiting room', value: dashboard.waitingRoomCount },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((k) => (
        <Card key={k.label}>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export const TelemedicineDashboardPanel = TelemedicineMetrics;

export function VideoWindow({ session }: { session: TelemedicineSession }) {
  return (
    <div className="relative aspect-video rounded-lg border bg-muted flex items-center justify-center">
      <div className="text-center space-y-2">
        <Video className="h-12 w-12 mx-auto text-muted-foreground" />
        <p className="text-sm font-medium">
          {session.clinicianName} · {session.patientName}
        </p>
        <p className="text-xs text-muted-foreground">
          {session.platform.toUpperCase()} · Quality{' '}
          {session.qualityScore ?? 85}%
        </p>
        <Badge variant="secondary" className="capitalize">
          {session.status.replace('_', ' ')}
        </Badge>
      </div>
    </div>
  );
}

export function ParticipantCard({
  participant,
}: {
  participant: VideoParticipant;
}) {
  const qualityColor =
    participant.connectionQuality === 'excellent'
      ? 'text-emerald-600'
      : participant.connectionQuality === 'poor'
        ? 'text-destructive'
        : 'text-amber-600';
  return (
    <Card>
      <CardContent className="pt-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
          {participant.name.slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{participant.name}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {participant.role}
          </p>
        </div>
        <div className="flex gap-1">
          {participant.cameraOn ? (
            <Video className="h-4 w-4" />
          ) : (
            <VideoOff className="h-4 w-4 text-muted-foreground" />
          )}
          {participant.microphoneOn ? (
            <Mic className="h-4 w-4" />
          ) : (
            <MicOff className="h-4 w-4 text-muted-foreground" />
          )}
          {participant.screenSharing ? (
            <Monitor className="h-4 w-4 text-primary" />
          ) : null}
        </div>
        <span className={cn('text-xs capitalize', qualityColor)}>
          {participant.connectionQuality}
        </span>
      </CardContent>
    </Card>
  );
}

export function ParticipantGrid({
  participants,
}: {
  participants: VideoParticipant[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {participants.map((p) => (
        <ParticipantCard key={p.id} participant={p} />
      ))}
    </div>
  );
}

export function WaitingRoomCard({
  entry,
  onAdmit,
  onReject,
}: {
  entry: WaitingRoomEntry;
  onAdmit?: () => void;
  onReject?: () => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{entry.patientName}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <p className="text-muted-foreground">
          Wait ~{entry.estimatedWaitMinutes} min
        </p>
        <Badge className="capitalize">{entry.priority}</Badge>
        {entry.status === 'waiting' && onAdmit && onReject ? (
          <div className="flex gap-2 pt-2">
            <Button size="sm" onClick={onAdmit}>
              Admit
            </Button>
            <Button size="sm" variant="outline" onClick={onReject}>
              Reject
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export const VirtualWaitingRoom = ({
  entries,
  onAdmit,
  onReject,
}: {
  entries: WaitingRoomEntry[];
  onAdmit?: (id: string) => void;
  onReject?: (id: string) => void;
}) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {entries.map((e) => (
      <WaitingRoomCard
        key={e.id}
        entry={e}
        onAdmit={onAdmit ? () => onAdmit(e.id) : undefined}
        onReject={onReject ? () => onReject(e.id) : undefined}
      />
    ))}
  </div>
);

export function ChatMessageBubble({ message }: { message: ChatMessage }) {
  return (
    <div className="rounded-lg border p-3 text-sm">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="font-medium">{message.senderName}</span>
        <span className="text-xs text-muted-foreground">
          {format(new Date(message.sentAt), 'HH:mm')}
        </span>
      </div>
      <p>{message.content}</p>
    </div>
  );
}

export function ChatPanel({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {messages.map((m) => (
        <ChatMessageBubble key={m.id} message={m} />
      ))}
    </div>
  );
}

export function TypingIndicator({ users }: { users: string[] }) {
  if (!users.length) return null;
  return (
    <p className="text-xs text-muted-foreground italic">
      {users.join(', ')} typing…
    </p>
  );
}

export function SOAPPanel({ note }: { note: ClinicalNote }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">SOAP Note</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {[
          ['S', note.subjective],
          ['O', note.objective],
          ['A', note.assessment],
          ['P', note.plan],
        ].map(([label, text]) => (
          <div key={label}>
            <p className="font-medium text-muted-foreground">{label}</p>
            <p>{text}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export const ClinicalNotesPanel = SOAPPanel;

export function RecordingPanel({ recording }: { recording: SessionRecording }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Recording</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <Badge className="capitalize">
          {recording.status.replace('_', ' ')}
        </Badge>
        {recording.durationSeconds ? (
          <p>Duration: {Math.round(recording.durationSeconds / 60)} min</p>
        ) : null}
        {recording.transcription ? (
          <p className="text-muted-foreground">{recording.transcription}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function DeviceCheckCard({ result }: { result: DeviceCheckResult }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Device Check</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-2 text-sm">
        {(['camera', 'microphone', 'speaker'] as const).map((d) => (
          <div key={d} className="text-center">
            <p className="capitalize text-muted-foreground">{d}</p>
            <Badge variant={result[d] === 'pass' ? 'default' : 'destructive'}>
              {result[d]}
            </Badge>
          </div>
        ))}
        <p className="col-span-3 text-xs text-muted-foreground pt-2">
          {result.bandwidthMbps} Mbps · {result.latencyMs}ms latency ·{' '}
          {result.packetLossPercent}% loss
        </p>
      </CardContent>
    </Card>
  );
}

export function BandwidthIndicator({
  mbps,
  latency,
}: {
  mbps: number;
  latency: number;
}) {
  const good = mbps > 5 && latency < 100;
  return (
    <div
      className={cn(
        'flex items-center gap-2 text-sm',
        good ? 'text-emerald-600' : 'text-amber-600',
      )}
    >
      {good ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
      <span>
        {mbps.toFixed(1)} Mbps · {latency}ms
      </span>
    </div>
  );
}

export const ConnectionIndicator = BandwidthIndicator;

export function ConsentCard({ onConsent }: { onConsent?: () => void }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-3">
        <p>
          By continuing, you consent to this telemedicine consultation and
          optional session recording.
        </p>
        {onConsent ? (
          <Button size="sm" onClick={onConsent}>
            I consent
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function SessionControls({
  onLeave,
  onMute,
  onVideo,
}: {
  onLeave?: () => void;
  onMute?: () => void;
  onVideo?: () => void;
}) {
  return (
    <div className="flex justify-center gap-2">
      <Button size="icon" variant="outline" onClick={onMute}>
        <Mic className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="outline" onClick={onVideo}>
        <Video className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="destructive" onClick={onLeave}>
        <PhoneOff className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function SessionHeader({ session }: { session: TelemedicineSession }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
      <div>
        <h2 className="text-lg font-semibold">{session.specialty}</h2>
        <p className="text-sm text-muted-foreground">
          {session.clinicianName} ·{' '}
          {format(new Date(session.scheduledStart), 'PPp')}
        </p>
      </div>
      <SessionStatusBadge status={session.status} />
    </div>
  );
}

export function SessionTimeline({
  entries,
}: {
  entries: SessionTimelineEntry[];
}) {
  return (
    <div className="space-y-3">
      {entries.slice(0, 15).map((e) => (
        <div key={e.id} className="border-l-2 border-primary/30 pl-4">
          <p className="text-sm font-medium">{e.title}</p>
          <p className="text-xs text-muted-foreground">{e.description}</p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(e.date), 'MMM d, HH:mm')}
          </p>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsPanel({
  analytics,
}: {
  analytics: TelemedicineAnalytics;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <BarChartPanel title="Daily sessions" data={analytics.dailySessions} />
      <BarChartPanel title="Session quality" data={analytics.sessionQuality} />
      <BarChartPanel
        title="Provider workload"
        data={analytics.providerWorkload}
      />
      <BarChartPanel title="Platform health" data={analytics.platformHealth} />
    </div>
  );
}

export function VisitSummaryCard({
  session,
}: {
  session: TelemedicineSession;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Visit Summary</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <p>
          {session.patientName} · {session.clinicianName}
        </p>
        <p className="text-muted-foreground">
          Duration: {session.duration ?? '—'} min · Quality:{' '}
          {session.qualityScore ?? '—'}%
        </p>
        {session.notes ? <p>{session.notes}</p> : null}
      </CardContent>
    </Card>
  );
}

export const ScreenSharePanel = ({ active }: { active?: boolean }) => (
  <Card>
    <CardContent className="pt-4 flex items-center gap-2 text-sm">
      <Monitor className="h-4 w-4" />
      {active ? 'Screen sharing active' : 'No active screen share'}
    </CardContent>
  </Card>
);

export const WhiteboardPanel = ({ strokeCount }: { strokeCount?: number }) => (
  <Card>
    <CardContent className="pt-4 text-sm">
      Whiteboard · {strokeCount ?? 0} strokes
    </CardContent>
  </Card>
);

export const AttachmentPanel = ({ count }: { count: number }) => (
  <Card>
    <CardContent className="pt-4 text-sm">{count} shared files</CardContent>
  </Card>
);

export const TranscriptPanel = ({ text }: { text: string }) => (
  <Card>
    <CardContent className="pt-4 text-sm text-muted-foreground whitespace-pre-wrap">
      {text}
    </CardContent>
  </Card>
);

export const ProviderAvailabilityCard = ({
  name,
  specialty,
  slots,
}: {
  name: string;
  specialty: string;
  slots: number;
}) => (
  <Card>
    <CardContent className="pt-4">
      <p className="font-medium text-sm">{name}</p>
      <p className="text-xs text-muted-foreground">
        {specialty} · {slots} slots
      </p>
    </CardContent>
  </Card>
);

export const ProviderAvailability = ({
  providers,
}: {
  providers: {
    providerName: string;
    specialty: string;
    availableSlots: unknown[];
  }[];
}) => (
  <div className="grid gap-3 sm:grid-cols-2">
    {providers.map((p) => (
      <ProviderAvailabilityCard
        key={p.providerName}
        name={p.providerName}
        specialty={p.specialty}
        slots={p.availableSlots.length}
      />
    ))}
  </div>
);
