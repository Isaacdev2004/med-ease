import { Shield, Users, ActivitySquare, Database, Settings } from "lucide-react"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const adminNav = [
  { icon: ActivitySquare, label: "System Health", href: "/admin" },
  { icon: Users, label: "User Management", href: "/admin/users" },
  { icon: Shield, label: "Roles & Permissions", href: "/admin/roles" },
  { icon: Database, label: "Audit Logs", href: "/admin/logs" },
  { icon: Settings, label: "Platform Settings", href: "/admin/settings" },
]

export default function AdminPortal() {
  return (
    <DashboardShell sidebarItems={adminNav} roleName="Platform Admin" userName="System Administrator">
      <div className="space-y-6 motion-preset-entrance">
        <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14,231</div>
              <p className="text-xs text-muted-foreground">+180 this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Latency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42ms</div>
              <p className="text-xs text-green-600 font-medium">Normal</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Logins (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">-14% from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12/12</div>
              <p className="text-xs text-green-600 font-medium">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center border-b pb-4">
            <div>
              <CardTitle>Recent User Provisioning</CardTitle>
              <CardDescription>Latest accounts created across the platform.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
               <Input placeholder="Search users..." className="w-64 h-9" />
               <Button size="sm">Add User</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Facility</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { name: "Dr. Sarah Miller", email: "smiller@hospital.org", role: "Physician", facility: "Mount Sinai", status: "Active", date: "2 mins ago" },
                  { name: "James Wilson", email: "jwilson@medease.patient", role: "Patient", facility: "N/A", status: "Pending Verification", date: "1 hour ago" },
                  { name: "Unit B Dispatch", email: "dispatch_b@emstransport.com", role: "Transport", facility: "City EMS", status: "Active", date: "3 hours ago" },
                  { name: "Elena Rodriguez", email: "erodriguez@rx.com", role: "Pharmacist", facility: "Community Care Rx", status: "Locked", date: "1 day ago" },
                ].map((user, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell className="text-muted-foreground">{user.facility}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === "Active" ? "success" : user.status === "Locked" ? "destructive" : "secondary"}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{user.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}