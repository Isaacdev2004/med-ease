import { Ambulance, Map, CalendarClock, Settings, Activity } from "lucide-react"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Placeholder } from "@/components/ui/placeholder"

const transportNav = [
  { icon: Activity, label: "Live Dispatch", href: "/transport" },
  { icon: Map, label: "Routes & Tracking", href: "/transport/tracking" },
  { icon: CalendarClock, label: "Scheduled Transfers", href: "/transport/scheduled" },
  { icon: Ambulance, label: "Fleet Status", href: "/transport/fleet" },
  { icon: Settings, label: "Operations", href: "/transport/operations" },
]

export default function TransportPortal() {
  return (
    <DashboardShell sidebarItems={transportNav} roleName="Medical Transport" userName="Dispatch Unit A">
      <div className="space-y-6 motion-preset-entrance">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Active Dispatch Board</h1>
          <Button variant="destructive">Initiate Emergency Override</Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="col-span-full lg:col-span-2">
            <Card className="flex flex-col h-full overflow-hidden">
              <CardHeader className="bg-background z-10 border-b">
                <CardTitle>Live Unit Tracking</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex p-0 min-h-80 lg:min-h-96">
                <Placeholder 
                  icon={Map} 
                  title="Live Unit Tracking" 
                  description="Live GPS map view unavailable in demo mode." 
                  className="flex-1 border-0 rounded-none bg-muted/10"
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Runs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-3 hover:border-primary transition-colors cursor-pointer bg-primary/5 border-primary/20">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className="bg-primary text-primary-foreground">Medic 12</Badge>
                    <span className="text-xs font-bold text-destructive animate-pulse">En Route - P1</span>
                  </div>
                  <p className="text-sm font-medium">Cardiac Arrest (Code 3)</p>
                  <p className="text-xs text-muted-foreground mt-1">Dest: Mount Sinai ER</p>
                  <div className="mt-3 pt-2 border-t text-xs flex justify-between">
                    <span>ETA: 4 mins</span>
                    <span className="font-mono">Unit: ALS</span>
                  </div>
                </div>

                <div className="border rounded-lg p-3 hover:border-primary transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">Medic 04</Badge>
                    <span className="text-xs font-medium text-muted-foreground">Returning</span>
                  </div>
                  <p className="text-sm font-medium">Inter-facility Transfer (P3)</p>
                  <p className="text-xs text-muted-foreground mt-1">Dest: Base Station</p>
                  <div className="mt-3 pt-2 border-t text-xs flex justify-between">
                    <span>ETA: 12 mins</span>
                    <span className="font-mono">Unit: BLS</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}