import { Link } from "wouter"
import { Activity, ShieldCheck, Clock, Users, ArrowRight, ChevronRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2 font-semibold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="font-serif italic text-lg font-bold leading-none">M</span>
              </div>
              <span className="text-xl tracking-tight text-foreground">Med'ease</span>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Platform</a>
              <a href="#solutions" className="hover:text-foreground transition-colors">Solutions</a>
              <a href="#security" className="hover:text-foreground transition-colors">Security</a>
              <Link href="/design-system" className="text-primary hover:text-primary/80 transition-colors">Design System</Link>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium mb-8 bg-muted/50 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Now connecting over 500+ healthcare facilities
          </div>
          
          <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-foreground sm:text-7xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Healthcare coordination, <br className="hidden sm:block"/>
            <span className="text-primary">finally synchronized.</span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            The premium enterprise platform bridging hospitals, professionals, pharmacies, transport, and patients into a single, cohesive ecosystem.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base shadow-lg" asChild>
              <Link href="/register">
                Request Enterprise Demo <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base" asChild>
              <Link href="/login">Patient Portal Login</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="border-y bg-muted/30 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8">Trusted by leading healthcare networks</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale mix-blend-multiply dark:mix-blend-screen dark:opacity-40">
            {/* Logos represented by text for simplicity */}
            <h3 className="text-xl font-bold font-serif italic">Mount Sinai</h3>
            <h3 className="text-xl font-bold">Mayo Clinic</h3>
            <h3 className="text-xl font-bold tracking-tighter">NYU Langone</h3>
            <h3 className="text-xl font-bold uppercase tracking-widest">Kaiser</h3>
          </div>
        </div>
      </section>

      {/* Unified Portals Section */}
      <section id="solutions" className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">One platform. Every role.</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Med'ease provides tailored, secure environments for every participant in the care journey, sharing a unified data model.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { role: "Patients", desc: "Access records, book appointments, and manage medications with calm clarity.", path: "/patient" },
              { role: "Professionals", desc: "Manage schedules, review charts, and communicate securely without friction.", path: "/professional" },
              { role: "Facilities", desc: "Monitor bed capacity, staff allocation, and operational analytics in real-time.", path: "/facility" },
              { role: "Pharmacies", desc: "Process prescriptions, track inventory, and flag interactions automatically.", path: "/pharmacy" },
              { role: "Medical Transport", desc: "Live-track fleet logistics and emergency dispatches with precision.", path: "/transport" },
              { role: "Administrators", desc: "Control permissions, audit logs, and system health from a central command.", path: "/admin" },
            ].map((item, i) => (
              <Link key={i} href={item.path}>
                <div className="group relative rounded-2xl border bg-card p-8 hover-elevate transition-all cursor-pointer h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">{item.role}</h3>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed flex-1">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Clinical Precision Feature */}
      <section className="py-24 md:py-32 bg-sidebar border-y">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
                <Activity className="h-4 w-4 mr-2" /> Clinical Grade
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                Designed for clinical precision. Built for human care.
              </h2>
              <div className="space-y-6">
                {[
                  "Zero-latency data synchronization across all modules",
                  "Strict adherence to WCAG 2.2 AA accessibility standards",
                  "Minimalist interface reduces cognitive load during critical tasks",
                  "Automated triage flagging for abnormal results"
                ].map((text, i) => (
                  <div key={i} className="flex">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mr-4" />
                    <p className="text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              {/* Abstract UI representation */}
              <div className="aspect-square md:aspect-[4/3] rounded-2xl border bg-background shadow-2xl overflow-hidden relative">
                 <div className="absolute top-0 w-full h-12 border-b bg-muted/50 flex items-center px-4 gap-2">
                   <div className="h-3 w-3 rounded-full bg-red-400"></div>
                   <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                   <div className="h-3 w-3 rounded-full bg-green-400"></div>
                 </div>
                 <div className="p-8 pt-20 grid gap-4">
                   <div className="h-8 w-1/3 rounded bg-muted animate-pulse"></div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="h-32 rounded-xl border bg-card p-4">
                        <div className="h-4 w-1/2 rounded bg-muted mb-4"></div>
                        <div className="h-10 w-3/4 rounded bg-primary/20 mb-2"></div>
                     </div>
                     <div className="h-32 rounded-xl border bg-card p-4">
                        <div className="h-4 w-1/2 rounded bg-muted mb-4"></div>
                        <div className="h-10 w-3/4 rounded bg-primary/20 mb-2"></div>
                     </div>
                   </div>
                   <div className="h-24 w-full rounded-xl border bg-card"></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-12 border-t">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
             <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
               <span className="font-serif italic text-xs font-bold leading-none">M</span>
             </div>
             <span className="font-semibold">Med'ease</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            The foundation for modern healthcare coordination.
          </p>
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} Med'ease Platform. All rights reserved. HIPAA Compliant. SOC2 Type II Certified.
          </p>
        </div>
      </footer>
    </div>
  )
}