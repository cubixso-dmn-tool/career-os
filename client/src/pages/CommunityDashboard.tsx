import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useSidebar } from "@/hooks/use-sidebar";
import Sidebar from "@/components/layout/Sidebar";
import MobileHeader from "@/components/ui/mobile-header";
import MobileNavigation from "@/components/layout/MobileNavigation";
import MobileSidebar from "@/components/layout/MobileSidebar";
import FeatureCard from "@/components/community/FeatureCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  FolderOpen, 
  Calendar, 
  Trophy, 
  Search,
  Globe,
  MessageSquare
} from "lucide-react";

// Mock user ID until authentication is implemented
const USER_ID = 1;

// Mock data for when API is not available
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

export default function CommunityDashboard() {
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch user data
  const { data: userData, isLoading: loadingUser } = useQuery({
    queryKey: [`/api/users/${USER_ID}`],
    queryFn: async () => {
      const response = await fetch(`/api/users/${USER_ID}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    }
  });

  // Fetch all community feature cards with fallback data
  const { data: allCards = [], isLoading: loadingCards } = useQuery({
    queryKey: ['/api/community-features/cards'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/community-features/cards', {
          credentials: 'include'
        });
        if (!response.ok) {
          console.error('Failed to fetch cards, using fallback data');
          return mockCards;
        }
        const result = await response.json();
        return result.data || mockCards;
      } catch (error) {
        console.error('API error, using fallback data:', error);
        return mockCards;
      }
    }
  });

  // Close sidebar when navigating to this page
  useEffect(() => {
    closeSidebar();
  }, [closeSidebar]);

  // Group cards by category
  const groupedCards = allCards.reduce((acc: any, card: any) => {
    if (!acc[card.category]) acc[card.category] = [];
    acc[card.category].push(card);
    return acc;
  }, {});

  // Filter cards based on search term
  const filterCards = (cards: any[]) => {
    if (!searchTerm) return cards;
    return cards.filter((card: any) => 
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const isLoading = loadingUser || loadingCards;

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
      <MobileHeader user={userData || { name: 'Ananya Singh', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6' }} />

      {/* Sidebar */}
      <Sidebar user={userData || { name: 'Ananya Singh', email: 'ananya.s@example.com', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6' }} />

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <MobileSidebar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar} 
          user={userData || { name: 'Ananya Singh', email: 'ananya.s@example.com', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6' }}
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

          {/* Search */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search communities, projects, events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </motion.div>

          {/* Community Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
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
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <tab.icon className="h-5 w-5 text-primary" />
                          {tab.label}
                        </CardTitle>
                        <CardDescription>{tab.description}</CardDescription>
                      </CardHeader>
                    </Card>

                    {isLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <Card key={i} className="animate-pulse">
                            <CardContent className="p-6">
                              <div className="h-32 bg-gray-200 rounded mb-4"></div>
                              <div className="h-4 bg-gray-200 rounded mb-2"></div>
                              <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                              <div className="h-8 bg-gray-200 rounded"></div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filterCards(groupedCards[tab.value] || []).length === 0 ? (
                          <div className="col-span-full text-center py-12">
                            <tab.icon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-900 mb-2">
                              No {tab.label.toLowerCase()} available
                            </h3>
                            <p className="text-gray-600">
                              {searchTerm 
                                ? `No ${tab.label.toLowerCase()} match your search.`
                                : `${tab.label} will appear here when added by administrators.`
                              }
                            </p>
                          </div>
                        ) : (
                          filterCards(groupedCards[tab.value] || []).map((card: any) => (
                            <motion.div
                              key={card.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.1 }}
                            >
                              <FeatureCard
                                id={card.id}
                                title={card.title}
                                description={card.description}
                                imageUrl={card.imageUrl}
                                redirectUrl={card.redirectUrl}
                                category={card.category}
                              />
                            </motion.div>
                          ))
                        )}
                      </div>
                    )}
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>

          {/* Community Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Community Activity
                </CardTitle>
                <CardDescription>
                  Stay connected with your community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {groupedCards.communities?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Active Communities</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {groupedCards.projects?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Open Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {groupedCards.events?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Upcoming Events</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {groupedCards.competitions?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Live Competitions</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
}