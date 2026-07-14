import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, ArrowLeft } from "lucide-react"

export default function ForgotPassword() {
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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Reset Password</h1>
            <p className="text-sm text-muted-foreground mt-2">Enter your email address and we'll send you a link to reset your password securely.</p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="name@example.com" className="h-11" />
            </div>

            <Button className="w-full h-11 text-base shadow-md" type="button" asChild>
              <Link href="/login">Send Reset Link</Link>
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t flex flex-col items-center justify-center gap-4">
            <Link href="/login" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to login
            </Link>
            
            <div className="flex items-center text-xs text-muted-foreground font-medium bg-muted px-3 py-1.5 rounded-full mt-2">
              <Shield className="w-3.5 h-3.5 mr-1.5 text-primary" />
              Secure Account Recovery
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}