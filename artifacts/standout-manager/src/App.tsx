import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import NotFound from "@/pages/not-found";
import Landing from "@/pages/public/Landing";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Onboarding from "@/pages/app/Onboarding";
import Dashboard from "@/pages/app/Dashboard";
import Scenarios from "@/pages/app/Scenarios";
import ScenarioDetail from "@/pages/app/ScenarioDetail";
import Systems from "@/pages/app/Systems";
import Coach from "@/pages/app/Coach";
import Journey from "@/pages/app/Journey";
import Assess from "@/pages/app/Assess";
import BrandLab from "@/pages/app/BrandLab";
import SystemDetail from "@/pages/app/SystemDetail";
import ManagementReadiness from "@/pages/app/ManagementReadiness";

// Layout
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/use-auth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center text-primary">Loading secure workspace...</div>;
  
  if (!isAuthenticated) {
    return <Redirect to="/auth/login" />;
  }
  
  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Landing} />
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/register" component={Register} />
      
      {/* Semi-Protected */}
      <Route path="/onboarding">
        {() => <ProtectedRoute component={Onboarding} />}
      </Route>

      {/* Protected App Routes */}
      <Route path="/dashboard">
        {() => <ProtectedRoute component={() => <AppLayout><Dashboard /></AppLayout>} />}
      </Route>
      <Route path="/assess">
        {() => <ProtectedRoute component={() => <AppLayout><Assess /></AppLayout>} />}
      </Route>
      <Route path="/scenarios">
        {() => <ProtectedRoute component={() => <AppLayout><Scenarios /></AppLayout>} />}
      </Route>
      <Route path="/scenarios/:id">
        {() => <ProtectedRoute component={() => <AppLayout><ScenarioDetail /></AppLayout>} />}
      </Route>
      <Route path="/systems">
        {() => <ProtectedRoute component={() => <AppLayout><Systems /></AppLayout>} />}
      </Route>
      <Route path="/systems/:id">
        {() => <ProtectedRoute component={() => <AppLayout><SystemDetail /></AppLayout>} />}
      </Route>
      <Route path="/coach">
        {() => <ProtectedRoute component={() => <AppLayout><Coach /></AppLayout>} />}
      </Route>
      <Route path="/journey">
        {() => <ProtectedRoute component={() => <AppLayout><Journey /></AppLayout>} />}
      </Route>
      <Route path="/assess/management-readiness">
        {() => <ProtectedRoute component={() => <AppLayout><ManagementReadiness /></AppLayout>} />}
      </Route>
      <Route path="/brand-lab">
        {() => <ProtectedRoute component={() => <AppLayout><BrandLab /></AppLayout>} />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
