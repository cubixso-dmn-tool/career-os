import React, { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  Home, Users, Calendar, Settings, MessageSquare, FileText, Briefcase, 
  BarChart, MessageCircle, UserPlus, Shield, PlusCircle, ArrowLeft,
  ImagePlus, Info, Bell, Flag, ExternalLink, Trash2, Edit, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';

// Types
type Community = {
  id: number;
  name: string;
  description: string;
  founderId: number;
  category: string;
  isVerified: boolean;
  logo?: string | null;
  banner?: string | null;
  memberCount: number;
  createdAt: string;
  founderName: string;
  rules?: string[];
  links?: { title: string; url: string }[];
};

type CommunityMember = {
  userId: number;
  communityId: number;
  name: string;
  avatar?: string;
  role: 'member' | 'moderator' | 'admin';
  joinedAt: string;
  isActive: boolean;
};

type CommunityPost = {
  id: number;
  communityId: number;
  authorId: number;
  authorName: string;
  authorAvatar?: string;
  title: string;
  content: string;
  type: 'announcement' | 'discussion' | 'event' | 'job' | 'blog';
  createdAt: string;
  commentCount: number;
  isFeatured: boolean;
  likes: number;
};

type CommunityEvent = {
  id: number;
  communityId: number;
  organizerId: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  isOnline: boolean;
  attendeeCount: number;
};

type CommunityStats = {
  totalMembers: number;
  activeMembers: number;
  totalPosts: number;
  totalEvents: number;
  engagementRate: number;
  memberGrowth: { date: string; count: number }[];
  postEngagement: { date: string; count: number }[];
  newJoins: number;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const getPostTypeIcon = (type: string) => {
  switch(type) {
    case 'announcement': return <Info className="h-4 w-4" />;
    case 'discussion': return <MessageCircle className="h-4 w-4" />;
    case 'event': return <Calendar className="h-4 w-4" />;
    case 'job': return <Briefcase className="h-4 w-4" />;
    case 'blog': return <FileText className="h-4 w-4" />;
    default: return <MessageCircle className="h-4 w-4" />;
  }
};

const CommunityManagement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch community data
  const { data: community, isLoading: isLoadingCommunity } = useQuery<Community>({
    queryKey: [`/api/communities/${id}`],
    enabled: !!id,
  });

  // Fetch community members
  const { data: members = [], isLoading: isLoadingMembers } = useQuery<CommunityMember[]>({
    queryKey: [`/api/communities/${id}/members`],
    enabled: !!id,
  });

  // Fetch community posts
  const { data: posts = [], isLoading: isLoadingPosts } = useQuery<CommunityPost[]>({
    queryKey: [`/api/communities/${id}/posts`],
    enabled: !!id,
  });

  // Fetch community events
  const { data: events = [], isLoading: isLoadingEvents } = useQuery<CommunityEvent[]>({
    queryKey: [`/api/communities/${id}/events`],
    enabled: !!id,
  });

  // Fetch community stats
  const { data: stats, isLoading: isLoadingStats } = useQuery<CommunityStats>({
    queryKey: [`/api/communities/${id}/stats`],
    enabled: !!id,
  });

  // Check if user is authorized to manage this community
  const isFounder = community && user ? community.founderId === user.id : false;
  const isAdmin = members.some(member => member.userId === user?.id && (member.role === 'admin' || member.role === 'moderator'));
  const canManage = isFounder || isAdmin;

  if (isLoadingCommunity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="ml-3">Loading community management dashboard...</p>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Users className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Community Not Found</h2>
        <p className="text-gray-600 mb-6">The community you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/communities')}>
          Back to Communities
        </Button>
      </div>
    );
  }

  if (!canManage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Shield className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6">You don't have permission to manage this community.</p>
        <Button onClick={() => navigate(`/communities/${id}`)}>
          View Community
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2"
                onClick={() => navigate(`/communities/${id}`)}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Community
              </Button>
              <Separator orientation="vertical" className="h-6 mx-2" />
              <h1 className="text-xl font-bold flex items-center">
                {community.name}
                {community.isVerified && (
                  <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-600 border-blue-200 text-xs">
                    Verified
                  </Badge>
                )}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/communities/${id}`)}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                View Public Page
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Management Interface */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="font-semibold">Management</h2>
              </div>
              <nav className="space-y-1 p-2">
                <Button
                  variant={activeTab === "overview" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("overview")}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Overview
                </Button>
                <Button
                  variant={activeTab === "posts" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("posts")}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Posts
                </Button>
                <Button
                  variant={activeTab === "events" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("events")}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Events
                </Button>
                <Button
                  variant={activeTab === "members" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("members")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Members
                </Button>
                <Button
                  variant={activeTab === "analytics" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("analytics")}
                >
                  <BarChart className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
                <Button
                  variant={activeTab === "settings" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Total Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{community.memberCount}</div>
                      {stats && (
                        <p className="text-xs text-green-500">+{stats.newJoins} this week</p>
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Total Posts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{posts.length}</div>
                      <p className="text-xs text-gray-500">Across all categories</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Upcoming Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{events.length}</div>
                      <p className="text-xs text-gray-500">In the next 30 days</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest posts and events</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {posts.length === 0 && events.length === 0 ? (
                        <div className="text-center py-6">
                          <p className="text-gray-500">No recent activity</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {[...posts, ...events.map(e => ({
                            id: e.id,
                            communityId: e.communityId,
                            authorId: e.organizerId,
                            authorName: "Event Organizer", // Placeholder
                            title: e.title,
                            content: e.description,
                            type: "event" as const,
                            createdAt: e.startDate,
                            commentCount: 0,
                            isFeatured: false,
                            likes: 0
                          }))]
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .slice(0, 5)
                            .map(item => (
                              <div key={`${item.type}-${item.id}`} className="flex items-start py-2 border-b last:border-b-0">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                  {getPostTypeIcon(item.type)}
                                </div>
                                <div>
                                  <div className="font-medium">{item.title}</div>
                                  <div className="text-sm text-gray-500">
                                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)} • {formatDate(item.createdAt)}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <div className="w-full flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setActiveTab("posts")}
                        >
                          View All Posts
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setActiveTab("events")}
                        >
                          View All Events
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>

                  {/* New Members */}
                  <Card>
                    <CardHeader>
                      <CardTitle>New Members</CardTitle>
                      <CardDescription>Recently joined community members</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {members.length === 0 ? (
                        <div className="text-center py-6">
                          <p className="text-gray-500">No members yet</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {members
                            .sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime())
                            .slice(0, 5)
                            .map(member => (
                              <div key={member.userId} className="flex items-center">
                                <Avatar className="h-10 w-10 mr-3">
                                  <AvatarImage src={member.avatar} />
                                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{member.name}</div>
                                  <div className="text-sm text-gray-500">
                                    Joined {formatDate(member.joinedAt)}
                                  </div>
                                </div>
                                {member.role !== 'member' && (
                                  <Badge variant="outline" className="ml-auto capitalize">
                                    {member.role}
                                  </Badge>
                                )}
                              </div>
                            ))}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setActiveTab("members")}
                      >
                        View All Members
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Manage your community with these commonly used actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <Button 
                        className="h-auto py-6 flex flex-col"
                        onClick={() => navigate(`/communities/${id}/post/new?type=announcement`)}
                      >
                        <Bell className="h-6 w-6 mb-2" />
                        <span>Post Announcement</span>
                      </Button>
                      <Button 
                        className="h-auto py-6 flex flex-col"
                        variant="outline"
                        onClick={() => navigate(`/communities/${id}/event/new`)}
                      >
                        <Calendar className="h-6 w-6 mb-2" />
                        <span>Create Event</span>
                      </Button>
                      <Button 
                        className="h-auto py-6 flex flex-col"
                        variant="outline"
                        onClick={() => navigate(`/communities/${id}/post/new?type=job`)}
                      >
                        <Briefcase className="h-6 w-6 mb-2" />
                        <span>Post Job</span>
                      </Button>
                      <Button 
                        className="h-auto py-6 flex flex-col"
                        variant="outline"
                        onClick={() => setActiveTab("settings")}
                      >
                        <Settings className="h-6 w-6 mb-2" />
                        <span>Edit Settings</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === "posts" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Manage Posts</h2>
                  <Button onClick={() => navigate(`/communities/${id}/post/new`)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create New Post
                  </Button>
                </div>

                <Tabs defaultValue="all">
                  <TabsList>
                    <TabsTrigger value="all">All Posts</TabsTrigger>
                    <TabsTrigger value="announcements">Announcements</TabsTrigger>
                    <TabsTrigger value="discussions">Discussions</TabsTrigger>
                    <TabsTrigger value="jobs">Job Listings</TabsTrigger>
                    <TabsTrigger value="blogs">Blog Posts</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-6">
                    {isLoadingPosts ? (
                      <div className="text-center py-8">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p>Loading posts...</p>
                      </div>
                    ) : posts.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-lg font-medium mb-2">No Posts Yet</h3>
                        <p className="text-gray-500 mb-6">Start creating content for your community.</p>
                        <Button onClick={() => navigate(`/communities/${id}/post/new`)}>
                          Create First Post
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {posts.map(post => (
                                <tr key={post.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900 truncate max-w-xs">{post.title}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge variant="outline" className="capitalize flex items-center">
                                      {getPostTypeIcon(post.type)}
                                      <span className="ml-1">{post.type}</span>
                                    </Badge>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <Avatar className="h-6 w-6 mr-2">
                                        <AvatarImage src={post.authorAvatar} />
                                        <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm">{post.authorName}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(post.createdAt)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex items-center space-x-2">
                                      <span>{post.likes} likes</span>
                                      <span>•</span>
                                      <span>{post.commentCount} comments</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                    <div className="flex justify-center space-x-2">
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => navigate(`/communities/${id}/post/${post.id}/edit`)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* Other post type tabs would follow the same pattern */}
                  <TabsContent value="announcements" className="mt-6">
                    {/* Similar to 'all' tab but filtered for announcements */}
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === "events" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Manage Events</h2>
                  <Button onClick={() => navigate(`/communities/${id}/event/new`)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create New Event
                  </Button>
                </div>

                <Tabs defaultValue="upcoming">
                  <TabsList>
                    <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                    <TabsTrigger value="past">Past Events</TabsTrigger>
                  </TabsList>

                  <TabsContent value="upcoming" className="mt-6">
                    {isLoadingEvents ? (
                      <div className="text-center py-8">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p>Loading events...</p>
                      </div>
                    ) : events.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-lg font-medium mb-2">No Upcoming Events</h3>
                        <p className="text-gray-500 mb-6">Schedule your first community event.</p>
                        <Button onClick={() => navigate(`/communities/${id}/event/new`)}>
                          Create First Event
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {events.map(event => (
                          <Card key={event.id}>
                            <CardHeader>
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle>{event.title}</CardTitle>
                                  <CardDescription>
                                    {new Date(event.startDate).toLocaleDateString()} at {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </CardDescription>
                                </div>
                                <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                                  {event.isOnline ? 'Online Event' : 'In-person Event'}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-gray-700">{event.description}</p>
                              <div className="flex items-center mt-4 text-sm text-gray-500">
                                <div className="flex items-center mr-4">
                                  <Users className="h-4 w-4 mr-1" />
                                  <span>{event.attendeeCount} attending</span>
                                </div>
                                {!event.isOnline && (
                                  <div className="flex items-center">
                                    <Globe className="h-4 w-4 mr-1" />
                                    <span>{event.location}</span>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-end space-x-2">
                              <Button 
                                variant="outline"
                                onClick={() => navigate(`/communities/${id}/event/${event.id}/edit`)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Cancel Event
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="past" className="mt-6">
                    {/* Similar to 'upcoming' tab but filtered for past events */}
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* Members Tab */}
            {activeTab === "members" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Manage Members</h2>
                  <Button onClick={() => {/* Invite members flow */}}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Members
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Community Members</CardTitle>
                      <div className="flex items-center">
                        <Input
                          placeholder="Search members..."
                          className="w-64 mr-2"
                        />
                        <Button variant="outline" size="sm">
                          Search
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoadingMembers ? (
                      <div className="text-center py-8">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p>Loading members...</p>
                      </div>
                    ) : members.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-lg font-medium mb-2">No Members Yet</h3>
                        <p className="text-gray-500">Invite people to join your community.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {members.map(member => (
                              <tr key={member.userId} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <Avatar className="h-8 w-8 mr-3">
                                      <AvatarImage src={member.avatar} />
                                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="font-medium">{member.name}</div>
                                      {member.userId === community.founderId && (
                                        <div className="text-xs text-gray-500">Community Founder</div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Badge variant="outline" className="capitalize">
                                    {member.role}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(member.joinedAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Badge className={member.isActive ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}>
                                    {member.isActive ? "Active" : "Inactive"}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <div className="flex justify-center space-x-2">
                                    {member.userId !== community.founderId && (
                                      <>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                        >
                                          Change Role
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                          Remove
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Community Analytics</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Engagement Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stats ? `${(stats.engagementRate * 100).toFixed(1)}%` : 'N/A'}
                      </div>
                      <p className="text-xs text-gray-500">Based on posts, comments, likes</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Active Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stats ? stats.activeMembers : 'N/A'}
                      </div>
                      <p className="text-xs text-gray-500">Of {community.memberCount} total</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Total Post Views</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">N/A</div>
                      <p className="text-xs text-gray-500">Analytics in development</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts and detailed analytics would go here */}
                <Card>
                  <CardHeader>
                    <CardTitle>Growth & Engagement</CardTitle>
                    <CardDescription>Community metrics over time</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-lg font-medium mb-2">Detailed Analytics Coming Soon</h3>
                      <p className="text-gray-500">
                        We're working on building comprehensive analytics for community founders.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Community Settings</h2>
                
                <Card>
                  <CardHeader>
                    <CardTitle>General Information</CardTitle>
                    <CardDescription>Basic details about your community</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Community Name</label>
                        <Input defaultValue={community.name} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <Textarea 
                          defaultValue={community.description} 
                          className="min-h-32"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <Input defaultValue={community.category} />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Community Images</CardTitle>
                    <CardDescription>Update your community's visual identity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Logo Image</label>
                        <div className="flex items-center">
                          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                            {community.logo ? (
                              <img 
                                src={community.logo} 
                                alt="Community logo" 
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <Users className="h-10 w-10 text-gray-400" />
                            )}
                          </div>
                          <Button>
                            <ImagePlus className="h-4 w-4 mr-2" />
                            Upload Logo
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Banner Image</label>
                        <div className="flex items-center">
                          <div className="w-40 h-24 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                            {community.banner ? (
                              <img 
                                src={community.banner} 
                                alt="Community banner" 
                                className="w-full h-full rounded-md object-cover"
                              />
                            ) : (
                              <ImagePlus className="h-10 w-10 text-gray-400" />
                            )}
                          </div>
                          <Button>
                            <ImagePlus className="h-4 w-4 mr-2" />
                            Upload Banner
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Community Rules</CardTitle>
                    <CardDescription>Set guidelines for your community members</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Enter community rules, one per line..."
                      className="min-h-32"
                      defaultValue={community.rules?.join('\n')}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button>Save Rules</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Danger Zone</CardTitle>
                    <CardDescription className="text-red-500">
                      These actions cannot be undone
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 border border-red-200 rounded-md">
                        <div>
                          <h4 className="font-semibold">Archive Community</h4>
                          <p className="text-sm text-gray-500">
                            Community will be hidden from public view but data will be preserved
                          </p>
                        </div>
                        <Button variant="outline" className="border-red-200 text-red-500 hover:text-red-700 hover:bg-red-50">
                          Archive
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 border border-red-200 rounded-md">
                        <div>
                          <h4 className="font-semibold">Delete Community</h4>
                          <p className="text-sm text-gray-500">
                            This will permanently delete all community data
                          </p>
                        </div>
                        <Button variant="destructive">
                          Delete Forever
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityManagement;