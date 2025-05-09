import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StarIcon, MessageCircle, ThumbsUp, ThumbsDown, ChevronRight, Filter, SortAsc, SortDesc, BookmarkIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Review {
  id: number;
  userId: number;
  username: string;
  userAvatar?: string;
  courseId: number;
  rating: number; // 1-5
  review: string;
  createdAt: string;
  helpfulCount: number;
  unhelpfulCount: number;
  notes?: string[];
  isVerifiedPurchase: boolean;
  completedPercent?: number;
}

export default function CommunityReviews() {
  const [sortBy, setSortBy] = useState<"newest" | "highest" | "lowest" | "most-helpful">("most-helpful");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"reviews" | "notes">("reviews");
  
  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ['/api/courses/reviews', { sortBy, filterRating }],
    // Using default queryFn from queryClient
  });
  
  // For notes, filter out reviews with notes
  const notesReviews = reviews.filter(review => review.notes && review.notes.length > 0);
  
  // Get average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";
  
  // Get rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(review => review.rating === rating).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { rating, count, percentage };
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-40 bg-gray-200 rounded"></div>
      </div>
    );
  }

  // If no reviews, don't show anything
  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold flex items-center">
          <MessageCircle className="mr-2 h-5 w-5 text-primary" />
          Community Feedback
        </h2>
      </div>
      
      <p className="text-gray-600 mb-4">
        Reviews and shared notes from students who have taken these courses
      </p>
      
      <Card className="border border-gray-100">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rating Summary */}
            <div>
              <div className="text-center md:text-left pb-4 border-b md:border-none">
                <div className="flex items-center justify-center md:justify-start mb-2">
                  <span className="text-3xl font-bold mr-2">{averageRating}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon 
                        key={star}
                        className={cn(
                          "h-5 w-5",
                          parseFloat(averageRating) >= star 
                            ? "text-amber-400 fill-amber-400" 
                            : parseFloat(averageRating) >= star - 0.5
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500">{reviews.length} reviews</p>
              </div>
              
              {/* Rating Distribution */}
              <div className="hidden md:block mt-4">
                <h3 className="font-medium text-sm mb-2">Rating Distribution</h3>
                <div className="space-y-2">
                  {ratingDistribution.map(({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center text-sm">
                      <div className="w-10">{rating} ★</div>
                      <div className="w-full mx-2 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-amber-400 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="w-8 text-right text-gray-500">{count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Reviews List */}
            <div className="md:col-span-2">
              <Tabs defaultValue="reviews" value={activeTab} onValueChange={(v) => setActiveTab(v as "reviews" | "notes")}>
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="reviews" className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Reviews
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="flex items-center">
                      <BookmarkIcon className="h-4 w-4 mr-1" />
                      Shared Notes
                      {notesReviews.length > 0 && (
                        <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                          {notesReviews.length}
                        </span>
                      )}
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 text-xs">
                          <Filter className="h-3 w-3 mr-1" />
                          Filter
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem onClick={() => setFilterRating(null)}>
                          All Ratings
                        </DropdownMenuItem>
                        {[5, 4, 3, 2, 1].map(rating => (
                          <DropdownMenuItem 
                            key={rating} 
                            onClick={() => setFilterRating(rating)}
                            className={filterRating === rating ? "bg-primary/10" : ""}
                          >
                            {rating} Stars
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 text-xs">
                          {sortBy === "newest" ? (
                            <SortDesc className="h-3 w-3 mr-1" />
                          ) : (
                            <SortAsc className="h-3 w-3 mr-1" />
                          )}
                          Sort
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem 
                          onClick={() => setSortBy("newest")}
                          className={sortBy === "newest" ? "bg-primary/10" : ""}
                        >
                          Newest
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setSortBy("highest")}
                          className={sortBy === "highest" ? "bg-primary/10" : ""}
                        >
                          Highest Rating
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setSortBy("lowest")}
                          className={sortBy === "lowest" ? "bg-primary/10" : ""}
                        >
                          Lowest Rating
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setSortBy("most-helpful")}
                          className={sortBy === "most-helpful" ? "bg-primary/10" : ""}
                        >
                          Most Helpful
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <TabsContent value="reviews" className="mt-0">
                  <ScrollArea className="h-[460px] md:pr-2 rounded-sm">
                    <div className="space-y-4">
                      {reviews.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-1">No reviews yet</h3>
                          <p className="text-gray-600 mb-4">Be the first to share your experience!</p>
                        </div>
                      ) : (
                        reviews.map(review => (
                          <div 
                            key={review.id} 
                            className="p-4 rounded-lg border bg-white hover:shadow-sm transition-shadow"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-start">
                                <Avatar className="h-10 w-10 mr-3">
                                  <AvatarImage src={review.userAvatar} />
                                  <AvatarFallback>{getInitials(review.username)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-medium">{review.username}</h4>
                                  <div className="flex items-center text-sm text-gray-500">
                                    <div className="flex">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <StarIcon 
                                          key={star}
                                          className={cn(
                                            "h-4 w-4",
                                            review.rating >= star 
                                              ? "text-amber-400 fill-amber-400" 
                                              : "text-gray-300"
                                          )}
                                        />
                                      ))}
                                    </div>
                                    <span className="mx-2">•</span>
                                    <time>{formatDate(review.createdAt)}</time>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                {review.isVerifiedPurchase && (
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                    Verified
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <p className="text-gray-700 mb-3">{review.review}</p>
                            
                            {review.completedPercent !== undefined && (
                              <div className="text-sm text-gray-500 mb-3">
                                Completed {review.completedPercent}% of the course
                              </div>
                            )}
                            
                            <div className="flex justify-between text-sm">
                              <div className="flex items-center gap-4">
                                <button className="flex items-center text-gray-500 hover:text-gray-700">
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                  <span>{review.helpfulCount}</span>
                                </button>
                                <button className="flex items-center text-gray-500 hover:text-gray-700">
                                  <ThumbsDown className="h-4 w-4 mr-1" />
                                  <span>{review.unhelpfulCount}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="notes" className="mt-0">
                  <ScrollArea className="h-[460px] md:pr-2 rounded-sm">
                    <div className="space-y-4">
                      {notesReviews.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <BookmarkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-1">No shared notes yet</h3>
                          <p className="text-gray-600 mb-4">Share your course notes to help other students!</p>
                        </div>
                      ) : (
                        notesReviews.map(review => (
                          <div 
                            key={review.id} 
                            className="p-4 rounded-lg border bg-white hover:shadow-sm transition-shadow"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-start">
                                <Avatar className="h-10 w-10 mr-3">
                                  <AvatarImage src={review.userAvatar} />
                                  <AvatarFallback>{getInitials(review.username)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-medium">{review.username}'s Notes</h4>
                                  <div className="flex items-center text-sm text-gray-500">
                                    <time>{formatDate(review.createdAt)}</time>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2 mb-3">
                              {review.notes?.map((note, index) => (
                                <div 
                                  key={index} 
                                  className="p-3 bg-amber-50 border border-amber-100 text-amber-800 rounded-md"
                                >
                                  {note}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}