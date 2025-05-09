import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  UsersIcon,
  Calendar,
  Clock,
  Trophy,
  UserPlus,
  AlertCircle,
  Clock3,
  Rocket,
  Flag,
  Timer,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Participant {
  id: number;
  name: string;
  avatar?: string;
  role: "participant" | "mentor";
  points?: number;
  completedTasks?: number;
}

interface CohortChallenge {
  id: number;
  title: string;
  description: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: "upcoming" | "active" | "completed";
  participants: Participant[];
  maxParticipants: number;
  type: "hackathon" | "group-project" | "challenge";
  skillLevel: "beginner" | "intermediate" | "advanced";
  totalTasks: number;
  completedTasks?: number;
  prizesAvailable?: boolean;
}

export default function LiveCohortChallenges() {
  const [activeTab, setActiveTab] = useState<"active" | "upcoming" | "completed">("active");
  
  const { data: challenges = [], isLoading } = useQuery<CohortChallenge[]>({
    queryKey: ['/api/courses/cohort-challenges'],
    // Using default queryFn from queryClient
  });
  
  // Filter challenges based on status
  const activeChallenges = challenges.filter(c => c.status === "active");
  const upcomingChallenges = challenges.filter(c => c.status === "upcoming");
  const completedChallenges = challenges.filter(c => c.status === "completed");
  
  // Get my challenges
  const { data: userData } = useQuery({
    queryKey: ['/api/users/me'],
    // Using default queryFn from queryClient
  });
  
  const userChallenges = challenges.filter(challenge => 
    challenge.participants.some(p => p.id === userData?.id)
  );
  
  // Calculate days until start/end
  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Get the skill level badge style
  const getSkillLevelBadge = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-blue-100 text-blue-800";
      case "advanced":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }
  
  // Don't render anything if no challenges
  if (challenges.length === 0) {
    return null;
  }

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold flex items-center">
          <UsersIcon className="mr-2 h-5 w-5 text-primary" />
          Cohort Challenges
        </h2>
      </div>
      
      <p className="text-gray-600 mb-4">
        Collaborative learning experiences with other students in timed challenges
      </p>
      
      {userChallenges.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Your Active Challenges</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userChallenges.map(challenge => (
              <Card key={challenge.id} className="border border-primary/20">
                <CardHeader className="bg-primary/5 pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{challenge.title}</CardTitle>
                    <Badge className="bg-primary/10 text-primary">
                      My Challenge
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-3">
                  <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-medium">
                        {challenge.completedTasks || 0}/{challenge.totalTasks} tasks
                      </span>
                    </div>
                    <Progress 
                      value={((challenge.completedTasks || 0) / challenge.totalTasks) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(challenge.endDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <UsersIcon className="h-4 w-4 mr-1" />
                      <span>{challenge.participants.length}/{challenge.maxParticipants}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full">Continue Challenge</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <Tabs defaultValue="active" value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" className="flex items-center">
            <Rocket className="h-4 w-4 mr-1" />
            Active
            {activeChallenges.length > 0 && (
              <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                {activeChallenges.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Upcoming
            {upcomingChallenges.length > 0 && (
              <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                {upcomingChallenges.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center">
            <Flag className="h-4 w-4 mr-1" />
            Completed
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          {activeChallenges.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <Rocket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No active challenges</h3>
              <p className="text-gray-600 mb-4">Check back soon or join an upcoming challenge</p>
              <Button 
                variant="outline" 
                onClick={() => setActiveTab("upcoming")}
              >
                View Upcoming
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeChallenges.map(challenge => (
                <ChallengeCard 
                  key={challenge.id} 
                  challenge={challenge} 
                  userId={userData?.id}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="upcoming">
          {upcomingChallenges.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No upcoming challenges</h3>
              <p className="text-gray-600">Check back soon for new opportunities</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingChallenges.map(challenge => (
                <ChallengeCard 
                  key={challenge.id} 
                  challenge={challenge} 
                  userId={userData?.id}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {completedChallenges.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <Flag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No completed challenges</h3>
              <p className="text-gray-600">Join an active or upcoming challenge</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedChallenges.map(challenge => (
                <CompletedChallengeCard 
                  key={challenge.id} 
                  challenge={challenge} 
                  userId={userData?.id}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Component for active and upcoming challenges
function ChallengeCard({ challenge, userId }: { challenge: CohortChallenge, userId?: number }) {
  const isActive = challenge.status === "active";
  const isUserEnrolled = challenge.participants.some(p => p.id === userId);
  const spotsLeft = challenge.maxParticipants - challenge.participants.length;
  const daysLeft = getDaysUntil(isActive ? challenge.endDate : challenge.startDate);
  
  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <Card className="border border-gray-100 hover:shadow-sm transition-shadow overflow-hidden">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-medium flex-1">{challenge.title}</CardTitle>
          <div className="flex gap-1 flex-shrink-0">
            <Badge className={getSkillLevelBadge(challenge.skillLevel)}>
              {challenge.skillLevel}
            </Badge>
            {challenge.prizesAvailable && (
              <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                <Trophy className="h-3 w-3 mr-1" />
                Prizes
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{challenge.description}</p>
        
        <div className="flex justify-between items-center mb-3 text-sm">
          <div className="flex items-center text-gray-500">
            {isActive ? (
              <>
                <Clock3 className="h-4 w-4 mr-1" />
                <span>{daysLeft > 0 ? `${daysLeft} days left` : "Ends today"}</span>
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 mr-1" />
                <span>Starts in {daysLeft} days</span>
              </>
            )}
          </div>
          <div className="flex items-center text-gray-500">
            <UsersIcon className="h-4 w-4 mr-1" />
            <span>{challenge.participants.length}/{challenge.maxParticipants}</span>
          </div>
        </div>
        
        {challenge.status === "active" && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Progress</span>
              <span>{Math.floor(((challenge.completedTasks || 0) / challenge.totalTasks) * 100)}%</span>
            </div>
            <Progress 
              value={((challenge.completedTasks || 0) / challenge.totalTasks) * 100} 
              className="h-1.5"
            />
          </div>
        )}
        
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600 font-medium">Team</span>
            <span className="text-xs text-gray-500">
              {spotsLeft > 0
                ? `${spotsLeft} ${spotsLeft === 1 ? 'spot' : 'spots'} left`
                : 'Full'
              }
            </span>
          </div>
          <div className="flex -space-x-2">
            {challenge.participants.slice(0, 5).map((participant, index) => (
              <Avatar key={participant.id} className="h-8 w-8 border-2 border-white">
                <AvatarImage src={participant.avatar} />
                <AvatarFallback className={participant.role === "mentor" ? "bg-amber-100 text-amber-800" : ""}>
                  {getInitials(participant.name)}
                </AvatarFallback>
              </Avatar>
            ))}
            {challenge.participants.length > 5 && (
              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium border-2 border-white">
                +{challenge.participants.length - 5}
              </div>
            )}
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>
              {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2">
        {isUserEnrolled ? (
          <Button className="w-full">
            {isActive ? 'Continue Challenge' : 'View Details'}
          </Button>
        ) : (
          <Button 
            className="w-full" 
            variant={spotsLeft > 0 ? 'default' : 'outline'}
            disabled={spotsLeft === 0}
          >
            {spotsLeft > 0 ? (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Join Challenge
              </>
            ) : (
              'Full'
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

// Component for completed challenges
function CompletedChallengeCard({ challenge, userId }: { challenge: CohortChallenge, userId?: number }) {
  const isUserEnrolled = challenge.participants.some(p => p.id === userId);
  const userParticipant = challenge.participants.find(p => p.id === userId);
  
  // Get top participants by points
  const topParticipants = [...challenge.participants]
    .filter(p => p.points !== undefined)
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, 3);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <Card className="border border-gray-100 hover:shadow-sm transition-shadow">
      <CardHeader className="p-4 pb-3 bg-gray-50">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-medium">{challenge.title}</CardTitle>
          <Badge className="bg-gray-200 text-gray-700">
            Completed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4 text-sm text-gray-600">
          <span className="flex items-center mb-1">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
          </span>
          <span className="flex items-center">
            <UsersIcon className="h-4 w-4 mr-1" />
            {challenge.participants.length} participants
          </span>
        </div>
        
        {isUserEnrolled && userParticipant?.points !== undefined && (
          <div className="mb-4 p-3 bg-primary/5 rounded-md">
            <p className="text-sm font-medium mb-1">Your Performance</p>
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <div className="font-medium text-primary">{userParticipant.points} points</div>
                <div className="text-gray-500">
                  {userParticipant.completedTasks}/{challenge.totalTasks} tasks completed
                </div>
              </div>
              {/* Optional: Show rank if available */}
              <Badge variant="outline" className="bg-primary/10 text-primary border-none">
                {/* Find user rank */}
                {challenge.participants
                  .filter(p => p.points !== undefined)
                  .sort((a, b) => (b.points || 0) - (a.points || 0))
                  .findIndex(p => p.id === userId) + 1}
                /{challenge.participants.length} Rank
              </Badge>
            </div>
          </div>
        )}
        
        <div>
          <h4 className="text-sm font-medium mb-2">Top Performers</h4>
          <ScrollArea className="h-[100px]">
            <div className="space-y-2">
              {topParticipants.map((participant, index) => (
                <div key={participant.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-2 w-5 text-center">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}`}
                    </div>
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback>{getInitials(participant.name)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{participant.name}</span>
                  </div>
                  <span className="text-sm font-medium">{participant.points} pts</span>
                </div>
              ))}
              
              {topParticipants.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No participant data available
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" className="w-full text-gray-700">
          View Results
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}

// Get the skill level badge style - helper function
function getSkillLevelBadge(level: string) {
  switch (level) {
    case "beginner":
      return "bg-green-100 text-green-800";
    case "intermediate":
      return "bg-blue-100 text-blue-800";
    case "advanced":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// Get days until date - helper function
function getDaysUntil(dateString: string) {
  const today = new Date();
  const targetDate = new Date(dateString);
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Get initials from name - helper function
function getInitials(name: string) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
}