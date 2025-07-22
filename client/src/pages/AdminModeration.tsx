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
  Shield,
  AlertTriangle,
  Flag,
  UserX,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Clock,
  MessageSquare,
  Users
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminModeration() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: moderationData, isLoading, error } = useQuery({
    queryKey: ["/api/admin/moderation-queue"],
    queryFn: async () => {
      const response = await fetch('/api/admin/moderation-queue', {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    },
    retry: false,
  });

  const moderation = moderationData?.data || {};
  const flaggedContent = moderation.flaggedContent || [];
  const userReports = moderation.userReports || [];
  const expertApplications = moderation.expertApplications || [];
  const stats = moderation.stats || {};

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'under_review':
        return <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      case 'pending_review':
        return <Badge className="bg-orange-100 text-orange-800">Pending Review</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getReasonBadge = (reason: string) => {
    switch (reason) {
      case 'spam':
        return <Badge variant="outline" className="text-red-600">Spam</Badge>;
      case 'harassment':
        return <Badge variant="outline" className="text-red-600">Harassment</Badge>;
      case 'inappropriate_behavior':
        return <Badge variant="outline" className="text-orange-600">Inappropriate</Badge>;
      default:
        return <Badge variant="outline">{reason}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Layout title="Moderation Dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading moderation data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Moderation Dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Error loading moderation data. Please check your permissions.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Moderation Dashboard">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-8 mb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Shield className="h-8 w-8 text-orange-600" />
                  </div>
                  Moderation Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                  Monitor and manage community content and user reports
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-2xl font-bold">{stats.pendingReviews || '0'}</h3>
                <p className="text-gray-600 text-sm">Pending Reviews</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold">{stats.resolvedToday || '0'}</h3>
                <p className="text-gray-600 text-sm">Resolved Today</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold">{stats.avgResolutionTime || '0'}h</h3>
                <p className="text-gray-600 text-sm">Avg Resolution Time</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <Flag className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold">{flaggedContent.length}</h3>
                <p className="text-gray-600 text-sm">Flagged Content</p>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Moderation Search</CardTitle>
              <CardDescription>Search through flagged content and user reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by content, user, or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Moderation Tabs */}
          <Tabs defaultValue="flagged" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="flagged">Flagged Content</TabsTrigger>
              <TabsTrigger value="reports">User Reports</TabsTrigger>
              <TabsTrigger value="applications">Expert Applications</TabsTrigger>
            </TabsList>

            {/* Flagged Content Tab */}
            <TabsContent value="flagged">
              <Card>
                <CardHeader>
                  <CardTitle>Flagged Content</CardTitle>
                  <CardDescription>Review and moderate flagged posts and comments</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Content</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Flagged By</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {flaggedContent.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="max-w-xs">
                              <p className="font-medium text-gray-900 truncate">{item.content}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.type.replace('_', ' ')}</Badge>
                          </TableCell>
                          <TableCell>{item.author}</TableCell>
                          <TableCell>{getReasonBadge(item.reason)}</TableCell>
                          <TableCell>{item.flaggedBy}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell>{new Date(item.flaggedAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              {item.status === 'pending' && (
                                <>
                                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-red-600">
                                    <XCircle className="h-4 w-4 mr-1" />
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

                  {flaggedContent.length === 0 && (
                    <div className="text-center py-8">
                      <Flag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No flagged content to review</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* User Reports Tab */}
            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>User Reports</CardTitle>
                  <CardDescription>Review reports about user behavior</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reported User</TableHead>
                        <TableHead>Reported By</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userReports.map((report: any) => (
                        <TableRow key={report.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-400" />
                              {report.reportedUser}
                            </div>
                          </TableCell>
                          <TableCell>{report.reportedBy}</TableCell>
                          <TableCell>{getReasonBadge(report.reason)}</TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              <p className="text-sm text-gray-600 truncate">{report.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(report.status)}</TableCell>
                          <TableCell>{new Date(report.reportedAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                Investigate
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600">
                                <UserX className="h-4 w-4 mr-1" />
                                Take Action
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {userReports.length === 0 && (
                    <div className="text-center py-8">
                      <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No user reports to review</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Expert Applications Tab */}
            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle>Expert Applications</CardTitle>
                  <CardDescription>Review applications from users wanting to become experts</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Expertise</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applied</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expertApplications.map((application: any) => (
                        <TableRow key={application.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                {application.applicantName.split(' ').map((n: string) => n[0]).join('')}
                              </div>
                              {application.applicantName}
                            </div>
                          </TableCell>
                          <TableCell>{application.applicantEmail}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{application.expertise}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              <p className="text-sm text-gray-600 truncate">{application.experience}</p>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(application.status)}</TableCell>
                          <TableCell>{new Date(application.appliedAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                Review
                              </Button>
                              {application.status === 'pending_review' && (
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

                  {expertApplications.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No expert applications to review</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}