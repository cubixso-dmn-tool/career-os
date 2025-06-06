import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import MobileNavigation from "@/components/layout/MobileNavigation";
import CourseCard from "@/components/courses/CourseCard";
import LearningTracks from "@/components/courses/LearningTracks";
import MicrolearningBites from "@/components/courses/MicrolearningBites";
import IntegratedPractice from "@/components/courses/IntegratedPractice";
import ProgressHeatmap from "@/components/courses/ProgressHeatmap";
import CommunityReviews from "@/components/courses/CommunityReviews";
import LiveCohortChallenges from "@/components/courses/LiveCohortChallenges";
import MinimalLearningModeSwitcher from "@/components/courses/MinimalLearningModeSwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Search, SlidersHorizontal, X, Compass, Zap, BookmarkIcon, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Mock user ID until authentication is implemented
const USER_ID = 1;

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  tags?: string[];
  isFree?: boolean;
}

interface CoursesProps {}

export default function Courses({}: CoursesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"courses" | "mylearning">("courses");
  const [showLearningModeSettings, setShowLearningModeSettings] = useState(false);

  // Fetch courses from content management API
  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['/api/content-management/courses', { category: selectedCategory, isFree: priceFilter === 'free' ? true : (priceFilter === 'paid' ? false : undefined) }],
    queryFn: undefined, // Use default queryFn from queryClient
  });

  // Fetch user data
  const { data: userData } = useQuery({
    queryKey: [`/api/users/${USER_ID}`],
    queryFn: undefined, // Use default queryFn from queryClient
  });

  // Filter courses based on search term, tags, category, and price
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
                         
    const matchesTags = selectedTags.length === 0 || 
                       (course.tags && selectedTags.some(tag => course.tags.includes(tag)));
    
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    
    const matchesPrice = !priceFilter || priceFilter === "all" || 
                        (priceFilter === "free" && course.isFree) ||
                        (priceFilter === "paid" && !course.isFree);
                       
    return matchesSearch && matchesTags && matchesCategory && matchesPrice;
  });

  // Get all available categories from courses
  const categories = Array.from(new Set(
    courses.map((course) => course.category)
  ));
  
  // Get all available tags from courses
  const allTags = Array.from(new Set(
    courses.flatMap((course) => course.tags || [])
  ));

  // Toggle a tag in the selected tags array
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setPriceFilter(null);
    setSelectedTags([]);
  };

  // Render the courses catalog
  const renderCoursesCatalog = () => (
    <>
      {/* Search and Filter Bar */}
      <div className="mb-8 space-y-4">
        <div className="cantina-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="cantina-input pl-10"
            />
            {searchTerm && (
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cantina-text-muted hover:text-foreground"
                onClick={() => setSearchTerm("")}
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <div className="cantina-row gap-2">
            <Select value={priceFilter || ""} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-32 cantina-input">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent className="cantina-card">
                <SelectItem value="all" className="cantina-text-body">All Prices</SelectItem>
                <SelectItem value="free" className="cantina-text-body">Free</SelectItem>
                <SelectItem value="paid" className="cantina-text-body">Paid</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              className="md:hidden cantina-button-ghost"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={16} />
            </Button>
            
            {(selectedCategory || priceFilter || selectedTags.length > 0) && (
              <Button 
                variant="ghost" 
                onClick={clearFilters}
                className="cantina-button-ghost"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
        
        {/* Mobile Filters */}
        {showFilters && (
          <div className="p-4 border rounded-md md:hidden">
            <h3 className="font-medium mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((category: string) => (
                <Badge 
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
            
            <h3 className="font-medium mb-2">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 8).map((tag: string) => (
                <Badge 
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Desktop Category Tabs */}
        <div className="hidden md:block">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger 
                value="all"
                onClick={() => setSelectedCategory(null)}
                className={!selectedCategory ? "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" : ""}
              >
                All Courses
              </TabsTrigger>
              {categories.map((category: string) => (
                <TabsTrigger 
                  key={category}
                  value={category}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" : ""}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        {/* Desktop Tags */}
        <div className="hidden md:flex flex-wrap gap-2">
          {allTags.slice(0, 12).map((tag: string) => (
            <Badge 
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
        
        {/* Applied Filters */}
        {(selectedCategory || priceFilter || selectedTags.length > 0) && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Filters:</span>
            {selectedCategory && (
              <Badge 
                variant="secondary"
                className="gap-1"
              >
                {selectedCategory}
                <button onClick={() => setSelectedCategory(null)}>
                  <X size={14} />
                </button>
              </Badge>
            )}
            
            {priceFilter && (
              <Badge 
                variant="secondary"
                className="gap-1"
              >
                {priceFilter === 'free' ? 'Free' : 'Paid'}
                <button onClick={() => setPriceFilter(null)}>
                  <X size={14} />
                </button>
              </Badge>
            )}
            
            {selectedTags.map(tag => (
              <Badge 
                key={tag}
                variant="secondary"
                className="gap-1"
              >
                {tag}
                <button onClick={() => toggleTag(tag)}>
                  <X size={14} />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      {/* Learning Tracks Section */}
      <LearningTracks />
      
      {/* Course Listing */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {selectedCategory ? `${selectedCategory} Courses` : 'All Courses'}
          </h2>
          <p className="text-sm text-gray-500">{filteredCourses.length} courses</p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-80"></div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any courses matching your filters.
            </p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course: any) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
      
      {/* Community Reviews Section */}
      <CommunityReviews />
    </>
  );
  
  // Render the My Learning tab content
  const renderMyLearning = () => (
    <div className="cantina-stack">
      {/* Desktop Learning Mode Switcher */}
      <div className="hidden md:block">
        <div className="cantina-card p-6">
          <h2 className="text-sm cantina-text-muted mb-4 uppercase tracking-wide">Learning Preferences</h2>
          <MinimalLearningModeSwitcher />
        </div>
      </div>
      
      {/* Daily Learning Bytes */}
      <MicrolearningBites />
      
      {/* Progress Heatmap */}
      <ProgressHeatmap />
      
      {/* Integrated Practice Section */}
      <IntegratedPractice />
      
      {/* Live Cohort Challenges */}
      <LiveCohortChallenges />
    </div>
  );

  return (
    <Layout title="Courses">
      <div className="px-4 py-6 md:px-8 pb-20 md:pb-6 bg-background min-h-screen">
        {/* Header */}
        <div className="cantina-row justify-between mb-8 cantina-divider pb-6">
          <div className="cantina-row">
            <BookOpen className="h-5 w-5 text-accent" />
            <h1 className="text-xl font-semibold cantina-text-heading">Courses</h1>
          </div>
          
          {/* Settings button for mobile */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowLearningModeSettings(!showLearningModeSettings)}
              className="cantina-button-ghost h-8 w-8"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Learning Mode Switcher */}
        {showLearningModeSettings && (
          <div className="mb-6 md:hidden">
            <div className="cantina-card p-4">
              <h2 className="text-sm cantina-text-muted mb-3 uppercase tracking-wide">Learning Preferences</h2>
              <MinimalLearningModeSwitcher />
            </div>
          </div>
        )}
        
        {/* Main Navigation Tabs */}
        <Tabs 
          defaultValue="courses" 
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "courses" | "mylearning")}
          className="mb-8"
        >
          <TabsList className="w-full flex bg-transparent cantina-divider p-0 h-auto mb-8">
            <TabsTrigger 
              value="courses" 
              className={cn(
                "font-medium px-6 py-3 border-b-2 bg-transparent cantina-row",
                activeTab === "courses" 
                  ? "border-accent cantina-text-accent" 
                  : "border-transparent cantina-text-muted hover:text-foreground"
              )}
            >
              <Compass className="h-4 w-4 mr-2" />
              Browse Courses
            </TabsTrigger>
            <TabsTrigger 
              value="mylearning" 
              className={cn(
                "font-medium px-6 py-3 border-b-2 bg-transparent cantina-row",
                activeTab === "mylearning" 
                  ? "border-accent cantina-text-accent" 
                  : "border-transparent cantina-text-muted hover:text-foreground"
              )}
            >
              <BookmarkIcon className="h-4 w-4 mr-2" />
              My Learning
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="courses" className="mt-0 p-0 border-none">
            {renderCoursesCatalog()}
          </TabsContent>
          
          <TabsContent value="mylearning" className="mt-0 p-0 border-none">
            {renderMyLearning()}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNavigation />
    </Layout>
  );
}
