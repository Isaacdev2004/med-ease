import { Pill, Box, RefreshCw, AlertCircle, FileText } from "lucide-react"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const pharmacyNav = [
  { icon: FileText, label: "Queue", href: "/pharmacy" },
  { icon: Box, label: "Inventory", href: "/pharmacy/inventory" },
  { icon: AlertCircle, label: "Interactions", href: "/pharmacy/interactions" },
  { icon: RefreshCw, label: "Refill Requests", href: "/pharmacy/refills" },
]

export default function PharmacyPortal() {
  return (
    <DashboardShell sidebarItems={pharmacyNav} roleName="Pharmacy Dispensing" userName="David Chen, PharmD">
      <div className="space-y-6 motion-preset-entrance">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Dispensing Queue</h1>
          <div className="flex items-center gap-2">
            <Input placeholder="Scan barcode or Rx #..." className="w-64 bg-background" />
            <Button>Lookup</Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-primary-foreground/90 text-sm font-medium">To Fill</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">24</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">To Verify (RPh)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground">12</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">Ready for Pickup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground">56</div>
            </CardContent>
          </Card>
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-destructive text-sm font-medium flex items-center gap-2">
                Exceptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-destructive">3</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Priority Fulfillment</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {[
                { rx: "RX-88349", patient: "Johnson, A.", drug: "Amoxicillin 500mg Cap", type: "Antibiotic", status: "Filling", time: "10 mins" },
                { rx: "RX-88350", patient: "Smith, B.", drug: "Lisinopril 20mg Tab", type: "Maintenance", status: "Pending Verification", time: "25 mins" },
                { rx: "RX-88351", patient: "Williams, C.", drug: "Oxycodone-Acetaminophen 5-325mg", type: "Controlled (CII)", status: "Needs RPh Review", time: "40 mins" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-muted p-3 rounded-lg flex-shrink-0">
                      <Pill className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-muted-foreground">{item.rx}</span>
                        {item.type.includes('CII') && <Badge variant="destructive" className="h-5 px-1.5 text-xs">CII</Badge>}
                      </div>
                      <h4 className="font-semibold">{item.drug}</h4>
                      <p className="text-sm text-muted-foreground">Patient: {item.patient}</p>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 flex sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto justify-between">
                    <Badge variant="outline">{item.status}</Badge>
                    <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <RefreshCw className="h-3 w-3" /> Waiting {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}