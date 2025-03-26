
import React, { useState } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Header/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Mail, 
  MailPlus, 
  Users, 
  Send, 
  PieChart, 
  Search,
  Plus,
  MoreVertical,
  Calendar,
  BarChart3,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

// Sample email campaigns data
const campaigns = [
  { 
    id: 1, 
    name: "Summer Sale Announcement", 
    subject: "Summer Sale: 30% Off Everything!", 
    status: "sent", 
    recipients: 1250, 
    openRate: 24.8, 
    clickRate: 12.3, 
    sentDate: "2023-06-15" 
  },
  { 
    id: 2, 
    name: "Product Update Newsletter", 
    subject: "Exciting New Features Just Released", 
    status: "sent", 
    recipients: 980, 
    openRate: 32.7, 
    clickRate: 18.5, 
    sentDate: "2023-07-02" 
  },
  { 
    id: 3, 
    name: "Customer Feedback Survey", 
    subject: "We Value Your Opinion - Take Our Survey", 
    status: "draft", 
    recipients: 0, 
    openRate: 0, 
    clickRate: 0, 
    sentDate: null 
  },
  { 
    id: 4, 
    name: "Monthly Newsletter", 
    subject: "Your August Newsletter Is Here", 
    status: "scheduled", 
    recipients: 1450, 
    openRate: 0, 
    clickRate: 0, 
    sentDate: "2023-08-20" 
  },
  { 
    id: 5, 
    name: "New Product Announcement", 
    subject: "Introducing Our Latest Innovation", 
    status: "draft", 
    recipients: 0, 
    openRate: 0, 
    clickRate: 0, 
    sentDate: null 
  },
];

// Sample subscriber lists data
const subscriberLists = [
  { id: 1, name: "All Subscribers", count: 2500, description: "Complete database of all subscribers", lastUpdated: "2023-08-01" },
  { id: 2, name: "Active Customers", count: 1250, description: "Customers who purchased in the last 6 months", lastUpdated: "2023-08-05" },
  { id: 3, name: "Newsletter Subscribers", count: 1850, description: "Opt-in subscribers to the monthly newsletter", lastUpdated: "2023-07-28" },
  { id: 4, name: "Potential Leads", count: 780, description: "Prospects who haven't made a purchase yet", lastUpdated: "2023-07-25" },
  { id: 5, name: "VIP Customers", count: 320, description: "High-value repeat customers", lastUpdated: "2023-08-03" },
];

// Status colors
const statusColors = {
  sent: "bg-green-100 text-green-800",
  draft: "bg-gray-100 text-gray-800",
  scheduled: "bg-blue-100 text-blue-800",
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const EmailMarketing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [showCampaignEditor, setShowCampaignEditor] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("blank");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");

  // Filter campaigns based on search query
  const filteredCampaigns = campaigns.filter(
    campaign => 
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter subscribers based on search query
  const filteredLists = subscriberLists.filter(
    list => 
      list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate metrics
  const totalSubscribers = subscriberLists.reduce((sum, list) => sum + list.count, 0);
  const sentCampaigns = campaigns.filter(campaign => campaign.status === "sent").length;
  const avgOpenRate = campaigns
    .filter(campaign => campaign.status === "sent")
    .reduce((sum, campaign) => sum + campaign.openRate, 0) / sentCampaigns || 0;
  const avgClickRate = campaigns
    .filter(campaign => campaign.status === "sent")
    .reduce((sum, campaign) => sum + campaign.clickRate, 0) / sentCampaigns || 0;

  // Handle create new campaign
  const handleCreateCampaign = () => {
    setShowCampaignEditor(true);
  };

  // Handle save draft
  const handleSaveDraft = () => {
    if (!emailSubject) {
      toast({
        title: "Missing Information",
        description: "Please enter an email subject",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Campaign Saved",
      description: "Your email campaign draft has been saved successfully.",
    });
    
    setShowCampaignEditor(false);
    setEmailSubject("");
    setEmailContent("");
    setSelectedTemplate("blank");
  };

  // Handle template selection
  const handleTemplateChange = (template) => {
    setSelectedTemplate(template);
    
    // Pre-fill content based on template
    switch(template) {
      case "newsletter":
        setEmailSubject("Monthly Newsletter: [Month] [Year]");
        setEmailContent("# Monthly Newsletter\n\nDear [Subscriber],\n\n## What's New\n\n- Update 1\n- Update 2\n- Update 3\n\n## Featured Product\n\n[Product description]\n\n## Upcoming Events\n\n[Event details]\n\nThank you for subscribing!");
        break;
      case "promotion":
        setEmailSubject("Special Offer: [Discount]% Off!");
        setEmailContent("# Special Promotion\n\nDear [Subscriber],\n\nWe're excited to offer you an exclusive discount on our products.\n\n## Limited Time Offer\n\n[Offer details]\n\n## Shop Now\n\n[CTA Button]\n\nThis offer expires on [Date].");
        break;
      case "announcement":
        setEmailSubject("Announcing: [New Feature/Product]");
        setEmailContent("# Important Announcement\n\nDear [Subscriber],\n\nWe're excited to share some important news with you.\n\n## Announcing [Feature/Product]\n\n[Details]\n\n## Why This Matters\n\n[Benefits]\n\n## Learn More\n\n[CTA Button]");
        break;
      default:
        setEmailSubject("");
        setEmailContent("");
    }
  };

  return (
    <Layout>
      <Header 
        title="Email Marketing" 
        description="Create, send, and analyze email campaigns."
      >
        <Button size="sm" onClick={handleCreateCampaign}>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </Header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubscribers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across {subscriberLists.length} lists</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Campaigns Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sentCampaigns}</div>
            <p className="text-xs text-muted-foreground">Total campaigns delivered</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Open Rate</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgOpenRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Industry avg: 21.3%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Click Rate</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgClickRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Industry avg: 9.7%</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Campaign Management</h3>
        <div className="relative w-[350px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search campaigns and lists..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="subscribers">Subscriber Lists</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="border rounded-md mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Open Rate</TableHead>
                <TableHead>Click Rate</TableHead>
                <TableHead>Sent Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>{campaign.subject}</TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center px-2.5 py-0.5 text-xs rounded-full capitalize ${statusColors[campaign.status]}`}>
                      {campaign.status}
                    </div>
                  </TableCell>
                  <TableCell>{campaign.recipients.toLocaleString()}</TableCell>
                  <TableCell>{campaign.status === "sent" ? `${campaign.openRate}%` : "—"}</TableCell>
                  <TableCell>{campaign.status === "sent" ? `${campaign.clickRate}%` : "—"}</TableCell>
                  <TableCell>{formatDate(campaign.sentDate)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          View Campaign
                        </DropdownMenuItem>
                        {campaign.status !== "sent" && (
                          <DropdownMenuItem>
                            <Send className="h-4 w-4 mr-2" />
                            {campaign.status === "scheduled" ? "Edit Schedule" : "Send Campaign"}
                          </DropdownMenuItem>
                        )}
                        {campaign.status === "sent" && (
                          <DropdownMenuItem>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            View Reports
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="subscribers" className="border rounded-md mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>List Name</TableHead>
                <TableHead>Subscribers</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLists.map((list) => (
                <TableRow key={list.id}>
                  <TableCell className="font-medium">{list.name}</TableCell>
                  <TableCell>{list.count.toLocaleString()}</TableCell>
                  <TableCell>{list.description}</TableCell>
                  <TableCell>{formatDate(list.lastUpdated)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Users className="h-4 w-4 mr-2" />
                          View Subscribers
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MailPlus className="h-4 w-4 mr-2" />
                          Send Campaign
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="analytics" className="p-6 flex flex-col items-center justify-center border rounded-md mt-6 text-center min-h-[300px]">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Campaign Analytics</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              View detailed reports on your email campaigns, including open rates, click rates, and subscriber engagement.
            </p>
            <Button>View Reports</Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Campaign Editor Dialog */}
      <Dialog open={showCampaignEditor} onOpenChange={setShowCampaignEditor}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create Email Campaign</DialogTitle>
            <DialogDescription>
              Design and create a new email campaign to send to your subscribers.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-4">
            <div className="md:col-span-1 border-r pr-4">
              <div className="font-medium mb-2">Templates</div>
              <div className="space-y-2">
                <div 
                  className={`p-2 rounded cursor-pointer ${selectedTemplate === 'blank' ? 'bg-primary/10' : 'hover:bg-muted'}`}
                  onClick={() => handleTemplateChange('blank')}
                >
                  <div className="font-medium">Blank</div>
                  <div className="text-xs text-muted-foreground">Start from scratch</div>
                </div>
                <div 
                  className={`p-2 rounded cursor-pointer ${selectedTemplate === 'newsletter' ? 'bg-primary/10' : 'hover:bg-muted'}`}
                  onClick={() => handleTemplateChange('newsletter')}
                >
                  <div className="font-medium">Newsletter</div>
                  <div className="text-xs text-muted-foreground">Monthly newsletter template</div>
                </div>
                <div 
                  className={`p-2 rounded cursor-pointer ${selectedTemplate === 'promotion' ? 'bg-primary/10' : 'hover:bg-muted'}`}
                  onClick={() => handleTemplateChange('promotion')}
                >
                  <div className="font-medium">Promotion</div>
                  <div className="text-xs text-muted-foreground">Sales and special offers</div>
                </div>
                <div 
                  className={`p-2 rounded cursor-pointer ${selectedTemplate === 'announcement' ? 'bg-primary/10' : 'hover:bg-muted'}`}
                  onClick={() => handleTemplateChange('announcement')}
                >
                  <div className="font-medium">Announcement</div>
                  <div className="text-xs text-muted-foreground">Product or feature announcement</div>
                </div>
              </div>
            </div>
            <div className="md:col-span-3">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input 
                    id="subject" 
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Enter your email subject"
                    className="w-full mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="content">Email Content</Label>
                  <Textarea 
                    id="content"
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    placeholder="Enter your email content here..."
                    className="min-h-[300px] w-full mt-1 font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports Markdown formatting. Use # for headings, * for lists, etc.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-2 w-full sm:justify-between">
              <div>
                <Button variant="outline" type="button" onClick={() => setShowCampaignEditor(false)}>
                  Cancel
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" type="button" onClick={handleSaveDraft}>
                  Save Draft
                </Button>
                <Button type="button">
                  Next: Select Recipients
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default EmailMarketing;
