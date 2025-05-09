import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Trophy, 
  Calendar, 
  Flame, 
  Target, 
  BarChart, 
  Star, 
  Heart, 
  Clock, 
  Award,
  ArrowUpRight,
  Sparkles,
  Zap,
  Gift
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLearningMode } from "@/hooks/use-learning-mode";

// Quotes for different streak milestones
const STREAK_QUOTES = [
  // Starting out (1-3 days)
  [
    "Great start! The journey of a thousand miles begins with a single step.",
    "Day 1 complete! Consistency is the key to mastery.",
    "You're on your way! Small daily improvements lead to stunning results over time."
  ],
  // Building momentum (4-6 days)
  [
    "You're building momentum! Keep the streak alive!",
    "5 days strong! You're developing a powerful learning habit.",
    "Almost a week of consistent learning! Your future self thanks you."
  ],
  // Solid streak (7-13 days)
  [
    "A full week streak! That's serious dedication!",
    "Your brain is changing with each day of this streak. Neural pathways are strengthening!",
    "10 days of learning in a row! You're outperforming 80% of learners."
  ],
  // Impressive streak (14-20 days)
  [
    "Two weeks of consecutive learning! You're in the top 15% of dedicated learners.",
    "Research shows it takes about 21 days to form a habit. You're well on your way!",
    "Your consistency is inspiring! Keep nurturing your learning habit."
  ],
  // Expert streak (21+ days)
  [
    "21+ days! You've officially formed a learning habit according to research.",
    "A month of daily learning is a rare achievement. You're unstoppable!",
    "Your dedication to daily improvement puts you in the top 5% of learners worldwide."
  ]
];

// Motivational tips for different situations
const MOTIVATIONAL_TIPS = [
  "Try learning at the same time each day to build a stronger habit.",
  "Set a specific goal for tomorrow's session to make it more concrete.",
  "Share your learning journey with a friend for accountability.",
  "Break down complex topics into smaller, manageable chunks.",
  "Reward yourself after completing a learning session.",
  "Connect what you're learning to your long-term career goals.",
  "Try the Pomodoro technique: 25 minutes of focused learning followed by a 5-minute break.",
  "Review what you learned yesterday before starting today's session.",
  "Visualize yourself mastering these skills and reaching your goals.",
  "Create a distraction-free learning environment for better focus."
];

// Achievement badges
const ACHIEVEMENT_BADGES = [
  { 
    id: 1, 
    name: "First Day", 
    description: "Completed your first day of learning",
    icon: <Zap className="h-5 w-5 text-amber-500" />,
    requiredDays: 1,
    color: "from-amber-400 to-amber-500"
  },
  { 
    id: 2, 
    name: "Three-Day Streak", 
    description: "Completed 3 consecutive days of learning",
    icon: <Flame className="h-5 w-5 text-orange-500" />,
    requiredDays: 3,
    color: "from-orange-400 to-orange-600"
  },
  { 
    id: 3, 
    name: "Week Warrior", 
    description: "Maintained a 7-day learning streak",
    icon: <Award className="h-5 w-5 text-blue-500" />,
    requiredDays: 7,
    color: "from-blue-400 to-blue-600"
  },
  { 
    id: 4, 
    name: "Fortnight Focus", 
    description: "Maintained a 14-day learning streak",
    icon: <Trophy className="h-5 w-5 text-purple-500" />,
    requiredDays: 14,
    color: "from-purple-400 to-purple-600"
  },
  { 
    id: 5, 
    name: "21-Day Habit", 
    description: "Formed a solid learning habit with 21 consecutive days",
    icon: <Sparkles className="h-5 w-5 text-primary" />,
    requiredDays: 21,
    color: "from-primary/80 to-primary"
  },
  { 
    id: 6, 
    name: "Monthly Master", 
    description: "Completed a full month of daily learning",
    icon: <Star className="h-5 w-5 text-amber-500" />,
    requiredDays: 30,
    color: "from-amber-400 to-amber-600"
  },
];

// Custom streak goals
const DEFAULT_STREAK_GOALS = [
  { days: 3, reward: "Take a coffee break" },
  { days: 7, reward: "Watch a movie" },
  { days: 14, reward: "Buy something nice" },
  { days: 30, reward: "Weekend getaway" }
];

// Component for the learning streak motivator
export default function StreakMotivator() {
  // Get streak data from API
  const { data: streakData, isLoading } = useQuery<{
    currentStreak: number;
    longestStreak: number;
    streakHistory: number[]; // Last 7 days of streak counts
    lastActive: string; // ISO date string
  }>({
    queryKey: ['/api/courses/streak-data'],
    // Using default queryFn from queryClient
  });
  
  // For the customizable streak goals
  const [streakGoals, setStreakGoals] = useState(DEFAULT_STREAK_GOALS);
  const [editingGoal, setEditingGoal] = useState<number | null>(null);
  const [newGoalDays, setNewGoalDays] = useState<number>(0);
  const [newGoalReward, setNewGoalReward] = useState<string>("");
  
  // For the daily motivation
  const [motivationIndex, setMotivationIndex] = useState(0);
  const [dailyTipIndex, setDailyTipIndex] = useState(0);
  
  // Get learning mode context to adapt motivator based on user preferences
  const { focusMode, mode } = useLearningMode();
  
  // Current streak data with defaults
  const currentStreak = streakData?.currentStreak || 0;
  const longestStreak = streakData?.longestStreak || 0;
  const streakHistory = streakData?.streakHistory || [0, 0, 0, 0, 0, 0, 0];
  const lastActive = streakData?.lastActive || new Date().toISOString();
  
  // Calculate days since last activity
  const daysSinceLastActive = () => {
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const diffTime = Math.abs(now.getTime() - lastActiveDate.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // Get appropriate quote based on streak length
  const getStreakQuote = () => {
    let quoteCategory = 0;
    
    if (currentStreak >= 21) {
      quoteCategory = 4;
    } else if (currentStreak >= 14) {
      quoteCategory = 3;
    } else if (currentStreak >= 7) {
      quoteCategory = 2;
    } else if (currentStreak >= 4) {
      quoteCategory = 1;
    }
    
    // Get quotes for this category
    const quotes = STREAK_QUOTES[quoteCategory];
    
    // Return a quote based on the current motivationIndex
    return quotes[motivationIndex % quotes.length];
  };
  
  // Get a daily tip
  const getDailyTip = () => {
    return MOTIVATIONAL_TIPS[dailyTipIndex % MOTIVATIONAL_TIPS.length];
  };
  
  // Get earned badges
  const getEarnedBadges = () => {
    return ACHIEVEMENT_BADGES.filter(badge => currentStreak >= badge.requiredDays);
  };
  
  // Get next badge to earn
  const getNextBadge = () => {
    const nextBadges = ACHIEVEMENT_BADGES.filter(badge => currentStreak < badge.requiredDays);
    return nextBadges.length > 0 ? nextBadges[0] : null;
  };
  
  // Progress towards next badge
  const getNextBadgeProgress = () => {
    const nextBadge = getNextBadge();
    if (!nextBadge) return 100;
    
    return Math.min(100, (currentStreak / nextBadge.requiredDays) * 100);
  };
  
  // Start or add a new goal
  const handleAddGoal = () => {
    if (newGoalDays > 0 && newGoalReward.trim() !== "") {
      if (editingGoal !== null) {
        // Update existing goal
        setStreakGoals(prev => prev.map((goal, i) => 
          i === editingGoal ? { days: newGoalDays, reward: newGoalReward } : goal
        ));
      } else {
        // Add new goal
        setStreakGoals(prev => [...prev, { days: newGoalDays, reward: newGoalReward }]);
      }
      
      // Reset form
      setNewGoalDays(0);
      setNewGoalReward("");
      setEditingGoal(null);
    }
  };
  
  // Edit an existing goal
  const handleEditGoal = (index: number) => {
    setEditingGoal(index);
    setNewGoalDays(streakGoals[index].days);
    setNewGoalReward(streakGoals[index].reward);
  };
  
  // Delete a goal
  const handleDeleteGoal = (index: number) => {
    setStreakGoals(prev => prev.filter((_, i) => i !== index));
  };
  
  // Rotate motivation and tips on mount and interval
  useEffect(() => {
    // Set initial random indices
    setMotivationIndex(Math.floor(Math.random() * 3));
    setDailyTipIndex(Math.floor(Math.random() * MOTIVATIONAL_TIPS.length));
    
    // Rotate quotes every 24 hours
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('motivationDate');
    
    if (storedDate !== today) {
      localStorage.setItem('motivationDate', today);
      setMotivationIndex(Math.floor(Math.random() * 3));
      setDailyTipIndex(Math.floor(Math.random() * MOTIVATIONAL_TIPS.length));
    }
  }, []);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Current Streak Card */}
      <Card className={cn(
        "border-0 shadow-md overflow-hidden",
        currentStreak > 0 ? "bg-gradient-to-br from-primary/10 to-primary/5" : "bg-gray-50"
      )}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center text-white relative",
              currentStreak > 0 
                ? "bg-gradient-to-br from-primary to-primary/80" 
                : "bg-gray-400"
            )}>
              <Flame className="h-8 w-8 absolute animate-pulse" />
              <span className="text-3xl font-bold">{currentStreak}</span>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">
                {currentStreak === 0 
                  ? "Start Your Learning Journey!" 
                  : `${currentStreak}-Day Streak!`}
              </h2>
              <p className="text-gray-700">
                {currentStreak === 0 
                  ? "Complete today's learning to start your streak" 
                  : getStreakQuote()}
              </p>
              
              {currentStreak > 0 && (
                <div className="flex items-center justify-center md:justify-start mt-2 text-sm text-gray-500">
                  <Trophy className="h-4 w-4 mr-1 text-amber-500" />
                  <span>
                    {currentStreak === longestStreak 
                      ? "This is your longest streak ever!" 
                      : `Your longest streak: ${longestStreak} days`}
                  </span>
                </div>
              )}
            </div>
            
            {currentStreak > 0 && daysSinceLastActive() === 0 && (
              <Badge className="bg-green-100 text-green-800 py-1.5 px-3">
                <Zap className="h-3.5 w-3.5 mr-1" />
                Today Completed
              </Badge>
            )}
            
            {daysSinceLastActive() > 0 && (
              <Button>
                Continue Streak
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Tabs for different motivational features */}
      <Tabs defaultValue="achievements" className="space-y-4">
        <TabsList className="grid grid-cols-3 h-auto">
          <TabsTrigger value="achievements" className="py-2">
            <Trophy className="h-4 w-4 mr-2" />
            <span>Achievements</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="py-2">
            <Target className="h-4 w-4 mr-2" />
            <span>Streak Goals</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="py-2">
            <BarChart className="h-4 w-4 mr-2" />
            <span>Insights</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          {/* Earned Badges */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Your Badges</h3>
            
            {getEarnedBadges().length === 0 ? (
              <Card className="bg-gray-50 border-dashed border-2">
                <CardContent className="p-6 text-center">
                  <Gift className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Complete your first day to earn badges!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {getEarnedBadges().map(badge => (
                  <div key={badge.id} className="text-center">
                    <div className={cn(
                      "w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-gradient-to-br text-white",
                      `${badge.color}`
                    )}>
                      {badge.icon}
                    </div>
                    <p className="mt-2 text-sm font-medium">{badge.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Next Badge */}
          {getNextBadge() && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Next Badge</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    {getNextBadge()?.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between mb-1 text-sm">
                      <span className="font-medium">{getNextBadge()?.name}</span>
                      <span>{currentStreak}/{getNextBadge()?.requiredDays} days</span>
                    </div>
                    <Progress value={getNextBadgeProgress()} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">{getNextBadge()?.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Daily Tip */}
          <Card className="bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Daily Motivation Tip</h4>
                  <p className="text-sm text-gray-600">{getDailyTip()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Streak Goals</CardTitle>
              <CardDescription>
                Set your own streak goals and rewards to stay motivated
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Goals List */}
              {streakGoals.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <Target className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                  <p>You haven't set any streak goals yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {streakGoals.sort((a, b) => a.days - b.days).map((goal, index) => (
                    <div 
                      key={index} 
                      className={cn(
                        "flex justify-between items-center p-3 rounded-lg border",
                        currentStreak >= goal.days 
                          ? "bg-green-50 border-green-200" 
                          : "bg-white"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          currentStreak >= goal.days 
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-600"
                        )}>
                          {currentStreak >= goal.days ? (
                            <CheckIcon className="h-5 w-5" />
                          ) : (
                            <div className="font-medium">{goal.days}</div>
                          )}
                        </div>
                        
                        <div>
                          <div className="font-medium">
                            {goal.days}-Day Streak Goal
                            {currentStreak >= goal.days && (
                              <Badge className="ml-2 bg-green-100 text-green-800">
                                Achieved
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            Reward: {goal.reward}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditGoal(index)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteGoal(index)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add/Edit Goal Form */}
              <Card className="border-dashed">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium">
                    {editingGoal !== null ? "Edit Goal" : "Add New Goal"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Streak Duration (days)
                    </label>
                    <div className="flex gap-2">
                      <Slider
                        value={[newGoalDays]}
                        onValueChange={(value) => setNewGoalDays(value[0])}
                        max={60}
                        step={1}
                        className="flex-1"
                      />
                      <div className="w-12 h-9 rounded-md border flex items-center justify-center">
                        {newGoalDays}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Reward
                    </label>
                    <input
                      type="text"
                      value={newGoalReward}
                      onChange={(e) => setNewGoalReward(e.target.value)}
                      placeholder="How will you reward yourself?"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    {editingGoal !== null && (
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setEditingGoal(null);
                          setNewGoalDays(0);
                          setNewGoalReward("");
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button onClick={handleAddGoal}>
                      {editingGoal !== null ? "Update Goal" : "Add Goal"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Streak Insights</CardTitle>
              <CardDescription>
                Track your learning consistency over time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Weekly Activity */}
              <div>
                <h3 className="text-sm font-medium mb-2">Last 7 Days Activity</h3>
                <div className="flex gap-1 h-16">
                  {streakHistory.map((count, i) => (
                    <div key={i} className="flex-1 flex flex-col gap-1">
                      <div className="flex-1 relative">
                        <div 
                          className={cn(
                            "absolute bottom-0 w-full bg-primary/20 rounded-t",
                            count > 0 ? "bg-primary/80" : "bg-gray-200"
                          )}
                          style={{ height: `${Math.min(100, count * 20)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-center">
                        {["S", "M", "T", "W", "T", "F", "S"][i]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Streak Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gray-50">
                  <CardContent className="p-4 text-center">
                    <Trophy className="h-6 w-6 text-amber-500 mx-auto mb-1" />
                    <div className="text-2xl font-bold">{longestStreak}</div>
                    <p className="text-xs text-gray-600">Longest Streak</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50">
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                    <div className="text-2xl font-bold">
                      {Math.floor(streakHistory.reduce((sum, count) => sum + (count > 0 ? 1 : 0), 0) / 7 * 100)}%
                    </div>
                    <p className="text-xs text-gray-600">Weekly Consistency</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Personalized Suggestions */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-none">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Personalized Suggestion</h4>
                      <p className="text-sm text-gray-600">
                        {currentStreak === 0 
                          ? "Start with just 5 minutes of learning today to begin your streak!" 
                          : currentStreak < 3
                            ? "You're just getting started! Try setting a specific time each day for learning."
                            : currentStreak < 7
                              ? "You're building momentum! Consider setting a specific 7-day goal to keep going."
                              : "You're doing great! Share your achievement with friends for accountability."
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper components
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  );
}