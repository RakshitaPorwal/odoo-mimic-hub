import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Header/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Lock,
  Bell,
  Palette,
  Languages,
  Shield,
  Banknote,
  Users,
  Building,
  Laptop,
  Cloud,
  FileText,
  Save,
  Upload,
  Trash,
  Plus,
  Key,
  Download,
  LogOut
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  getUserSettings,
  updateUserSettings,
  getTeamMembers,
  inviteTeamMember,
  getActiveDevices,
  revokeDeviceSession,
  getIntegrations,
  addIntegration,
  removeIntegration,
  generateApiKey,
  getActivityLogs,
  type UserSettings,
  type TeamMember,
  type DeviceSession,
  type Integration,
  uploadProfilePicture,
  updatePassword,
  toggleTwoFactor,
  verifyTwoFactorCode
} from "@/services/settingsService";
import { useAuth } from "@/hooks/use-auth";
import useTheme from "@/hooks/use-theme";

const Settings = () => {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profile");
  const fileInputRef = useRef<HTMLInputElement>(null); 
  const { theme, setTheme } = useTheme();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorSecret, setTwoFactorSecret] = useState('');

  // Fetch user settings
  const { data: settings, isLoading: isLoadingSettings, error: settingsError } = useQuery({
    queryKey: ["settings", user?.id],
    queryFn: () => getUserSettings(user?.id!),
    enabled: !!user?.id,
  });

  // Fetch team members
  const { data: teamMembers, isLoading: isLoadingTeam, error: teamError } = useQuery({
    queryKey: ["team-members", user?.id],
    queryFn: () => getTeamMembers(user?.id!),
    enabled: !!user?.id,
  });

  // Fetch active devices
  const { data: devices, isLoading: isLoadingDevices, error: devicesError } = useQuery({
    queryKey: ["devices", user?.id],
    queryFn: () => getActiveDevices(user?.id!),
    enabled: !!user?.id,
  });

  // Fetch integrations
  const { data: integrations, isLoading: isLoadingIntegrations, error: integrationsError } = useQuery({
    queryKey: ["integrations", user?.id],
    queryFn: () => getIntegrations(user?.id!),
    enabled: !!user?.id,
  });

  // Fetch activity logs
  const { data: activityLogs, isLoading: isLoadingLogs, error: logsError } = useQuery({
    queryKey: ["activity-logs", user?.id],
    queryFn: () => getActivityLogs(user?.id!),
    enabled: !!user?.id,
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (newSettings: Partial<UserSettings>) =>
      updateUserSettings(user?.id!, newSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Invite team member mutation
  const inviteTeamMemberMutation = useMutation({
    mutationFn: ({ email, role }: { email: string; role: TeamMember["role"] }) =>
      inviteTeamMember(user?.id!, email, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      toast({
        title: "Invitation sent",
        description: "Team member invitation has been sent successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Revoke device session mutation
  const revokeDeviceMutation = useMutation({
    mutationFn: (sessionId: string) => revokeDeviceSession(user?.id!, sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      toast({
        title: "Session revoked",
        description: "Device session has been revoked successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to revoke session. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Add integration mutation
  const addIntegrationMutation = useMutation({
    mutationFn: (integration: Omit<Integration, "id" | "user_id">) =>
      addIntegration(user?.id!, integration),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      toast({
        title: "Integration added",
        description: "Integration has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add integration. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Remove integration mutation
  const removeIntegrationMutation = useMutation({
    mutationFn: (integrationId: string) => removeIntegration(user?.id!, integrationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      toast({
        title: "Integration removed",
        description: "Integration has been removed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove integration. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Generate API key mutation
  const generateApiKeyMutation = useMutation({
    mutationFn: (name: string) => generateApiKey(user?.id!, name),
    onSuccess: (data) => {
      toast({
        title: "API key generated",
        description: "Your new API key has been generated successfully.",
      });
      // Here you would typically show the API key to the user
      console.log("Generated API key:", data.key);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate API key. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Profile photo upload mutation
  const uploadPhotoMutation = useMutation({
    mutationFn: async (file: File) => {
      console.log('Mutation started with file:', file.name);
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return uploadProfilePicture(user.id, file);
    },
    onSuccess: (url) => {
      console.log('Upload mutation success, URL:', url);
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Upload mutation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile picture. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Password update mutation
  const updatePasswordMutation = useMutation({
    mutationFn: () => updatePassword(currentPassword, newPassword),
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Two-factor authentication mutation
  const toggleTwoFactorMutation = useMutation({
    mutationFn: (enabled: boolean) => toggleTwoFactor(user?.id!, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast({
        title: "Two-factor authentication updated",
        description: "Your two-factor authentication settings have been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update two-factor authentication. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle profile photo upload
  /*const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0){
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('File selected:', file.name, file.type, file.size);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "File must be an image.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 2MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      console.log('Starting upload...');
      const url = await uploadPhotoMutation.mutateAsync(file);
      console.log('Upload successful, URL:', url);
      toast({
        title: "Success",
        description: "Profile picture updated successfully.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset the input value to allow uploading the same file again
      e.target.value = '';
    }
    }
  };*/
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    console.log("File selected:", file.name, file.type, file.size);

    // ✅ Improved validation logic (reduced nesting)
    if (!file.type.startsWith("image/")) return alert("File must be an image.");
    if (file.size > 2 * 1024 * 1024) return alert("File size must be less than 2MB.");

    setIsUploading(true);
    try {
      console.log("Starting upload...");
      
      // ✅ Simulated API call before implementing real upload
      await new Promise((resolve) => setTimeout(resolve, 2000));  
      
      console.log("Upload successful");
      alert("Profile picture updated successfully.");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload profile picture.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";  // ✅ Properly reset input field
    }
  };

  // Handle password update
  const handlePasswordUpdate = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    updatePasswordMutation.mutate();
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-semibold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Please sign in to access your settings.</p>
        </div>
      </Layout>
    );
  }

  if (isLoadingSettings) {
    return (
      <Layout>
        <Header 
          title="Settings" 
          description="Configure your account settings and preferences."
        />
        <div className="container mx-auto py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (settingsError) {
    return (
      <Layout>
        <Header 
          title="Settings" 
          description="Configure your account settings and preferences."
        />
        <div className="container mx-auto py-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-red-800 font-semibold">Error Loading Settings</h2>
            <p className="text-red-600 mt-2">Failed to load your settings. Please try again later.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header 
        title="Settings" 
        description="Configure your account settings and preferences."
      />

      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="md:col-span-1">
            <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="flex flex-col h-auto bg-transparent space-y-1 w-full">
                <TabsTrigger value="profile" className="justify-start w-full">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="security" className="justify-start w-full">
                  <Lock className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="notifications" className="justify-start w-full">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="appearance" className="justify-start w-full">
                  <Palette className="h-4 w-4 mr-2" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger value="language" className="justify-start w-full">
                  <Languages className="h-4 w-4 mr-2" />
                  Language & Region
                </TabsTrigger>
                <TabsTrigger value="privacy" className="justify-start w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy & Data
                </TabsTrigger>
                <TabsTrigger value="billing" className="justify-start w-full">
                  <Banknote className="h-4 w-4 mr-2" />
                  Billing
                </TabsTrigger>
                <TabsTrigger value="teams" className="justify-start w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Teams
                </TabsTrigger>
                <TabsTrigger value="company" className="justify-start w-full">
                  <Building className="h-4 w-4 mr-2" />
                  Company
                </TabsTrigger>
                <TabsTrigger value="devices" className="justify-start w-full">
                  <Laptop className="h-4 w-4 mr-2" />
                  Devices
                </TabsTrigger>
                <TabsTrigger value="integrations" className="justify-start w-full">
                  <Cloud className="h-4 w-4 mr-2" />
                  Integrations
                </TabsTrigger>
                <TabsTrigger value="logs" className="justify-start w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Logs
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Settings Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <Tabs value={activeTab} className="w-full">
                {/* Profile Settings */}
                <TabsContent value="profile" className="space-y-6 mt-0">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Profile Settings</h2>
                    <p className="text-sm text-muted-foreground">
                      Update your personal information and profile picture.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center space-x-4">
                      <div className="relative w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold overflow-hidden">
                        {settings?.profile_picture_url ? (
                          <img 
                            src={settings.profile_picture_url} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // If image fails to load, show initials
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.textContent = `${settings?.first_name?.[0] || ''}${settings?.last_name?.[0] || ''}`;
                              }
                            }}
                          />
                        ) : (
                          `${settings?.first_name?.[0] || ''}${settings?.last_name?.[0] || ''}`
                        )}
                      </div>
                      <div className="space-y-2">
                          <input
                          type="file"
                          id="photo-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          disabled={isUploading}
                          ref={fileInputRef}
                        />
                        <label htmlFor="photo-upload"
                        onClick={() => fileInputRef.current?.click()}>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={isUploading}
                            className="cursor-pointer"
                          >
                            {isUploading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload photo
                              </>
                            )}
                          </Button>
                        </label>
                        <p className="text-xs text-muted-foreground">
                          JPEG, GIF or PNG. Max 2MB.
                        </p>
                      </div>
                    </div>

                    {/* Profile Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          defaultValue={settings?.first_name}
                          onChange={(e) => updateSettingsMutation.mutate({ first_name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          defaultValue={settings?.last_name}
                          onChange={(e) => updateSettingsMutation.mutate({ last_name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          defaultValue={settings?.email}
                          onChange={(e) => updateSettingsMutation.mutate({ email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          type="tel" 
                          defaultValue={settings?.phone}
                          onChange={(e) => updateSettingsMutation.mutate({ phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          defaultValue={settings?.bio}
                          onChange={(e) => updateSettingsMutation.mutate({ bio: e.target.value })}
                          placeholder="Write a short bio..."
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button>
                        <Save className="h-4 w-4 mr-2" />
                        Save changes
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security" className="space-y-6 mt-0">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Security Settings</h2>
                    <p className="text-sm text-muted-foreground">
                      Manage your account security and authentication settings.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Password Change */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Change Password</h3>
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input 
                          id="currentPassword" 
                          type="password" 
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input 
                          id="newPassword" 
                          type="password" 
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input 
                          id="confirmPassword" 
                          type="password" 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      <Button onClick={handlePasswordUpdate}>Update Password</Button>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Two-factor authentication</p>
                            <p className="text-sm text-muted-foreground">
                              Add an extra layer of security to your account.
                            </p>
                          </div>
                          <Switch 
                            checked={settings?.two_factor_enabled}
                            onCheckedChange={async (checked) => {
                              if (checked) {
                                try {
                                  await toggleTwoFactorMutation.mutateAsync(true);
                                  setShow2FASetup(true);
                                  // Here you would typically show the QR code and secret to the user
                                  // This would be handled by your 2FA setup component
                                } catch (error) {
                                  toast({
                                    title: "Error",
                                    description: "Failed to enable two-factor authentication. Please try again.",
                                    variant: "destructive",
                                  });
                                }
                              } else {
                                try {
                                  await toggleTwoFactorMutation.mutateAsync(false);
                                  setShow2FASetup(false);
                                  toast({
                                    title: "Success",
                                    description: "Two-factor authentication has been disabled.",
                                  });
                                } catch (error) {
                                  toast({
                                    title: "Error",
                                    description: "Failed to disable two-factor authentication. Please try again.",
                                    variant: "destructive",
                                  });
                                }
                              }
                            }}
                          />
                        </div>

                        {show2FASetup && (
                          <div className="mt-4 p-4 border rounded-lg">
                            <h4 className="font-medium mb-2">Set up Two-Factor Authentication</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                              1. Install an authenticator app (like Google Authenticator or Authy)
                              2. Scan the QR code or enter the secret code manually
                              3. Enter the verification code from your authenticator app
                            </p>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="twoFactorCode">Verification Code</Label>
                                <Input
                                  id="twoFactorCode"
                                  value={twoFactorCode}
                                  onChange={(e) => setTwoFactorCode(e.target.value)}
                                  placeholder="Enter 6-digit code"
                                />
                              </div>
                              <Button
                                onClick={async () => {
                                  try {
                                    const isValid = await verifyTwoFactorCode(user?.id!, twoFactorCode);
                                    if (isValid) {
                                      toast({
                                        title: "Success",
                                        description: "Two-factor authentication has been enabled.",
                                      });
                                      setShow2FASetup(false);
                                      setTwoFactorCode('');
                                    } else {
                                      toast({
                                        title: "Error",
                                        description: "Invalid verification code. Please try again.",
                                        variant: "destructive",
                                      });
                                    }
                                  } catch (error) {
                                    toast({
                                      title: "Error",
                                      description: "Failed to verify code. Please try again.",
                                      variant: "destructive",
                                    });
                                  }
                                }}
                              >
                                Verify and Enable
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Active Sessions */}
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-4">Active Sessions</h3>
                      {devices?.map((device) => (
                        <div key={device.id} className="p-3 border rounded-lg flex justify-between items-center mb-2">
                          <div>
                            <p className="font-medium">{device.device_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {device.device_type} • {device.location} • Last active {new Date(device.last_active).toLocaleString()}
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => revokeDeviceMutation.mutate(device.id)}
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Revoke
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Notification Settings */}
                <TabsContent value="notifications" className="space-y-6 mt-0">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Notification Settings</h2>
                    <p className="text-sm text-muted-foreground">
                      Configure how you receive notifications.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Email Notifications */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Email Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">All email notifications</p>
                            <p className="text-sm text-muted-foreground">
                              Receive all emails for account activity.
                            </p>
                          </div>
                          <Switch 
                            checked={settings?.email_notifications}
                            onCheckedChange={(checked) => 
                              updateSettingsMutation.mutate({ email_notifications: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Order updates</p>
                            <p className="text-sm text-muted-foreground">
                              Receive emails when orders change status.
                            </p>
                          </div>
                          <Switch 
                            checked={settings?.order_updates}
                            onCheckedChange={(checked) => 
                              updateSettingsMutation.mutate({ order_updates: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Payment updates</p>
                            <p className="text-sm text-muted-foreground">
                              Receive emails for payment-related updates.
                            </p>
                          </div>
                          <Switch 
                            checked={settings?.payment_updates}
                            onCheckedChange={(checked) => 
                              updateSettingsMutation.mutate({ payment_updates: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Newsletter</p>
                            <p className="text-sm text-muted-foreground">
                              Receive our monthly newsletter.
                            </p>
                          </div>
                          <Switch 
                            checked={settings?.newsletter}
                            onCheckedChange={(checked) => 
                              updateSettingsMutation.mutate({ newsletter: checked })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Push Notifications */}
                    <div className="pt-4 border-t space-y-4">
                      <h3 className="text-lg font-medium">Push Notifications</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Push notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive push notifications for important updates.
                          </p>
                        </div>
                        <Switch 
                          checked={settings?.push_notifications}
                          onCheckedChange={(checked) => 
                            updateSettingsMutation.mutate({ push_notifications: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Appearance Settings */}
                <TabsContent value="appearance" className="space-y-6 mt-0">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Appearance Settings</h2>
                    <p className="text-sm text-muted-foreground">
                      Customize the look and feel of the application.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Theme */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Theme</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Dark mode</p>
                          <p className="text-sm text-muted-foreground">
                            Toggle between light and dark themes.
                          </p>
                        </div>
                        <Switch 
                          checked={theme === 'dark'}
                          onCheckedChange={(checked) => {
                            setTheme(checked ? 'dark' : 'light');
                            updateSettingsMutation.mutate({ 
                              theme: checked ? 'dark' : 'light' 
                            });
                          }}
                        />
                      </div>
                    </div>

                    {/* Layout */}
                    <div className="pt-4 border-t space-y-4">
                      <h3 className="text-lg font-medium">Layout</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Compact mode</p>
                          <p className="text-sm text-muted-foreground">
                            Use a more compact user interface.
                          </p>
                        </div>
                        <Switch 
                          checked={settings?.compact_mode}
                          onCheckedChange={(checked) => {
                            updateSettingsMutation.mutate({ compact_mode: checked });
                            // Apply compact mode to the layout
                            document.documentElement.classList.toggle('compact-mode', checked);
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Show sidebar</p>
                          <p className="text-sm text-muted-foreground">
                            Show sidebar by default on page load.
                          </p>
                        </div>
                        <Switch 
                          checked={settings?.show_sidebar}
                          onCheckedChange={(checked) => {
                            updateSettingsMutation.mutate({ show_sidebar: checked });
                            // Toggle sidebar visibility
                            document.documentElement.classList.toggle('hide-sidebar', !checked);
                          }}
                        />
                      </div>
                    </div>

                    {/* Font Size */}
                    <div className="pt-4 border-t space-y-4">
                      <h3 className="text-lg font-medium">Font Size</h3>
                      <div className="flex items-center space-x-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={settings?.font_size === 'small' ? 'border-primary bg-primary/10' : ''}
                          onClick={() => {
                            updateSettingsMutation.mutate({ font_size: 'small' });
                            document.documentElement.classList.remove('font-medium', 'font-large');
                            document.documentElement.classList.add('font-small');
                          }}
                        >
                          Small
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={settings?.font_size === 'medium' ? 'border-primary bg-primary/10' : ''}
                          onClick={() => {
                            updateSettingsMutation.mutate({ font_size: 'medium' });
                            document.documentElement.classList.remove('font-small', 'font-large');
                            document.documentElement.classList.add('font-medium');
                          }}
                        >
                          Medium
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={settings?.font_size === 'large' ? 'border-primary bg-primary/10' : ''}
                          onClick={() => {
                            updateSettingsMutation.mutate({ font_size: 'large' });
                            document.documentElement.classList.remove('font-small', 'font-medium');
                            document.documentElement.classList.add('font-large');
                          }}
                        >
                          Large
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Language & Region Settings */}
                <TabsContent value="language" className="space-y-6 mt-0">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Language & Region</h2>
                    <p className="text-sm text-muted-foreground">
                      Set your preferred language and regional settings.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <select
                        id="language"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={settings?.language}
                        onChange={(e) => updateSettingsMutation.mutate({ language: e.target.value })}
                      >
                        <option value="en-US">English (United States)</option>
                        <option value="en-GB">English (United Kingdom)</option>
                        <option value="fr-FR">French (France)</option>
                        <option value="es-ES">Spanish (Spain)</option>
                        <option value="de-DE">German (Germany)</option>
                        <option value="ja-JP">Japanese (Japan)</option>
                        <option value="zh-CN">Chinese (Simplified, China)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <select
                        id="timezone"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={settings?.timezone}
                        onChange={(e) => updateSettingsMutation.mutate({ timezone: e.target.value })}
                      >
                        <option value="America/New_York">Eastern Time (US & Canada)</option>
                        <option value="America/Chicago">Central Time (US & Canada)</option>
                        <option value="America/Denver">Mountain Time (US & Canada)</option>
                        <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                        <option value="Europe/London">London</option>
                        <option value="Europe/Paris">Paris</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <select
                        id="dateFormat"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={settings?.date_format}
                        onChange={(e) => updateSettingsMutation.mutate({ date_format: e.target.value })}
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <select
                        id="currency"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={settings?.currency}
                        onChange={(e) => updateSettingsMutation.mutate({ currency: e.target.value })}
                      >
                        <option value="USD">US Dollar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                        <option value="GBP">British Pound (GBP)</option>
                        <option value="JPY">Japanese Yen (JPY)</option>
                        <option value="CAD">Canadian Dollar (CAD)</option>
                        <option value="AUD">Australian Dollar (AUD)</option>
                      </select>
                    </div>
                  </div>
                </TabsContent>

                {/* Privacy & Data Settings */}
                <TabsContent value="privacy" className="space-y-6 mt-0">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Privacy & Data</h2>
                    <p className="text-sm text-muted-foreground">
                      Manage your data privacy settings and export options.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Data Sharing */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Data Sharing</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Analytics data</p>
                            <p className="text-sm text-muted-foreground">
                              Share anonymous usage data to help improve the service.
                            </p>
                          </div>
                          <Switch 
                            checked={settings?.data_sharing.analytics}
                            onCheckedChange={(checked) => 
                              updateSettingsMutation.mutate({ 
                                data_sharing: { 
                                  ...settings?.data_sharing, 
                                  analytics: checked 
                                } 
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Marketing communications</p>
                            <p className="text-sm text-muted-foreground">
                              Receive marketing emails and updates.
                            </p>
                          </div>
                          <Switch 
                            checked={settings?.data_sharing.marketing}
                            onCheckedChange={(checked) => 
                              updateSettingsMutation.mutate({ 
                                data_sharing: { 
                                  ...settings?.data_sharing, 
                                  marketing: checked 
                                } 
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Third-party sharing</p>
                            <p className="text-sm text-muted-foreground">
                              Allow sharing data with third-party services.
                            </p>
                          </div>
                          <Switch 
                            checked={settings?.data_sharing.third_party}
                            onCheckedChange={(checked) => 
                              updateSettingsMutation.mutate({ 
                                data_sharing: { 
                                  ...settings?.data_sharing, 
                                  third_party: checked 
                                } 
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Data Export */}
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-4">Data Export</h3>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download personal data
                      </Button>
                    </div>

                    {/* Account Deletion */}
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-4">Account Deletion</h3>
                      <Button variant="destructive">
                        <Trash className="h-4 w-4 mr-2" />
                        Delete account
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Billing Settings */}
                <TabsContent value="billing" className="space-y-6 mt-0">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Billing & Subscription</h2>
                    <p className="text-sm text-muted-foreground">
                      Manage your payment methods and subscription plans.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Current Plan */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Current Plan</h3>
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Professional Plan</p>
                            <p className="text-sm text-muted-foreground">
                              $29/month • Billed annually
                            </p>
                          </div>
                          <Button variant="outline">Change Plan</Button>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm text-muted-foreground">
                            Next billing date: January 1, 2025
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
                      <Button variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add payment method
                      </Button>
                    </div>

                    {/* Billing History */}
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-4">Billing History</h3>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download invoices
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Team Settings */}
                <TabsContent value="teams" className="space-y-6 mt-0">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Teams & Collaboration</h2>
                    <p className="text-sm text-muted-foreground">
                      Manage team members and set access permissions.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Team Members */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Team Members</h3>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Invite member
                        </Button>
                      </div>

                      {teamMembers?.map((member) => (
                        <div key={member.id} className="p-4 border rounded-lg flex justify-between items-center">
                          <div>
                            <p className="font-medium">{member.email}</p>
                            <p className="text-sm text-muted-foreground">
                              Role: {member.role} • Status: {member.status}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Trash className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Roles & Permissions */}
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-4">Roles & Permissions</h3>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <p className="font-medium">Admin</p>
                          <p className="text-sm text-muted-foreground">
                            Full access to all features and settings.
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <p className="font-medium">User</p>
                          <p className="text-sm text-muted-foreground">
                            Access to core features and limited settings.
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <p className="font-medium">Viewer</p>
                          <p className="text-sm text-muted-foreground">
                            Read-only access to shared content.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Company Settings */}
                <TabsContent value="company" className="space-y-6 mt-0">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Company Information</h2>
                    <p className="text-sm text-muted-foreground">
                      Manage your company profile and business details.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Company Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input 
                          id="companyName" 
                          defaultValue={settings?.company_name}
                          onChange={(e) => updateSettingsMutation.mutate({ company_name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyAddress">Company Address</Label>
                        <Input 
                          id="companyAddress" 
                          defaultValue={settings?.company_address}
                          onChange={(e) => updateSettingsMutation.mutate({ company_address: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyPhone">Company Phone</Label>
                        <Input 
                          id="companyPhone" 
                          defaultValue={settings?.company_phone}
                          onChange={(e) => updateSettingsMutation.mutate({ company_phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyEmail">Company Email</Label>
                        <Input 
                          id="companyEmail" 
                          type="email"
                          defaultValue={settings?.company_email}
                          onChange={(e) => updateSettingsMutation.mutate({ company_email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyWebsite">Company Website</Label>
                        <Input 
                          id="companyWebsite" 
                          defaultValue={settings?.company_website || ''}
                          onChange={(e) => updateSettingsMutation.mutate({ company_website: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Company Logo */}
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-4">Company Logo</h3>
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 border rounded-lg flex items-center justify-center">
                          {settings?.company_logo_url ? (
                            <img 
                              src={settings.company_logo_url} 
                              alt="Company logo" 
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Building className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload logo
                          </Button>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG or JPG. Max 2MB.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Device Settings */}
                <TabsContent value="devices" className="space-y-6 mt-0">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Devices & Sessions</h2>
                    <p className="text-sm text-muted-foreground">
                      View and manage devices connected to your account.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Active Devices */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Active Devices</h3>
                      {devices?.map((device) => (
                        <div key={device.id} className="p-4 border rounded-lg flex justify-between items-center">
                          <div>
                            <p className="font-medium">{device.device_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {device.device_type} • {device.location} • Last active {new Date(device.last_active).toLocaleString()}
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => revokeDeviceMutation.mutate(device.id)}
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Revoke
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Security Settings */}
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-4">Security Settings</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Restrict unrecognized logins</p>
                          <p className="text-sm text-muted-foreground">
                            Require additional verification for new devices.
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Integration Settings */}
                <TabsContent value="integrations" className="space-y-6 mt-0">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Integrations & API</h2>
                    <p className="text-sm text-muted-foreground">
                      Connect with third-party services and manage API access.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Connected Services */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Connected Services</h3>
                      {integrations?.map((integration) => (
                        <div key={integration.id} className="p-4 border rounded-lg flex justify-between items-center">
                          <div>
                            <p className="font-medium">{integration.service}</p>
                            <p className="text-sm text-muted-foreground">
                              Status: {integration.status} • Last sync: {integration.last_sync ? new Date(integration.last_sync).toLocaleString() : 'Never'}
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeIntegrationMutation.mutate(integration.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add integration
                      </Button>
                    </div>

                    {/* API Keys */}
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-4">API Keys</h3>
                      <div className="space-y-4">
                        <Button onClick={() => generateApiKeyMutation.mutate('New API Key')}>
                          <Key className="h-4 w-4 mr-2" />
                          Generate new API key
                        </Button>
                        <p className="text-sm text-muted-foreground">
                          API keys are used to authenticate requests to our API. Keep them secure and never share them publicly.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Activity Logs */}
                <TabsContent value="logs" className="space-y-6 mt-0">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Activity Logs</h2>
                    <p className="text-sm text-muted-foreground">
                      View the history of activities on your account.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Activity List */}
                    <div className="space-y-4">
                      {activityLogs?.map((log) => (
                        <div key={log.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{log.action}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(log.created_at).toLocaleString()}
                              </p>
                            </div>
                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                              {log.type}
                            </span>
                          </div>
                          {log.details && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {log.details}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Export Logs */}
                    <div className="pt-4 border-t">
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export logs
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
