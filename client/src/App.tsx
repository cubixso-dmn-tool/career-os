import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import DashboardRouter, { StudentDashboard, MentorDashboard, AdminDashboard } from "@/pages/DashboardRouter";
import ModeratorDashboard from "@/pages/ModeratorDashboard";
import CareerGuide from "@/pages/CareerGuide";
import CareerRoadmap from "@/pages/CareerRoadmap";
import Learning from "@/pages/Learning";
import CommunityHub from "@/pages/CommunityHub";
import ResumeBuilder from "@/pages/ResumeBuilder";
import SoftSkills from "@/pages/SoftSkills";
import Achievements from "@/pages/Achievements";
import Settings from "@/pages/Settings";
import HowItWorks from "@/pages/HowItWorks";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import LandingPage from "@/pages/LandingPage";
import AICareerCoachPage from "@/pages/AICareerCoach";
import IndustryExpertNetworkPage from "@/pages/IndustryExpertNetwork";
import MentorJourney from "@/pages/MentorJourney";
import AdminUserManagement from "@/pages/AdminUserManagement";
import AdminAnalytics from "@/pages/AdminAnalytics";
import AdminContentManagement from "@/pages/AdminContentManagement";
import AdminModeration from "@/pages/AdminModeration";
import AdminExpertManagement from "@/pages/AdminExpertManagement";
import AdminSessionManagement from "@/pages/AdminSessionManagement";
import AdminCareerManagement from "@/pages/AdminCareerManagement";

import { AuthProvider } from "@/hooks/use-auth-context";
import { LearningModeProvider } from "@/hooks/use-learning-mode";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/dashboard">
        <ProtectedRoute>
          <DashboardRouter />
        </ProtectedRoute>
      </Route>
      <Route path="/student-dashboard">
        <ProtectedRoute>
          <StudentDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/mentor-dashboard">
        <ProtectedRoute>
          <MentorDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/admin-dashboard">
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/moderator-dashboard">
        <ProtectedRoute>
          <ModeratorDashboard />
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
      <Route path="/learning">
        <ProtectedRoute>
          <Learning />
        </ProtectedRoute>
      </Route>
      <Route path="/community">
        <ProtectedRoute>
          <CommunityHub />
        </ProtectedRoute>
      </Route>
      <Route path="/community-hub">
        <ProtectedRoute>
          <CommunityHub />
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
      <Route path="/industry-experts">
        <ProtectedRoute>
          <IndustryExpertNetworkPage />
        </ProtectedRoute>
      </Route>
      <Route path="/mentor-journey">
        <ProtectedRoute>
          <MentorJourney />
        </ProtectedRoute>
      </Route>
      <Route path="/admin-users">
        <ProtectedRoute>
          <AdminUserManagement />
        </ProtectedRoute>
      </Route>
      <Route path="/admin-analytics">
        <ProtectedRoute>
          <AdminAnalytics />
        </ProtectedRoute>
      </Route>
      <Route path="/admin-content">
        <ProtectedRoute>
          <AdminContentManagement />
        </ProtectedRoute>
      </Route>
      <Route path="/admin-moderation">
        <ProtectedRoute>
          <AdminModeration />
        </ProtectedRoute>
      </Route>
      <Route path="/experts">
        <ProtectedRoute>
          <AdminExpertManagement />
        </ProtectedRoute>
      </Route>
      <Route path="/sessions">
        <ProtectedRoute>
          <AdminSessionManagement />
        </ProtectedRoute>
      </Route>
      <Route path="/careers">
        <ProtectedRoute>
          <AdminCareerManagement />
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
