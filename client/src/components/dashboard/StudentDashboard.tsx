import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { 
  Bell, BookOpen, Calendar, Clock, MessageSquare, 
  TrendingUp, Users, ListChecks, Bookmark, Award, 
  BarChart, PlusCircle, Search, Filter, CheckCircle,
  ArrowRight, FileText, Layers, Zap, RefreshCw
} from "lucide-react";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { User, Community, CommunityPost } from "@shared/schema";

// Mock data for development
const mockCommunities = [
  {
    id: 1,
    name: "Code Crafters",
    slug: "code-crafters",
    description: "A community of passionate developers building amazing projects",
    logo: "https://ui-avatars.com/api/?name=Code+Crafters&background=0D8ABC&color=fff",
    stream: "tech",
    memberCount: 1245,
    isVerified: true
  },
  {
    id: 2,
    name: "Finance Forum",
    slug: "finance-forum",
    description: "Discussing the latest trends in finance and business",
    logo: "https://ui-avatars.com/api/?name=Finance+Forum&background=2AAA8A&color=fff",
    stream: "commerce",
    memberCount: 843,
    isVerified: true
  },
  {
    id: 3,
    name: "Design Dialogue",
    slug: "design-dialogue",
    description: "Creative designers collaborating and sharing inspiration",
    logo: "https://ui-avatars.com/api/?name=Design+Dialogue&background=C13584&color=fff",
    stream: "arts",
    memberCount: 567,
    isVerified: false
  }
];

const mockPosts = [
  {
    id: 1,
    communityId: 1,
    communityName: "Code Crafters",
    communityLogo: "https://ui-avatars.com/api/?name=Code+Crafters&background=0D8ABC&color=fff",
    authorId: 2,
    authorName: "Priya Sharma",
    authorAvatar: "https://ui-avatars.com/api/?name=Priya+Sharma&background=A78BFA&color=fff",
    title: "Web Developer Internship Opportunity - Summer 2025",
    content: "We're looking for enthusiastic web developers for a 3-month internship starting May 2025. Learn from industry experts and work on real-world projects. Stipend offered. Apply by Jan 30.",
    type: "internship",
    createdAt: "2024-12-18T10:30:00Z",
    likes: 45,
    views: 231
  },
  {
    id: 2,
    communityId: 2,
    communityName: "Finance Forum",
    communityLogo: "https://ui-avatars.com/api/?name=Finance+Forum&background=2AAA8A&color=fff",
    authorId: 3,
    authorName: "Rahul Patel",
    authorAvatar: "https://ui-avatars.com/api/?name=Rahul+Patel&background=F59E0B&color=fff",
    title: "Financial Modeling Workshop - Online",
    content: "Join our 2-day intensive workshop on financial modeling with Excel and Python. Learn from industry experts and gain practical skills that you can apply immediately.",
    type: "event",
    createdAt: "2024-12-17T14:20:00Z",
    likes: 32,
    views: 128
  },
  {
    id: 3,
    communityId: 3,
    communityName: "Design Dialogue",
    communityLogo: "https://ui-avatars.com/api/?name=Design+Dialogue&background=C13584&color=fff",
    authorId: 4,
    authorName: "Aditya Verma",
    authorAvatar: "https://ui-avatars.com/api/?name=Aditya+Verma&background=3B82F6&color=fff",
    title: "Portfolio Review Sessions - Get Expert Feedback",
    content: "We're hosting portfolio review sessions next week. Get constructive feedback from industry professionals and improve your design portfolio.",
    type: "announcement",
    createdAt: "2024-12-16T09:15:00Z",
    likes: 27,
    views: 103
  }
];

const mockEvents = [
  {
    id: 1,
    title: "React Masterclass",
    communityName: "Code Crafters",
    type: "webinar",
    date: "2024-12-30T15:00:00Z",
    isRegistered: true
  },
  {
    id: 2,
    title: "Investment Strategies for 2025",
    communityName: "Finance Forum",
    type: "workshop",
    date: "2025-01-05T13:30:00Z",
    isRegistered: false
  }
];

const mockDailyBytes = [
  {
    id: 1,
    title: "CSS Flexbox Tip",
    content: "Use 'flex: 1' to make an element grow to fill available space",
    type: "tip",
    category: "web-development"
  },
  {
    id: 2,
    title: "What's the time complexity of binary search?",
    content: "O(log n)",
    type: "quiz",
    category: "algorithms"
  }
];

const mockDiscussions = [
  {
    id: 1,
    title: "Best resources to learn Data Structures?",
    communityName: "Code Crafters",
    replies: 12,
    lastActive: "2024-12-18T11:30:00Z"
  },
  {
    id: 2,
    title: "How to prepare for product design interviews?",
    communityName: "Design Dialogue",
    replies: 8,
    lastActive: "2024-12-17T16:45:00Z"
  }
];

const mockSubscribedCommunities = [
  {
    id: 1,
    name: "Code Crafters",
    logo: "https://ui-avatars.com/api/?name=Code+Crafters&background=0D8ABC&color=fff",
    unreadCount: 3
  },
  {
    id: 2,
    name: "Finance Forum",
    logo: "https://ui-avatars.com/api/?name=Finance+Forum&background=2AAA8A&color=fff",
    unreadCount: 0
  }
];

const mockProgressStats = {
  streakDays: 7,
  coursesCompleted: 3,
  skillsAcquired: 12,
  projectsFinished: 2
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const [activeStream, setActiveStream] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Get current date for daily bytes section
  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Filter posts by stream
  const filteredPosts = searchQuery 
    ? mockPosts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.communityName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : activeStream === "all" 
      ? mockPosts 
      : mockPosts.filter(post => {
          const community = mockCommunities.find(c => c.id === post.communityId);
          return community?.stream === activeStream;
        });

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Namaste, {user?.name || 'Student'}! 👋</h1>
          <p className="text-muted-foreground mt-1">Let's continue your learning journey today.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden md:block text-sm text-muted-foreground">{currentDate}</span>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content - Left 3 columns */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Learning Streak</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center">
                <div className="text-2xl font-bold mr-2">{mockProgressStats.streakDays} days</div>
                <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                  <Zap className="h-3 w-3 mr-1" /> Active
                </Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Courses Completed</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center">
                <div className="text-2xl font-bold mr-2">{mockProgressStats.coursesCompleted}</div>
                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                  <BookOpen className="h-3 w-3 mr-1" /> Learning
                </Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Skills Acquired</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center">
                <div className="text-2xl font-bold mr-2">{mockProgressStats.skillsAcquired}</div>
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" /> Progress
                </Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Projects Finished</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center">
                <div className="text-2xl font-bold mr-2">{mockProgressStats.projectsFinished}</div>
                <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                  <Layers className="h-3 w-3 mr-1" /> Portfolio
                </Badge>
              </CardContent>
            </Card>
          </div>
          
          {/* Daily Bytes Section */}
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Daily Bytes</CardTitle>
                <CardDescription>Quick learning nuggets for today</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" /> Refresh
              </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockDailyBytes.map((item) => (
                <Card key={item.id} className="bg-muted/50">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base font-medium">{item.title}</CardTitle>
                      <Badge>{item.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="text-sm">{item.content}</p>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Community Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Community Feed</h2>
              <div className="flex space-x-2">
                <div className="relative w-60">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts, communities..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select
                  value={activeStream}
                  onValueChange={(value) => setActiveStream(value)}
                >
                  <SelectTrigger className="w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by stream" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Streams</SelectItem>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="commerce">Commerce</SelectItem>
                    <SelectItem value="arts">Arts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={post.communityLogo} alt={post.communityName} />
                            <AvatarFallback>{post.communityName.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{post.communityName}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span>Posted {new Date(post.createdAt).toLocaleDateString()}</span>
                              <Badge variant="outline" className="ml-2">
                                {post.type}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <Button variant="ghost" size="sm">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-sm text-muted-foreground line-clamp-3">{post.content}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0 text-xs text-muted-foreground">
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3.5 w-3.5" />
                          <span>{post.views} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>Comment</span>
                        </div>
                      </div>
                      <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                        Read more 
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No posts found. Try adjusting your filters.</p>
                </Card>
              )}

              <div className="flex justify-center mt-6">
                <Button>
                  Load more posts
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Right column */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockEvents.map((event) => (
                <div key={event.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{event.title}</p>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {event.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{event.communityName}</p>
                  </div>
                  {event.isRegistered ? (
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                      Registered
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm" className="text-xs h-7">
                      Register
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="link" className="pl-0 text-sm h-auto">
                View all events
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>

          {/* Subscribed Communities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">My Communities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockSubscribedCommunities.map((community) => (
                <div key={community.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={community.logo} alt={community.name} />
                      <AvatarFallback>{community.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{community.name}</span>
                  </div>
                  {community.unreadCount > 0 && (
                    <Badge variant="secondary">
                      {community.unreadCount} new
                    </Badge>
                  )}
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2">
                <Users className="h-4 w-4 mr-2" />
                Explore Communities
              </Button>
            </CardContent>
          </Card>

          {/* Active Discussions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Discussions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockDiscussions.map((discussion) => (
                <div key={discussion.id} className="space-y-1">
                  <p className="font-medium text-sm">{discussion.title}</p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{discussion.communityName}</span>
                    <div className="flex items-center">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      <span>{discussion.replies} replies</span>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="link" className="pl-0 text-sm h-auto">
                See all discussions
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>

          {/* Ask a Question Card */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Have a Question?</CardTitle>
              <CardDescription>Get answers from community experts</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <PlusCircle className="h-4 w-4 mr-2" />
                Ask a Question
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}