import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import CareerGuide from "@/pages/CareerGuide";
import CareerRoadmap from "@/pages/CareerRoadmap";
import Courses from "@/pages/Courses";
import Projects from "@/pages/Projects";
import Community from "@/pages/Community";
import ResumeBuilder from "@/pages/ResumeBuilder";
import SoftSkills from "@/pages/SoftSkills";
import Achievements from "@/pages/Achievements";
import Settings from "@/pages/Settings";
import HowItWorks from "@/pages/HowItWorks";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import LandingPage from "@/pages/LandingPage";
import AICareerCoachPage from "@/pages/AICareerCoach";
import { AuthProvider } from "@/hooks/use-auth-context";
import { LearningModeProvider } from "@/hooks/use-learning-mode";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/career-guide">
        <ProtectedRoute>
          <CareerGuide />
        </ProtectedRoute>
      </Route>
      <Route path="/career-roadmap">
        <ProtectedRoute>
          <CareerRoadmap />
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
      <Route path="/settings">
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      </Route>
      <Route path="/ai-career-coach">
        <ProtectedRoute>
          <AICareerCoachPage />
        </ProtectedRoute>
      </Route>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LearningModeProvider>
          <Router />
          <Toaster />
        </LearningModeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
