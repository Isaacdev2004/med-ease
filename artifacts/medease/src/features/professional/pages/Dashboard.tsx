import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export default function Dashboard() {
  return (
    <div className="space-y-6 motion-preset-entrance">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Today's Schedule
          </h1>
          <p className="text-muted-foreground mt-1">
            Tuesday, October 24th • 8 Appointments, 3 Pending Approvals
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Print Roster</Button>
          <Button>Start Rounds</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">
            Upcoming Consultations
          </h2>

          {[
            {
              time: '10:00 AM',
              patient: 'Sarah Jenkins',
              type: 'Follow-up',
              status: 'Checked In',
              condition: 'Post-op Cardiac',
            },
            {
              time: '10:30 AM',
              patient: 'Marcus Thorne',
              type: 'Initial Consult',
              status: 'Waiting',
              condition: 'Arrhythmia Evaluation',
            },
            {
              time: '11:15 AM',
              patient: 'Elena Rodriguez',
              type: 'Review',
              status: 'Expected',
              condition: 'Hypertension Management',
            },
          ].map((apt, i) => (
            <Card key={i} className="hover-elevate transition-all duration-300">
              <CardContent className="p-0 flex flex-col sm:flex-row">
                <div className="bg-muted p-4 flex flex-row sm:flex-col items-center justify-center min-w-24 sm:min-w-28 border-b sm:border-b-0 sm:border-r border-border">
                  <span className="font-bold text-lg mr-2 sm:mr-0">
                    {apt.time.split(' ')[0]}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium uppercase">
                    {apt.time.split(' ')[1]}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {apt.patient
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-base">{apt.patient}</h4>
                      <p className="text-sm text-muted-foreground">
                        {apt.condition} • {apt.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col sm:items-end justify-between items-center gap-2">
                    <Badge
                      variant={
                        apt.status === 'Checked In'
                          ? 'success'
                          : apt.status === 'Waiting'
                            ? 'warning'
                            : 'secondary'
                      }
                    >
                      {apt.status}
                    </Badge>
                    <Button size="sm" variant="ghost" className="h-8">
                      Review Chart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Urgent Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="h-2 w-2 mt-2 rounded-full bg-destructive" />
                <div>
                  <p className="text-sm font-medium">
                    Approve Prescription Refill
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Lisinopril 10mg - J. Doe
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-2 w-2 mt-2 rounded-full bg-warning" />
                <div>
                  <p className="text-sm font-medium">Review Lab Results</p>
                  <p className="text-xs text-muted-foreground">
                    Lipid Panel - M. Smith (High alert)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
