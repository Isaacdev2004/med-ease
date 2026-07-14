import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Timeline } from "@/components/ui/timeline"
import { VitalsCard } from "@/components/medical/vitals-card"
import { MedicationCard } from "@/components/medical/medication-card"
import { EmptyState } from "@/components/ui/empty-state"
import { FileQuestion, Info, AlertTriangle, CheckCircle2 } from "lucide-react"

export default function DesignSystem() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-16 lg:px-6 z-10 sticky top-0">
        <div className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="font-serif italic text-lg font-bold leading-none">M</span>
          </div>
          <span className="text-lg text-foreground">Med'ease Design System</span>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="mx-auto max-w-6xl w-full space-y-12 motion-preset-entrance">
          
          <header className="border-b pb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Core Design System</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              The foundation for a premium enterprise healthcare platform. Calm confidence, clinical precision, and strict accessibility.
            </p>
          </header>

          <Tabs defaultValue="components" className="w-full">
          <TabsList className="mb-8 bg-muted/50 p-1">
            <TabsTrigger value="components" className="px-6">Base Components</TabsTrigger>
            <TabsTrigger value="medical" className="px-6">Medical Primitives</TabsTrigger>
            <TabsTrigger value="states" className="px-6">States & Alerts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="components" className="space-y-12">
            {/* Buttons */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Buttons</h2>
              <div className="flex flex-wrap gap-4 items-center p-6 border rounded-xl bg-card">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
                <Button disabled>Disabled</Button>
              </div>
            </section>

            {/* Badges */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Badges & Status</h2>
              <div className="flex flex-wrap gap-4 items-center p-6 border rounded-xl bg-card">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="success">Success / Normal</Badge>
                <Badge variant="warning">Warning / Elevated</Badge>
                <Badge variant="info">Info / Pending</Badge>
                <Badge variant="destructive">Critical / Danger</Badge>
              </div>
            </section>

            {/* Inputs */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Form Controls</h2>
              <div className="grid md:grid-cols-2 gap-8 p-6 border rounded-xl bg-card">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ds-input">Standard Input</Label>
                    <Input id="ds-input" placeholder="Enter text..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ds-disabled">Disabled Input</Label>
                    <Input id="ds-disabled" disabled placeholder="Not allowed..." />
                  </div>
                </div>
                <div className="space-y-4 flex flex-col justify-center border-l pl-8">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="c1" className="h-4 w-4 rounded-sm border-primary text-primary" defaultChecked />
                    <Label htmlFor="c1">Checked Option</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="r1" className="h-4 w-4 border-primary text-primary" defaultChecked />
                    <Label htmlFor="r1">Selected Radio</Label>
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="medical" className="space-y-12">
            {/* Vitals */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Vital Signs</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <VitalsCard type="heartRate" value={72} unit="bpm" status="normal" timeago="10m ago" />
                <VitalsCard type="bloodPressure" value="120/80" unit="mmHg" status="warning" timeago="1h ago" />
                <VitalsCard type="temperature" value={101.2} unit="°F" status="critical" timeago="Just now" />
              </div>
            </section>

            {/* Medications */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Medication Cards</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <MedicationCard 
                  name="Atorvastatin" 
                  dosage="20mg" 
                  frequency="1 pill daily at bedtime" 
                  prescribedBy="Emily Chen"
                  status="active"
                  nextDose="Tonight at 10:00 PM"
                  refillsRemaining={3}
                  instructions="Take with a full glass of water. Do not eat grapefruit."
                />
                <MedicationCard 
                  name="Amoxicillin" 
                  dosage="500mg" 
                  frequency="3 times daily" 
                  prescribedBy="Marcus Thorne"
                  status="completed"
                  instructions="Finish all medication even if feeling better."
                />
              </div>
            </section>

            {/* Care Journey Timeline */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Care Journey Timeline</h2>
              <div className="p-8 border rounded-xl bg-card">
                <Timeline items={[
                  { id: "1", title: "Initial Consultation", description: "Met with Dr. Chen regarding chest pain.", date: "Oct 12, 2023", status: "completed" },
                  { id: "2", title: "ECG Test Performed", description: "Results sent to cardiology department.", date: "Oct 14, 2023", status: "completed" },
                  { id: "3", title: "Awaiting Lab Results", description: "Comprehensive metabolic panel processing.", date: "Today", status: "current" },
                  { id: "4", title: "Follow-up Appointment", description: "Discuss results and treatment plan.", date: "Oct 28, 2023", status: "upcoming" }
                ]} />
              </div>
            </section>
          </TabsContent>

          <TabsContent value="states" className="space-y-12">
            {/* Alerts */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Alerts & Banners</h2>
              <div className="grid gap-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Information</AlertTitle>
                  <AlertDescription>Your records have been successfully updated.</AlertDescription>
                </Alert>
                <Alert variant="success">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>Prescription refill approved and sent to pharmacy.</AlertDescription>
                </Alert>
                <Alert variant="warning">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>Patient allergies have not been verified in the last 6 months.</AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Critical Interaction Alert</AlertTitle>
                  <AlertDescription>Proposed medication conflicts with currently active Lisinopril prescription.</AlertDescription>
                </Alert>
              </div>
            </section>

            {/* Empty States */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Empty States</h2>
              <EmptyState 
                icon={FileQuestion}
                title="No active medications"
                description="There are currently no active prescriptions on file for this patient. Any new prescriptions will appear here."
                action={<Button>Add Medication</Button>}
              />
            </section>
          </TabsContent>
        </Tabs>
      </div>
      </main>
    </div>
  )
}