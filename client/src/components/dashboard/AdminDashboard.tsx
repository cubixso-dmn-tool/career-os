import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { 
  Bell, Calendar, MessageSquare, 
  TrendingUp, Users, CheckCircle, 
  BarChart, PlusCircle, Search, Filter,
  ArrowRight, FileText, Settings, RefreshCw,
  Megaphone, Briefcase, PenTool, Video,
  Flag, Eye, ThumbsUp, Edit, Trash2, 
  ChevronDown, XCircle, Clock,
  PieChart, BarChart2, LineChart, Activity
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Community } from "@shared/schema";

// Mock data
const mockCommunity = {
  id: 1,
  name: "Code Crafters",
  logo: "https://ui-avatars.com/api/?name=Code+Crafters&background=0D8ABC&color=fff",
  stream: "tech",
  memberCount: 1245,
  isVerified: true,
  description: "A community of passionate developers building amazing projects",
  createdAt: "2023-06-15T12:00:00Z",
  stats: {
    posts: 342,
    events: 28,
    questions: 156,
    activeMembers: 463,
  }
};

const mockPosts = [
  {
    id: 1,
    title: "Web Developer Internship Opportunity - Summer 2025",
    content: "We're looking for enthusiastic web developers for a 3-month internship starting May 2025. Learn from industry experts and work on real-world projects. Stipend offered. Apply by Jan 30.",
    type: "internship",
    createdAt: "2024-12-18T10:30:00Z",
    likes: 45,
    views: 231,
    status: "published",
    isPinned: true,
  },
  {
    id: 2,
    title: "React Masterclass Workshop - January 2025",
    content: "Join our intensive 2-day workshop on React and modern frontend development. Learn components, hooks, state management, and best practices from industry experts.",
    type: "event",
    createdAt: "2024-12-17T14:20:00Z",
    scheduledFor: "2025-01-15T10:30:00Z",
    likes: 32,
    views: 128,
    status: "scheduled",
    isPinned: false,
  },
  {
    id: 3,
    title: "Design Hackathon - Winners Announcement",
    content: "Congratulations to Team Pixel Perfect for winning our annual design hackathon! Their innovative approach to solving the UI/UX challenge impressed all our judges.",
    type: "announcement",
    createdAt: "2024-12-15T16:30:00Z",
    likes: 87,
    views: 312,
    status: "published",
    isPinned: false,
  },
];

const mockEvents = [
  {
    id: 1,
    title: "React Masterclass",
    type: "webinar",
    format: "online",
    startDate: "2025-01-15T10:00:00Z",
    endDate: "2025-01-15T12:00:00Z",
    registrations: 78,
    maxAttendees: 100,
    status: "upcoming"
  },
  {
    id: 2,
    title: "Node.js Beginner Workshop",
    type: "workshop",
    format: "hybrid",
    startDate: "2025-01-22T09:00:00Z",
    endDate: "2025-01-22T17:00:00Z",
    registrations: 45,
    maxAttendees: 50,
    status: "upcoming"
  },
  {
    id: 3,
    title: "Annual Tech Mixer",
    type: "meetup",
    format: "offline",
    startDate: "2024-12-10T18:00:00Z",
    endDate: "2024-12-10T21:00:00Z",
    registrations: 120,
    maxAttendees: 150,
    status: "completed"
  }
];

const mockQuestions = [
  {
    id: 1,
    title: "What's the best resource to learn React hooks?",
    content: "I'm struggling with understanding useEffect and useCallback. Can anyone recommend good tutorials or articles?",
    askedBy: "Priya Sharma",
    askedAt: "2024-12-18T15:20:00Z",
    isAnswered: false,
    upvotes: 8,
    views: 45
  },
  {
    id: 2,
    title: "How to optimize React performance?",
    content: "My React app is getting slower as it grows. What are the best practices for performance optimization?",
    askedBy: "Rahul Patel",
    askedAt: "2024-12-17T12:10:00Z",
    isAnswered: true,
    upvotes: 12,
    views: 78
  }
];

const mockMembers = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: [
    "Aarav Sharma", "Diya Patel", "Arjun Singh", "Ananya Kumar", 
    "Ishaan Verma", "Zara Khan", "Vihaan Mehta", "Anika Gupta", 
    "Reyansh Reddy", "Myra Joshi"
  ][i],
  username: [
    "aarav_dev", "diya_code", "arjun_singh", "ananya_k", 
    "ishaan_v", "zara.khan", "vihaan.m", "anika_gupta", 
    "reyansh22", "myra_j"
  ][i],
  joinedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
  role: i < 2 ? "moderator" : "member",
  lastActive: i < 5 
    ? new Date(Date.now() - Math.floor(Math.random() * 100000000)).toISOString()
    : new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent([
    "Aarav Sharma", "Diya Patel", "Arjun Singh", "Ananya Kumar", 
    "Ishaan Verma", "Zara Khan", "Vihaan Mehta", "Anika Gupta", 
    "Reyansh Reddy", "Myra Joshi"
  ][i])}&background=random`
}));

const mockAnalytics = {
  postEngagement: [42, 58, 69, 47, 63, 51, 72, 65, 59, 82, 75, 68],
  memberGrowth: [210, 230, 265, 285, 315, 355, 384, 410, 450, 495, 520, 563],
  questionActivity: [18, 22, 16, 27, 31, 24, 35, 29, 38, 43, 37, 41],
  eventAttendance: [65, 72, 78, 70, 85, 88, 76, 90, 82, 92, 89, 94]
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("content");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [postTypeFilter, setPostTypeFilter] = useState<string>("all");
  const [postStatusFilter, setPostStatusFilter] = useState<string>("all");
  const [currentPostForm, setCurrentPostForm] = useState({
    title: "",
    content: "",
    type: "announcement",
    scheduledFor: ""
  });
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Function to format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter posts based on search, type, and status
  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = postTypeFilter === "all" || post.type === postTypeFilter;
    const matchesStatus = postStatusFilter === "all" || post.status === postStatusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Handle form submit for new post
  const handleSubmitPost = () => {
    console.log("Creating new post:", currentPostForm);
    setShowNewPostDialog(false);
    // Reset form
    setCurrentPostForm({
      title: "",
      content: "",
      type: "announcement",
      scheduledFor: ""
    });
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      {/* Community Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-lg border">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={mockCommunity.logo} alt={mockCommunity.name} />
            <AvatarFallback>{mockCommunity.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center">
              <h1 className="text-xl font-bold">{mockCommunity.name}</h1>
              {mockCommunity.isVerified && (
                <Badge className="ml-2 bg-blue-100 text-blue-700 hover:bg-blue-100">Verified</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {mockCommunity.memberCount.toLocaleString()} members · Created {formatDate(mockCommunity.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Invite Members
          </Button>
        </div>
      </div>

      {/* Admin Dashboard Tabs */}
      <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="content" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Content</span>
              <span className="md:hidden">Content</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Events</span>
              <span className="md:hidden">Events</span>
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Members</span>
              <span className="md:hidden">Members</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Analytics</span>
              <span className="md:hidden">Analytics</span>
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
          </div>
        </div>

        {/* Content Management Tab */}
        <TabsContent value="content" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold">Content Management</h2>
            <div className="flex gap-3 w-full sm:w-auto">
              <Dialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create New Post</DialogTitle>
                    <DialogDescription>
                      Create content for your community. You can publish it immediately or schedule it for later.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="title" className="text-sm font-medium">Title</label>
                      <Input 
                        id="title" 
                        placeholder="Enter post title" 
                        value={currentPostForm.title}
                        onChange={(e) => setCurrentPostForm({...currentPostForm, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="content" className="text-sm font-medium">Content</label>
                      <Textarea 
                        id="content" 
                        placeholder="Enter post content" 
                        className="h-32"
                        value={currentPostForm.content}
                        onChange={(e) => setCurrentPostForm({...currentPostForm, content: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="type" className="text-sm font-medium">Post Type</label>
                        <Select
                          value={currentPostForm.type}
                          onValueChange={(value) => setCurrentPostForm({...currentPostForm, type: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select post type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="announcement">Announcement</SelectItem>
                            <SelectItem value="event">Event</SelectItem>
                            <SelectItem value="blog">Blog Post</SelectItem>
                            <SelectItem value="job">Job</SelectItem>
                            <SelectItem value="internship">Internship</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="scheduledFor" className="text-sm font-medium">Schedule (Optional)</label>
                        <Input 
                          id="scheduledFor" 
                          type="datetime-local" 
                          value={currentPostForm.scheduledFor}
                          onChange={(e) => setCurrentPostForm({...currentPostForm, scheduledFor: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowNewPostDialog(false)}>Cancel</Button>
                    <Button onClick={handleSubmitPost}>
                      {currentPostForm.scheduledFor ? "Schedule Post" : "Publish Now"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Content Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={postTypeFilter}
              onValueChange={setPostTypeFilter}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="announcement">Announcements</SelectItem>
                <SelectItem value="event">Events</SelectItem>
                <SelectItem value="blog">Blog Posts</SelectItem>
                <SelectItem value="job">Jobs</SelectItem>
                <SelectItem value="internship">Internships</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={postStatusFilter}
              onValueChange={setPostStatusFilter}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Posts Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Engagement</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-start gap-2">
                        {post.isPinned && (
                          <Badge variant="outline" className="shrink-0 bg-gray-50 text-gray-700 px-1 py-0">
                            Pinned
                          </Badge>
                        )}
                        <span className="line-clamp-1">{post.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        post.type === 'announcement' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        post.type === 'event' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        post.type === 'job' ? 'bg-green-50 text-green-700 border-green-200' :
                        post.type === 'internship' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        'bg-gray-50 text-gray-700 border-gray-200'
                      }>
                        {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDate(post.createdAt)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={
                        post.status === 'published' ? 'default' :
                        post.status === 'scheduled' ? 'outline' :
                        'secondary'
                      }>
                        {post.status === 'scheduled' && <Clock className="h-3 w-3 mr-1" />}
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        {post.status === 'scheduled' && post.scheduledFor && (
                          <span className="ml-1 text-xs">
                            ({formatDate(post.scheduledFor)})
                          </span>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-3">
                        <div className="flex items-center text-xs">
                          <Eye className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>{post.views}</span>
                        </div>
                        <div className="flex items-center text-xs">
                          <ThumbsUp className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>{post.likes}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {post.isPinned ? (
                              <DropdownMenuItem>
                                <XCircle className="h-4 w-4 mr-2" />
                                Unpin
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Pin to Top
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPosts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No posts found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Events Management Tab */}
        <TabsContent value="events" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Events Management</h2>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead className="text-center">Registrations</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockEvents.filter(event => event.status === "upcoming").map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            event.type === 'webinar' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            event.type === 'workshop' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            event.type === 'hackathon' ? 'bg-green-50 text-green-700 border-green-200' :
                            'bg-orange-50 text-orange-700 border-orange-200'
                          }>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{formatDate(event.startDate)}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatTime(event.startDate)} - {formatTime(event.endDate)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {event.format.charAt(0).toUpperCase() + event.format.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div>
                            <div className="text-sm">{event.registrations}/{event.maxAttendees}</div>
                            <Progress 
                              value={(event.registrations / event.maxAttendees) * 100} 
                              className="h-2 mt-1"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Users className="h-4 w-4 mr-2" />
                                View Attendees
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Megaphone className="h-4 w-4 mr-2" />
                                Send Reminder
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Cancel Event
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {mockEvents.filter(event => event.status === "upcoming").length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No upcoming events scheduled.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Create Event</CardTitle>
                <CardDescription>Schedule your next community gathering</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="font-medium text-sm">Event Type</div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="justify-start" size="sm">
                      <Video className="h-4 w-4 mr-2" />
                      Webinar
                    </Button>
                    <Button variant="outline" className="justify-start" size="sm">
                      <PenTool className="h-4 w-4 mr-2" />
                      Workshop
                    </Button>
                    <Button variant="outline" className="justify-start" size="sm">
                      <Users className="h-4 w-4 mr-2" />
                      Meetup
                    </Button>
                    <Button variant="outline" className="justify-start" size="sm">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Hackathon
                    </Button>
                  </div>
                </div>
                <Button className="w-full">Create New Event</Button>
              </CardContent>
            </Card>
          </div>

          <h3 className="text-lg font-semibold mt-6">Past Events</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-center">Attendance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockEvents.filter(event => event.status === "completed").map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">
                      <div>{event.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)} · {event.format.charAt(0).toUpperCase() + event.format.slice(1)}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(event.startDate)}</TableCell>
                    <TableCell className="text-center">
                      {event.registrations} attendees
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">View Report</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Member Management Tab */}
        <TabsContent value="members" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Member Management</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Invite Members
              </Button>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                className="pl-8"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="moderator">Moderators</SelectItem>
                <SelectItem value="member">Members</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Member</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{member.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>@{member.username}</TableCell>
                    <TableCell>{formatDate(member.joinedAt)}</TableCell>
                    <TableCell>
                      {new Date(member.lastActive).getTime() > Date.now() - 86400000 * 2
                        ? 'Today'
                        : new Date(member.lastActive).getTime() > Date.now() - 86400000 * 7
                        ? 'This week'
                        : formatDate(member.lastActive)
                      }
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.role === 'moderator' ? 'default' : 'secondary'}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </DropdownMenuItem>
                          {member.role === 'member' ? (
                            <DropdownMenuItem>
                              <Users className="h-4 w-4 mr-2" />
                              Make Moderator
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>
                              <Users className="h-4 w-4 mr-2" />
                              Remove Moderator
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Flag className="h-4 w-4 mr-2" />
                            Ban Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Community Analytics</h2>
            <Select defaultValue="30days">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="12months">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Member Count</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockCommunity.memberCount.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">+87 in the last 30 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Engagement Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">36.2%</div>
                <p className="text-xs text-green-600 mt-1">+4.7% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockCommunity.stats.activeMembers}</div>
                <p className="text-xs text-muted-foreground mt-1">37.2% of total members</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Posts & Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockCommunity.stats.posts + mockCommunity.stats.events}</div>
                <p className="text-xs text-muted-foreground mt-1">{mockCommunity.stats.posts} posts, {mockCommunity.stats.events} events</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Member Growth</CardTitle>
                <CardDescription>New members joining each month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-end justify-between">
                  {mockAnalytics.memberGrowth.map((value, index) => (
                    <div key={index} className="relative h-full flex flex-col justify-end items-center gap-2">
                      <div 
                        className="w-12 bg-primary/80 rounded-t-sm hover:bg-primary transition-colors"
                        style={{ height: `${(value / Math.max(...mockAnalytics.memberGrowth)) * 80}%` }}
                      />
                      <span className="text-xs text-muted-foreground absolute bottom-0 -mb-5">{months[index]}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Content Engagement</CardTitle>
                <CardDescription>Post interactions & event attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-end justify-between">
                  {months.map((month, index) => (
                    <div key={index} className="relative h-full flex flex-col justify-end items-center gap-2">
                      <div className="flex flex-col items-center w-12">
                        <div 
                          className="w-6 bg-blue-500/80 rounded-t-sm"
                          style={{ height: `${(mockAnalytics.postEngagement[index] / 100) * 80}%` }}
                          title={`Posts: ${mockAnalytics.postEngagement[index]}`}
                        />
                        <div 
                          className="w-6 bg-green-500/80 rounded-t-sm"
                          style={{ height: `${(mockAnalytics.eventAttendance[index] / 100) * 80}%` }}
                          title={`Events: ${mockAnalytics.eventAttendance[index]}%`}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground absolute bottom-0 -mb-5">{months[index]}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-6 mt-8">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                    <span className="text-sm">Post Interactions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                    <span className="text-sm">Event Attendance</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Member Activity by Section</CardTitle>
              <CardDescription>How members are engaging with different parts of the community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Posts & Comments</span>
                    <span className="font-medium">67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Event Participation</span>
                    <span className="font-medium">42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Q&A Engagement</span>
                    <span className="font-medium">31%</span>
                  </div>
                  <Progress value={31} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Poll Participation</span>
                    <span className="font-medium">56%</span>
                  </div>
                  <Progress value={56} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}