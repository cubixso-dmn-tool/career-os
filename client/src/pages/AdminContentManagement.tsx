import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText,
  BookOpen,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Filter
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminContentManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [contentFilter, setContentFilter] = useState("all");

  // Mock data for content management
  const mockCourses = [
    {
      id: 1,
      title: "Introduction to React",
      instructor: "John Doe",
      status: "published",
      enrollments: 245,
      rating: 4.8,
      createdAt: "2024-01-15",
      category: "Web Development"
    },
    {
      id: 2,
      title: "Advanced JavaScript Concepts",
      instructor: "Jane Smith",
      status: "draft",
      enrollments: 0,
      rating: 0,
      createdAt: "2024-02-01",
      category: "Web Development"
    },
    {
      id: 3,
      title: "Data Structures and Algorithms",
      instructor: "Mike Johnson",
      status: "review",
      enrollments: 0,
      rating: 0,
      createdAt: "2024-01-28",
      category: "Computer Science"
    }
  ];

  const mockProjects = [
    {
      id: 1,
      title: "E-commerce Website",
      difficulty: "Intermediate",
      status: "published",
      completions: 89,
      category: "Web Development",
      createdAt: "2024-01-10"
    },
    {
      id: 2,
      title: "Mobile Banking App",
      difficulty: "Advanced",
      status: "draft",
      completions: 0,
      category: "Mobile Development",
      createdAt: "2024-02-05"
    },
    {
      id: 3,
      title: "Portfolio Website",
      difficulty: "Beginner",
      status: "published",
      completions: 156,
      category: "Web Development",
      createdAt: "2024-01-20"
    }
  ];

  const mockPosts = [
    {
      id: 1,
      title: "Tips for Frontend Development",
      author: "Sarah Wilson",
      status: "published",
      likes: 45,
      comments: 12,
      createdAt: "2024-02-15",
      category: "Discussion"
    },
    {
      id: 2,
      title: "Career Advice for New Graduates",
      author: "Alex Brown",
      status: "flagged",
      likes: 23,
      comments: 8,
      createdAt: "2024-02-14",
      category: "Career"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case 'review':
        return <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>;
      case 'flagged':
        return <Badge className="bg-red-100 text-red-800">Flagged</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  return (
    <Layout title="Content Management">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-8 mb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <FileText className="h-8 w-8 text-indigo-600" />
                  </div>
                  Content Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage courses, projects, and community content
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Content
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold">{mockCourses.length}</h3>
                <p className="text-gray-600 text-sm">Total Courses</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold">{mockProjects.length}</h3>
                <p className="text-gray-600 text-sm">Total Projects</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold">{mockPosts.length}</h3>
                <p className="text-gray-600 text-sm">Community Posts</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold">1</h3>
                <p className="text-gray-600 text-sm">Pending Review</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Content Search</CardTitle>
              <CardDescription>Search and filter content across all categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search content by title, instructor, or category..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Tabs */}
          <Tabs defaultValue="courses" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="posts">Community Posts</TabsTrigger>
            </TabsList>

            {/* Courses Tab */}
            <TabsContent value="courses">
              <Card>
                <CardHeader>
                  <CardTitle>Course Management</CardTitle>
                  <CardDescription>Manage all courses on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead>Instructor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Enrollments</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockCourses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900">{course.title}</p>
                              <p className="text-sm text-gray-600">{course.category}</p>
                            </div>
                          </TableCell>
                          <TableCell>{course.instructor}</TableCell>
                          <TableCell>{getStatusBadge(course.status)}</TableCell>
                          <TableCell>{course.enrollments}</TableCell>
                          <TableCell>
                            {course.rating > 0 ? `${course.rating}/5` : 'N/A'}
                          </TableCell>
                          <TableCell>{new Date(course.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              {course.status === 'review' && (
                                <>
                                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-red-600">
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle>Project Management</CardTitle>
                  <CardDescription>Manage all projects on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Completions</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockProjects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900">{project.title}</p>
                              <p className="text-sm text-gray-600">{project.category}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{project.difficulty}</Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(project.status)}</TableCell>
                          <TableCell>{project.completions}</TableCell>
                          <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Community Posts Tab */}
            <TabsContent value="posts">
              <Card>
                <CardHeader>
                  <CardTitle>Community Posts</CardTitle>
                  <CardDescription>Manage community-generated content</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Post</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Engagement</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900">{post.title}</p>
                              <p className="text-sm text-gray-600">{post.category}</p>
                            </div>
                          </TableCell>
                          <TableCell>{post.author}</TableCell>
                          <TableCell>{getStatusBadge(post.status)}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <span className="text-gray-600">{post.likes} likes</span>
                              <span className="text-gray-600 ml-2">{post.comments} comments</span>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              {post.status === 'flagged' && (
                                <>
                                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Remove
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}