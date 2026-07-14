import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield } from "lucide-react"

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md bg-card rounded-2xl border shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="h-2 w-full bg-primary" />
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
              <span className="font-serif italic text-2xl font-bold leading-none">M</span>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome to Med'ease</h1>
            <p className="text-sm text-muted-foreground mt-2">Secure access to the enterprise healthcare network.</p>
          </div>

          <form className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address or ID</Label>
              <Input id="email" type="email" placeholder="name@example.com" className="h-11" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input id="password" type="password" className="h-11" />
            </div>
            
            <div className="flex items-center space-x-2 pt-1 pb-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">Remember this device for 30 days</Label>
            </div>

            <Button className="w-full h-11 text-base shadow-md" type="button" asChild>
              <Link href="/patient">Sign In Securely</Link>
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t flex flex-col items-center justify-center gap-4">
            <div className="flex items-center text-xs text-muted-foreground font-medium bg-muted px-3 py-1.5 rounded-full">
              <Shield className="w-3.5 h-3.5 mr-1.5 text-primary" />
              HIPAA Compliant Secure Portal
            </div>
            
            <p className="text-sm text-center text-muted-foreground">
              New to Med'ease? <Link href="/register" className="text-primary font-medium hover:underline">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}