import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, MessageSquareText, Image, Code, Smile } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";

interface User {
  id: number;
  name: string;
  avatar: string;
}

interface Post {
  id: number;
  userId: number;
  user?: {
    name: string;
    avatar: string;
  };
  content: string;
  likes: number;
  replies: number;
  createdAt: string;
}

interface CommunitySectionProps {
  posts: Post[];
  currentUser: User;
}

const formSchema = z.object({
  content: z.string().min(1, "Post content cannot be empty").max(500, "Post content is too long")
});

export default function CommunitySection({ posts, currentUser }: CommunitySectionProps) {
  const queryClient = useQueryClient();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: ""
    }
  });

  const createPostMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await apiRequest("POST", "/api/posts", {
        userId: currentUser.id,
        content: values.content
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      form.reset();
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createPostMutation.mutate(values);
  };

  const formatPostDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return "recently";
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Community Discussions</h2>
        <Link href="/community">
          <a className="text-sm text-primary font-medium hover:underline cursor-pointer">
            Join Community
          </a>
        </Link>
      </div>
      
      <Card>
        {posts.map((post) => (
          <div key={post.id} className="p-4 border-b border-gray-100">
            <div className="flex space-x-3">
              <img 
                className="h-10 w-10 rounded-full object-cover" 
                src={post.user?.avatar || "https://ui-avatars.com/api/?name=User"} 
                alt="User profile" 
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">{post.user?.name || "User"}</h3>
                  <span className="text-xs text-gray-500">{formatPostDate(post.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{post.content}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <button className="text-xs text-gray-500 flex items-center">
                    <Heart className="mr-1" size={14} />
                    {post.likes} likes
                  </button>
                  <button className="text-xs text-gray-500 flex items-center">
                    <MessageCircle className="mr-1" size={14} />
                    {post.replies} replies
                  </button>
                  <button className="text-xs text-primary flex items-center">
                    <MessageSquareText className="mr-1" size={14} />
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="p-4">
          <div className="flex space-x-3">
            <img 
              className="h-10 w-10 rounded-full object-cover" 
              src={currentUser.avatar} 
              alt="Your profile" 
            />
            <div className="flex-1">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <div className="bg-gray-100 rounded-lg p-2">
                          <Textarea
                            {...field}
                            className="w-full bg-transparent border-0 focus:ring-0 text-sm text-gray-800 placeholder-gray-500 resize-none"
                            placeholder="Share your thoughts or ask a question..."
                            rows={2}
                          />
                        </div>
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between mt-2">
                    <div className="flex space-x-2">
                      <button type="button" className="text-gray-500 text-sm">
                        <Image size={16} />
                      </button>
                      <button type="button" className="text-gray-500 text-sm">
                        <Code size={16} />
                      </button>
                      <button type="button" className="text-gray-500 text-sm">
                        <Smile size={16} />
                      </button>
                    </div>
                    <Button 
                      type="submit" 
                      className="bg-primary text-white hover:bg-primary/90 text-sm px-3 py-1"
                      disabled={createPostMutation.isPending}
                    >
                      Post
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
