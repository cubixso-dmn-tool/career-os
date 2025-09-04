import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Crown,
  Users,
  Calendar,
  Shield,
  FileText,
  BarChart3,
  Settings,
  UserCheck,
  UserX,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Download,
  ToggleLeft,
  ToggleRight,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Zap,
  Database,
  Bell,
  FolderOpen
} from "lucide-react";

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for dialogs
  const [editUserDialog, setEditUserDialog] = useState<{ isOpen: boolean; user: any }>({ isOpen: false, user: null });
  const [deleteUserDialog, setDeleteUserDialog] = useState<{ isOpen: boolean; user: any }>({ isOpen: false, user: null });
  const [createUserDialog, setCreateUserDialog] = useState(false);
  const [viewProfileDialog, setViewProfileDialog] = useState<{ isOpen: boolean; user: any }>({ isOpen: false, user: null });
  const [editProfileDialog, setEditProfileDialog] = useState<{ isOpen: boolean; user: any }>({ isOpen: false, user: null });
  const [suspendUserDialog, setSuspendUserDialog] = useState<{ isOpen: boolean; user: any }>({ isOpen: false, user: null });
  
  // State for forms
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [newUserForm, setNewUserForm] = useState({ name: "", email: "", username: "", role: "student" });
  const [editUserForm, setEditUserForm] = useState({ name: "", email: "", username: "", bio: "" });
  const [suspendForm, setSuspendForm] = useState({ reason: "", action: "suspend" });

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/admin/analytics"],
    queryFn: async () => {
      const response = await fetch('/api/admin/analytics', {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    },
    retry: false,
  });

  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const response = await fetch('/api/admin/users', {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    },
    retry: false,
  });

  const { data: rolesData } = useQuery({
    queryKey: ["/api/admin/roles"],
    queryFn: async () => {
      const response = await fetch('/api/admin/roles', {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    },
    retry: false,
  });

  const { data: moderationData, isLoading: moderationLoading } = useQuery({
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

  // Mutations
  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, roleName }: { userId: number; roleName: string }) => {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ roleName }),
      });
      if (!response.ok) throw new Error('Failed to update user role');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "User role updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setEditUserDialog({ isOpen: false, user: null });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete user');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "User deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setDeleteUserDialog({ isOpen: false, user: null });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: { name: string; email: string; username: string; roleName: string }) => {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Failed to create user');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "User created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setCreateUserDialog(false);
      setNewUserForm({ name: "", email: "", username: "", role: "student" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, userData }: { userId: number; userData: { name: string; email: string; username: string; bio: string } }) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Failed to update user');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "User updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setEditProfileDialog({ isOpen: false, user: null });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const suspendUserMutation = useMutation({
    mutationFn: async ({ userId, status, reason }: { userId: number; status: string; reason: string }) => {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status, reason }),
      });
      if (!response.ok) throw new Error('Failed to update user status');
      return response.json();
    },
    onSuccess: (data) => {
      toast({ 
        title: "Success", 
        description: `User ${data.data.status === 'suspended' ? 'suspended' : 'activated'} successfully` 
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setSuspendUserDialog({ isOpen: false, user: null });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Fetch individual user data for profile view
  const { data: userProfileData } = useQuery({
    queryKey: [`/api/admin/users/${viewProfileDialog.user?.id}`],
    queryFn: async () => {
      if (!viewProfileDialog.user?.id) return null;
      const response = await fetch(`/api/admin/users/${viewProfileDialog.user.id}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch user profile');
      return response.json();
    },
    enabled: !!viewProfileDialog.user?.id && viewProfileDialog.isOpen,
  });

  const isLoading = analyticsLoading || usersLoading || moderationLoading;

  if (isLoading) {
    return (
      <Layout title="Admin Dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Use real analytics data
  const analytics = analyticsData?.data || {};
  const users = usersData?.data || {};
  const moderation = moderationData?.data || {};
  const roles = rolesData?.data || [];

  // Helper functions for user management
  const handleEditUser = (user: any) => {
    setSelectedRole(user.role);
    setEditUserDialog({ isOpen: true, user });
  };

  const handleDeleteUser = (user: any) => {
    setDeleteUserDialog({ isOpen: true, user });
  };

  const handleCreateUser = () => {
    setCreateUserDialog(true);
  };

  const handleViewProfile = (user: any) => {
    console.log('View Profile clicked for user:', user);
    setViewProfileDialog({ isOpen: true, user });
  };

  const handleEditProfile = (user: any) => {
    console.log('Edit Profile clicked for user:', user);
    setEditUserForm({
      name: user.name || "",
      email: user.email || "",
      username: user.username || "",
      bio: user.bio || ""
    });
    setEditProfileDialog({ isOpen: true, user });
  };

  const handleSuspendUser = (user: any) => {
    setSuspendForm({ reason: "", action: user.status === 'suspended' ? 'activate' : 'suspend' });
    setSuspendUserDialog({ isOpen: true, user });
  };

  const confirmRoleUpdate = () => {
    if (editUserDialog.user && selectedRole) {
      updateUserRoleMutation.mutate({
        userId: editUserDialog.user.id,
        roleName: selectedRole
      });
    }
  };

  const confirmDeleteUser = () => {
    if (deleteUserDialog.user) {
      deleteUserMutation.mutate(deleteUserDialog.user.id);
    }
  };

  const confirmCreateUser = () => {
    if (newUserForm.name && newUserForm.email && newUserForm.username) {
      createUserMutation.mutate({
        name: newUserForm.name,
        email: newUserForm.email,
        username: newUserForm.username,
        roleName: newUserForm.role
      });
    }
  };

  const confirmUpdateUser = () => {
    if (editProfileDialog.user) {
      updateUserMutation.mutate({
        userId: editProfileDialog.user.id,
        userData: editUserForm
      });
    }
  };

  const confirmSuspendUser = () => {
    if (suspendUserDialog.user) {
      const status = suspendForm.action === 'suspend' ? 'suspended' : 'active';
      suspendUserMutation.mutate({
        userId: suspendUserDialog.user.id,
        status,
        reason: suspendForm.reason
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'moderator': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'mentor': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'expert': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const data = {
    stats: {
      totalUsers: users.stats?.totalUsers || analytics.users?.total || 0,
      activeToday: analytics.users?.activeUsers || 0,
      totalEvents: analytics.engagement?.totalSessions || 0,
      pendingModeration: moderation.stats?.pendingReviews || 0
    },
    metrics: {
      conversionRate: `${analytics.revenue?.conversionRate || 0}%`,
      growthRate: `${analytics.users?.growthRate || 0}%`, 
      retentionRate: `${analytics.users?.retentionRate || 0}%`,
      engagementRate: `${analytics.engagement?.avgSessionDuration || 0}min`
    }
  };

  const adminJourneyStages = [
    {
      id: 1,
      title: "System Access",
      description: "Full admin privileges",
      icon: Crown,
      status: "completed",
      color: "green"
    },
    {
      id: 2,
      title: "Role Management",
      description: "User role assignments",
      icon: Users,
      status: "active",
      color: "blue"
    },
    {
      id: 3,
      title: "Event Oversight", 
      description: "Calendar & notifications",
      icon: Calendar,
      status: "active",
      color: "purple"
    },
    {
      id: 4,
      title: "Community Moderation",
      description: "Mod oversight & escalations",
      icon: Shield,
      status: "active",
      color: "orange"
    },
    {
      id: 5,
      title: "Content Management",
      description: "Official content approval",
      icon: FileText,
      status: "active",
      color: "indigo"
    },
    {
      id: 6,
      title: "Analytics & KPIs",
      description: "Platform metrics monitoring",
      icon: BarChart3,
      status: "active",
      color: "pink"
    },
    {
      id: 7,
      title: "Feature Toggles",
      description: "Feature flag management",
      icon: Settings,
      status: "active",
      color: "cyan"
    }
  ];

  return (
    <Layout title="Admin Dashboard">
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Welcome Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-8 mb-8">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Crown className="h-8 w-8 text-indigo-600" />
                  </div>
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                  Complete platform oversight and management control
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="px-3 py-1 bg-indigo-100 text-indigo-800">
                  <Globe className="h-4 w-4 mr-1" />
                  Super Admin
                </Badge>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-8">
            {/* Platform Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold">{data.stats.totalUsers.toLocaleString()}</h3>
                  <p className="text-blue-100 text-sm">Total Users</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-0 bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <Activity className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold">{data.stats.activeToday.toLocaleString()}</h3>
                  <p className="text-green-100 text-sm">Active Today</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold">{data.stats.totalEvents}</h3>
                  <p className="text-purple-100 text-sm">Total Events</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold">{data.stats.pendingModeration}</h3>
                  <p className="text-orange-100 text-sm">Pending Review</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Admin Journey Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-6 w-6 text-indigo-600" />
                    Admin Control Center
                  </CardTitle>
                  <CardDescription>
                    Complete platform management and oversight capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {adminJourneyStages.map((stage) => (
                      <div
                        key={stage.id}
                        className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                          stage.status === 'completed' ? 'border-green-200 bg-green-50' :
                          stage.status === 'active' ? 'border-indigo-200 bg-indigo-50' 
                          : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="text-center">
                          <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                            stage.status === 'completed' ? 'bg-green-500' :
                            stage.status === 'active' ? 'bg-indigo-500' : 'bg-gray-400'
                          }`}>
                            <stage.icon className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-sm text-gray-900 mb-1">{stage.title}</h3>
                          <p className="text-xs text-gray-600 mb-2">{stage.description}</p>
                          <Badge 
                            variant={stage.status === 'completed' ? 'default' : stage.status === 'active' ? 'secondary' : 'outline'}
                            className={`text-xs ${
                              stage.status === 'completed' ? 'bg-green-100 text-green-800' :
                              stage.status === 'active' ? 'bg-indigo-100 text-indigo-800' :
                              'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {stage.status === 'completed' ? 'Complete' :
                             stage.status === 'active' ? 'Active' : 'Pending'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Admin Management Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Tabs defaultValue="users" className="space-y-6">
                {/* <TabsList className="flex items-center justify-between">
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="experts">Experts</TabsTrigger>
                  <TabsTrigger value="sessions">Sessions</TabsTrigger>
                  <TabsTrigger value="careers">Careers</TabsTrigger>
                  <TabsTrigger value="community">Community</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList> */}

                {/* User Management Tab */}
                <TabsContent value="users">
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-600" />
                            User & Role Management
                          </CardTitle>
                          <CardDescription>Manage user accounts and role assignments</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                          <Button onClick={handleCreateUser} size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Add User
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      {/* User Stats Row */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{users.stats?.totalUsers || 0}</div>
                          <div className="text-xs text-gray-500">Total Users</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{users.stats?.students || 0}</div>
                          <div className="text-xs text-gray-500">Students</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{users.stats?.mentors || 0}</div>
                          <div className="text-xs text-gray-500">Mentors</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{users.stats?.experts || 0}</div>
                          <div className="text-xs text-gray-500">Experts</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">{users.stats?.admins || 0}</div>
                          <div className="text-xs text-gray-500">Admins</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {!users.data || users.data?.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium">No users found</p>
                            <p className="text-sm">Users will appear here as they register</p>
                          </div>
                        ) : users.data?.map((user: any) => (
                          <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                                  ) : (
                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                      {(user.name || user.username).split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                    </div>
                                  )}
                                  <div>
                                    <h4 className="font-semibold text-gray-900">{user.name || user.username}</h4>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                    {user.username && <p className="text-xs text-gray-500">@{user.username}</p>}
                                  </div>
                                  <Badge 
                                    className={getRoleBadgeColor(user.role)}
                                  >
                                    {user.role || 'student'}
                                  </Badge>
                                  <Badge 
                                    variant={user.status === 'active' ? 'default' : 'secondary'}
                                    className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                                  >
                                    {user.status || 'active'}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
                                  <div>
                                    <span className="font-medium">User ID:</span> {user.id}
                                  </div>
                                  <div>
                                    <span className="font-medium">Last Active:</span> {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Never'}
                                  </div>
                                  <div>
                                    <span className="font-medium">Joined:</span> {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'Unknown'}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button size="sm" variant="outline" onClick={() => handleViewProfile(user)}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Profile
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleEditProfile(user)}>
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit User
                                </Button>
                                {/* <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>
                                  <UserCheck className="h-4 w-4 mr-1" />
                                  Role
                                </Button> */}
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className={user.status === 'suspended' ? 'text-green-600 hover:text-green-700' : 'text-orange-600 hover:text-orange-700'}
                                  onClick={() => handleSuspendUser(user)}
                                >
                                  {user.status === 'suspended' ? (
                                    <>
                                      <UserCheck className="h-4 w-4 mr-1" />
                                      Activate
                                    </>
                                  ) : (
                                    <>
                                      <UserX className="h-4 w-4 mr-1" />
                                      Suspend
                                    </>
                                  )}
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => handleDeleteUser(user)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Expert Management Tab */}
                <TabsContent value="experts">
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-purple-600" />
                            Expert Network Management
                          </CardTitle>
                          <CardDescription>Manage industry experts, sessions, and networking events</CardDescription>
                        </div>
                        <Link href="/experts">
                          <Button className="bg-purple-600 hover:bg-purple-700">
                            <Users className="h-4 w-4 mr-2" />
                            Manage Experts
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-6 text-white">
                          <h3 className="text-lg font-semibold mb-2">Total Experts</h3>
                          <p className="text-3xl font-bold">0</p>
                          <p className="text-purple-100 text-sm mt-2">Industry professionals</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg p-6 text-white">
                          <h3 className="text-lg font-semibold mb-2">Active Sessions</h3>
                          <p className="text-3xl font-bold">0</p>
                          <p className="text-blue-100 text-sm mt-2">Upcoming expert sessions</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-lg p-6 text-white">
                          <h3 className="text-lg font-semibold mb-2">Success Stories</h3>
                          <p className="text-3xl font-bold">0</p>
                          <p className="text-green-100 text-sm mt-2">Career transformation stories</p>
                        </div>
                      </div>
                      <div className="mt-8 text-center">
                        <p className="text-gray-600 mb-4">Start building your expert network by adding industry professionals</p>
                        <Link href="/experts">
                          <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                            Get Started with Expert Management
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Session Management Tab */}
                <TabsContent value="sessions">
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-orange-600" />
                            Session & Event Management
                          </CardTitle>
                          <CardDescription>Manage expert sessions and networking events</CardDescription>
                        </div>
                        <Link href="/sessions">
                          <Button className="bg-orange-600 hover:bg-orange-700">
                            <Calendar className="h-4 w-4 mr-2" />
                            Manage Sessions
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Expert Sessions</p>
                              <p className="text-lg font-semibold">Create & Manage</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">One-on-one mentoring, group sessions, and workshops</p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Calendar className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Networking Events</p>
                              <p className="text-lg font-semibold">Schedule & Track</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">Webinars, conferences, and networking meetups</p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <BarChart3 className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Event Analytics</p>
                              <p className="text-lg font-semibold">Performance Insights</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">Attendance tracking and engagement metrics</p>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-start gap-3">
                          <Calendar className="h-5 w-5 text-orange-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-orange-900">Session Management Features</h4>
                            <p className="text-sm text-orange-700 mt-1">
                              Create expert-led sessions, schedule networking events, manage participants, 
                              and track engagement metrics. Set up pricing, manage registrations, and 
                              monitor event success.
                            </p>
                            <ul className="text-sm text-orange-600 mt-2 space-y-1">
                              <li>• Expert session scheduling and management</li>
                              <li>• Networking event creation and tracking</li>
                              <li>• Participant management and notifications</li>
                              <li>• Event analytics and performance metrics</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Career Management Tab */}
                <TabsContent value="careers">
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-green-600" />
                            Career Path Management
                          </CardTitle>
                          <CardDescription>Manage career options, assessments, and roadmaps</CardDescription>
                        </div>
                        <Link href="/careers">
                          <Button className="bg-green-600 hover:bg-green-700">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Manage Careers
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <BarChart3 className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Career Options</p>
                              <p className="text-lg font-semibold">Create & Manage</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">Add and manage available career paths for students</p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <FileText className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Career Roadmaps</p>
                              <p className="text-lg font-semibold">Skills & Resources</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">Define skills, courses, and resources for each career path</p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Users className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Assessments</p>
                              <p className="text-lg font-semibold">Career Matching</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">Configure assessment questions and career matching logic</p>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-start gap-3">
                          <BarChart3 className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-green-900">Career Management Features</h4>
                            <p className="text-sm text-green-700 mt-1">
                              Create and manage career options that will be recommended to students. Define 
                              comprehensive roadmaps with skills, courses, projects, and resources for each career path.
                            </p>
                            <ul className="text-sm text-green-600 mt-2 space-y-1">
                              <li>• Dynamic career options with salary ranges</li>
                              <li>• Skill-based career roadmaps</li>
                              <li>• Assessment questions and matching algorithms</li>
                              <li>• Course and resource recommendations</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Community Management Tab */}
                <TabsContent value="community">
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-purple-600" />
                            Community Feature Management
                          </CardTitle>
                          <CardDescription>Manage community cards displayed to users</CardDescription>
                        </div>
                        <Link href="/admin/community">
                          <Button className="bg-purple-600 hover:bg-purple-700">
                            <Users className="h-4 w-4 mr-2" />
                            Manage Community
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Communities</p>
                              <p className="text-lg font-semibold">Manage Cards</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">Create and manage community group cards</p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <FolderOpen className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Projects</p>
                              <p className="text-lg font-semibold">Project Cards</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">Manage collaborative project opportunities</p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                              <Calendar className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Events</p>
                              <p className="text-lg font-semibold">Event Cards</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">Create and promote community events</p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Crown className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Competitions</p>
                              <p className="text-lg font-semibold">Contest Cards</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">Showcase competitions and challenges</p>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-start gap-3">
                          <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-purple-900">Community Management Features</h4>
                            <p className="text-sm text-purple-700 mt-1">
                              Create and manage community feature cards that redirect users to external platforms. 
                              Each card can have a title, description, image, and redirect URL that opens in a new tab.
                            </p>
                            <ul className="text-sm text-purple-600 mt-2 space-y-1">
                              <li>• Community group cards with external links</li>
                              <li>• Project collaboration opportunities</li>
                              <li>• Event promotion and registration</li>
                              <li>• Competition and challenge showcases</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="shadow-lg border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-indigo-600" />
                          Platform Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Daily Active Users</span>
                            <span className="font-semibold text-gray-900">{analytics.users?.activeUsers?.toLocaleString() || '0'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Weekly Retention</span>
                            <span className="font-semibold text-green-600">{analytics.users?.retentionRate || 0}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Course Completion</span>
                            <span className="font-semibold text-blue-600">{analytics.engagement?.courseCompletions || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">System Uptime</span>
                            <span className="font-semibold text-purple-600">{analytics.performance?.systemUptime || 0}%</span>
                          </div>
                          <div className="pt-2 border-t">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600">Platform Health</span>
                              <span className="text-sm font-medium text-green-600">{analytics.performance?.systemUptime || 0}%</span>
                            </div>
                            <Progress value={analytics.performance?.systemUptime || 0} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-lg border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          Growth Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">New Users (30d)</span>
                            <span className="font-semibold text-gray-900">+{analytics.users?.newThisMonth?.toLocaleString() || '0'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Content</span>
                            <span className="font-semibold text-blue-600">{analytics.content?.totalCourses || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Monthly Revenue</span>
                            <span className="font-semibold text-purple-600">${analytics.revenue?.monthlyRevenue?.toLocaleString() || '0'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Community Posts</span>
                            <span className="font-semibold text-orange-600">{analytics.content?.totalPosts?.toLocaleString() || '0'}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Other tabs remain the same... */}
                <TabsContent value="content">
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle>Content Management</CardTitle>
                      <CardDescription>Approve and manage official platform content</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-gray-600">Content management interface coming soon...</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="features">
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle>Feature Management</CardTitle>
                      <CardDescription>Control feature rollouts and availability</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-gray-600">Feature management interface coming soon...</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="system">
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle>System Status</CardTitle>
                      <CardDescription>Monitor system health and performance</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-gray-600">System monitoring interface coming soon...</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>            
          </div>
        </div>
      </div>

      {/* Edit User Role Dialog */}
      <Dialog open={editUserDialog.isOpen} onOpenChange={(open) => setEditUserDialog({ isOpen: open, user: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Change the role for {editUserDialog.user?.name || editUserDialog.user?.username}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="role">Select Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role: any) => (
                  <SelectItem key={role.id} value={role.name}>
                    {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUserDialog({ isOpen: false, user: null })}>
              Cancel
            </Button>
            <Button 
              onClick={confirmRoleUpdate} 
              disabled={updateUserRoleMutation.isPending || !selectedRole}
            >
              {updateUserRoleMutation.isPending ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={deleteUserDialog.isOpen} onOpenChange={(open) => setDeleteUserDialog({ isOpen: open, user: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deleteUserDialog.user?.name || deleteUserDialog.user?.username}? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUserDialog({ isOpen: false, user: null })}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteUser}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={createUserDialog} onOpenChange={setCreateUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={newUserForm.name}
                onChange={(e) => setNewUserForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUserForm.email}
                onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={newUserForm.username}
                onChange={(e) => setNewUserForm(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Enter username"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={newUserForm.role} onValueChange={(value) => setNewUserForm(prev => ({ ...prev, role: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role: any) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateUserDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmCreateUser}
              disabled={createUserMutation.isPending || !newUserForm.name || !newUserForm.email || !newUserForm.username}
            >
              {createUserMutation.isPending ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View User Profile Dialog */}
      <Dialog open={viewProfileDialog.isOpen} onOpenChange={(open) => setViewProfileDialog({ isOpen: open, user: null })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {viewProfileDialog.user?.avatar ? (
                <img src={viewProfileDialog.user.avatar} alt={viewProfileDialog.user.name} className="w-12 h-12 rounded-full" />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {(viewProfileDialog.user?.name || viewProfileDialog.user?.username)?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <div>
                <div className="text-xl font-semibold">{viewProfileDialog.user?.name || viewProfileDialog.user?.username}</div>
                <div className="text-sm text-gray-500">@{viewProfileDialog.user?.username}</div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {userProfileData?.data && (
            <div className="py-4 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-medium mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Email:</span>
                    <div>{userProfileData.data.email}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Role:</span>
                    <Badge className={getRoleBadgeColor(userProfileData.data.role)}>
                      {userProfileData.data.role}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">User ID:</span>
                    <div>{userProfileData.data.id}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Status:</span>
                    <Badge variant={userProfileData.data.stats?.accountStatus === 'active' ? 'default' : 'secondary'}>
                      {userProfileData.data.stats?.accountStatus || 'active'}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Joined:</span>
                    <div>{new Date(userProfileData.data.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Last Login:</span>
                    <div>{userProfileData.data.stats?.lastLoginDate ? new Date(userProfileData.data.stats.lastLoginDate).toLocaleDateString() : 'Never'}</div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {userProfileData.data.bio && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Bio</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{userProfileData.data.bio}</p>
                </div>
              )}

              {/* Activity Stats */}
              <div>
                <h3 className="text-lg font-medium mb-3">Activity Statistics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{userProfileData.data.stats?.coursesEnrolled || 0}</div>
                    <div className="text-sm text-gray-600">Courses Enrolled</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{userProfileData.data.stats?.projectsCompleted || 0}</div>
                    <div className="text-sm text-gray-600">Projects Completed</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{userProfileData.data.stats?.communityPosts || 0}</div>
                    <div className="text-sm text-gray-600">Community Posts</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewProfileDialog({ isOpen: false, user: null })}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Profile Dialog */}
      <Dialog open={editProfileDialog.isOpen} onOpenChange={(open) => setEditProfileDialog({ isOpen: open, user: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
            <DialogDescription>
              Update user information for {editProfileDialog.user?.name || editProfileDialog.user?.username}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editUserForm.name}
                onChange={(e) => setEditUserForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editUserForm.email}
                onChange={(e) => setEditUserForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                value={editUserForm.username}
                onChange={(e) => setEditUserForm(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Enter username"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-bio">Bio</Label>
              <Input
                id="edit-bio"
                value={editUserForm.bio}
                onChange={(e) => setEditUserForm(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Enter user bio (optional)"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProfileDialog({ isOpen: false, user: null })}>
              Cancel
            </Button>
            <Button 
              onClick={confirmUpdateUser}
              disabled={updateUserMutation.isPending || !editUserForm.name || !editUserForm.email || !editUserForm.username}
            >
              {updateUserMutation.isPending ? "Updating..." : "Update User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend User Dialog */}
      <Dialog open={suspendUserDialog.isOpen} onOpenChange={(open) => setSuspendUserDialog({ isOpen: open, user: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {suspendForm.action === 'suspend' ? 'Suspend User' : 'Activate User'}
            </DialogTitle>
            <DialogDescription>
              {suspendForm.action === 'suspend' 
                ? `Are you sure you want to suspend ${suspendUserDialog.user?.name || suspendUserDialog.user?.username}?`
                : `Are you sure you want to activate ${suspendUserDialog.user?.name || suspendUserDialog.user?.username}?`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="suspend-reason">
              {suspendForm.action === 'suspend' ? 'Suspension Reason' : 'Activation Reason'} (Optional)
            </Label>
            <Input
              id="suspend-reason"
              value={suspendForm.reason}
              onChange={(e) => setSuspendForm(prev => ({ ...prev, reason: e.target.value }))}
              placeholder={suspendForm.action === 'suspend' ? 'Enter reason for suspension' : 'Enter reason for activation'}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendUserDialog({ isOpen: false, user: null })}>
              Cancel
            </Button>
            <Button 
              variant={suspendForm.action === 'suspend' ? 'destructive' : 'default'}
              onClick={confirmSuspendUser}
              disabled={suspendUserMutation.isPending}
            >
              {suspendUserMutation.isPending 
                ? (suspendForm.action === 'suspend' ? "Suspending..." : "Activating...")
                : (suspendForm.action === 'suspend' ? "Suspend User" : "Activate User")
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}