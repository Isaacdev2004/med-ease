import { Link, useLocation } from "wouter"
import { Bell, Search, Menu, User, Settings, LogOut, Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface SidebarItem {
  icon: React.ElementType
  label: string
  href: string
}

interface DashboardShellProps {
  children: React.ReactNode
  sidebarItems: SidebarItem[]
  roleName: string
  userName: string
}

export function DashboardShell({ children, sidebarItems, roleName, userName }: DashboardShellProps) {
  const [location, setLocation] = useLocation()
  const { setTheme } = useTheme()
  const initials = userName.split(' ').map(n => n[0]).join('').substring(0, 2)

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-sidebar md:flex">
        <div className="flex h-14 items-center border-b px-4 lg:h-16">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="font-serif italic text-lg font-bold leading-none">M</span>
            </div>
            <span className="text-lg text-sidebar-foreground">Med'ease</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <div className="px-4 mb-6">
            <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">
              {roleName} Portal
            </p>
          </div>
          <nav className="grid items-start px-2 text-sm font-medium space-y-1">
            {sidebarItems.map((item) => {
              const isActive = location === item.href || location.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 transition-all hover:text-sidebar-accent-foreground hover:bg-sidebar-accent",
                    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold" : "text-sidebar-foreground/70"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-sidebar-foreground/50")} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
          {/* Quick role switcher for demo purposes */}
          <div className="text-xs mb-2 text-sidebar-foreground/50 font-medium">Demo Role Switcher:</div>
          <select 
            className="w-full text-xs bg-sidebar-accent border-sidebar-border rounded p-1 mb-4"
            onChange={(e) => setLocation(e.target.value)}
            value={location.split('/')[1] ? `/${location.split('/')[1]}` : '/patient'}
          >
            <option value="/patient">Patient</option>
            <option value="/professional">Professional</option>
            <option value="/facility">Facility</option>
            <option value="/pharmacy">Pharmacy</option>
            <option value="/transport">Transport</option>
            <option value="/admin">Admin</option>
          </select>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-16 lg:px-6 z-10">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
          <div className="w-full flex-1">
            <form className="hidden sm:block max-w-sm relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search everywhere..."
                className="w-full appearance-none bg-background pl-8 shadow-none h-9"
              />
            </form>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive border-2 border-background" />
                <span className="sr-only">Toggle notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-4 text-center text-sm text-muted-foreground">
                No new notifications
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full ml-1" aria-label="User profile menu">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {roleName} Account
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Sun className="mr-2 h-4 w-4 dark:hidden" />
                  <Moon className="mr-2 h-4 w-4 hidden dark:block" />
                  <span>Theme</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      <Sun className="mr-2 h-4 w-4" />
                      <span>Light</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Dark</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      <Monitor className="mr-2 h-4 w-4" />
                      <span>System</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground" onClick={() => setLocation("/")}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="mx-auto max-w-6xl w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
