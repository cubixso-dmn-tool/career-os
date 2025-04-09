import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import CareerGuide from "@/pages/CareerGuide";
import Courses from "@/pages/Courses";
import CourseDetailPage from "@/pages/CourseDetailPage";
import Projects from "@/pages/Projects";
import Community from "@/pages/Community";
import ResumeBuilder from "@/pages/ResumeBuilder";
import SoftSkills from "@/pages/SoftSkills";
import Achievements from "@/pages/Achievements";
import HowItWorks from "@/pages/HowItWorks";
import AuthPage from "@/pages/auth-page";
import LandingPage from "@/pages/LandingPage";
import Communities from "@/pages/Communities";
import CommunityDetail from "@/pages/CommunityDetail";
import CommunityManagement from "@/pages/CommunityManagement";
import { SidebarProvider } from "@/hooks/use-sidebar";
import { AuthProvider } from "@/hooks/use-auth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { DashboardProvider } from "@/hooks/useDashboardContext";

function Router() {
  return (
    <Switch>
      {/* Authentication Routes - Should come first since they're public */}
      <Route path="/login" component={AuthPage} />
      <Route path="/register" component={AuthPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/how-it-works" component={HowItWorks} />
      
      {/* Specific Dashboard Routes - More specific routes first */}
      <Route path="/dashboard/courses/:id">
        <ProtectedRoute>
          <CourseDetailPage />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/courses">
        <ProtectedRoute>
          <DashboardLayout>
            <Courses />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/projects">
        <ProtectedRoute>
          <DashboardLayout>
            <Projects />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/skills">
        <ProtectedRoute>
          <DashboardLayout>
            <SoftSkills />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/communities">
        <ProtectedRoute>
          <DashboardLayout>
            <Communities />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/resume">
        <ProtectedRoute>
          <DashboardLayout>
            <ResumeBuilder />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/achievements">
        <ProtectedRoute>
          <DashboardLayout>
            <Achievements />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/career">
        <ProtectedRoute>
          <DashboardLayout>
            <CareerGuide />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/settings">
        <ProtectedRoute>
          <DashboardLayout>
            <div className="p-6 bg-white rounded-lg border">
              <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
              <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      
      {/* Main Dashboard Route */}
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      
      {/* Community Routes */}
      <Route path="/communities/:id/manage">
        <ProtectedRoute requiredRole="community_founder">
          <CommunityManagement />
        </ProtectedRoute>
      </Route>
      <Route path="/communities/:id" component={CommunityDetail} />
      <Route path="/communities" component={Communities} />
      
      {/* Legacy routes */}
      <Route path="/career-guide">
        <ProtectedRoute>
          <CareerGuide />
        </ProtectedRoute>
      </Route>
      <Route path="/courses">
        <ProtectedRoute>
          <Courses />
        </ProtectedRoute>
      </Route>
      <Route path="/projects">
        <ProtectedRoute>
          <Projects />
        </ProtectedRoute>
      </Route>
      <Route path="/community">
        <ProtectedRoute>
          <Community />
        </ProtectedRoute>
      </Route>
      <Route path="/resume-builder">
        <ProtectedRoute>
          <ResumeBuilder />
        </ProtectedRoute>
      </Route>
      <Route path="/soft-skills">
        <ProtectedRoute>
          <SoftSkills />
        </ProtectedRoute>
      </Route>
      <Route path="/achievements">
        <ProtectedRoute>
          <Achievements />
        </ProtectedRoute>
      </Route>
      
      {/* Landing page and fallback route */}
      <Route path="/" component={LandingPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SidebarProvider>
          <DashboardProvider>
            <Router />
            <Toaster />
          </DashboardProvider>
        </SidebarProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
