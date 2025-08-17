import { useState, useEffect } from "react";
import { useSidebar } from "@/hooks/use-sidebar";
import Sidebar from "@/components/layout/Sidebar";
import MobileHeader from "@/components/ui/mobile-header";
import MobileNavigation from "@/components/layout/MobileNavigation";
import MobileSidebar from "@/components/layout/MobileSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FolderOpen, 
  Calendar, 
  Trophy, 
  ExternalLink,
  Globe
} from "lucide-react";

// Mock user data
const mockUser = { 
  name: 'Ananya Singh', 
  email: 'ananya.s@example.com', 
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6' 
};

// Mock cards data
const mockCards = [
  {
    id: 1,
    title: 'Tech Communities Discord',
    description: 'Join our vibrant Discord community for tech discussions, networking, and career advice',
    redirectUrl: 'https://discord.gg/techcommunity',
    category: 'communities'
  },
  {
    id: 2,
    title: 'Open Source Projects',
    description: 'Contribute to open source projects and build your portfolio with real-world experience',
    redirectUrl: 'https://github.com/explore',
    category: 'projects'
  },
  {
    id: 3,
    title: 'Tech Meetups Mumbai',
    description: 'Attend local tech meetups and networking events in Mumbai',
    redirectUrl: 'https://www.meetup.com/tech-mumbai',
    category: 'events'
  },
  {
    id: 4,
    title: 'HackerRank Challenges',
    description: 'Participate in coding competitions and algorithmic challenges',
    redirectUrl: 'https://www.hackerrank.com/contests',
    category: 'competitions'
  }
];

export default function CommunityDashboardSimple() {
  const { isSidebarOpen, closeSidebar } = useSidebar();

  useEffect(() => {
    closeSidebar();
  }, [closeSidebar]);

  // Group cards by category
  const groupedCards = mockCards.reduce((acc: any, card: any) => {
    if (!acc[card.category]) acc[card.category] = [];
    acc[card.category].push(card);
    return acc;
  }, {});

  const handleCardClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const tabConfig = [
    { 
      value: 'communities', 
      label: 'Communities', 
      icon: Users,
      description: 'Join communities and connect with like-minded peers'
    },
    { 
      value: 'projects', 
      label: 'Projects', 
      icon: FolderOpen,
      description: 'Collaborate on exciting projects and build your portfolio'
    },
    { 
      value: 'events', 
      label: 'Events', 
      icon: Calendar,
      description: 'Attend workshops, webinars, and networking events'
    },
    { 
      value: 'competitions', 
      label: 'Competitions', 
      icon: Trophy,
      description: 'Participate in contests and showcase your skills'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <MobileHeader user={mockUser} />

      {/* Sidebar */}
      <Sidebar user={mockUser} />

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <MobileSidebar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar} 
          user={mockUser}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 relative">
        <div className="px-4 py-6 md:px-8 pb-20 md:pb-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Globe className="h-6 w-6 mr-2 text-primary" />
              <h1 className="text-3xl font-bold text-gray-900">Community Hub</h1>
            </div>
            <p className="text-gray-600 text-lg">
              Discover communities, projects, events, and competitions tailored for your career growth
            </p>
          </div>

          {/* Community Tabs */}
          <Tabs defaultValue="communities" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              {tabConfig.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {tabConfig.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <tab.icon className="h-5 w-5 text-primary" />
                      {tab.label}
                    </CardTitle>
                    <p className="text-gray-600">{tab.description}</p>
                  </CardHeader>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(groupedCards[tab.value] || []).length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <tab.icon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-900 mb-2">
                        No {tab.label.toLowerCase()} available
                      </h3>
                      <p className="text-gray-600">
                        {tab.label} will appear here when added by administrators.
                      </p>
                    </div>
                  ) : (
                    (groupedCards[tab.value] || []).map((card: any) => (
                      <Card key={card.id} className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
                        <CardContent className="p-6">
                          <CardHeader className="p-0 mb-4">
                            <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                              {card.title}
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-2">
                              {card.description}
                            </p>
                          </CardHeader>
                          
                          <Button 
                            onClick={() => handleCardClick(card.redirectUrl)}
                            className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                            variant="outline"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Explore
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
}