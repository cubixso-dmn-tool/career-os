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
            
            {/* Show admin tab only to users with specific permissions */}
            <PermissionGate permissions={["admin:roles"]}>
              <TabsTrigger value="roles" className="flex items-center">
                <BadgeCheck className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Roles</span>
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
        </Tabs>
      </div>
    </Layout>
  );
}