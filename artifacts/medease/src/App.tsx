import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from 'next-themes';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import NotFound from '@/pages/not-found';
import Landing from '@/pages/landing';
import Login from '@/pages/login';
import Register from '@/pages/register';
import ForgotPassword from '@/pages/forgot-password';
import PatientPortal from '@/pages/patient';
import ProfessionalPortal from '@/pages/professional';
import FacilityPortal from '@/pages/facility';
import PharmacyPortal from '@/pages/pharmacy';
import TransportPortal from '@/pages/transport';
import AdminPortal from '@/pages/admin';
import DesignSystem from '@/pages/design-system';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      
      {/* Portals - These route paths act as the base for the role shell */}
      {/* In a real app, you'd use nested routing here for the sub-pages */}
      <Route path="/patient" component={PatientPortal} />
      <Route path="/professional" component={ProfessionalPortal} />
      <Route path="/facility" component={FacilityPortal} />
      <Route path="/pharmacy" component={PharmacyPortal} />
      <Route path="/transport" component={TransportPortal} />
      <Route path="/admin" component={AdminPortal} />
      
      {/* Developer / Internal */}
      <Route path="/design-system" component={DesignSystem} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;