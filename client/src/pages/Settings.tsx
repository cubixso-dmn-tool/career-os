import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import PermissionGate from "@/components/auth/PermissionGate";
import {
  BellRing,
  UserCircle,
  Shield,
  Mail,
  Globe,
  Moon,
  Sun,
  Palette,
  Lock,
  Languages,
  ArrowRight,
  Save,
  Cloud,
  Users,
  BadgeCheck,
  Upload,
  BookOpen,
  GitBranch,
  Layers
} from "lucide-react";

// Mock user ID until authentication is implemented
const USER_ID = 1;

export default function Settings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Fetch user data
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: [`/api/users/${USER_ID}`],
    queryFn: undefined, // Use default queryFn from queryClient
  });

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: "",
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    courseUpdates: true,
    communityMessages: true,
    careerOpportunities: true,
    weeklyDigest: true,
  });

  // Appearance settings state
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    colorScheme: "indigo",
    reducedMotion: false,
    fontSize: "medium",
  });

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showProgressToOthers: true,
    shareActivities: true,
    allowDataCollection: true,
  });

  // Language settings state
  const [languageSettings, setLanguageSettings] = useState({
    preferredLanguage: "english",
    contentLanguage: "english",
  });

  // Update user profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedProfile: any) => {
      const response = await fetch(`/api/users/${USER_ID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedProfile),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${USER_ID}`] });
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Save notification settings mutation
  const saveNotificationSettingsMutation = useMutation({
    mutationFn: async (settings: any) => {
      const response = await fetch(`/api/users/${USER_ID}/settings/notifications`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) {
        throw new Error("Failed to save notification settings");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Save appearance settings mutation
  const saveAppearanceSettingsMutation = useMutation({
    mutationFn: async (settings: any) => {
      const response = await fetch(`/api/users/${USER_ID}/settings/appearance`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) {
        throw new Error("Failed to save appearance settings");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Appearance updated",
        description: "Your appearance settings have been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Save privacy settings mutation
  const savePrivacySettingsMutation = useMutation({
    mutationFn: async (settings: any) => {
      const response = await fetch(`/api/users/${USER_ID}/settings/privacy`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) {
        throw new Error("Failed to save privacy settings");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Privacy settings updated",
        description: "Your privacy preferences have been saved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update profile data when user data is loaded
  useState(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
      });
    }
  });

  // Handle profile form submit
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileForm);
  };

  // Handle notification settings save
  const handleNotificationSettingsSave = () => {
    saveNotificationSettingsMutation.mutate(notificationSettings);
  };

  // Handle appearance settings save
  const handleAppearanceSettingsSave = () => {
    saveAppearanceSettingsMutation.mutate(appearanceSettings);
  };

  // Handle privacy settings save
  const handlePrivacySettingsSave = () => {
    savePrivacySettingsMutation.mutate(privacySettings);
  };

  // Handle language settings save
  const handleLanguageSettingsSave = () => {
    // Implement language settings save
    toast({
      title: "Language settings updated",
      description: "Your language preferences have been saved.",
    });
  };
  
  // Content Management form states
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    category: "",
    price: 0,
    isFree: true,
    tags: "",
    thumbnail: null as File | null,
    thumbnailPreview: ""
  });
  
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    duration: "",
    skills: ""
  });
  
  const [communityForm, setCommunityForm] = useState({
    name: "",
    description: "",
    type: "",
    rules: "",
    isPrivate: false,
    banner: null as File | null,
    bannerPreview: "",
    icon: null as File | null,
    iconPreview: ""
  });
  
  // Course upload mutation
  const uploadCourseMutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      
      // Append text fields
      Object.keys(data).forEach(key => {
        if (key !== 'thumbnail' && key !== 'thumbnailPreview') {
          formData.append(key, data[key]);
        }
      });
      
      // Append thumbnail if present
      if (data.thumbnail) {
        formData.append('thumbnail', data.thumbnail);
      }
      
      const response = await fetch("/api/content-management/courses", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Failed to upload course");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Course uploaded",
        description: "New course has been added successfully.",
      });
      
      // Reset form
      setCourseForm({
        title: "",
        description: "",
        category: "",
        price: 0,
        isFree: true,
        tags: "",
        thumbnail: null,
        thumbnailPreview: ""
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Project upload mutation
  const uploadProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/content-management/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to upload project");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Project uploaded",
        description: "New project recommendation has been added successfully.",
      });
      
      // Reset form
      setProjectForm({
        title: "",
        description: "",
        category: "",
        difficulty: "",
        duration: "",
        skills: ""
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Community upload mutation
  const uploadCommunityMutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      
      // Append text fields
      Object.keys(data).forEach(key => {
        if (!['banner', 'icon', 'bannerPreview', 'iconPreview'].includes(key)) {
          formData.append(key, data[key]);
        }
      });
      
      // Append files if present
      if (data.banner) {
        formData.append('banner', data.banner);
      }
      
      if (data.icon) {
        formData.append('icon', data.icon);
      }
      
      const response = await fetch("/api/content-management/communities", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Failed to create community");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Community created",
        description: "New community has been created successfully.",
      });
      
      // Reset form
      setCommunityForm({
        name: "",
        description: "",
        type: "",
        rules: "",
        isPrivate: false,
        banner: null,
        bannerPreview: "",
        icon: null,
        iconPreview: ""
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Creation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle file upload for course thumbnail
  const handleCourseThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target) {
          setCourseForm({
            ...courseForm,
            thumbnail: file,
            thumbnailPreview: event.target.result as string
          });
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  // Handle file uploads for community banner and icon
  const handleCommunityFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'banner' | 'icon') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target) {
          if (fileType === 'banner') {
            setCommunityForm({
              ...communityForm,
              banner: file,
              bannerPreview: event.target.result as string
            });
          } else {
            setCommunityForm({
              ...communityForm,
              icon: file,
              iconPreview: event.target.result as string
            });
          }
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  // Handle course form submission
  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    uploadCourseMutation.mutate(courseForm);
  };
  
  // Handle project form submission
  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    uploadProjectMutation.mutate(projectForm);
  };
  
  // Handle community form submission
  const handleCommunitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    uploadCommunityMutation.mutate(communityForm);
  };
  
  // Roles Management
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  
  // Fetch all users
  const { data: users, isLoading: isUsersLoading } = useQuery({
    queryKey: ['/api/users'],
    queryFn: undefined, // Use default queryFn from queryClient
  });
  
  // Fetch all roles
  const { data: roles, isLoading: isRolesLoading } = useQuery({
    queryKey: ['/api/rbac/roles'],
    queryFn: undefined, // Use default queryFn from queryClient
  });
  
  // Fetch selected user's roles
  const { data: userRoles, isLoading: isUserRolesLoading, refetch: refetchUserRoles } = useQuery({
    queryKey: ['/api/rbac/users', selectedUserId, 'roles'],
    queryFn: undefined, // Use default queryFn from queryClient
    enabled: !!selectedUserId, // Only run query if selectedUserId is not null
  });
  
  // Mutation to assign role to user
  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, roleId }: { userId: number; roleId: number }) => {
      const response = await fetch(`/api/rbac/users/${userId}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId }),
      });
      if (!response.ok) {
        throw new Error('Failed to assign role to user');
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Role assigned',
        description: 'The role has been successfully assigned to the user.',
      });
      if (selectedUserId) {
        refetchUserRoles();
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to assign role',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Mutation to remove role from user
  const removeRoleMutation = useMutation({
    mutationFn: async ({ userId, roleId }: { userId: number; roleId: number }) => {
      const response = await fetch(`/api/rbac/users/${userId}/roles/${roleId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to remove role from user');
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Role removed',
        description: 'The role has been successfully removed from the user.',
      });
      if (selectedUserId) {
        refetchUserRoles();
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to remove role',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Handle assign role
  const handleAssignRole = () => {
    if (selectedUserId && selectedRoleId) {
      assignRoleMutation.mutate({ userId: selectedUserId, roleId: selectedRoleId });
    } else {
      toast({
        title: 'Selection required',
        description: 'Please select both a user and a role.',
        variant: 'destructive',
      });
    }
  };
  
  // Handle remove role
  const handleRemoveRole = (roleId: number) => {
    if (selectedUserId) {
      removeRoleMutation.mutate({ userId: selectedUserId, roleId });
    }
  };

  return (
    <Layout title="Settings">
      <div className="container py-6">
        <div className="flex items-center mb-6">
          <Shield className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>

        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-6 w-full mb-4">
            <TabsTrigger value="profile" className="flex items-center">
              <UserCircle className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <BellRing className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center">
              <Palette className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="language" className="flex items-center">
              <Languages className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Language</span>
            </TabsTrigger>
            
            {/* Show admin tabs only to users with specific permissions */}
            <PermissionGate permissions={["admin:roles"]}>
              <TabsTrigger value="roles" className="flex items-center">
                <BadgeCheck className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Roles</span>
              </TabsTrigger>
            </PermissionGate>
            
            <PermissionGate permissions={["content:upload", "course:manage", "project:manage"]}>
              <TabsTrigger value="content" className="flex items-center">
                <Upload className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Content</span>
              </TabsTrigger>
            </PermissionGate>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and how it appears on your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit}>
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3 flex flex-col items-center justify-center">
                        <Avatar className="h-32 w-32 mb-4">
                          <AvatarImage src={profileForm.avatar} alt={profileForm.name} />
                          <AvatarFallback>{profileForm.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm">
                          Change Avatar
                        </Button>
                      </div>
                      <div className="md:w-2/3 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              value={profileForm.name}
                              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                              placeholder="Your full name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={profileForm.email}
                              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                              placeholder="Your email address"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={profileForm.bio}
                            onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                            placeholder="Tell us a bit about yourself"
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button 
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="flex items-center"
                    >
                      {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                      <Save className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Manage your password and account security settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" placeholder="Enter your current password" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" placeholder="Enter new password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" placeholder="Confirm new password" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button variant="outline" className="mr-2">Reset</Button>
                  <Button>Update Password</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control which notifications you receive and how they are delivered
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium">Push Notifications</h4>
                      <p className="text-sm text-gray-500">Receive notifications on your device</p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, pushNotifications: checked})}
                    />
                  </div>
                  <Separator />
                  <h3 className="text-lg font-medium">Notification Types</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-medium">Course Updates</h4>
                        <p className="text-sm text-gray-500">New content, recommendations, and deadlines</p>
                      </div>
                      <Switch
                        checked={notificationSettings.courseUpdates}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, courseUpdates: checked})}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-medium">Community Messages</h4>
                        <p className="text-sm text-gray-500">Posts, comments, and direct messages</p>
                      </div>
                      <Switch
                        checked={notificationSettings.communityMessages}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, communityMessages: checked})}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-medium">Career Opportunities</h4>
                        <p className="text-sm text-gray-500">Job matches and career path alerts</p>
                      </div>
                      <Switch
                        checked={notificationSettings.careerOpportunities}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, careerOpportunities: checked})}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-medium">Weekly Digest</h4>
                        <p className="text-sm text-gray-500">Summary of your progress and new opportunities</p>
                      </div>
                      <Switch
                        checked={notificationSettings.weeklyDigest}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, weeklyDigest: checked})}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={handleNotificationSettingsSave}
                    disabled={saveNotificationSettingsMutation.isPending}
                  >
                    Save Notification Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize how CareerOS looks and feels to match your preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <Button
                        variant={appearanceSettings.theme === "light" ? "default" : "outline"}
                        className={`h-24 flex flex-col justify-center`}
                        onClick={() => setAppearanceSettings({...appearanceSettings, theme: "light"})}
                      >
                        <Sun className="h-8 w-8 mb-2" />
                        <span>Light</span>
                      </Button>
                      <Button
                        variant={appearanceSettings.theme === "dark" ? "default" : "outline"}
                        className={`h-24 flex flex-col justify-center`}
                        onClick={() => setAppearanceSettings({...appearanceSettings, theme: "dark"})}
                      >
                        <Moon className="h-8 w-8 mb-2" />
                        <span>Dark</span>
                      </Button>
                      <Button
                        variant={appearanceSettings.theme === "system" ? "default" : "outline"}
                        className={`h-24 flex flex-col justify-center`}
                        onClick={() => setAppearanceSettings({...appearanceSettings, theme: "system"})}
                      >
                        <Globe className="h-8 w-8 mb-2" />
                        <span>System</span>
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Color Scheme</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div 
                        className={`h-16 bg-indigo-500 rounded-md cursor-pointer flex items-center justify-center ${
                          appearanceSettings.colorScheme === "indigo" ? "ring-2 ring-offset-2 ring-indigo-500" : ""
                        }`}
                        onClick={() => setAppearanceSettings({...appearanceSettings, colorScheme: "indigo"})}
                      >
                        {appearanceSettings.colorScheme === "indigo" && (
                          <div className="h-6 w-6 bg-white rounded-full flex items-center justify-center">
                            ✓
                          </div>
                        )}
                      </div>
                      <div 
                        className={`h-16 bg-cyan-500 rounded-md cursor-pointer flex items-center justify-center ${
                          appearanceSettings.colorScheme === "cyan" ? "ring-2 ring-offset-2 ring-cyan-500" : ""
                        }`}
                        onClick={() => setAppearanceSettings({...appearanceSettings, colorScheme: "cyan"})}
                      >
                        {appearanceSettings.colorScheme === "cyan" && (
                          <div className="h-6 w-6 bg-white rounded-full flex items-center justify-center">
                            ✓
                          </div>
                        )}
                      </div>
                      <div 
                        className={`h-16 bg-emerald-500 rounded-md cursor-pointer flex items-center justify-center ${
                          appearanceSettings.colorScheme === "emerald" ? "ring-2 ring-offset-2 ring-emerald-500" : ""
                        }`}
                        onClick={() => setAppearanceSettings({...appearanceSettings, colorScheme: "emerald"})}
                      >
                        {appearanceSettings.colorScheme === "emerald" && (
                          <div className="h-6 w-6 bg-white rounded-full flex items-center justify-center">
                            ✓
                          </div>
                        )}
                      </div>
                      <div 
                        className={`h-16 bg-rose-500 rounded-md cursor-pointer flex items-center justify-center ${
                          appearanceSettings.colorScheme === "rose" ? "ring-2 ring-offset-2 ring-rose-500" : ""
                        }`}
                        onClick={() => setAppearanceSettings({...appearanceSettings, colorScheme: "rose"})}
                      >
                        {appearanceSettings.colorScheme === "rose" && (
                          <div className="h-6 w-6 bg-white rounded-full flex items-center justify-center">
                            ✓
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Reduced Motion</h4>
                        <p className="text-sm text-gray-500">Minimize animations and transitions</p>
                      </div>
                      <Switch
                        checked={appearanceSettings.reducedMotion}
                        onCheckedChange={(checked) => 
                          setAppearanceSettings({...appearanceSettings, reducedMotion: checked})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Font Size</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <Button 
                          variant={appearanceSettings.fontSize === "small" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setAppearanceSettings({...appearanceSettings, fontSize: "small"})}
                        >
                          Small
                        </Button>
                        <Button 
                          variant={appearanceSettings.fontSize === "medium" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setAppearanceSettings({...appearanceSettings, fontSize: "medium"})}
                        >
                          Medium
                        </Button>
                        <Button 
                          variant={appearanceSettings.fontSize === "large" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setAppearanceSettings({...appearanceSettings, fontSize: "large"})}
                        >
                          Large
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={handleAppearanceSettingsSave}
                    disabled={saveAppearanceSettingsMutation.isPending}
                  >
                    Save Appearance Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Data</CardTitle>
                <CardDescription>
                  Control your privacy settings and manage how your data is used
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Profile Visibility</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="public" 
                          name="profileVisibility" 
                          value="public"
                          checked={privacySettings.profileVisibility === "public"}
                          onChange={() => setPrivacySettings({...privacySettings, profileVisibility: "public"})}
                          className="h-4 w-4 text-primary"
                        />
                        <Label htmlFor="public">Public</Label>
                        <p className="text-sm text-gray-500">Anyone can see your profile and progress</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="private" 
                          name="profileVisibility" 
                          value="private"
                          checked={privacySettings.profileVisibility === "private"}
                          onChange={() => setPrivacySettings({...privacySettings, profileVisibility: "private"})}
                          className="h-4 w-4 text-primary"
                        />
                        <Label htmlFor="private">Private</Label>
                        <p className="text-sm text-gray-500">Only you can see your profile and progress</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="connections" 
                          name="profileVisibility" 
                          value="connections"
                          checked={privacySettings.profileVisibility === "connections"}
                          onChange={() => setPrivacySettings({...privacySettings, profileVisibility: "connections"})}
                          className="h-4 w-4 text-primary"
                        />
                        <Label htmlFor="connections">Connections Only</Label>
                        <p className="text-sm text-gray-500">Only your connections can see your profile</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Data Sharing</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-medium">Show Progress to Others</h4>
                          <p className="text-sm text-gray-500">Allow others to see your learning progress</p>
                        </div>
                        <Switch
                          checked={privacySettings.showProgressToOthers}
                          onCheckedChange={(checked) => 
                            setPrivacySettings({...privacySettings, showProgressToOthers: checked})}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-medium">Share Activities</h4>
                          <p className="text-sm text-gray-500">Share your activities in the community feed</p>
                        </div>
                        <Switch
                          checked={privacySettings.shareActivities}
                          onCheckedChange={(checked) => 
                            setPrivacySettings({...privacySettings, shareActivities: checked})}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-medium">Allow Data Collection for Recommendations</h4>
                          <p className="text-sm text-gray-500">Allow us to use your data to provide personalized recommendations</p>
                        </div>
                        <Switch
                          checked={privacySettings.allowDataCollection}
                          onCheckedChange={(checked) => 
                            setPrivacySettings({...privacySettings, allowDataCollection: checked})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Data Management</h3>
                    <p className="text-sm text-gray-500">Manage your personal data and account information</p>
                    <div className="flex flex-col space-y-2 mt-2">
                      <Button variant="outline" className="justify-start">
                        <Cloud className="mr-2 h-4 w-4" />
                        Download Your Data
                      </Button>
                      <Button variant="outline" className="justify-start text-orange-500 hover:text-orange-600 hover:bg-orange-50">
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Request Account Deletion
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={handlePrivacySettingsSave}
                    disabled={savePrivacySettingsMutation.isPending}
                  >
                    Save Privacy Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Language Settings */}
          <TabsContent value="language">
            <Card>
              <CardHeader>
                <CardTitle>Language & Region</CardTitle>
                <CardDescription>
                  Choose your preferred language and content preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="preferredLanguage">Interface Language</Label>
                    <select
                      id="preferredLanguage"
                      className="w-full rounded-md border border-gray-300 p-2"
                      value={languageSettings.preferredLanguage}
                      onChange={(e) => setLanguageSettings({
                        ...languageSettings,
                        preferredLanguage: e.target.value
                      })}
                    >
                      <option value="english">English</option>
                      <option value="hindi">हिन्दी (Hindi)</option>
                      <option value="tamil">தமிழ் (Tamil)</option>
                      <option value="telugu">తెలుగు (Telugu)</option>
                      <option value="bengali">বাংলা (Bengali)</option>
                      <option value="marathi">मराठी (Marathi)</option>
                      <option value="gujarati">ગુજરાતી (Gujarati)</option>
                      <option value="kannada">ಕನ್ನಡ (Kannada)</option>
                      <option value="malayalam">മലയാളം (Malayalam)</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                      This changes the language of buttons, menus, and system notifications
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contentLanguage">Content Language</Label>
                    <select
                      id="contentLanguage"
                      className="w-full rounded-md border border-gray-300 p-2"
                      value={languageSettings.contentLanguage}
                      onChange={(e) => setLanguageSettings({
                        ...languageSettings,
                        contentLanguage: e.target.value
                      })}
                    >
                      <option value="english">English</option>
                      <option value="hindi">हिन्दी (Hindi)</option>
                      <option value="tamil">தமிழ் (Tamil)</option>
                      <option value="telugu">తెలుగు (Telugu)</option>
                      <option value="bengali">বাংলা (Bengali)</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                      Preferred language for courses, projects, and other content (when available)
                    </p>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button 
                      onClick={handleLanguageSettingsSave}
                    >
                      Save Language Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Role Management - only visible to admins */}
          <TabsContent value="roles">
            <PermissionGate permissions={["admin:roles"]}>
              <Card>
                <CardHeader>
                  <CardTitle>Role Management</CardTitle>
                  <CardDescription>
                    Assign or remove roles for users across the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* User Selection */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium">Select User</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="select-user">User</Label>
                          <select
                            id="select-user"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={selectedUserId || ""}
                            onChange={(e) => setSelectedUserId(e.target.value ? parseInt(e.target.value) : null)}
                          >
                            <option value="">Select a user...</option>
                            {users && users.map((user: any) => (
                              <option key={user.id} value={user.id}>
                                {user.name || user.username} {user.email ? `(${user.email})` : ""}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        {isUsersLoading && (
                          <div className="flex items-center space-x-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-t-2 border-primary"></div>
                            <span className="text-sm text-muted-foreground">Loading users...</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Current User Roles */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium">Current Roles</h3>
                      {!selectedUserId && (
                        <p className="text-sm text-muted-foreground">Select a user to view their roles</p>
                      )}
                      
                      {selectedUserId && isUserRolesLoading && (
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-t-2 border-primary"></div>
                          <span className="text-sm text-muted-foreground">Loading roles...</span>
                        </div>
                      )}
                      
                      {selectedUserId && userRoles && userRoles.length === 0 && (
                        <p className="text-sm text-muted-foreground">This user has no roles assigned</p>
                      )}
                      
                      {selectedUserId && userRoles && userRoles.length > 0 && (
                        <div className="grid gap-2">
                          {userRoles.map((role: any) => (
                            <div key={role.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                              <div>
                                <p className="font-medium">{role.name}</p>
                                <p className="text-xs text-muted-foreground">{role.description}</p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleRemoveRole(role.id)}
                                disabled={removeRoleMutation.isPending}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    {/* Assign New Role */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium">Assign Role</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="select-role">Role</Label>
                          <select
                            id="select-role"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={selectedRoleId || ""}
                            onChange={(e) => setSelectedRoleId(e.target.value ? parseInt(e.target.value) : null)}
                            disabled={!selectedUserId}
                          >
                            <option value="">Select a role...</option>
                            {roles && roles.map((role: any) => (
                              <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                          </select>
                        </div>
                        
                        {isRolesLoading && (
                          <div className="flex items-center space-x-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-t-2 border-primary"></div>
                            <span className="text-sm text-muted-foreground">Loading roles...</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-end mt-4">
                        <Button 
                          onClick={handleAssignRole}
                          disabled={!selectedUserId || !selectedRoleId || assignRoleMutation.isPending}
                          className="flex items-center"
                        >
                          {assignRoleMutation.isPending ? "Assigning..." : "Assign Role"}
                          <BadgeCheck className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </PermissionGate>
          </TabsContent>
          
          {/* Content Management Tab - Only visible to admin users */}
          <TabsContent value="content">
            <PermissionGate permissions={["content:upload", "course:manage", "project:manage"]}>
              <div className="space-y-6">
                {/* Course Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-primary" />
                      Course Management
                    </CardTitle>
                    <CardDescription>
                      Upload and manage course content for the platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="course-title">Course Title</Label>
                          <Input id="course-title" placeholder="Enter course title" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="course-category">Category</Label>
                          <select
                            id="course-category"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Select category...</option>
                            <option value="web-development">Web Development</option>
                            <option value="mobile-development">Mobile Development</option>
                            <option value="data-science">Data Science</option>
                            <option value="design">UI/UX Design</option>
                            <option value="devops">DevOps</option>
                            <option value="soft-skills">Soft Skills</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="course-description">Description</Label>
                        <Textarea 
                          id="course-description" 
                          placeholder="Enter detailed course description" 
                          rows={4}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="course-thumbnail">Thumbnail Image</Label>
                          <Input id="course-thumbnail" type="file" accept="image/*" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="course-price">Price (₹)</Label>
                          <Input 
                            id="course-price" 
                            type="number" 
                            placeholder="0 for free courses" 
                            min="0"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="is-free" 
                          className="h-4 w-4 text-primary"
                        />
                        <Label htmlFor="is-free">This is a free course</Label>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="course-tags">Tags (comma separated)</Label>
                        <Input 
                          id="course-tags" 
                          placeholder="e.g. javascript, react, beginner"
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline">Reset</Button>
                        <Button className="flex items-center">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Course
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
                
                {/* Project Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <GitBranch className="h-5 w-5 mr-2 text-primary" />
                      Project Recommendations
                    </CardTitle>
                    <CardDescription>
                      Add new project ideas and challenges for students
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="project-title">Project Title</Label>
                          <Input id="project-title" placeholder="Enter project title" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="project-category">Category</Label>
                          <select
                            id="project-category"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Select category...</option>
                            <option value="web-development">Web Development</option>
                            <option value="mobile-development">Mobile Development</option>
                            <option value="data-science">Data Science</option>
                            <option value="design">UI/UX Design</option>
                            <option value="devops">DevOps</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="project-description">Description</Label>
                        <Textarea 
                          id="project-description" 
                          placeholder="Enter detailed project description" 
                          rows={4}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="project-difficulty">Difficulty Level</Label>
                          <select
                            id="project-difficulty"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Select difficulty...</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="project-duration">Estimated Duration</Label>
                          <Input 
                            id="project-duration" 
                            placeholder="e.g. 2-3 weeks" 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="project-skills">Required Skills (comma separated)</Label>
                        <Input 
                          id="project-skills" 
                          placeholder="e.g. JavaScript, React, Node.js"
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline">Reset</Button>
                        <Button className="flex items-center">
                          <Upload className="w-4 h-4 mr-2" />
                          Add Project
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
                
                {/* Community Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Layers className="h-5 w-5 mr-2 text-primary" />
                      Community Management
                    </CardTitle>
                    <CardDescription>
                      Create and manage community spaces for discussions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="community-name">Community Name</Label>
                          <Input id="community-name" placeholder="Enter community name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="community-type">Type</Label>
                          <select
                            id="community-type"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Select type...</option>
                            <option value="topic">Topic-based</option>
                            <option value="career">Career-specific</option>
                            <option value="regional">Regional</option>
                            <option value="industry">Industry</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="community-description">Description</Label>
                        <Textarea 
                          id="community-description" 
                          placeholder="Describe what this community is about" 
                          rows={4}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="community-banner">Banner Image</Label>
                          <Input id="community-banner" type="file" accept="image/*" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="community-icon">Icon</Label>
                          <Input id="community-icon" type="file" accept="image/*" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="community-rules">Community Rules</Label>
                        <Textarea 
                          id="community-rules" 
                          placeholder="Enter community guidelines and rules" 
                          rows={4}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="is-private" 
                          className="h-4 w-4 text-primary"
                        />
                        <Label htmlFor="is-private">Make this community private (invite only)</Label>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline">Reset</Button>
                        <Button className="flex items-center">
                          <Upload className="w-4 h-4 mr-2" />
                          Create Community
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </PermissionGate>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}