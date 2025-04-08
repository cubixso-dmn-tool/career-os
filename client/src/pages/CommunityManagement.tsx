import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, Link } from 'wouter';
import {
  Users, BarChart, Calendar, FileText, Settings, Flag, ArrowLeft,
  User, Shield, UserX, CheckCircle, XCircle, Clock, MessageSquare,
  BarChart2, UserCheck, Share2, Edit, Trash, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

interface FlaggedContent {
  id: number;
  communityId: number;
  contentId: number;
  contentType: 'post' | 'comment' | 'poll';
  content: string;
  reporterId: number;
  reporterName: string;
  reason: string;
  createdAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

interface CommunityCollaboration {
  id: number;
  sourceCommunityId: number;
  sourceCommunityName: string;
  targetCommunityId: number;
  targetCommunityName: string;
  type: 'event' | 'project';
  status: 'pending' | 'approved' | 'rejected';
  details: string;
  createdAt: string;
}

interface CommunityStats {
  totalMembers: number;
  activeMembers: number;
  totalPosts: number;
  totalEvents: number;
  engagementRate: number;
  memberGrowth: Array<{ date: string; count: number }>;
  postEngagement: Array<{ date: string; count: number }>;
  newJoins: number;
}

// Community Management Page Component
export default function CommunityManagementPage() {
  const [location, setLocation] = useLocation();
  const pathParts = location.split('/');
  const communityId = parseInt(pathParts[pathParts.length - 2] || '1');
  const [activeTab, setActiveTab] = useState('overview');
  const [isUpdateCommunityDialogOpen, setIsUpdateCommunityDialogOpen] = useState(false);
  const [isCollaborationDialogOpen, setIsCollaborationDialogOpen] = useState(false);
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

  // Fetch community members
  const { data: members = [], isLoading: isLoadingMembers } = useQuery<CommunityMember[]>({
    queryKey: [`/api/communities/${communityId}/members`],
    queryFn: async () => {
      const res = await fetch(`/api/communities/${communityId}/members`);
      if (!res.ok) throw new Error('Failed to fetch members');
      return res.json();
    },
  });

  // Fetch flagged content
  const { data: flaggedContent = [], isLoading: isLoadingFlagged } = useQuery<FlaggedContent[]>({
    queryKey: [`/api/communities/${communityId}/flagged`],
    queryFn: async () => {
      const res = await fetch(`/api/communities/${communityId}/flagged`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Fetch collaboration opportunities
  const { data: collaborations = [], isLoading: isLoadingCollaborations } = useQuery<CommunityCollaboration[]>({
    queryKey: [`/api/communities/${communityId}/collaborations`],
    queryFn: async () => {
      const res = await fetch(`/api/communities/${communityId}/collaborations`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Fetch community analytics
  const { data: stats, isLoading: isLoadingStats } = useQuery<CommunityStats>({
    queryKey: [`/api/communities/${communityId}/stats`],
    queryFn: async () => {
      const res = await fetch(`/api/communities/${communityId}/stats`);
      if (!res.ok) throw new Error('Failed to fetch community stats');
      return res.json();
    },
  });

  // Check if user is an admin or moderator
  const userRole = members.find(member => member.userId === user?.id)?.role;
  const isAdmin = userRole === 'admin';
  const isModerator = userRole === 'moderator';

  // Update community mutation
  const updateCommunityMutation = useMutation({
    mutationFn: async (communityData: any) => {
      const res = await fetch(`/api/communities/${communityId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(communityData),
      });
      
      if (!res.ok) throw new Error('Failed to update community');
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Community updated',
        description: 'Your community has been updated successfully.',
      });
      setIsUpdateCommunityDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: [`/api/communities/${communityId}`] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update community. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Update member role mutation
  const updateMemberRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: number; role: string }) => {
      const res = await fetch(`/api/communities/${communityId}/members/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });
      
      if (!res.ok) throw new Error('Failed to update member role');
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Member updated',
        description: 'Member role has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: [`/api/communities/${communityId}/members`] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update member. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await fetch(`/api/communities/${communityId}/members/${userId}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to remove member');
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Member removed',
        description: 'Member has been removed from the community.',
      });
      queryClient.invalidateQueries({ queryKey: [`/api/communities/${communityId}/members`] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to remove member. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Handle flagged content mutation
  const handleFlaggedContentMutation = useMutation({
    mutationFn: async ({ flagId, action }: { flagId: number; action: string }) => {
      const res = await fetch(`/api/communities/${communityId}/flagged/${flagId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });
      
      if (!res.ok) throw new Error('Failed to handle flagged content');
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Content moderated',
        description: 'Flagged content has been handled successfully.',
      });
      queryClient.invalidateQueries({ queryKey: [`/api/communities/${communityId}/flagged`] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to moderate content. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Propose collaboration mutation
  const proposeCollaborationMutation = useMutation({
    mutationFn: async (collaborationData: any) => {
      const res = await fetch(`/api/communities/${communityId}/collaborations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(collaborationData),
      });
      
      if (!res.ok) throw new Error('Failed to propose collaboration');
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Collaboration proposed',
        description: 'Your collaboration proposal has been sent.',
      });
      setIsCollaborationDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: [`/api/communities/${communityId}/collaborations`] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to propose collaboration. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Respond to collaboration mutation
  const respondToCollaborationMutation = useMutation({
    mutationFn: async ({ collaborationId, status }: { collaborationId: number; status: string }) => {
      const res = await fetch(`/api/communities/${communityId}/collaborations/${collaborationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!res.ok) throw new Error('Failed to respond to collaboration');
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Response sent',
        description: 'Your response to the collaboration request has been sent.',
      });
      queryClient.invalidateQueries({ queryKey: [`/api/communities/${communityId}/collaborations`] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to respond to collaboration. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Handle community update form submission
  const handleUpdateCommunity = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const form = event.currentTarget;
    const formData = new FormData(form);
    
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    
    // Parse rules and links
    const rulesText = formData.get('rules') as string;
    const rules = rulesText.split('\n').filter(rule => rule.trim() !== '');
    
    const linksText = formData.get('links') as string;
    const links = linksText.split('\n')
      .filter(link => link.trim() !== '')
      .map(link => {
        const parts = link.split('|');
        return {
          title: parts[0]?.trim() || 'Link',
          url: parts[1]?.trim() || '#',
        };
      });
    
    updateCommunityMutation.mutate({
      name,
      description,
      category,
      rules,
      links
    });
  };

  // Handle collaboration proposal form submission
  const handleProposeCollaboration = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const form = event.currentTarget;
    const formData = new FormData(form);
    
    const targetCommunityId = Number(formData.get('targetCommunityId'));
    const type = formData.get('type') as string;
    const details = formData.get('details') as string;
    
    proposeCollaborationMutation.mutate({
      targetCommunityId,
      type,
      details
    });
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

  // Check permissions
  if (!isAdmin && !isModerator) {
    return (
      <div className="container max-w-7xl mx-auto py-10 px-4">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
          <p className="text-gray-500 mt-2">You don't have permission to manage this community.</p>
          <Link href={`/communities/${communityId}`}>
            <a className="inline-block mt-4">
              <Button>Back to Community</Button>
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-10 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href={`/communities/${communityId}`}>
            <a className="bg-secondary p-2 rounded-md hover:bg-secondary/80">
              <ArrowLeft className="h-5 w-5" />
            </a>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">
              Manage {community.name}
            </h1>
            <p className="text-gray-500">
              {isAdmin ? 'Admin Dashboard' : 'Moderator Dashboard'}
            </p>
          </div>
        </div>
        
        {isAdmin && (
          <Dialog open={isUpdateCommunityDialogOpen} onOpenChange={setIsUpdateCommunityDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0">
                <Settings className="h-4 w-4 mr-2" />
                Community Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Update Community</DialogTitle>
                <DialogDescription>
                  Make changes to your community settings and information.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleUpdateCommunity}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={community.name}
                      className="col-span-3"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Select name="category" defaultValue={community.category}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tech">Tech</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Career">Career</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description" className="text-right pt-2">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={community.description}
                      className="col-span-3"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="rules" className="text-right pt-2">
                      Rules
                    </Label>
                    <Textarea
                      id="rules"
                      name="rules"
                      defaultValue={community.rules.join('\n')}
                      className="col-span-3"
                      rows={4}
                      placeholder="One rule per line"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="links" className="text-right pt-2">
                      Links
                    </Label>
                    <div className="col-span-3">
                      <Textarea
                        id="links"
                        name="links"
                        defaultValue={community.links.map(link => `${link.title}|${link.url}`).join('\n')}
                        rows={3}
                        placeholder="Format: Title|URL (one per line)"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Format: Link Title|https://example.com (one per line)
                      </p>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit" disabled={updateCommunityMutation.isPending}>
                    {updateCommunityMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {/* Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
          <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {isLoadingStats ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : stats ? (
            <div>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Total Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalMembers}</div>
                    <p className="text-xs text-gray-500 mt-1">
                      {stats.newJoins} new this month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Active Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeMembers}</div>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round(stats.activeMembers / stats.totalMembers * 100)}% of total
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Total Posts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalPosts}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Engagement Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{(stats.engagementRate * 100).toFixed(1)}%</div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Growth and Engagement Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Member Growth</CardTitle>
                    <CardDescription>
                      Monthly growth in community members
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-end">
                      {stats.memberGrowth.map((point, index) => (
                        <div 
                          key={index} 
                          className="flex-1 mx-1 flex flex-col items-center justify-end"
                        >
                          <div 
                            className="w-full bg-primary/60 rounded-t"
                            style={{ 
                              height: `${(point.count / Math.max(...stats.memberGrowth.map(p => p.count)) * 160)}px` 
                            }}
                          ></div>
                          <div className="text-xs mt-2 text-gray-500">
                            {new Date(point.date).toLocaleDateString(undefined, { month: 'short' })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Post Engagement</CardTitle>
                    <CardDescription>
                      Monthly engagement with community posts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-end">
                      {stats.postEngagement.map((point, index) => (
                        <div 
                          key={index} 
                          className="flex-1 mx-1 flex flex-col items-center justify-end"
                        >
                          <div 
                            className="w-full bg-primary/60 rounded-t"
                            style={{ 
                              height: `${(point.count / Math.max(...stats.postEngagement.map(p => p.count)) * 160)}px` 
                            }}
                          ></div>
                          <div className="text-xs mt-2 text-gray-500">
                            {new Date(point.date).toLocaleDateString(undefined, { month: 'short' })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-xl font-medium">Statistics not available</h3>
              <p className="text-gray-500 mt-2">
                We couldn't load the statistics for this community.
              </p>
            </div>
          )}
        </TabsContent>
        
        {/* Members Tab */}
        <TabsContent value="members" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Members</CardTitle>
              <CardDescription>
                Manage members and their roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingMembers ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse flex items-center">
                      <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                      <div className="ml-4 space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/5"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : members.length === 0 ? (
                <div className="text-center py-6">
                  <h3 className="text-lg font-medium">No members yet</h3>
                  <p className="text-gray-500 mt-2">
                    Invite people to join your community.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {members.map((member) => (
                    <div key={member.userId} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center">
                        {member.avatar ? (
                          <img 
                            src={member.avatar} 
                            alt={member.name} 
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            {member.role === 'admin' ? (
                              <Shield className="h-3 w-3 text-primary mr-1" />
                            ) : member.role === 'moderator' ? (
                              <Shield className="h-3 w-3 text-orange-500 mr-1" />
                            ) : (
                              <User className="h-3 w-3 text-gray-400 mr-1" />
                            )}
                            <span className="capitalize">{member.role}</span>
                            {!member.isActive && (
                              <Badge variant="outline" className="ml-2 text-xs">Inactive</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isAdmin && member.userId !== user?.id && (
                          <>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Role
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => updateMemberRoleMutation.mutate({ 
                                    userId: member.userId, 
                                    role: 'member' 
                                  })}
                                  disabled={member.role === 'member'}
                                >
                                  <User className="h-4 w-4 mr-2" />
                                  Member
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => updateMemberRoleMutation.mutate({ 
                                    userId: member.userId, 
                                    role: 'moderator' 
                                  })}
                                  disabled={member.role === 'moderator'}
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Moderator
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => updateMemberRoleMutation.mutate({ 
                                    userId: member.userId, 
                                    role: 'admin' 
                                  })}
                                  disabled={member.role === 'admin'}
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Admin
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to remove ${member.name} from the community?`)) {
                                  removeMemberMutation.mutate(member.userId);
                                }
                              }}
                            >
                              <UserX className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Moderation Tab */}
        <TabsContent value="moderation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Content</CardTitle>
              <CardDescription>
                Review and take action on content flagged by community members
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingFlagged ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-16 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              ) : flaggedContent.length === 0 ? (
                <div className="text-center py-6">
                  <h3 className="text-lg font-medium">No flagged content</h3>
                  <p className="text-gray-500 mt-2">
                    All content in your community is currently in good standing.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {flaggedContent.map((flag) => (
                    <div key={flag.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Badge className="capitalize">{flag.contentType}</Badge>
                          <Badge 
                            variant={
                              flag.status === 'pending' ? 'outline' : 
                              flag.status === 'resolved' ? 'default' : 
                              'destructive'
                            }
                            className="ml-2"
                          >
                            {flag.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(flag.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                      
                      <div className="bg-secondary/30 p-3 rounded my-3">
                        <p className="text-sm whitespace-pre-line">{flag.content}</p>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">Reported by:</span> {flag.reporterName}
                        </div>
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">Reason:</span> {flag.reason}
                        </div>
                      </div>
                      
                      {flag.status === 'pending' && (
                        <div className="flex justify-end mt-4 gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleFlaggedContentMutation.mutate({ 
                              flagId: flag.id, 
                              action: 'ignore' 
                            })}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Ignore
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleFlaggedContentMutation.mutate({ 
                              flagId: flag.id, 
                              action: 'approve' 
                            })}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleFlaggedContentMutation.mutate({ 
                              flagId: flag.id, 
                              action: 'remove' 
                            })}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Collaborations Tab */}
        <TabsContent value="collaborations" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle>Collaboration Requests</CardTitle>
                <CardDescription>
                  Partner with other communities for joint events or projects
                </CardDescription>
              </div>
              
              <Dialog open={isCollaborationDialogOpen} onOpenChange={setIsCollaborationDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Collaboration
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Propose Collaboration</DialogTitle>
                    <DialogDescription>
                      Reach out to another community to collaborate on events or projects.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleProposeCollaboration}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="targetCommunityId" className="text-right">
                          Community
                        </Label>
                        <Select name="targetCommunityId" required>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a community" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">Future Leaders</SelectItem>
                            <SelectItem value="4">Creative Design Collective</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                          Type
                        </Label>
                        <Select name="type" defaultValue="event">
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select collaboration type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="event">Joint Event</SelectItem>
                            <SelectItem value="project">Project Collaboration</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="details" className="text-right pt-2">
                          Details
                        </Label>
                        <Textarea
                          id="details"
                          name="details"
                          className="col-span-3"
                          rows={4}
                          placeholder="Describe the collaboration opportunity..."
                          required
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button type="submit" disabled={proposeCollaborationMutation.isPending}>
                        {proposeCollaborationMutation.isPending ? 'Proposing...' : 'Propose Collaboration'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {isLoadingCollaborations ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : collaborations.length === 0 ? (
                <div className="text-center py-6">
                  <h3 className="text-lg font-medium">No collaborations yet</h3>
                  <p className="text-gray-500 mt-2">
                    Propose partnerships with other communities to grow together.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {collaborations.map((collab) => {
                    const isIncoming = collab.targetCommunityId === communityId;
                    const communityName = isIncoming ? collab.sourceCommunityName : collab.targetCommunityName;
                    
                    return (
                      <Card key={collab.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div>
                              <div className="font-medium flex items-center">
                                {isIncoming ? (
                                  <Badge variant="outline" className="mr-2">Incoming</Badge>
                                ) : (
                                  <Badge variant="outline" className="mr-2">Outgoing</Badge>
                                )}
                                Collaboration with {communityName}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                <Badge variant="secondary" className="mr-2 capitalize">
                                  {collab.type}
                                </Badge>
                                <Badge 
                                  variant={
                                    collab.status === 'pending' ? 'outline' : 
                                    collab.status === 'approved' ? 'default' : 
                                    'destructive'
                                  }
                                >
                                  {collab.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDistanceToNow(new Date(collab.createdAt), { addSuffix: true })}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{collab.details}</p>
                          
                          {isIncoming && collab.status === 'pending' && (
                            <div className="flex justify-end mt-4 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => respondToCollaborationMutation.mutate({ 
                                  collaborationId: collab.id, 
                                  status: 'rejected' 
                                })}
                              >
                                Decline
                              </Button>
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => respondToCollaborationMutation.mutate({ 
                                  collaborationId: collab.id, 
                                  status: 'approved' 
                                })}
                              >
                                Accept
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}