import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSidebar } from "@/hooks/use-sidebar";
import Sidebar from "@/components/layout/Sidebar";
import MobileHeader from "@/components/ui/mobile-header";
import MobileNavigation from "@/components/layout/MobileNavigation";
import MobileSidebar from "@/components/layout/MobileSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Star, Award, Lock, Loader2, BookOpen, GraduationCap, Zap, Medal, Target, Sparkles } from "lucide-react";

// Mock user ID until authentication is implemented
const USER_ID = 1;

interface AchievementsProps {}

export default function Achievements({}: AchievementsProps) {
  const { isSidebarOpen, closeSidebar } = useSidebar();

  // Fetch user data
  const { data: userData, isLoading: loadingUser } = useQuery({
    queryKey: [`/api/users/${USER_ID}`],
    queryFn: undefined, // Use default queryFn from queryClient
  });

  // Fetch user achievements
  const { data: userAchievements = [], isLoading: loadingAchievements } = useQuery({
    queryKey: [`/api/users/${USER_ID}/achievements`],
    queryFn: undefined, // Use default queryFn from queryClient
  });

  // Fetch all achievements
  const { data: allAchievements = [], isLoading: loadingAllAchievements } = useQuery({
    queryKey: ['/api/achievements'],
    queryFn: undefined, // Use default queryFn from queryClient
  });

  // Close sidebar when navigating to this page
  useEffect(() => {
    closeSidebar();
  }, [closeSidebar]);

  const isLoading = loadingUser || loadingAchievements || loadingAllAchievements;

  // Calculate how many achievements are unlocked
  const unlockedCount = userAchievements.length;
  const totalCount = allAchievements.length;
  const completionPercentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  // Group achievements by category
  const categories = [...new Set(allAchievements.map((achievement: any) => achievement.category))];

  const getAchievementIcon = (icon: string, unlocked: boolean = true, size: number = 24) => {
    const className = `${unlocked ? 'text-amber-400' : 'text-gray-400'} h-${size} w-${size}`;
    
    switch (icon) {
      case 'star':
        return <Star className={className} size={size} />;
      case 'award':
        return <Award className={className} size={size} />;
      case 'lock':
        return <Lock className={className} size={size} />;
      case 'book':
        return <BookOpen className={className} size={size} />;
      case 'graduate':
        return <GraduationCap className={className} size={size} />;
      case 'zap':
        return <Zap className={className} size={size} />;
      case 'medal':
        return <Medal className={className} size={size} />;
      case 'target':
        return <Target className={className} size={size} />;
      case 'sparkles':
        return <Sparkles className={className} size={size} />;
      default:
        return <Trophy className={className} size={size} />;
    }
  };

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
          <div className="flex items-center mb-6">
            <Trophy className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Achievements</h1>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className="mt-4 text-gray-600">Loading achievements...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Achievement Progress */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Your Achievement Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="space-y-1 mb-2 md:mb-0">
                      <p className="text-sm text-gray-500">You've unlocked {unlockedCount} out of {totalCount} achievements</p>
                      <Progress value={completionPercentage} className="h-2 w-full md:w-64" />
                    </div>
                    <div className="flex items-center space-x-1 text-amber-500 font-bold">
                      <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                      <span>{userAchievements.reduce((acc: number, curr: any) => acc + 10, 0)} Points</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Recent Achievements */}
                    {userAchievements.slice(0, 4).map((userAchievement: any) => (
                      <Card key={userAchievement.id} className="bg-amber-50 border-amber-200">
                        <CardContent className="p-4 flex flex-col items-center text-center">
                          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                            {getAchievementIcon(userAchievement.achievement.icon)}
                          </div>
                          <h3 className="font-medium text-gray-900">{userAchievement.achievement.title}</h3>
                          <p className="text-xs text-gray-600 mt-1">Earned {new Date(userAchievement.earnedAt).toLocaleDateString()}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Achievement Categories */}
              <Tabs defaultValue={categories[0] || "all"} className="w-full">
                <TabsList className="w-full justify-start mb-4 overflow-x-auto flex-nowrap">
                  {categories.map((category: string) => (
                    <TabsTrigger key={category} value={category} className="whitespace-nowrap">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {categories.map((category: string) => (
                  <TabsContent key={category} value={category} className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {allAchievements
                        .filter((achievement: any) => achievement.category === category)
                        .map((achievement: any) => {
                          const userAchievement = userAchievements.find(
                            (userAch: any) => userAch.achievementId === achievement.id
                          );
                          
                          const isUnlocked = Boolean(userAchievement);
                          
                          return (
                            <Card 
                              key={achievement.id} 
                              className={`${isUnlocked 
                                ? 'bg-amber-50 border-amber-200' 
                                : 'bg-gray-50 border-gray-200'}`}
                            >
                              <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                  <div className={`h-14 w-14 rounded-full ${isUnlocked ? 'bg-amber-100' : 'bg-gray-200'} flex items-center justify-center`}>
                                    {getAchievementIcon(achievement.icon, isUnlocked, 28)}
                                  </div>
                                  {isUnlocked && (
                                    <div className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                                      +10 points
                                    </div>
                                  )}
                                </div>
                                <h3 className={`font-medium ${isUnlocked ? 'text-gray-900' : 'text-gray-600'} text-lg mb-1`}>
                                  {achievement.title}
                                </h3>
                                <p className={`text-sm ${isUnlocked ? 'text-gray-600' : 'text-gray-500'} mb-4`}>
                                  {achievement.description}
                                </p>
                                {isUnlocked ? (
                                  <div className="text-green-600 text-sm flex items-center">
                                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                                      <Award className="h-3 w-3 mr-1" />
                                      Earned {new Date(userAchievement.earnedAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                ) : (
                                  <Button variant="outline" size="sm" className="w-full">
                                    <Lock className="h-3 w-3 mr-1" />
                                    How to Unlock
                                  </Button>
                                )}
                              </CardContent>
                            </Card>
                          );
                        })}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              {/* Leaderboard */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Achievement Leaderboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg">
                      <div className="font-semibold w-10 text-center">1</div>
                      <div className="h-10 w-10 rounded-full overflow-hidden ml-2 mr-4">
                        <img 
                          src="https://images.unsplash.com/photo-1580489944761-15a19d654956" 
                          alt="User profile" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Priya Sharma</h3>
                        <p className="text-sm text-gray-600">Mumbai, India</p>
                      </div>
                      <div className="flex items-center space-x-1 text-amber-500 font-bold">
                        <Trophy className="h-4 w-4 fill-amber-500 text-amber-500" />
                        <span>120 points</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                      <div className="font-semibold w-10 text-center">2</div>
                      <div className="h-10 w-10 rounded-full overflow-hidden ml-2 mr-4">
                        <img 
                          src="https://images.unsplash.com/photo-1517841905240-472988babdf9" 
                          alt="User profile" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Arjun Mehta</h3>
                        <p className="text-sm text-gray-600">Bangalore, India</p>
                      </div>
                      <div className="flex items-center space-x-1 text-amber-500 font-bold">
                        <Trophy className="h-4 w-4 fill-amber-500 text-amber-500" />
                        <span>90 points</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-gradient-to-r from-[#f0e6fd] to-[#e2d5fa] rounded-lg">
                      <div className="font-semibold w-10 text-center">3</div>
                      <div className="h-10 w-10 rounded-full overflow-hidden ml-2 mr-4">
                        <img 
                          src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6" 
                          alt="User profile" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Ananya Singh</h3>
                        <p className="text-sm text-gray-600">Delhi, India</p>
                      </div>
                      <div className="flex items-center space-x-1 text-amber-500 font-bold">
                        <Trophy className="h-4 w-4 fill-amber-500 text-amber-500" />
                        <span>{userAchievements.reduce((acc: number, curr: any) => acc + 10, 0)} points</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 rounded-lg">
                      <div className="font-semibold w-10 text-center">4</div>
                      <div className="h-10 w-10 rounded-full overflow-hidden ml-2 mr-4">
                        <img 
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" 
                          alt="User profile" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Rahul Kumar</h3>
                        <p className="text-sm text-gray-600">Chennai, India</p>
                      </div>
                      <div className="flex items-center space-x-1 text-amber-500 font-bold">
                        <Trophy className="h-4 w-4 fill-amber-500 text-amber-500" />
                        <span>50 points</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
}
