import React, { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, Calendar, Award, MessageSquare, ArrowLeft, Bell, BellOff, Share2, Flag,
  FileText, Briefcase, Globe, Info, MoreVertical, PlusCircle, Edit, MessageCircle,
  CalendarDays, Vote, Activity, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
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

type CommunityMember = {
  userId: number;
  communityId: number;
  name: string;
  avatar?: string;
  role: 'member' | 'moderator' | 'admin';
  joinedAt: string;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getPostTypeIcon = (type: string) => {
  switch(type) {
    case 'announcement': return <Info className="h-4 w-4" />;
    case 'discussion': return <MessageCircle className="h-4 w-4" />;
    case 'event': return <CalendarDays className="h-4 w-4" />;
    case 'job': return <Briefcase className="h-4 w-4" />;
    case 'blog': return <FileText className="h-4 w-4" />;
    default: return <MessageCircle className="h-4 w-4" />;
  }
};

const getPostTypeBadge = (type: string) => {
  switch(type) {
    case 'announcement':
      return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Announcement</Badge>;
    case 'discussion':
      return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Discussion</Badge>;
    case 'event':
      return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">Event</Badge>;
    case 'job':
      return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Job Opportunity</Badge>;
    case 'blog':
      return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Blog Post</Badge>;
    default:
      return <Badge variant="outline">Post</Badge>;
  }
};

const getCommunityTypeIcon = (category: string) => {
  switch(category.toLowerCase()) {
    case 'tech': return <Globe className="h-4 w-4" />;
    case 'education': return <Award className="h-4 w-4" />;
    case 'career': return <Briefcase className="h-4 w-4" />;
    default: return <Users className="h-4 w-4" />;
  }
};

const CommunityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isMember, setIsMember] = useState(false);

  // Fetch community data
  const { data: community, isLoading: isLoadingCommunity } = useQuery<Community>({
    queryKey: [`/api/communities/${id}`],
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

  // Fetch community members
  const { data: members = [], isLoading: isLoadingMembers } = useQuery<CommunityMember[]>({
    queryKey: [`/api/communities/${id}/members`],
    enabled: !!id,
  });

  const isFounder = community && user ? community.founderId === user.id : false;
  const isAdmin = members.some(member => member.userId === user?.id && (member.role === 'admin' || member.role === 'moderator'));
  const canManage = isFounder || isAdmin;

  if (isLoadingCommunity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="ml-3">Loading community...</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Community Header / Banner */}
      <div className="relative">
        {community.banner ? (
          <div className="h-64 bg-gray-200">
            <img 
              src={community.banner} 
              alt={`${community.name} banner`} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          </div>
        ) : (
          <div className="h-64 bg-gradient-to-r from-primary/20 to-primary/5"></div>
        )}

        {/* Back button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="absolute top-4 left-4 bg-white/90"
          onClick={() => navigate('/communities')}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white/90"
            onClick={() => setIsSubscribed(!isSubscribed)}
          >
            {isSubscribed ? (
              <>
                <BellOff className="h-4 w-4 mr-1" />
                Unsubscribe
              </>
            ) : (
              <>
                <Bell className="h-4 w-4 mr-1" />
                Subscribe
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white/90"
          >
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-white/90">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canManage && (
                <DropdownMenuItem onClick={() => navigate(`/communities/${id}/manage`)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Community
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Flag className="h-4 w-4 mr-2" />
                Report Community
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Community info card (positioned over the banner) */}
        <div className="container mx-auto px-4">
          <div className="relative -mt-24">
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="flex items-center mb-4 md:mb-0 md:mr-6">
                    <div className="w-20 h-20 rounded-full bg-white p-1 shadow-md mr-4">
                      {community.logo ? (
                        <img 
                          src={community.logo} 
                          alt={community.name} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-10 w-10 text-primary" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <CardTitle className="text-2xl">{community.name}</CardTitle>
                        {community.isVerified && (
                          <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-600 border-blue-200">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="flex items-center">
                          {getCommunityTypeIcon(community.category)}
                          <span className="ml-1">{community.category}</span>
                        </Badge>
                        <CardDescription className="ml-3">
                          Founded by {community.founderName} · {new Date(community.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 md:ml-auto">
                    {user && (isMember ? (
                      <Button variant="outline" onClick={() => setIsMember(false)}>
                        Leave Community
                      </Button>
                    ) : (
                      <Button onClick={() => setIsMember(true)}>
                        Join Community
                      </Button>
                    ))}
                    
                    {canManage && (
                      <Button variant="outline" onClick={() => navigate(`/communities/${id}/manage`)}>
                        <Settings className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
                  <div className="flex items-center mr-6 mb-2">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{community.memberCount} members</span>
                  </div>
                  <div className="flex items-center mr-6 mb-2">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>{posts.length} posts</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{events.length} upcoming events</span>
                  </div>
                </div>
                
                <p className="text-gray-700">{community.description}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Community Content (Left and Center) */}
          <div className="md:col-span-2">
            <Tabs defaultValue="discussions">
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="discussions">Discussions</TabsTrigger>
                  <TabsTrigger value="announcements">Announcements</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                  <TabsTrigger value="jobs">Jobs</TabsTrigger>
                </TabsList>
              </div>

              {/* Create Post Button */}
              {isMember && (
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between">
                  <Button onClick={() => navigate(`/communities/${id}/post/new`)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create New Post
                  </Button>
                  <Button variant="outline" onClick={() => navigate(`/communities/${id}/event/new`)}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </div>
              )}

              {/* Discussions Tab */}
              <TabsContent value="discussions">
                {isLoadingPosts ? (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Loading discussions...</p>
                  </div>
                ) : posts.filter(post => post.type === 'discussion').length > 0 ? (
                  <div className="space-y-4">
                    {posts
                      .filter(post => post.type === 'discussion')
                      .map(post => (
                        <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center">
                                <Avatar className="h-10 w-10 mr-2">
                                  <AvatarImage src={post.authorAvatar} />
                                  <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{post.authorName}</div>
                                  <div className="text-sm text-gray-500">{formatDate(post.createdAt)}</div>
                                </div>
                              </div>
                              {getPostTypeBadge(post.type)}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                            <p className="text-gray-700 line-clamp-3">{post.content}</p>
                          </CardContent>
                          <CardFooter className="border-t pt-3 flex justify-between">
                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center">
                                <Activity className="h-4 w-4 mr-1 text-gray-500" />
                                <span>{post.likes} likes</span>
                              </div>
                              <div className="flex items-center">
                                <MessageSquare className="h-4 w-4 mr-1 text-gray-500" />
                                <span>{post.commentCount} comments</span>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              className="text-primary"
                              onClick={() => navigate(`/communities/${id}/post/${post.id}`)}
                            >
                              View Discussion
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-2">No Discussions Yet</h3>
                    <p className="text-gray-500 mb-6">Be the first to start a discussion in this community.</p>
                    {isMember ? (
                      <Button onClick={() => navigate(`/communities/${id}/post/new`)}>
                        Start a Discussion
                      </Button>
                    ) : user ? (
                      <Button onClick={() => setIsMember(true)}>
                        Join to Participate
                      </Button>
                    ) : (
                      <Button onClick={() => navigate('/login')}>
                        Sign in to Participate
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* Announcements Tab */}
              <TabsContent value="announcements">
                {isLoadingPosts ? (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Loading announcements...</p>
                  </div>
                ) : posts.filter(post => post.type === 'announcement').length > 0 ? (
                  <div className="space-y-4">
                    {posts
                      .filter(post => post.type === 'announcement')
                      .map(post => (
                        <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center">
                                <Avatar className="h-10 w-10 mr-2">
                                  <AvatarImage src={post.authorAvatar} />
                                  <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{post.authorName}</div>
                                  <div className="text-sm text-gray-500">{formatDate(post.createdAt)}</div>
                                </div>
                              </div>
                              {getPostTypeBadge(post.type)}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                            <p className="text-gray-700 line-clamp-3">{post.content}</p>
                          </CardContent>
                          <CardFooter className="border-t pt-3 flex justify-between">
                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center">
                                <Activity className="h-4 w-4 mr-1 text-gray-500" />
                                <span>{post.likes} likes</span>
                              </div>
                              <div className="flex items-center">
                                <MessageSquare className="h-4 w-4 mr-1 text-gray-500" />
                                <span>{post.commentCount} comments</span>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              className="text-primary"
                              onClick={() => navigate(`/communities/${id}/post/${post.id}`)}
                            >
                              View Announcement
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <Info className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-2">No Announcements</h3>
                    <p className="text-gray-500 mb-6">There are no announcements in this community yet.</p>
                    {canManage && (
                      <Button onClick={() => navigate(`/communities/${id}/post/new?type=announcement`)}>
                        Create Announcement
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* Events Tab */}
              <TabsContent value="events">
                {isLoadingEvents ? (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Loading events...</p>
                  </div>
                ) : events.length > 0 ? (
                  <div className="space-y-4">
                    {events.map(event => (
                      <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl">{event.title}</CardTitle>
                              <div className="text-sm text-gray-500">
                                {new Date(event.startDate).toLocaleDateString()} at {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                              {event.isOnline ? 'Online Event' : 'In-person Event'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 line-clamp-3">{event.description}</p>
                          <div className="flex items-center mt-3 text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>
                              {formatDateTime(event.startDate)} - {formatDateTime(event.endDate)}
                            </span>
                          </div>
                          {!event.isOnline && (
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <Globe className="h-4 w-4 mr-1" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="border-t pt-3 flex justify-between">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-gray-500" />
                            <span>{event.attendeeCount} attending</span>
                          </div>
                          <div className="space-x-2">
                            <Button 
                              variant="outline"
                              onClick={() => navigate(`/communities/${id}/event/${event.id}`)}
                            >
                              View Details
                            </Button>
                            {user && (
                              <Button>
                                Attend Event
                              </Button>
                            )}
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-2">No Upcoming Events</h3>
                    <p className="text-gray-500 mb-6">There are no events scheduled in this community.</p>
                    {isMember && (
                      <Button onClick={() => navigate(`/communities/${id}/event/new`)}>
                        Create an Event
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* Jobs Tab */}
              <TabsContent value="jobs">
                {isLoadingPosts ? (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Loading job opportunities...</p>
                  </div>
                ) : posts.filter(post => post.type === 'job').length > 0 ? (
                  <div className="space-y-4">
                    {posts
                      .filter(post => post.type === 'job')
                      .map(post => (
                        <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center">
                                <Avatar className="h-10 w-10 mr-2">
                                  <AvatarImage src={post.authorAvatar} />
                                  <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{post.authorName}</div>
                                  <div className="text-sm text-gray-500">{formatDate(post.createdAt)}</div>
                                </div>
                              </div>
                              {getPostTypeBadge(post.type)}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                            <p className="text-gray-700 line-clamp-3">{post.content}</p>
                          </CardContent>
                          <CardFooter className="border-t pt-3 flex justify-between">
                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center">
                                <Activity className="h-4 w-4 mr-1 text-gray-500" />
                                <span>{post.likes} likes</span>
                              </div>
                              <div className="flex items-center">
                                <MessageSquare className="h-4 w-4 mr-1 text-gray-500" />
                                <span>{post.commentCount} comments</span>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              className="text-primary"
                              onClick={() => navigate(`/communities/${id}/post/${post.id}`)}
                            >
                              View Job Details
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-2">No Job Opportunities</h3>
                    <p className="text-gray-500 mb-6">There are no job listings in this community yet.</p>
                    {isMember && (
                      <Button onClick={() => navigate(`/communities/${id}/post/new?type=job`)}>
                        Post a Job Opportunity
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar (Right) */}
          <div className="space-y-6">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About this Community</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-600 text-sm">{community.description}</p>
                </div>

                {community.rules && community.rules.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Community Rules</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      {community.rules.map((rule, index) => (
                        <li key={index} className="flex items-start">
                          <span className="font-medium mr-2">{index + 1}.</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {community.links && community.links.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Useful Links</h4>
                    <ul className="text-sm text-primary space-y-1">
                      {community.links.map((link, index) => (
                        <li key={index}>
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {link.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2">Created</h4>
                  <p className="text-sm text-gray-600">{formatDate(community.createdAt)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Moderators Section */}
            <Card>
              <CardHeader>
                <CardTitle>Moderators</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingMembers ? (
                  <div className="text-center py-4">
                    <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm">Loading moderators...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {members
                      .filter(member => member.role === 'admin' || member.role === 'moderator')
                      .map(member => (
                        <div key={member.userId} className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{member.name}</div>
                            <div className="text-xs text-gray-500 capitalize">{member.role}</div>
                          </div>
                        </div>
                      ))}
                    {members.filter(member => member.role === 'admin' || member.role === 'moderator').length === 0 && (
                      <p className="text-sm text-gray-500">No moderators yet.</p>
                    )}
                  </div>
                )}
              </CardContent>
              {canManage && (
                <CardFooter className="border-t pt-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/communities/${id}/manage/moderators`)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Manage Moderators
                  </Button>
                </CardFooter>
              )}
            </Card>

            {/* Members Section */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Members</CardTitle>
                  <Badge variant="outline">{community.memberCount}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingMembers ? (
                  <div className="text-center py-4">
                    <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm">Loading members...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {members.slice(0, 5).map(member => (
                      <div key={member.userId} className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{member.name}</div>
                          <div className="text-xs text-gray-500">
                            Joined {formatDate(member.joinedAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/communities/${id}/members`)}
                >
                  View All Members
                </Button>
              </CardFooter>
            </Card>

            {/* Related Communities Suggestion */}
            <Card>
              <CardHeader>
                <CardTitle>You might also like</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Discover other communities in the {community.category} category.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/communities?category=${community.category}`)}
                >
                  Browse Related Communities
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetail;