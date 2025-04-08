import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, Link } from 'wouter';
import {
  Users, MessageSquare, Calendar, FileText, Plus, User, ChevronRight,
  ListOrdered, ChevronDown, MoreHorizontal, Send, Flag, Heart, MessageCircle,
  ThumbsUp, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

// Interfaces
interface Community {
  id: number;
  name: string;
  description: string;
  founderId: number;
  category: string;
  isVerified: boolean;
  logo: string | null;
  banner: string | null;
  memberCount: number;
  createdAt: string;
  founderName: string;
  rules: string[];
  links: { title: string; url: string }[];
}

interface CommunityMember {
  userId: number;
  communityId: number;
  name: string;
  avatar: string | null;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: string;
  isActive: boolean;
}

interface CommunityPost {
  id: number;
  communityId: number;
  authorId: number;
  authorName: string;
  authorAvatar: string | null;
  title: string;
  content: string;
  type: 'announcement' | 'discussion' | 'event' | 'job' | 'blog';
  createdAt: string;
  commentCount: number;
  isFeatured: boolean;
  likes: number;
}

interface CommunityEvent {
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
}

// Community Detail Page Component
export default function CommunityDetailPage() {
  const [location] = useLocation();
  const communityId = parseInt(location.split('/').pop() || '1');
  const [activeTab, setActiveTab] = useState('discussion');
  const [newPostType, setNewPostType] = useState<string>('discussion');
  const [isCreatePostDialogOpen, setIsCreatePostDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isPollDialogOpen, setIsPollDialogOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch community details
  const { data: community, isLoading: isLoadingCommunity } = useQuery<Community>({
    queryKey: [`/api/communities/${communityId}`],
    queryFn: async () => {
      const res = await fetch(`/api/communities/${communityId}`);
      if (!res.ok) throw new Error('Failed to fetch community');
      return res.json();
    },
  });

  // Fetch community posts
  const { data: posts = [], isLoading: isLoadingPosts } = useQuery<CommunityPost[]>({
    queryKey: [`/api/communities/${communityId}/posts`, activeTab],
    queryFn: async () => {
      let url = `/api/communities/${communityId}/posts`;
      const params = new URLSearchParams();
      
      // Map tabs to post types
      if (activeTab === 'announcements') params.append('type', 'announcement');
      else if (activeTab === 'discussions') params.append('type', 'discussion');
      else if (activeTab === 'jobs') params.append('type', 'job');
      else if (activeTab === 'blogs') params.append('type', 'blog');
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch posts');
      return res.json();
    },
  });

  // Fetch community events
  const { data: events = [], isLoading: isLoadingEvents } = useQuery<CommunityEvent[]>({
    queryKey: [`/api/communities/${communityId}/events`],
    queryFn: async () => {
      const res = await fetch(`/api/communities/${communityId}/events`);
      if (!res.ok) throw new Error('Failed to fetch events');
      return res.json();
    },
  });

  // Check if user is a member
  const { data: membership, isLoading: isLoadingMembership } = useQuery<CommunityMember | null>({
    queryKey: [`/api/communities/${communityId}/members`, isAuthenticated ? user?.id : 'anonymous'],
    queryFn: async () => {
      if (!isAuthenticated) return null;
      
      const res = await fetch(`/api/communities/${communityId}/members`);
      if (!res.ok) return null;
      
      const members = await res.json();
      return members.find((member: CommunityMember) => member.userId === user?.id) || null;
    },
    enabled: isAuthenticated,
  });

  // Join community mutation
  const joinMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/communities/${communityId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: 'member' }),
      });
      
      if (!res.ok) throw new Error('Failed to join community');
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: `You have joined ${community?.name}!`,
      });
      queryClient.invalidateQueries({ queryKey: [`/api/communities/${communityId}/members`] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to join community. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (postData: { title: string; content: string; type: string }) => {
      const res = await fetch(`/api/communities/${communityId}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      
      if (!res.ok) throw new Error('Failed to create post');
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Post created',
        description: 'Your post has been published successfully.',
      });
      setIsCreatePostDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: [`/api/communities/${communityId}/posts`] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      const res = await fetch(`/api/communities/${communityId}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      if (!res.ok) throw new Error('Failed to create event');
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Event created',
        description: 'Your event has been created successfully.',
      });
      setIsEventDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: [`/api/communities/${communityId}/events`] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create event. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Handle post creation
  const handleCreatePost = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    
    createPostMutation.mutate({ title, content, type: newPostType });
  };

  // Handle event creation
  const handleCreateEvent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const form = event.currentTarget;
    const formData = new FormData(form);
    
    const eventData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      location: formData.get('location') as string,
      isOnline: formData.get('isOnline') === 'true',
    };
    
    createEventMutation.mutate(eventData);
  };

  // Loading state
  if (isLoadingCommunity) {
    return (
      <div className="container max-w-7xl mx-auto py-10 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (!community) {
    return (
      <div className="container max-w-7xl mx-auto py-10 px-4">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-red-500">Community not found</h2>
          <p className="text-gray-500 mt-2">The community you're looking for might have been removed or doesn't exist.</p>
          <Link href="/communities">
            <a className="inline-block mt-4">
              <Button>Back to Communities</Button>
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-10 px-4 sm:px-6">
      {/* Community Header */}
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200 mb-8">
        {community.banner ? (
          <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${community.banner})` }}></div>
        ) : (
          <div className="h-40 bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-primary/70">{community.name}</h1>
          </div>
        )}
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              {community.logo ? (
                <img 
                  src={community.logo} 
                  alt={community.name} 
                  className="h-16 w-16 rounded-full object-cover border-2 border-primary/20"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              )}
              
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{community.name}</h1>
                  {community.isVerified && (
                    <Badge variant="default">Verified</Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                  <Badge variant="outline">{community.category}</Badge>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{community.memberCount} members</span>
                  </div>
                  <div>Founded by {community.founderName}</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isAuthenticated && !membership ? (
                <Button onClick={() => joinMutation.mutate()} disabled={joinMutation.isPending}>
                  {joinMutation.isPending ? "Joining..." : "Join Community"}
                </Button>
              ) : membership ? (
                <Badge variant="outline" className="px-3 py-1.5">
                  {membership.role === 'admin' ? 'Admin' : 
                   membership.role === 'moderator' ? 'Moderator' : 'Member'}
                </Badge>
              ) : (
                <Link href="/auth">
                  <a>
                    <Button variant="outline">Login to Join</Button>
                  </a>
                </Link>
              )}
              
              {membership?.role === 'admin' && (
                <Link href={`/communities/${communityId}/manage`}>
                  <a>
                    <Button variant="outline">Manage Community</Button>
                  </a>
                </Link>
              )}
            </div>
          </div>
          
          <p className="mt-4 text-gray-600">{community.description}</p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {community.rules.length > 0 && (
                <div>
                  <h3 className="font-medium text-sm mb-2">Community Rules</h3>
                  <ul className="list-decimal pl-5 text-sm space-y-1">
                    {community.rules.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {community.links.length > 0 && (
                <div>
                  <h3 className="font-medium text-sm mb-2">Links</h3>
                  <ul className="space-y-1">
                    {community.links.map((link, idx) => (
                      <li key={idx} className="text-sm">
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Upcoming Events */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Upcoming Events</CardTitle>
                {membership && (
                  <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Event</DialogTitle>
                        <DialogDescription>
                          Schedule an event for the community. All members will be notified.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <form onSubmit={handleCreateEvent}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                              Title
                            </Label>
                            <Input
                              id="title"
                              name="title"
                              className="col-span-3"
                              required
                            />
                          </div>
                          
                          <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="description" className="text-right pt-2">
                              Description
                            </Label>
                            <Textarea
                              id="description"
                              name="description"
                              className="col-span-3"
                              rows={3}
                              required
                            />
                          </div>
                          
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="startDate" className="text-right">
                              Start Date
                            </Label>
                            <Input
                              id="startDate"
                              name="startDate"
                              type="datetime-local"
                              className="col-span-3"
                              required
                            />
                          </div>
                          
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="endDate" className="text-right">
                              End Date
                            </Label>
                            <Input
                              id="endDate"
                              name="endDate"
                              type="datetime-local"
                              className="col-span-3"
                              required
                            />
                          </div>
                          
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="isOnline" className="text-right">
                              Event Type
                            </Label>
                            <Select name="isOnline" defaultValue="false">
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select event type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">Online</SelectItem>
                                <SelectItem value="false">In-person</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="location" className="text-right">
                              Location
                            </Label>
                            <Input
                              id="location"
                              name="location"
                              className="col-span-3"
                              placeholder="URL or physical address"
                              required
                            />
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button type="submit" disabled={createEventMutation.isPending}>
                            {createEventMutation.isPending ? "Creating..." : "Create Event"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingEvents ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-4 text-sm text-gray-500">
                  No upcoming events
                </div>
              ) : (
                <div className="space-y-4">
                  {events.slice(0, 3).map((event) => {
                    const startDate = new Date(event.startDate);
                    return (
                      <div key={event.id} className="flex gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{event.title}</h4>
                          <div className="text-xs text-gray-500">
                            {startDate.toLocaleDateString()} at {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center mt-1">
                            <User className="h-3 w-3 mr-1" />
                            <span>{event.attendeeCount} attending</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {events.length > 3 && (
                    <Link href={`/communities/${communityId}/events`}>
                      <a className="text-xs text-primary flex items-center hover:underline">
                        View all events
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </a>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {/* New Post Button */}
          {membership && (
            <div className="mb-6">
              <Dialog open={isCreatePostDialogOpen} onOpenChange={setIsCreatePostDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Post
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Post</DialogTitle>
                    <DialogDescription>
                      Share something with the community
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleCreatePost}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="postType" className="text-right">
                          Post Type
                        </Label>
                        <Select value={newPostType} onValueChange={setNewPostType}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select post type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="discussion">Discussion</SelectItem>
                            <SelectItem value="announcement">Announcement</SelectItem>
                            <SelectItem value="job">Job/Opportunity</SelectItem>
                            <SelectItem value="blog">Blog/Article</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                          Title
                        </Label>
                        <Input
                          id="title"
                          name="title"
                          className="col-span-3"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="content" className="text-right pt-2">
                          Content
                        </Label>
                        <Textarea
                          id="content"
                          name="content"
                          className="col-span-3"
                          rows={6}
                          required
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button type="submit" disabled={createPostMutation.isPending}>
                        {createPostMutation.isPending ? "Posting..." : "Post"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}
          
          {/* Posts Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="discussion">All</TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
              <TabsTrigger value="discussions">Discussions</TabsTrigger>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="blogs">Blogs</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="space-y-6">
              {isLoadingPosts ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader className="pb-2">
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-10">
                  <h3 className="text-xl font-medium">No posts yet</h3>
                  <p className="text-gray-500 mt-2">
                    {membership ? "Be the first to start a conversation!" : "Join the community to start posting."}
                  </p>
                </div>
              ) : (
                posts.map((post) => (
                  <Card key={post.id} className={post.isFeatured ? "border-primary/30" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-2">
                          {post.authorAvatar ? (
                            <img 
                              src={post.authorAvatar} 
                              alt={post.authorName} 
                              className="h-8 w-8 rounded-full mt-1 object-cover"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-primary/10 mt-1 flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                          )}
                          <div>
                            <CardTitle className="text-lg">{post.title}</CardTitle>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <span>{post.authorName}</span>
                              <span>•</span>
                              <span>
                                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                              </span>
                              <Badge variant="outline" className="capitalize">
                                {post.type}
                              </Badge>
                              {post.isFeatured && (
                                <Badge variant="default">Featured</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => {
                                toast({
                                  title: "Post flagged",
                                  description: "A moderator will review this post soon.",
                                });
                              }}
                            >
                              <Flag className="h-4 w-4 mr-2" />
                              Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 whitespace-pre-line">
                        {post.content}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <button className="flex items-center hover:text-primary">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center hover:text-primary">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span>{post.commentCount}</span>
                        </button>
                      </div>
                      
                      <Link href={`/communities/${communityId}/posts/${post.id}`}>
                        <a className="text-sm text-primary flex items-center hover:underline">
                          View Discussion
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </a>
                      </Link>
                    </CardFooter>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}