import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users,
  Search,
  Filter,
  Eye,
  Edit,
  UserX,
  UserPlus,
  Download,
  MoreHorizontal,
  Crown,
  Shield,
  GraduationCap
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminUserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const queryClient = useQueryClient();

  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ["/api/admin/users", searchTerm, roleFilter, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (roleFilter !== 'all') params.append('role', roleFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      
      const response = await fetch(`/api/admin/users?${params.toString()}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    },
    retry: false,
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, roleId }: { userId: number; roleId: number }) => {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ roleId }),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
  });

  const users = usersData?.data || {};
  const usersList = users.data || [];
  const stats = users.stats || {};

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'moderator': return <Shield className="h-4 w-4 text-blue-600" />;
      case 'mentor': return <GraduationCap className="h-4 w-4 text-green-600" />;
      default: return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-yellow-100 text-yellow-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      case 'mentor': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Layout title="User Management">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading user data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="User Management">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Error loading user data. Please check your permissions.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="User Management">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-8 mb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  User Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage user accounts, roles, and permissions
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Users
                </Button>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
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
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold">{stats.totalUsers?.toLocaleString() || '0'}</h3>
                <p className="text-gray-600 text-sm">Total Users</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold">{stats.students?.toLocaleString() || '0'}</h3>
                <p className="text-gray-600 text-sm">Students</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold">{(stats.mentors + stats.moderators + stats.admins) || '0'}</h3>
                <p className="text-gray-600 text-sm">Staff</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold">{stats.activeUsers?.toLocaleString() || '0'}</h3>
                <p className="text-gray-600 text-sm">Active Users</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>User Filters</CardTitle>
              <CardDescription>Search and filter users by various criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by name, email, or username..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="student">Students</SelectItem>
                    <SelectItem value="mentor">Mentors</SelectItem>
                    <SelectItem value="moderator">Moderators</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                {usersList.length} user{usersList.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersList.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {(user.name || user.username).split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name || user.username}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getRoleBadgeColor(user.role)} flex items-center gap-1 w-fit`}>
                          {getRoleIcon(user.role)}
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.status === 'active' ? 'default' : 'secondary'}
                          className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'Unknown'}
                      </TableCell>
                      <TableCell>
                        {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Never'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <UserX className="mr-2 h-4 w-4" />
                              Suspend User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {usersList.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No users found matching your criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}