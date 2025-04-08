import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { 
  Search, Plus, Users, Calendar, FileText, Tag, 
  ChevronRight, Filter, ArrowUpDown, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

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
}

export default function CommunitiesPage() {
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  // Query communities with filters
  const { data: communities = [], isLoading, error } = useQuery<Community[]>({
    queryKey: ['/api/communities', searchQuery, category, sortBy],
    queryFn: async () => {
      let url = '/api/communities';
      const params = new URLSearchParams();
      
      if (searchQuery) params.append('search', searchQuery);
      if (category) params.append('category', category);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch communities');
      
      let data = await res.json();
      
      // Client-side sorting
      if (sortBy === 'newest') {
        data = data.sort((a: Community, b: Community) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (sortBy === 'popular') {
        data = data.sort((a: Community, b: Community) => b.memberCount - a.memberCount);
      } else if (sortBy === 'alphabetical') {
        data = data.sort((a: Community, b: Community) => a.name.localeCompare(b.name));
      }
      
      return data;
    },
  });

  const { data: userFoundedCommunities = [] } = useQuery<Community[]>({
    queryKey: ['/api/communities/founded'],
    queryFn: async () => {
      if (!isAuthenticated) return [];
      
      const res = await fetch('/api/communities/founded');
      if (!res.ok) return [];
      
      return await res.json();
    },
    enabled: isAuthenticated,
  });

  const handleCreateCommunity = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    
    try {
      const response = await fetch('/api/communities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          category,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create community');
      }
      
      const data = await response.json();
      
      toast({
        title: 'Community created!',
        description: 'Your community has been created successfully.',
      });
      
      setIsCreateDialogOpen(false);
      form.reset();
      
      // Redirect to the new community
      window.location.href = `/communities/${data.id}`;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create community. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const renderCategories = () => {
    const categories = [
      { name: 'All', value: undefined },
      { name: 'Tech', value: 'Tech' },
      { name: 'Business', value: 'Business' },
      { name: 'Design', value: 'Design' },
      { name: 'Career', value: 'Career' },
      { name: 'Education', value: 'Education' },
    ];
    
    return (
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <Badge
            key={cat.name}
            variant={category === cat.value ? "default" : "outline"}
            className="cursor-pointer hover:bg-secondary/50"
            onClick={() => setCategory(cat.value)}
          >
            {cat.name}
          </Badge>
        ))}
      </div>
    );
  };

  if (error) {
    return (
      <div className="container max-w-7xl mx-auto py-10">
        <div className="text-center p-10">
          <h2 className="text-2xl font-bold text-red-500">Error loading communities</h2>
          <p className="mt-2 text-gray-500">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-10 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Communities</h1>
          <p className="text-gray-500">Discover and join communities to connect with peers and industry professionals</p>
        </div>
        
        {isAuthenticated && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="whitespace-nowrap">
                <Plus className="h-4 w-4 mr-2" />
                Create Community
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new community</DialogTitle>
                <DialogDescription>
                  Create a space for students and professionals to connect, share knowledge, and grow together.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleCreateCommunity}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="E.g., Tech Enthusiasts"
                      className="col-span-3"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Select name="category" defaultValue="Tech" required>
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
                      placeholder="Tell us about your community..."
                      className="col-span-3"
                      rows={4}
                      required
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit">Create Community</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {/* Search and filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search communities..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1">{renderCategories()}</div>
          
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-gray-400" />
            <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="alphabetical">A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* My communities section (if authenticated) */}
      {isAuthenticated && userFoundedCommunities.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Communities You Manage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userFoundedCommunities.map((community) => (
              <Link key={community.id} href={`/communities/${community.id}/manage`}>
                <a className="block">
                  <Card className="h-full transition-all hover:border-primary/50 hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        {community.logo ? (
                          <img
                            src={community.logo}
                            alt={community.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <CardTitle className="text-lg">{community.name}</CardTitle>
                      </div>
                      <Badge variant="outline" className="ml-10 mt-1">
                        {community.category}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {community.description}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User className="h-4 w-4" />
                        <span>{community.memberCount} members</span>
                      </div>
                      <div className="text-primary flex items-center">
                        <span className="text-sm font-medium">Manage</span>
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </div>
                    </CardFooter>
                  </Card>
                </a>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* All communities */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Discover Communities</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="h-[220px] animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded w-full mt-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mt-2"></div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : communities.length === 0 ? (
          <div className="text-center p-10">
            <h3 className="text-xl font-medium">No communities found</h3>
            <p className="text-gray-500 mt-2">
              {searchQuery || category
                ? "Try changing your search criteria"
                : "Be the first to create a community!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <Link key={community.id} href={`/communities/${community.id}`}>
                <a className="block">
                  <Card className="h-full transition-all hover:border-primary/50 hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        {community.logo ? (
                          <img
                            src={community.logo}
                            alt={community.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <CardTitle className="text-lg">{community.name}</CardTitle>
                        {community.isVerified && (
                          <Badge variant="default" className="ml-auto">Verified</Badge>
                        )}
                      </div>
                      <Badge variant="outline" className="ml-10 mt-1">
                        {community.category}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {community.description}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User className="h-4 w-4" />
                        <span>{community.memberCount} members</span>
                      </div>
                      <div className="text-primary flex items-center">
                        <span className="text-sm font-medium">View</span>
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </div>
                    </CardFooter>
                  </Card>
                </a>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}