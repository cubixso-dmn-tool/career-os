import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSidebar } from "@/hooks/use-sidebar";
import Sidebar from "@/components/layout/Sidebar";
import MobileHeader from "@/components/ui/mobile-header";
import MobileNavigation from "@/components/layout/MobileNavigation";
import MobileSidebar from "@/components/layout/MobileSidebar";
import CourseCard from "@/components/courses/CourseCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Search, SlidersHorizontal, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

// Mock user ID until authentication is implemented
const USER_ID = 1;

interface CoursesProps {}

export default function Courses({}: CoursesProps) {
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Fetch courses
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['/api/courses', { category: selectedCategory, isFree: priceFilter === 'free' ? true : (priceFilter === 'paid' ? false : undefined) }],
    queryFn: undefined, // Use default queryFn from queryClient
  });

  // Fetch user data
  const { data: userData } = useQuery({
    queryKey: [`/api/users/${USER_ID}`],
    queryFn: undefined, // Use default queryFn from queryClient
  });

  // Close sidebar when navigating to this page
  useEffect(() => {
    closeSidebar();
  }, [closeSidebar]);

  // Filter courses based on search term, tags, category, and price
  const filteredCourses = courses.filter((course: any) => {
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
  const categories = [...new Set(courses.map((course: any) => course.category))];
  
  // Get all available tags from courses
  const allTags = Array.from(new Set(
    courses.flatMap((course: any) => course.tags || [])
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
            <BookOpen className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
                {searchTerm && (
                  <button 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchTerm("")}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              
              <div className="flex gap-2">
                <Select value={priceFilter || ""} onValueChange={setPriceFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  className="md:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal size={18} />
                </Button>
                
                {(selectedCategory || priceFilter || selectedTags.length > 0) && (
                  <Button 
                    variant="ghost" 
                    onClick={clearFilters}
                    className="text-primary"
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
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
}
