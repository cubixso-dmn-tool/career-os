import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSidebar } from "@/hooks/use-sidebar";
import Sidebar from "@/components/layout/Sidebar";
import MobileHeader from "@/components/ui/mobile-header";
import MobileNavigation from "@/components/layout/MobileNavigation";
import MobileSidebar from "@/components/layout/MobileSidebar";
import CommunityPost from "@/components/community/CommunityPost";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { MessageSquare, Search, Image, Code, Smile, Users, TrendingUp, Clock } from "lucide-react";

// Mock user ID until authentication is implemented
const USER_ID = 1;

const postSchema = z.object({
  content: z.string().min(1, "Post content cannot be empty").max(500, "Post content is too long")
});

export default function Community() {
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  // Fetch posts from content management API
  const { data: posts = [], isLoading: loadingPosts } = useQuery({
    queryKey: ['/api/content-management/communities/posts'],
    queryFn: undefined, // Use default queryFn from queryClient
  });

  // Fetch user data
  const { data: userData, isLoading: loadingUser } = useQuery({
    queryKey: [`/api/users/${USER_ID}`],
    queryFn: undefined, // Use default queryFn from queryClient
  });

  // Close sidebar when navigating to this page
  useEffect(() => {
    closeSidebar();
  }, [closeSidebar]);

  // Create post form
  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: ""
    }
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (values: z.infer<typeof postSchema>) => {
      const response = await apiRequest("POST", "/api/content-management/communities/posts", {
        userId: USER_ID,
        content: values.content
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content-management/communities/posts'] });
      form.reset();
    }
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof postSchema>) => {
    createPostMutation.mutate(values);
  };

  // Filter posts based on search term
  const filteredPosts = posts.filter((post: any) => 
    !searchTerm || 
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.user?.name && post.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isLoading = loadingPosts || loadingUser;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <MobileHeader user={userData || { name: 'Ananya Singh', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6' }} />

      {/* Sidebar */}
      <Sidebar user={userData || { name: 'Ananya Singh', email: 'ananya.s@example.com', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6' }} />

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <MobileSidebar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar} 
          user={userData || { name: 'Ananya Singh', email: 'ananya.s@example.com', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6' }}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 relative">
        <div className="px-4 py-6 md:px-8 pb-20 md:pb-6">
          <div className="flex items-center mb-6">
            <MessageSquare className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Community</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Feed (2/3 width on desktop) */}
            <div className="md:col-span-2 space-y-6">
              {/* Create Post */}
              <Card>
                <CardContent className="pt-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <div className="space-y-4">
                              <Textarea
                                {...field}
                                placeholder="Share your thoughts or ask a question..."
                                className="resize-none min-h-[120px] text-base focus-visible:ring-primary"
                              />
                              <div className="flex justify-between">
                                <div className="flex space-x-2">
                                  <Button type="button" variant="ghost" size="icon" className="text-gray-500">
                                    <Image size={18} />
                                  </Button>
                                  <Button type="button" variant="ghost" size="icon" className="text-gray-500">
                                    <Code size={18} />
                                  </Button>
                                  <Button type="button" variant="ghost" size="icon" className="text-gray-500">
                                    <Smile size={18} />
                                  </Button>
                                </div>
                                <Button 
                                  type="submit" 
                                  className="bg-primary"
                                  disabled={createPostMutation.isPending}
                                >
                                  {createPostMutation.isPending ? 'Posting...' : 'Post'}
                                </Button>
                              </div>
                            </div>
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Feed Tabs */}
              <Tabs defaultValue="recent">
                <TabsList className="mb-4">
                  <TabsTrigger value="recent" className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Recent
                  </TabsTrigger>
                  <TabsTrigger value="trending" className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Trending
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="recent" className="mt-0">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      placeholder="Search posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Card key={i} className="animate-pulse">
                          <CardContent className="pt-6">
                            <div className="flex space-x-3">
                              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                                <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                                <div className="h-20 bg-gray-100 rounded"></div>
                                <div className="flex space-x-3">
                                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                                  <div className="h-6 w-20 bg-gray-200 rounded"></div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : filteredPosts.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                      <p className="text-gray-600 mb-4">
                        {searchTerm ? 'We couldn\'t find any posts matching your search.' : 'Be the first to start a discussion!'}
                      </p>
                      {searchTerm && (
                        <Button 
                          variant="outline" 
                          onClick={() => setSearchTerm("")}
                        >
                          Clear Search
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredPosts.map((post: any) => (
                        <CommunityPost 
                          key={post.id} 
                          post={post} 
                          currentUser={userData || { 
                            id: USER_ID, 
                            name: 'Ananya Singh', 
                            avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6',
                            username: 'ananya'
                          }} 
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="trending" className="mt-0">
                  <div className="space-y-4">
                    {[...filteredPosts]
                      .sort((a: any, b: any) => b.likes - a.likes)
                      .slice(0, 5)
                      .map((post: any) => (
                        <CommunityPost 
                          key={post.id} 
                          post={post} 
                          currentUser={userData || { 
                            id: USER_ID, 
                            name: 'Ananya Singh', 
                            avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6',
                            username: 'ananya'
                          }}
                        />
                      ))
                    }
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar (1/3 width on desktop) */}
            <div className="hidden md:block space-y-6">
              {/* Community Guidelines */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Community Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Be Respectful</h3>
                    <p className="text-sm text-gray-600">Treat others with kindness and respect. No harassment or hate speech.</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Share Knowledge</h3>
                    <p className="text-sm text-gray-600">Help each other by sharing your experiences and insights.</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Stay On Topic</h3>
                    <p className="text-sm text-gray-600">Keep discussions relevant to careers, education, and skill development.</p>
                  </div>
                  <Button variant="outline" className="w-full">Read Full Guidelines</Button>
                </CardContent>
              </Card>

              {/* Active Users */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    Active Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-primary font-medium">AS</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Ananya Singh</p>
                        <p className="text-xs text-gray-500">Data Science • Delhi</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                        <span className="text-amber-700 font-medium">AM</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Arjun Mehta</p>
                        <p className="text-xs text-gray-500">Machine Learning • Bangalore</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-700 font-medium">PS</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Priya Sharma</p>
                        <p className="text-xs text-gray-500">Web Development • Mumbai</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-700 font-medium">RK</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Rahul Kumar</p>
                        <p className="text-xs text-gray-500">Cybersecurity • Pune</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <span className="mr-2 text-primary font-medium">#</span>
                      data_science
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <span className="mr-2 text-primary font-medium">#</span>
                      career_advice
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <span className="mr-2 text-primary font-medium">#</span>
                      interview_tips
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <span className="mr-2 text-primary font-medium">#</span>
                      python
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <span className="mr-2 text-primary font-medium">#</span>
                      machine_learning
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
}
