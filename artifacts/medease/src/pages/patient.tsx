import { Activity, Calendar, FileText, Heart, Home, Inbox, MessageSquare, Pill } from "lucide-react"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const patientNav = [
  { icon: Home, label: "Overview", href: "/patient" },
  { icon: Calendar, label: "Appointments", href: "/patient/appointments" },
  { icon: FileText, label: "Health Records", href: "/patient/records" },
  { icon: Pill, label: "Medications", href: "/patient/medications" },
  { icon: MessageSquare, label: "Messages", href: "/patient/messages" },
  { icon: Activity, label: "Care Journey", href: "/patient/journey" },
]

export default function PatientPortal() {
  return (
    <DashboardShell sidebarItems={patientNav} roleName="Patient" userName="Sarah Jenkins">
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, Sarah.</h1>
            <p className="text-muted-foreground mt-1">Here's your health summary for today.</p>
          </div>
          <Button>Book Appointment</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-full lg:col-span-2 bg-primary text-primary-foreground overflow-hidden relative">
            <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
              <Heart className="w-64 h-64 -mt-10 -mr-10" />
            </div>
            <CardHeader>
              <CardTitle className="text-primary-foreground">Next Appointment</CardTitle>
              <CardDescription className="text-primary-foreground/80">Dr. Emily Chen • Cardiology</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">Tomorrow, 10:00 AM</div>
              <p className="text-primary-foreground/90 mb-6">Mount Sinai Main Campus, Room 402</p>
              <div className="flex gap-3">
                <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">Prepare for visit</Button>
                <Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">Reschedule</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Test Results</CardTitle>
              <CardDescription>Comprehensive Metabolic Panel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg text-muted-foreground bg-muted/30">
                Chart Placeholder
              </div>
              <Button variant="link" className="px-0 mt-4 h-auto w-full justify-start text-primary">View full report &rarr;</Button>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-xl font-semibold mt-10 mb-4 tracking-tight">Active Medications</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
           <Card className="hover-elevate">
              <CardContent className="p-5 flex gap-4">
                <div className="bg-primary/10 p-3 rounded-full h-12 w-12 flex items-center justify-center">
                  <Pill className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Atorvastatin</h4>
                  <p className="text-sm text-muted-foreground">20mg • Take 1 pill daily at bedtime</p>
                  <p className="text-xs font-medium text-green-600 mt-2">12 refills remaining</p>
                </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </DashboardShell>
  )
}