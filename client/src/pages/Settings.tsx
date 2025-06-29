import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
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
import { Badge } from "@/components/ui/badge";
import { queryClient, getQueryFn, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import PermissionGate from "@/components/auth/PermissionGate";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Settings as SettingsIcon,
  Camera,
  Save,
  Edit3,
  Check,
  X,
  Upload,
  BookOpen,
  GitBranch,
  Users,
  Crown,
  ChevronRight,
  Moon,
  Sun,
  Volume2,
  Lock,
  Trash2,
  Download,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  UserCheck,
  Loader2
} from "lucide-react";

const USER_ID = 1;

export default function Settings() {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  
  // Fetch user data
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: [`/api/users/${USER_ID}`],
    queryFn: undefined,
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

  // Content Management states
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

  // Role management states
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  // Data fetching queries
  const { data: courses, isLoading: isCoursesLoading } = useQuery({
    queryKey: ['/api/content-management/courses'],
    queryFn: getQueryFn({ on401: "throw" })
  });
  
  const { data: projects, isLoading: isProjectsLoading } = useQuery({
    queryKey: ['/api/content-management/projects'],
    queryFn: getQueryFn({ on401: "throw" })
  });
  
  const { data: communities, isLoading: isCommunitiesLoading } = useQuery({
    queryKey: ['/api/content-management/communities'],
    queryFn: getQueryFn({ on401: "throw" })
  });

  const { data: users, isLoading: isUsersLoading } = useQuery({
    queryKey: ['/api/users'],
    queryFn: undefined,
  });
  
  const { data: roles, isLoading: isRolesLoading } = useQuery({
    queryKey: ['/api/rbac/roles'],
    queryFn: undefined,
  });
  
  const { data: userRoles, isLoading: isUserRolesLoading, refetch: refetchUserRoles } = useQuery({
    queryKey: ['/api/rbac/users', selectedUserId, 'roles'],
    queryFn: undefined,
    enabled: !!selectedUserId,
  });

  // Update profile data when user data loads
  useEffect(() => {
    if (user && typeof user === 'object') {
      const userObj = user as any;
      setProfileForm({
        name: userObj.name || "",
        email: userObj.email || "",
        bio: userObj.bio || "",
        avatar: userObj.avatar || "",
      });
    }
  }, [user]);

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedProfile: any) => {
      const response = await fetch(`/api/users/${USER_ID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedProfile),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${USER_ID}`] });
      toast({ title: "Profile updated", description: "Your profile has been updated successfully." });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    },
  });

  const saveNotificationSettingsMutation = useMutation({
    mutationFn: async (settings: any) => {
      const response = await fetch(`/api/users/${USER_ID}/settings/notifications`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error("Failed to save notification settings");
      return await response.json();
    },
    onSuccess: () => {
      toast({ title: "Notifications updated", description: "Your notification preferences have been saved." });
    },
  });

  const saveAppearanceSettingsMutation = useMutation({
    mutationFn: async (settings: any) => {
      const response = await fetch(`/api/users/${USER_ID}/settings/appearance`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error("Failed to save appearance settings");
      return await response.json();
    },
    onSuccess: () => {
      toast({ title: "Appearance updated", description: "Your appearance settings have been saved." });
    },
  });

  const savePrivacySettingsMutation = useMutation({
    mutationFn: async (settings: any) => {
      const response = await fetch(`/api/users/${USER_ID}/settings/privacy`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error("Failed to save privacy settings");
      return await response.json();
    },
    onSuccess: () => {
      toast({ title: "Privacy updated", description: "Your privacy settings have been saved." });
    },
  });

  // Content Management Mutations
  const uploadCourseMutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key !== 'thumbnail' && key !== 'thumbnailPreview') {
          formData.append(key, data[key]);
        }
      });
      if (data.thumbnail) formData.append('thumbnail', data.thumbnail);
      
      const response = await fetch("/api/content-management/courses", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to upload course");
      return await response.json();
    },
    onSuccess: () => {
      toast({ title: "Course uploaded", description: "New course has been added successfully." });
      setCourseForm({ title: "", description: "", category: "", price: 0, isFree: true, tags: "", thumbnail: null, thumbnailPreview: "" });
      queryClient.invalidateQueries({ queryKey: ['/api/content-management/courses'] });
    },
  });

  const uploadProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/content-management/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to upload project");
      return await response.json();
    },
    onSuccess: () => {
      toast({ title: "Project uploaded", description: "New project has been added successfully." });
      setProjectForm({ title: "", description: "", category: "", difficulty: "", duration: "", skills: "" });
      queryClient.invalidateQueries({ queryKey: ['/api/content-management/projects'] });
    },
  });

  const uploadCommunityMutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (!['banner', 'icon', 'bannerPreview', 'iconPreview'].includes(key)) {
          formData.append(key, data[key]);
        }
      });
      if (data.banner) formData.append('banner', data.banner);
      if (data.icon) formData.append('icon', data.icon);
      
      const response = await fetch("/api/content-management/communities", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to create community");
      return await response.json();
    },
    onSuccess: () => {
      toast({ title: "Community created", description: "New community has been created successfully." });
      setCommunityForm({ name: "", description: "", type: "", rules: "", isPrivate: false, banner: null, bannerPreview: "", icon: null, iconPreview: "" });
      queryClient.invalidateQueries({ queryKey: ['/api/content-management/communities'] });
    },
  });

  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, roleId }: { userId: number; roleId: number }) => {
      const response = await fetch(`/api/rbac/users/${userId}/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId }),
      });
      if (!response.ok) throw new Error("Failed to assign role");
      return await response.json();
    },
    onSuccess: () => {
      toast({ title: "Role assigned", description: "Role has been assigned successfully." });
      refetchUserRoles();
    },
  });

  // Event handlers
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileForm);
  };

  const handleCourseThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
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

  const handleCommunityFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'banner' | 'icon') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCommunityForm({
            ...communityForm,
            [fileType]: file,
            [`${fileType}Preview`]: event.target.result as string
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Settings navigation menu
  const settingsMenu = [
    { id: 'profile', label: 'Profile', icon: User, description: 'Manage your personal information' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Control how you receive updates' },
    { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Customize your experience' },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield, description: 'Control your data and security' },
    { id: 'language', label: 'Language', icon: Globe, description: 'Choose your preferred language' },
  ];

  const adminMenu = [
    { id: 'content', label: 'Content Management', icon: BookOpen, description: 'Manage courses, projects, and communities' },
    { id: 'roles', label: 'User Roles', icon: Crown, description: 'Assign roles and permissions' },
  ];

  if (isUserLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account preferences and platform settings</p>
          </div>
          <Badge variant="outline" className="text-sm">
            <SettingsIcon className="w-4 h-4 mr-1" />
            Account Settings
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Settings Menu</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {settingsMenu.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between group hover:bg-gray-50 ${
                        activeSection === item.id ? 'bg-primary/10 text-primary border-r-2 border-primary' : 'text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-5 h-5" />
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-gray-500 hidden lg:block">{item.description}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                  
                  <Separator className="my-4" />
                  
                  <PermissionGate roles={[1]}>
                    <div className="px-4 py-2">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Admin Settings</h4>
                    </div>
                    {adminMenu.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between group hover:bg-gray-50 ${
                          activeSection === item.id ? 'bg-primary/10 text-primary border-r-2 border-primary' : 'text-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="w-5 h-5" />
                          <div>
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs text-gray-500 hidden lg:block">{item.description}</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </PermissionGate>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            {/* Profile Settings */}
            {activeSection === 'profile' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="w-5 h-5" />
                      <span>Profile Information</span>
                    </CardTitle>
                    <CardDescription>Update your personal information and profile photo</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center space-x-6">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={profileForm.avatar} alt={profileForm.name} />
                        <AvatarFallback className="text-xl">
                          {profileForm.name?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <div>
                          <Button variant="outline" size="sm">
                            <Camera className="w-4 h-4 mr-2" />
                            Change Photo
                          </Button>
                          <p className="text-xs text-gray-500 mt-2">JPG, PNG up to 2MB</p>
                        </div>
                      )}
                    </div>

                    {/* Profile Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    </div>

                    {isEditing && (
                      <div className="flex justify-end">
                        <Button type="submit" disabled={updateProfileMutation.isPending}>
                          {updateProfileMutation.isPending ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Notification Settings */}
            {activeSection === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                  <CardDescription>Choose how you want to be notified about updates and activities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Notifications
                      </h4>
                      <div className="space-y-3 pl-6">
                        {[
                          { key: 'emailNotifications', label: 'Email notifications', desc: 'Receive general updates via email' },
                          { key: 'courseUpdates', label: 'Course updates', desc: 'New courses and content updates' },
                          { key: 'careerOpportunities', label: 'Career opportunities', desc: 'Job postings and career tips' },
                          { key: 'weeklyDigest', label: 'Weekly digest', desc: 'Summary of your weekly progress' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <div>
                              <Label htmlFor={item.key}>{item.label}</Label>
                              <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                            <Switch
                              id={item.key}
                              checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                              onCheckedChange={(checked) =>
                                setNotificationSettings({ ...notificationSettings, [item.key]: checked })
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center">
                        <Smartphone className="w-4 h-4 mr-2" />
                        Push Notifications
                      </h4>
                      <div className="space-y-3 pl-6">
                        {[
                          { key: 'pushNotifications', label: 'Push notifications', desc: 'Receive notifications on your device' },
                          { key: 'communityMessages', label: 'Community messages', desc: 'New messages in your communities' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <div>
                              <Label htmlFor={item.key}>{item.label}</Label>
                              <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                            <Switch
                              id={item.key}
                              checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                              onCheckedChange={(checked) =>
                                setNotificationSettings({ ...notificationSettings, [item.key]: checked })
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button 
                      onClick={() => saveNotificationSettingsMutation.mutate(notificationSettings)}
                      disabled={saveNotificationSettingsMutation.isPending}
                    >
                      {saveNotificationSettingsMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Appearance Settings */}
            {activeSection === 'appearance' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="w-5 h-5" />
                    <span>Appearance & Display</span>
                  </CardTitle>
                  <CardDescription>Customize how the platform looks and feels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Theme</Label>
                        <div className="mt-2 flex space-x-2">
                          {[
                            { value: 'light', label: 'Light', icon: Sun },
                            { value: 'dark', label: 'Dark', icon: Moon },
                          ].map((theme) => (
                            <button
                              key={theme.value}
                              onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: theme.value })}
                              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                                appearanceSettings.theme === theme.value
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              <theme.icon className="w-4 h-4" />
                              <span>{theme.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Color Scheme</Label>
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          {['indigo', 'blue', 'green', 'purple', 'red', 'orange'].map((color) => (
                            <button
                              key={color}
                              onClick={() => setAppearanceSettings({ ...appearanceSettings, colorScheme: color })}
                              className={`w-full h-10 rounded-lg border-2 transition-all ${
                                appearanceSettings.colorScheme === color
                                  ? 'border-gray-900 scale-105'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              style={{ backgroundColor: `var(--${color}-500, #6366f1)` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Font Size</Label>
                        <div className="mt-2 space-y-2">
                          {[
                            { value: 'small', label: 'Small' },
                            { value: 'medium', label: 'Medium' },
                            { value: 'large', label: 'Large' }
                          ].map((size) => (
                            <label key={size.value} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                name="fontSize"
                                value={size.value}
                                checked={appearanceSettings.fontSize === size.value}
                                onChange={(e) => setAppearanceSettings({ ...appearanceSettings, fontSize: e.target.value })}
                                className="text-primary"
                              />
                              <span>{size.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="reducedMotion">Reduced Motion</Label>
                          <p className="text-sm text-gray-500">Minimize animations and transitions</p>
                        </div>
                        <Switch
                          id="reducedMotion"
                          checked={appearanceSettings.reducedMotion}
                          onCheckedChange={(checked) =>
                            setAppearanceSettings({ ...appearanceSettings, reducedMotion: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button 
                      onClick={() => saveAppearanceSettingsMutation.mutate(appearanceSettings)}
                      disabled={saveAppearanceSettingsMutation.isPending}
                    >
                      {saveAppearanceSettingsMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Apply Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Privacy & Security Settings */}
            {activeSection === 'privacy' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Privacy & Security</span>
                  </CardTitle>
                  <CardDescription>Control your privacy settings and account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="profileVisibility">Profile Visibility</Label>
                        <p className="text-sm text-gray-500">Who can see your profile information</p>
                      </div>
                      <select
                        value={privacySettings.profileVisibility}
                        onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })}
                        className="border rounded-lg px-3 py-2"
                      >
                        <option value="public">Public</option>
                        <option value="friends">Friends Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>

                    {[
                      { key: 'showProgressToOthers', label: 'Show progress to others', desc: 'Allow others to see your learning progress' },
                      { key: 'shareActivities', label: 'Share activities', desc: 'Share your activities in community feeds' },
                      { key: 'allowDataCollection', label: 'Allow data collection', desc: 'Help improve the platform with usage analytics' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between">
                        <div>
                          <Label htmlFor={item.key}>{item.label}</Label>
                          <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                        <Switch
                          id={item.key}
                          checked={privacySettings[item.key as keyof typeof privacySettings] as boolean}
                          onCheckedChange={(checked) =>
                            setPrivacySettings({ ...privacySettings, [item.key]: checked })
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      Security Actions
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="justify-start">
                        <Lock className="w-4 h-4 mr-2" />
                        Change Password
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Download Data
                      </Button>
                      <Button variant="outline" className="justify-start text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button 
                      onClick={() => savePrivacySettingsMutation.mutate(privacySettings)}
                      disabled={savePrivacySettingsMutation.isPending}
                    >
                      {savePrivacySettingsMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Language Settings */}
            {activeSection === 'language' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-5 h-5" />
                    <span>Language & Region</span>
                  </CardTitle>
                  <CardDescription>Choose your preferred language and regional settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="preferredLanguage">Interface Language</Label>
                      <select
                        id="preferredLanguage"
                        value={languageSettings.preferredLanguage}
                        onChange={(e) => setLanguageSettings({ ...languageSettings, preferredLanguage: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2"
                      >
                        <option value="english">English</option>
                        <option value="hindi">हिंदी (Hindi)</option>
                        <option value="tamil">தமிழ் (Tamil)</option>
                        <option value="bengali">বাংলা (Bengali)</option>
                        <option value="telugu">తెలుగు (Telugu)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contentLanguage">Content Language</Label>
                      <select
                        id="contentLanguage"
                        value={languageSettings.contentLanguage}
                        onChange={(e) => setLanguageSettings({ ...languageSettings, contentLanguage: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2"
                      >
                        <option value="english">English</option>
                        <option value="hindi">हिंदी (Hindi)</option>
                        <option value="tamil">தமிழ் (Tamil)</option>
                        <option value="bengali">বাংলা (Bengali)</option>
                        <option value="telugu">తెలుగు (Telugu)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button onClick={() => {
                      toast({ title: "Language settings updated", description: "Your language preferences have been saved." });
                    }}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Language
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Content Management (Admin Only) */}
            <PermissionGate roles={[1]}>
              {activeSection === 'content' && (
                <div className="space-y-6">
                  {/* Course Management */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BookOpen className="w-5 h-5" />
                        <span>Course Management</span>
                      </CardTitle>
                      <CardDescription>Add and manage educational courses</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <form onSubmit={(e) => { e.preventDefault(); uploadCourseMutation.mutate(courseForm); }} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            placeholder="Course Title"
                            value={courseForm.title}
                            onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                          />
                          <Input
                            placeholder="Category"
                            value={courseForm.category}
                            onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                          />
                          <Input
                            placeholder="Tags (comma separated)"
                            value={courseForm.tags}
                            onChange={(e) => setCourseForm({ ...courseForm, tags: e.target.value })}
                          />
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={courseForm.isFree}
                              onChange={(e) => setCourseForm({ ...courseForm, isFree: e.target.checked })}
                            />
                            <Label>Free Course</Label>
                          </div>
                        </div>
                        <Textarea
                          placeholder="Course Description"
                          value={courseForm.description}
                          onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                          rows={3}
                        />
                        <div className="flex items-center space-x-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCourseThumbnailChange}
                            className="hidden"
                            id="course-thumbnail"
                          />
                          <Button type="button" variant="outline" onClick={() => document.getElementById('course-thumbnail')?.click()}>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Thumbnail
                          </Button>
                          {courseForm.thumbnailPreview && (
                            <img src={courseForm.thumbnailPreview} alt="Preview" className="w-16 h-16 object-cover rounded" />
                          )}
                        </div>
                        <Button type="submit" disabled={uploadCourseMutation.isPending}>
                          {uploadCourseMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BookOpen className="w-4 h-4 mr-2" />}
                          Add Course
                        </Button>
                      </form>

                      {Array.isArray(courses) && courses.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-medium mb-3">Existing Courses ({courses.length})</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {courses.map((course: any) => (
                              <div key={course.id} className="border rounded-lg p-3">
                                <h5 className="font-medium">{course.title}</h5>
                                <p className="text-sm text-gray-600">{course.category}</p>
                                <Badge variant={course.isFree ? "secondary" : "default"} className="mt-1">
                                  {course.isFree ? "Free" : "Paid"}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Project Management */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <GitBranch className="w-5 h-5" />
                        <span>Project Management</span>
                      </CardTitle>
                      <CardDescription>Add and manage project recommendations</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <form onSubmit={(e) => { e.preventDefault(); uploadProjectMutation.mutate(projectForm); }} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            placeholder="Project Title"
                            value={projectForm.title}
                            onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                          />
                          <Input
                            placeholder="Category"
                            value={projectForm.category}
                            onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                          />
                          <select
                            value={projectForm.difficulty}
                            onChange={(e) => setProjectForm({ ...projectForm, difficulty: e.target.value })}
                            className="border rounded-lg px-3 py-2"
                          >
                            <option value="">Select Difficulty</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                          <Input
                            placeholder="Duration (e.g., 2 weeks)"
                            value={projectForm.duration}
                            onChange={(e) => setProjectForm({ ...projectForm, duration: e.target.value })}
                          />
                        </div>
                        <Textarea
                          placeholder="Project Description"
                          value={projectForm.description}
                          onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                          rows={3}
                        />
                        <Input
                          placeholder="Required Skills (comma separated)"
                          value={projectForm.skills}
                          onChange={(e) => setProjectForm({ ...projectForm, skills: e.target.value })}
                        />
                        <Button type="submit" disabled={uploadProjectMutation.isPending}>
                          {uploadProjectMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <GitBranch className="w-4 h-4 mr-2" />}
                          Add Project
                        </Button>
                      </form>

                      {Array.isArray(projects) && projects.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-medium mb-3">Existing Projects ({projects.length})</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {projects.map((project: any) => (
                              <div key={project.id} className="border rounded-lg p-3">
                                <h5 className="font-medium">{project.title}</h5>
                                <p className="text-sm text-gray-600">{project.category}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge variant="outline">{project.difficulty}</Badge>
                                  <span className="text-xs text-gray-500">{project.duration}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Community Management */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="w-5 h-5" />
                        <span>Community Management</span>
                      </CardTitle>
                      <CardDescription>Create and manage learning communities</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <form onSubmit={(e) => { e.preventDefault(); uploadCommunityMutation.mutate(communityForm); }} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            placeholder="Community Name"
                            value={communityForm.name}
                            onChange={(e) => setCommunityForm({ ...communityForm, name: e.target.value })}
                          />
                          <Input
                            placeholder="Community Type"
                            value={communityForm.type}
                            onChange={(e) => setCommunityForm({ ...communityForm, type: e.target.value })}
                          />
                        </div>
                        <Textarea
                          placeholder="Community Description"
                          value={communityForm.description}
                          onChange={(e) => setCommunityForm({ ...communityForm, description: e.target.value })}
                          rows={3}
                        />
                        <Textarea
                          placeholder="Community Rules"
                          value={communityForm.rules}
                          onChange={(e) => setCommunityForm({ ...communityForm, rules: e.target.value })}
                          rows={2}
                        />
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={communityForm.isPrivate}
                              onChange={(e) => setCommunityForm({ ...communityForm, isPrivate: e.target.checked })}
                            />
                            <Label>Private Community</Label>
                          </div>
                          <div className="flex space-x-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleCommunityFileChange(e, 'banner')}
                              className="hidden"
                              id="community-banner"
                            />
                            <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('community-banner')?.click()}>
                              Banner
                            </Button>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleCommunityFileChange(e, 'icon')}
                              className="hidden"
                              id="community-icon"
                            />
                            <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('community-icon')?.click()}>
                              Icon
                            </Button>
                          </div>
                        </div>
                        <Button type="submit" disabled={uploadCommunityMutation.isPending}>
                          {uploadCommunityMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Users className="w-4 h-4 mr-2" />}
                          Create Community
                        </Button>
                      </form>

                      {Array.isArray(communities) && communities.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-medium mb-3">Existing Communities ({communities.length})</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Array.isArray(communities) && communities.map((community: any) => (
                              <div key={community.id} className="border rounded-lg p-3">
                                <h5 className="font-medium">{community.name}</h5>
                                <p className="text-sm text-gray-600">{community.type}</p>
                                <Badge variant={community.isPrivate ? "secondary" : "default"} className="mt-1">
                                  {community.isPrivate ? "Private" : "Public"}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Role Management (Admin Only) */}
              {activeSection === 'roles' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Crown className="w-5 h-5" />
                      <span>User Role Management</span>
                    </CardTitle>
                    <CardDescription>Assign roles and permissions to users</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Label>Select User</Label>
                        <select
                          value={selectedUserId || ''}
                          onChange={(e) => setSelectedUserId(Number(e.target.value))}
                          className="w-full border rounded-lg px-3 py-2"
                        >
                          <option value="">Choose a user...</option>
                          {users?.map((user: any) => (
                            <option key={user.id} value={user.id}>
                              {user.name || user.username} ({user.email})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-4">
                        <Label>Select Role</Label>
                        <select
                          value={selectedRoleId || ''}
                          onChange={(e) => setSelectedRoleId(Number(e.target.value))}
                          className="w-full border rounded-lg px-3 py-2"
                        >
                          <option value="">Choose a role...</option>
                          {roles?.map((role: any) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {selectedUserId && selectedRoleId && (
                      <div className="flex justify-center">
                        <Button
                          onClick={() => assignRoleMutation.mutate({ userId: selectedUserId, roleId: selectedRoleId })}
                          disabled={assignRoleMutation.isPending}
                        >
                          {assignRoleMutation.isPending ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <UserCheck className="w-4 h-4 mr-2" />
                          )}
                          Assign Role
                        </Button>
                      </div>
                    )}

                    {selectedUserId && userRoles && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-3">Current Roles for Selected User</h4>
                        <div className="flex flex-wrap gap-2">
                          {userRoles.map((role: any) => (
                            <Badge key={role.id} variant="default">
                              {role.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </PermissionGate>
          </div>
        </div>
      </div>
    </Layout>
  );
}