import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield } from "lucide-react"

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 py-12">
      <div className="w-full max-w-xl bg-card rounded-2xl border shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="h-2 w-full bg-primary" />
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
              <span className="font-serif italic text-2xl font-bold leading-none">M</span>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Create your account</h1>
            <p className="text-sm text-muted-foreground mt-2">Join the secure healthcare network.</p>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Jane" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" className="h-11" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="name@example.com" className="h-11" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">I am registering as a...</Label>
              <select id="role" className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option value="patient">Patient</option>
                <option value="professional">Healthcare Professional</option>
                <option value="facility">Facility Administrator</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" className="h-11" />
              <p className="text-xs text-muted-foreground">Must be at least 12 characters and include a special character.</p>
            </div>

            <Button className="w-full h-11 text-base shadow-md" type="button" asChild>
              <Link href="/patient">Complete Registration</Link>
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t flex flex-col items-center justify-center gap-4">
            <div className="flex items-center text-xs text-muted-foreground font-medium bg-muted px-3 py-1.5 rounded-full">
              <Shield className="w-3.5 h-3.5 mr-1.5 text-primary" />
              Your data is encrypted end-to-end
            </div>
            
            <p className="text-sm text-center text-muted-foreground">
              Already have an account? <Link href="/login" className="text-primary font-medium hover:underline">Sign in instead</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}