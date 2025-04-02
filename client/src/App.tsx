import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import CareerGuide from "@/pages/CareerGuide";
import Courses from "@/pages/Courses";
import Projects from "@/pages/Projects";
import Community from "@/pages/Community";
import ResumeBuilder from "@/pages/ResumeBuilder";
import SoftSkills from "@/pages/SoftSkills";
import Achievements from "@/pages/Achievements";
import { useState } from "react";
import { SidebarProvider } from "@/hooks/use-sidebar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/career-guide" component={CareerGuide} />
      <Route path="/courses" component={Courses} />
      <Route path="/projects" component={Projects} />
      <Route path="/community" component={Community} />
      <Route path="/resume-builder" component={ResumeBuilder} />
      <Route path="/soft-skills" component={SoftSkills} />
      <Route path="/achievements" component={Achievements} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <Router />
        <Toaster />
      </SidebarProvider>
    </QueryClientProvider>
  );
}

export default App;
