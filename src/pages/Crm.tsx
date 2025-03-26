
import React, { useState } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Header/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  ChartBar, 
  Coins, 
  HandShake, 
  Plus, 
  Search, 
  User, 
  Users
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

const leadsData = [
  { id: 1, name: "John Smith", company: "Acme Inc.", email: "john@acme.com", phone: "+1 (555) 123-4567", status: "new", value: 12500 },
  { id: 2, name: "Sarah Johnson", company: "TechCorp", email: "sarah@techcorp.com", phone: "+1 (555) 987-6543", status: "contacted", value: 8750 },
  { id: 3, name: "Michael Brown", company: "Global Industries", email: "michael@global.com", phone: "+1 (555) 567-8901", status: "qualified", value: 21000 },
  { id: 4, name: "Emma Wilson", company: "Design Studio", email: "emma@design.com", phone: "+1 (555) 234-5678", status: "proposal", value: 5300 },
  { id: 5, name: "James Taylor", company: "Marketing Experts", email: "james@marketing.com", phone: "+1 (555) 345-6789", status: "negotiation", value: 15750 },
];

const dealsData = [
  { id: 1, name: "Software Implementation", client: "Acme Inc.", value: 24500, stage: "proposal", probability: 60, expectedClose: "2023-10-15" },
  { id: 2, name: "Consulting Services", client: "TechCorp", value: 12750, stage: "discovery", probability: 30, expectedClose: "2023-11-05" },
  { id: 3, name: "Annual Maintenance", client: "Global Industries", value: 36000, stage: "negotiation", probability: 80, expectedClose: "2023-09-30" },
  { id: 4, name: "Website Redesign", client: "Design Studio", value: 8300, stage: "closed won", probability: 100, expectedClose: "2023-09-10" },
  { id: 5, name: "Marketing Campaign", client: "Marketing Experts", value: 15750, stage: "discovery", probability: 20, expectedClose: "2023-12-01" },
];

const statusColors = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-purple-100 text-purple-800",
  qualified: "bg-green-100 text-green-800",
  proposal: "bg-yellow-100 text-yellow-800",
  negotiation: "bg-orange-100 text-orange-800",
  "closed won": "bg-teal-100 text-teal-800",
  "closed lost": "bg-red-100 text-red-800",
  discovery: "bg-indigo-100 text-indigo-800",
};

const Crm = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLeads = leadsData.filter(
    lead => 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDeals = dealsData.filter(
    deal => 
      deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <Header 
        title="CRM" 
        description="Manage your customer relationships, leads, and deals."
      >
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Lead</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new lead in the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="company" className="text-right">
                    Company
                  </Label>
                  <Input id="company" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input id="email" type="email" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input id="phone" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="value" className="text-right">
                    Value ($)
                  </Label>
                  <Input id="value" type="number" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Lead</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125</div>
            <p className="text-xs text-muted-foreground">+12 this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Deals</CardTitle>
            <HandShake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-muted-foreground">$345,200 total value</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Closed Deals (MTD)</CardTitle>
            <ChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs text-muted-foreground">$142,500 total value</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.8%</div>
            <p className="text-xs text-muted-foreground">+2.3% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Pipeline Management</h3>
        <div className="relative w-[350px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search leads and deals..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="leads" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="leads" className="border rounded-md mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Est. Value</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-2">
                        <User className="h-4 w-4" />
                      </div>
                      {lead.name}
                    </div>
                  </TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center px-2.5 py-0.5 text-xs rounded-full capitalize ${statusColors[lead.status]}`}>
                      {lead.status}
                    </div>
                  </TableCell>
                  <TableCell>${lead.value.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="deals" className="border rounded-md mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deal Name</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Probability</TableHead>
                <TableHead>Expected Close</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeals.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell className="font-medium">{deal.name}</TableCell>
                  <TableCell>{deal.client}</TableCell>
                  <TableCell>${deal.value.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center px-2.5 py-0.5 text-xs rounded-full capitalize ${statusColors[deal.stage]}`}>
                      {deal.stage}
                    </div>
                  </TableCell>
                  <TableCell>{deal.probability}%</TableCell>
                  <TableCell>{deal.expectedClose}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="activities" className="p-6 flex flex-col items-center justify-center border rounded-md mt-6 text-center min-h-[300px]">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Track Customer Activities</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Log calls, meetings, emails, and other interactions with your prospects and customers.
            </p>
            <Button>Log Activity</Button>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Crm;
