import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, Search, Filter, Calendar, Award, MessageSquare, RefreshCw, Plus, Globe, BookOpen, Briefcase, FileText 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';

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
};

const Communities: React.FC = () => {
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const { data: communities = [], isLoading } = useQuery<Community[]>({
    queryKey: ['/api/communities'],
    enabled: true,
  });

  const { data: founderCommunities = [] } = useQuery<Community[]>({
    queryKey: ['/api/communities/founded'],
    enabled: !!user,
  });

  // Filter communities based on search and category
  const filteredCommunities = communities.filter(community => {
    const matchesSearch = 
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      community.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || community.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Categories derived from the communities data
  const categories = Array.from(new Set(communities.map(c => c.category)));

  const getCommunityTypeIcon = (category: string) => {
    switch(category.toLowerCase()) {
      case 'tech': return <Globe className="h-4 w-4" />;
      case 'education': return <BookOpen className="h-4 w-4" />;
      case 'career': return <Briefcase className="h-4 w-4" />;
      case 'skills': return <Award className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center mb-1">
                <Users className="h-6 w-6 text-primary mr-2" />
                <h1 className="text-2xl font-bold">Communities</h1>
              </div>
              <p className="text-gray-600">Connect with peers, mentors, and industry leaders</p>
            </div>
            <div className="space-x-2">
              {user && (
                <Button
                  onClick={() => navigate('/communities/new')}
                  className="flex items-center"
                >
                  <Plus className="h-5 w-5 mr-1" />
                  Create Community
                </Button>
              )}
              {!user && (
                <Button onClick={() => navigate('/login')}>
                  Sign in to join
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search communities..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button variant="outline" className="w-full md:w-auto">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all">
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <TabsList className="grid grid-cols-4 w-full md:w-auto">
              <TabsTrigger value="all">All Communities</TabsTrigger>
              <TabsTrigger value="verified">Verified</TabsTrigger>
              <TabsTrigger value="joined" disabled={!user}>My Communities</TabsTrigger>
              <TabsTrigger value="founded" disabled={!user}>Founded by Me</TabsTrigger>
            </TabsList>
          </div>

          {/* All Communities */}
          <TabsContent value="all">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Loading communities...</p>
              </div>
            ) : filteredCommunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCommunities.map(community => (
                  <Card key={community.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    {community.banner && (
                      <div className="h-32 bg-gray-200 relative">
                        <img 
                          src={community.banner} 
                          alt={`${community.name} banner`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader className={!community.banner ? "pt-6" : "pt-4"}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                            {community.logo ? 
                              <img src={community.logo} alt={community.name} className="w-full h-full rounded-full object-cover" /> :
                              <Users className="h-5 w-5 text-primary" />
                            }
                          </div>
                          <div>
                            <CardTitle className="text-xl flex items-center">
                              {community.name}
                              {community.isVerified && (
                                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-600 border-blue-200">
                                  Verified
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription>Founded by {community.founderName}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className="flex items-center">
                          {getCommunityTypeIcon(community.category)}
                          <span className="ml-1">{community.category}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 line-clamp-3">{community.description}</p>
                      <div className="flex items-center mt-4 text-sm text-gray-500">
                        <div className="flex items-center mr-4">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{community.memberCount} members</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Since {new Date(community.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        className="w-full mr-2"
                        onClick={() => navigate(`/communities/${community.id}`)}
                      >
                        View Details
                      </Button>
                      {user && (
                        <Button className="w-full">
                          Join Community
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-2">No Communities Found</h3>
                <p className="text-gray-500 mb-6">We couldn't find any communities matching your search criteria.</p>
                <Button variant="outline" onClick={() => { setSearchTerm(''); setFilterCategory('all'); }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Verified Communities */}
          <TabsContent value="verified">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities
                .filter(c => c.isVerified)
                .map(community => (
                  <Card key={community.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    {community.banner && (
                      <div className="h-32 bg-gray-200 relative">
                        <img 
                          src={community.banner} 
                          alt={`${community.name} banner`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader className={!community.banner ? "pt-6" : "pt-4"}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                            {community.logo ? 
                              <img src={community.logo} alt={community.name} className="w-full h-full rounded-full object-cover" /> :
                              <Users className="h-5 w-5 text-primary" />
                            }
                          </div>
                          <div>
                            <CardTitle className="text-xl flex items-center">
                              {community.name}
                              <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-600 border-blue-200">
                                Verified
                              </Badge>
                            </CardTitle>
                            <CardDescription>Founded by {community.founderName}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className="flex items-center">
                          {getCommunityTypeIcon(community.category)}
                          <span className="ml-1">{community.category}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 line-clamp-3">{community.description}</p>
                      <div className="flex items-center mt-4 text-sm text-gray-500">
                        <div className="flex items-center mr-4">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{community.memberCount} members</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Since {new Date(community.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        className="w-full mr-2"
                        onClick={() => navigate(`/communities/${community.id}`)}
                      >
                        View Details
                      </Button>
                      {user && (
                        <Button className="w-full">
                          Join Community
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* User's Communities */}
          <TabsContent value="joined">
            {user ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-2">Your Communities</h3>
                <p className="text-gray-500 mb-6">Communities you have joined will appear here.</p>
                <Button onClick={() => navigate('/communities')}>
                  Browse Communities
                </Button>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-2">Sign in to see your communities</h3>
                <Button onClick={() => navigate('/login')}>
                  Sign In
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Communities Founded by User */}
          <TabsContent value="founded">
            {user && founderCommunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {founderCommunities.map(community => (
                  <Card key={community.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    {community.banner && (
                      <div className="h-32 bg-gray-200 relative">
                        <img 
                          src={community.banner} 
                          alt={`${community.name} banner`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader className={!community.banner ? "pt-6" : "pt-4"}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                            {community.logo ? 
                              <img src={community.logo} alt={community.name} className="w-full h-full rounded-full object-cover" /> :
                              <Users className="h-5 w-5 text-primary" />
                            }
                          </div>
                          <div>
                            <CardTitle className="text-xl flex items-center">
                              {community.name}
                              {community.isVerified && (
                                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-600 border-blue-200">
                                  Verified
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription>Founded by you</CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className="flex items-center">
                          {getCommunityTypeIcon(community.category)}
                          <span className="ml-1">{community.category}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 line-clamp-3">{community.description}</p>
                      <div className="flex items-center mt-4 text-sm text-gray-500">
                        <div className="flex items-center mr-4">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{community.memberCount} members</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Since {new Date(community.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        className="w-full mr-2"
                        onClick={() => navigate(`/communities/${community.id}`)}
                      >
                        View Details
                      </Button>
                      <Button 
                        className="w-full"
                        onClick={() => navigate(`/communities/${community.id}/manage`)}
                      >
                        Manage
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : user ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-2">You haven't founded any communities yet</h3>
                <p className="text-gray-500 mb-6">Create a community to share knowledge and connect with others.</p>
                <Button onClick={() => navigate('/communities/new')}>
                  Create a Community
                </Button>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-2">Sign in to create your own community</h3>
                <Button onClick={() => navigate('/login')}>
                  Sign In
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Communities;