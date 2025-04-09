import React, { useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { DashboardProvider } from '@/hooks/useDashboardContext';
import { useDashboardEvents } from '@/lib/dashboardEventBus';
import NotificationsPanel, { NotificationsCard } from './NotificationsPanel';
import ActivityFeed from './ActivityFeed';
import ProgressSummary from './ProgressSummary';
import Recommendations from './Recommendations';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  BookOpen, 
  Code, 
  Sparkles, 
  Users, 
  FileText, 
  Award, 
  Settings,
  Menu,
  X
} from 'lucide-react';

// Define the sidebar navigation items
const sidebarItems = [
  {
    title: 'Dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: '/dashboard',
    color: 'text-primary',
  },
  {
    title: 'Courses',
    icon: <BookOpen className="h-5 w-5" />,
    href: '/dashboard/courses',
    color: 'text-blue-600',
  },
  {
    title: 'Projects',
    icon: <Code className="h-5 w-5" />,
    href: '/dashboard/projects',
    color: 'text-green-600',
  },
  {
    title: 'Soft Skills',
    icon: <Sparkles className="h-5 w-5" />,
    href: '/dashboard/skills',
    color: 'text-purple-600',
  },
  {
    title: 'Communities',
    icon: <Users className="h-5 w-5" />,
    href: '/dashboard/communities',
    color: 'text-pink-600',
  },
  {
    title: 'Resume Builder',
    icon: <FileText className="h-5 w-5" />,
    href: '/dashboard/resume',
    color: 'text-orange-600',
  },
  {
    title: 'Achievements',
    icon: <Award className="h-5 w-5" />,
    href: '/dashboard/achievements',
    color: 'text-yellow-600',
  },
  {
    title: 'Settings',
    icon: <Settings className="h-5 w-5" />,
    href: '/dashboard/settings',
    color: 'text-gray-600',
  },
];

// Sidebar navigation component
const Sidebar: React.FC<{
  mobile?: boolean;
  onClose?: () => void;
}> = ({ mobile = false, onClose }) => {
  const [location, setLocation] = useLocation();
  const { subscribe, publish, eventNames } = useDashboardEvents();
  
  // Handle navigation item click
  const handleClick = (href: string) => {
    setLocation(href);
    if (mobile && onClose) {
      onClose();
    }
    
    // Publish a tab change event for other components to react to
    publish(eventNames.TAB_CHANGED, { path: href });
  };
  
  return (
    <div className={`${mobile ? 'h-screen bg-background pt-4' : 'h-full'}`}>
      {mobile && (
        <div className="flex justify-between items-center px-4 pb-4">
          <h2 className="font-bold text-lg">CareerOS</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      <div className="space-y-1 py-2">
        {sidebarItems.map((item) => (
          <Button
            key={item.href}
            variant={location === item.href ? "default" : "ghost"}
            className={`w-full justify-start ${!mobile ? 'px-2' : ''}`}
            onClick={() => handleClick(item.href)}
          >
            <span className={`mr-2 ${item.color}`}>{item.icon}</span>
            <span>{item.title}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

// User profile card component
const UserProfileCard: React.FC = () => {
  const { user, logoutMutation } = useAuth();
  
  // Handle logout button click
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  if (!user) return null;
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar || undefined} alt={user.name} />
            <AvatarFallback>
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-2 gap-2 text-center">
          <Button variant="outline" size="sm" asChild>
            <a href="/dashboard/profile">View Profile</a>
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Main dashboard component
const DashboardOverview: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Event handlers for component interactions
  const handleCategoryClick = (category: string) => {
    // Navigate to the respective section
    window.location.href = `/dashboard/${category}`;
  };
  
  const handleActivityClick = (type: string, id: number) => {
    // Navigate to the specific item
    switch (type) {
      case 'course':
        window.location.href = `/dashboard/courses/${id}`;
        break;
      case 'project':
        window.location.href = `/dashboard/projects/${id}`;
        break;
      case 'skill':
        window.location.href = `/dashboard/skills/${id}`;
        break;
      case 'achievement':
        window.location.href = `/dashboard/achievements`;
        break;
      default:
        window.location.href = `/dashboard`;
    }
  };
  
  const handleRecommendationAction = (type: string, id: number) => {
    // Handle recommendation action (enroll, start, join, etc.)
    switch (type) {
      case 'course':
        window.location.href = `/dashboard/courses/${id}`;
        break;
      case 'project':
        window.location.href = `/dashboard/projects/${id}`;
        break;
      case 'community':
        window.location.href = `/dashboard/communities/${id}`;
        break;
      case 'skill':
        window.location.href = `/dashboard/skills/${id}`;
        break;
      default:
        window.location.href = `/dashboard`;
    }
  };
  
  const handleNotificationAction = (id: string, type: string, entityId?: number) => {
    // Navigate to the entity mentioned in the notification
    if (entityId) {
      handleActivityClick(type, entityId);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-3/4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="progress">My Progress</TabsTrigger>
              <TabsTrigger value="recommendations">For You</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6 pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <ProgressSummary onCategoryClick={handleCategoryClick} />
                <NotificationsCard 
                  onViewAll={() => document.getElementById('notifications-trigger')?.click()}
                  onNotificationAction={handleNotificationAction}
                />
              </div>
              
              <ActivityFeed 
                title="Recent Activities"
                description="Your latest progress and achievements"
                maxItems={5}
                onActivityClick={handleActivityClick}
              />
            </TabsContent>
            
            <TabsContent value="progress" className="space-y-6 pt-6">
              <ProgressSummary onCategoryClick={handleCategoryClick} />
              <ActivityFeed 
                title="Learning Journey"
                description="Chronological view of your learning path"
                maxItems={10}
                onActivityClick={handleActivityClick}
              />
            </TabsContent>
            
            <TabsContent value="recommendations" className="space-y-6 pt-6">
              <Recommendations onRecommendationAction={handleRecommendationAction} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="w-full md:w-1/4 space-y-6">
          <UserProfileCard />
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Your learning progress at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Courses Completed</span>
                    <span className="font-medium text-primary">3/8</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '37.5%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Projects Done</span>
                    <span className="font-medium text-primary">2/5</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-green-600 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Skills Mastered</span>
                    <span className="font-medium text-primary">4/10</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="pt-2">
                  <h4 className="font-medium text-sm">Next Goals</h4>
                  <ul className="text-sm text-gray-500 mt-2 space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                      <span>Complete "React Fundamentals"</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                      <span>Finish Portfolio Project</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-purple-600 rounded-full"></div>
                      <span>Master Communication Skills</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Main dashboard layout wrapper
const DashboardLayout: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, params] = useRoute('/dashboard/:page');
  const [, courseParams] = useRoute('/dashboard/courses/:id');
  const [, projectParams] = useRoute('/dashboard/projects/:id');
  const [, skillParams] = useRoute('/dashboard/skills/:id');
  
  // Check if current route is dashboard home
  const isDashboardHome = !params && !courseParams && !projectParams && !skillParams;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <div className="md:hidden border-b bg-white p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="font-bold">CareerOS</h1>
          <div className="flex items-center space-x-2">
            <NotificationsPanel 
              onNotificationAction={(id, type, entityId) => {
                // Handle notification action
              }}
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background">
          <Sidebar mobile onClose={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
      
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid md:grid-cols-[240px_1fr] gap-8">
          {/* Desktop sidebar */}
          <div className="hidden md:block sticky top-8 h-[calc(100vh-4rem)] overflow-auto border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-8">
              <h1 className="font-bold text-lg">CareerOS</h1>
              <NotificationsPanel 
                onNotificationAction={(id, type, entityId) => {
                  // Handle notification action
                }}
              />
            </div>
            <Sidebar />
          </div>
          
          {/* Main content */}
          <div>
            {isDashboardHome ? <DashboardOverview /> : children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;