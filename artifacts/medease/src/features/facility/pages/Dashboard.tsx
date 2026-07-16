import { AlertTriangle, LayoutDashboard } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Placeholder } from '@/shared/ui/placeholder';

export default function Dashboard() {
  return (
    <div className="space-y-6 motion-preset-entrance">
      <h1 className="text-3xl font-bold tracking-tight">Facility Operations Control</h1>

      <Alert variant="warning" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Capacity Warning</AlertTitle>
        <AlertDescription>
          ICU Ward B is currently operating at 92% capacity. Consider diverting non-critical scheduled admissions.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bed Occupancy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84.2%</div>
            <p className="text-xs text-muted-foreground">+2.1% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">3 call-outs pending cover</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ER Wait Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42 min</div>
            <p className="text-xs text-success font-medium">-15 min vs average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 inbound, 5 outbound</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <Card className="lg:col-span-4 flex flex-col">
          <CardHeader>
            <CardTitle>Department Load Tracking</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex min-h-80 lg:min-h-96">
            <Placeholder
              icon={LayoutDashboard}
              title="Live Capacity Chart"
              description="Live department tracking unavailable in demo mode."
              className="flex-1"
            />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Critical Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 border-l-2 border-muted ml-3">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="relative pl-6 pb-4 last:pb-0">
                  <span className="absolute left-[-5px] top-1 h-2 w-2 rounded-full bg-primary ring-4 ring-background" />
                  <p className="text-sm font-medium leading-none mb-1">Code Blue - Room 402</p>
                  <p className="text-xs text-muted-foreground">Resolved • 14 mins ago</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
