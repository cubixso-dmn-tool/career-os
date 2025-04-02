import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Heart, MessageCircle, Share, MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: number;
  name: string;
  avatar: string;
  username: string;
}

interface Post {
  id: number;
  userId: number;
  user?: User;
  content: string;
  likes: number;
  replies: number;
  createdAt: string;
}

interface Comment {
  id: number;
  postId: number;
  userId: number;
  user?: User;
  content: string;
  createdAt: string;
}

interface CommunityPostProps {
  post: Post;
  currentUser: User;
}

const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(500, "Comment is too long")
});

export default function CommunityPost({ post, currentUser }: CommunityPostProps) {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const queryClient = useQueryClient();
  
  const formatPostDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return "recently";
    }
  };
  
  // Form for adding comments
  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: ""
    }
  });
  
  // Fetch comments for post when comments are shown
  const { data: comments = [] } = useQuery({
    queryKey: [`/api/posts/${post.id}/comments`],
    queryFn: undefined, // Using default queryFn from queryClient
    enabled: showComments
  });
  
  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (values: z.infer<typeof commentSchema>) => {
      const response = await apiRequest("POST", "/api/comments", {
        postId: post.id,
        userId: currentUser.id,
        content: values.content
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${post.id}/comments`] });
      form.reset();
    }
  });
  
  // Like post mutation
  const likePostMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("PATCH", `/api/posts/${post.id}`, {
        likes: post.likes + (liked ? -1 : 1)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
    }
  });
  
  const handleLike = () => {
    setLiked(!liked);
    likePostMutation.mutate();
  };
  
  const onSubmitComment = (values: z.infer<typeof commentSchema>) => {
    addCommentMutation.mutate(values);
  };
  
  const toggleComments = () => {
    setShowComments(!showComments);
  };
  
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.user?.avatar} alt={post.user?.name || "User"} />
            <AvatarFallback>{post.user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">{post.user?.name || "User"}</h3>
                <p className="text-xs text-gray-500">{formatPostDate(post.createdAt)}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-2">
              <p className="text-sm text-gray-800">{post.content}</p>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center ${liked ? 'text-red-500' : 'text-gray-500'}`}
                  onClick={handleLike}
                >
                  <Heart className={`mr-1 h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                  <span>{post.likes + (liked ? 1 : 0)}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center text-gray-500"
                  onClick={toggleComments}
                >
                  <MessageCircle className="mr-1 h-4 w-4" />
                  <span>{post.replies}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center text-gray-500"
                >
                  <Share className="mr-1 h-4 w-4" />
                  <span>Share</span>
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center text-primary"
                onClick={toggleComments}
              >
                {showComments ? (
                  <>
                    Hide Replies <ChevronUp className="ml-1 h-4 w-4" />
                  </>
                ) : (
                  <>
                    View Replies <ChevronDown className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
            
            {/* Comments section */}
            {showComments && (
              <div className="mt-4 space-y-4">
                <div className="border-t my-2"></div>
                
                {/* Comment input */}
                <div className="flex space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmitComment)}>
                        <FormField
                          control={form.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-end gap-2">
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    placeholder="Write a comment..."
                                    className="resize-none min-h-[80px]"
                                  />
                                </FormControl>
                                <Button 
                                  type="submit" 
                                  size="sm"
                                  className="bg-primary"
                                  disabled={addCommentMutation.isPending}
                                >
                                  Post
                                </Button>
                              </div>
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>
                  </div>
                </div>
                
                {/* List of comments */}
                <div className="space-y-3 mt-4">
                  {comments.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-2">No comments yet. Be the first to comment!</p>
                  ) : (
                    comments.map((comment: Comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.user?.avatar} alt={comment.user?.name || "User"} />
                          <AvatarFallback>{comment.user?.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium">{comment.user?.name || "User"}</h4>
                              <span className="text-xs text-gray-500">{formatPostDate(comment.createdAt)}</span>
                            </div>
                            <p className="text-sm mt-1">{comment.content}</p>
                          </div>
                          
                          <div className="flex items-center mt-1 space-x-3 ml-1">
                            <Button variant="ghost" size="sm" className="h-6 text-xs text-gray-500">
                              Like
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 text-xs text-gray-500">
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
