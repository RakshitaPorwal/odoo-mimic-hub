
import React, { useState } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Header/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
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
  Save
} from "lucide-react";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(true);

  return (
    <Layout>
      <Header 
        title="Settings" 
        description="Configure system preferences."
      />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64 space-y-2">
          <Tabs defaultValue="profile" orientation="vertical" className="w-full">
            <TabsList className="flex flex-col h-auto bg-transparent space-y-1 w-full">
              <TabsTrigger value="profile" className="justify-start w-full">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="account" className="justify-start w-full">
                <Lock className="h-4 w-4 mr-2" />
                Account Security
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
        
        <div className="flex-1">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <Tabs defaultValue="profile" className="w-full">
              <TabsContent value="profile" className="space-y-6 mt-0">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Profile Settings</h2>
                  <p className="text-sm text-muted-foreground">
                    Update your personal information and profile picture.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                      JP
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        Upload photo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPEG, GIF or PNG. Max 2MB.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium">
                        First Name
                      </label>
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                      </label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </label>
                      <Input id="email" type="email" defaultValue="john.doe@example.com" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </label>
                      <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="bio" className="text-sm font-medium">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Write a short bio..."
                        defaultValue="Administrator at Odoo Hub with over 5 years of experience in system management and implementation."
                      ></textarea>
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
              
              <TabsContent value="account" className="space-y-6 mt-0">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Account Security</h2>
                  <p className="text-sm text-muted-foreground">
                    Update your password and secure your account.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Change Password</h3>
                    
                    <div className="space-y-2">
                      <label htmlFor="currentPassword" className="text-sm font-medium">
                        Current Password
                      </label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="newPassword" className="text-sm font-medium">
                        New Password
                      </label>
                      <Input id="newPassword" type="password" />
                      <p className="text-xs text-muted-foreground">
                        Password must be at least 8 characters and include a number, lowercase letter, uppercase letter, and special character.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className="text-sm font-medium">
                        Confirm New Password
                      </label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    
                    <Button className="mt-2">Update Password</Button>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Two-factor authentication</p>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account.
                        </p>
                      </div>
                      <Button variant="outline">Enable</Button>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-4">Sessions</h3>
                    
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-sm text-muted-foreground">
                            Chrome on Mac OS • San Francisco, USA • Active now
                          </p>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          This device
                        </span>
                      </div>
                      
                      <div className="p-3 border rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium">Mobile App</p>
                          <p className="text-sm text-muted-foreground">
                            iOS 16 • New York, USA • Last active 2 hours ago
                          </p>
                        </div>
                        <Button variant="outline" size="sm">Log out</Button>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="mt-3 w-full">
                      Log out of all devices
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-6 mt-0">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Notification Settings</h2>
                  <p className="text-sm text-muted-foreground">
                    Configure how you receive notifications.
                  </p>
                </div>
                
                <div className="space-y-6">
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
                          checked={emailNotifications} 
                          onCheckedChange={setEmailNotifications} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Order updates</p>
                          <p className="text-sm text-muted-foreground">
                            Receive emails when orders change status.
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Newsletter</p>
                          <p className="text-sm text-muted-foreground">
                            Receive our monthly newsletter.
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t space-y-4">
                    <h3 className="text-lg font-medium">Browser Notifications</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Browser notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Show desktop notifications for important events.
                          </p>
                        </div>
                        <Switch 
                          checked={browserNotifications} 
                          onCheckedChange={setBrowserNotifications} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Message notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Show notifications for new messages.
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Save preferences</Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="appearance" className="space-y-6 mt-0">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Appearance Settings</h2>
                  <p className="text-sm text-muted-foreground">
                    Customize the look and feel of the application.
                  </p>
                </div>
                
                <div className="space-y-6">
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
                        checked={darkMode} 
                        onCheckedChange={setDarkMode} 
                      />
                    </div>
                    
                    <div className="pt-4 grid grid-cols-3 gap-4">
                      <div className="border rounded-lg p-3 cursor-pointer bg-primary/10 border-primary/30">
                        <div className="w-full h-20 bg-primary rounded-md mb-2"></div>
                        <p className="text-sm font-medium text-center">Blue</p>
                      </div>
                      <div className="border rounded-lg p-3 cursor-pointer">
                        <div className="w-full h-20 bg-green-600 rounded-md mb-2"></div>
                        <p className="text-sm font-medium text-center">Green</p>
                      </div>
                      <div className="border rounded-lg p-3 cursor-pointer">
                        <div className="w-full h-20 bg-purple-600 rounded-md mb-2"></div>
                        <p className="text-sm font-medium text-center">Purple</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t space-y-4">
                    <h3 className="text-lg font-medium">Layout</h3>
                    
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-medium">Compact mode</p>
                          <p className="text-sm text-muted-foreground">
                            Use a more compact user interface.
                          </p>
                        </div>
                        <Switch />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Sidebar</p>
                          <p className="text-sm text-muted-foreground">
                            Show sidebar by default on page load.
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t space-y-4">
                    <h3 className="text-lg font-medium">Font Size</h3>
                    
                    <div className="flex items-center space-x-4">
                      <Button variant="outline" size="sm">Small</Button>
                      <Button variant="outline" size="sm" className="border-primary bg-primary/10">Medium</Button>
                      <Button variant="outline" size="sm">Large</Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Save preferences</Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="language" className="mt-0">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Language & Region</h2>
                    <p className="text-sm text-muted-foreground">
                      Set your preferred language and regional settings.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="language" className="text-sm font-medium">
                        Language
                      </label>
                      <select
                        id="language"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                      <label htmlFor="timezone" className="text-sm font-medium">
                        Timezone
                      </label>
                      <select
                        id="timezone"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                      <label htmlFor="dateFormat" className="text-sm font-medium">
                        Date Format
                      </label>
                      <select
                        id="dateFormat"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="currency" className="text-sm font-medium">
                        Currency
                      </label>
                      <select
                        id="currency"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                  
                  <div className="flex justify-end">
                    <Button>Save preferences</Button>
                  </div>
                </div>
              </TabsContent>
              
              {/* Additional tabs content would be added here */}
              
              <TabsContent value="privacy" className="mt-0">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Privacy & Data</h2>
                    <p className="text-sm text-muted-foreground">
                      Manage your data privacy settings and export options.
                    </p>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">
                      This tab would include privacy settings, data export options, and account deletion controls.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="billing" className="mt-0">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Billing & Subscription</h2>
                    <p className="text-sm text-muted-foreground">
                      Manage your payment methods and subscription plans.
                    </p>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">
                      This tab would include subscription details, payment methods, and billing history.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="teams" className="mt-0">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Teams & Permissions</h2>
                    <p className="text-sm text-muted-foreground">
                      Manage team members and set access permissions.
                    </p>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">
                      This tab would include team member management, role assignments, and permission settings.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="company" className="mt-0">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Company Information</h2>
                    <p className="text-sm text-muted-foreground">
                      Manage your company profile and business details.
                    </p>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">
                      This tab would include company information, logo settings, and business hours.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="devices" className="mt-0">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Devices & Sessions</h2>
                    <p className="text-sm text-muted-foreground">
                      View and manage devices connected to your account.
                    </p>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">
                      This tab would include a list of connected devices and active sessions.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="integrations" className="mt-0">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Integrations</h2>
                    <p className="text-sm text-muted-foreground">
                      Manage third-party integrations and API access.
                    </p>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">
                      This tab would include connected apps, API tokens, and integration settings.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="logs" className="mt-0">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Activity Logs</h2>
                    <p className="text-sm text-muted-foreground">
                      View the history of activities on your account.
                    </p>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">
                      This tab would include a chronological list of account activities and system logs.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
