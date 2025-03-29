
import React, { useState } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Header/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Plus,
  Phone,
  Mail,
  Star,
  Building,
  MapPin,
  UserCircle,
  Edit,
  Trash,
  Filter,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Define the contact type
type ContactType = "Customer" | "Vendor" | "Prospect";

interface Contact {
  id: number;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  address: string;
  type: ContactType;
  starred: boolean;
  tags: string[];
}

const Contacts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [isAddingContact, setIsAddingContact] = useState(false);
  
  // Sample contact data
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      name: "John Smith",
      avatar: "",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
      company: "Acme Inc.",
      position: "Sales Manager",
      address: "123 Business St, New York, NY 10001",
      type: "Customer",
      starred: true,
      tags: ["VIP", "Enterprise"]
    },
    {
      id: 2,
      name: "Jane Doe",
      avatar: "",
      email: "jane.doe@example.com",
      phone: "+1 (555) 987-6543",
      company: "Global Tech",
      position: "CTO",
      address: "456 Tech Ave, San Francisco, CA 94107",
      type: "Prospect",
      starred: false,
      tags: ["Technology", "Lead"]
    },
    {
      id: 3,
      name: "Robert Johnson",
      avatar: "",
      email: "robert.johnson@example.com",
      phone: "+1 (555) 567-8901",
      company: "Supply Solutions",
      position: "Account Manager",
      address: "789 Supply Rd, Chicago, IL 60601",
      type: "Vendor",
      starred: true,
      tags: ["Office Supplies"]
    },
    {
      id: 4,
      name: "Emily Chen",
      avatar: "",
      email: "emily.chen@example.com",
      phone: "+1 (555) 234-5678",
      company: "Innovative Designs",
      position: "Creative Director",
      address: "321 Creative Blvd, Austin, TX 78701",
      type: "Customer",
      starred: false,
      tags: ["Design", "Small Business"]
    },
    {
      id: 5,
      name: "Michael Rodriguez",
      avatar: "",
      email: "michael.rodriguez@example.com",
      phone: "+1 (555) 345-6789",
      company: "Rodriguez Consulting",
      position: "CEO",
      address: "654 Consulting Way, Miami, FL 33101",
      type: "Prospect",
      starred: true,
      tags: ["Consulting", "VIP"]
    }
  ]);
  
  // New contact form state
  const [newContact, setNewContact] = useState<Omit<Contact, "id">>({
    name: "",
    avatar: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    address: "",
    type: "Customer",
    starred: false,
    tags: []
  });
  
  // Filter contacts based on search and filter criteria
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm);
    
    const matchesType = filterType ? contact.type === filterType : true;
    const matchesStarred = onlyStarred ? contact.starred : true;
    
    return matchesSearch && matchesType && matchesStarred;
  });
  
  // Handle adding a new contact
  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Required fields missing",
        description: "Please fill in at least the name and phone number",
        variant: "destructive"
      });
      return;
    }
    
    setContacts([
      ...contacts,
      {
        ...newContact,
        id: contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1
      }
    ]);
    
    setIsAddingContact(false);
    
    // Reset form
    setNewContact({
      name: "",
      avatar: "",
      email: "",
      phone: "",
      company: "",
      position: "",
      address: "",
      type: "Customer",
      starred: false,
      tags: []
    });
    
    toast({
      title: "Contact added",
      description: `${newContact.name} has been added to your contacts`
    });
  };
  
  // Handle toggling a contact's starred status
  const toggleStarred = (contactId: number) => {
    setContacts(contacts.map(contact => 
      contact.id === contactId 
        ? { ...contact, starred: !contact.starred } 
        : contact
    ));
  };
  
  // Handle calling a contact via WhatsApp
  const callWhatsApp = (phone: string) => {
    // In a real app, this would open WhatsApp with the phone number
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank');
    toast({
      title: "Opening WhatsApp",
      description: `Starting a call with ${phone}`
    });
  };
  
  // Handle emailing a contact via Outlook
  const emailOutlook = (email: string) => {
    // In a real app, this would open the default email client
    window.open(`mailto:${email}`, '_blank');
    toast({
      title: "Opening email client",
      description: `Composing an email to ${email}`
    });
  };
  
  // Handle deleting a contact
  const deleteContact = (contactId: number) => {
    const contactToDelete = contacts.find(c => c.id === contactId);
    if (!contactToDelete) return;
    
    setContacts(contacts.filter(contact => contact.id !== contactId));
    toast({
      title: "Contact deleted",
      description: `${contactToDelete.name} has been removed from your contacts`
    });
  };

  return (
    <Layout>
      <Header 
        title="Contacts" 
        description="Manage your customers, vendors, and prospects."
      >
        <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new contact.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input 
                    id="name" 
                    value={newContact.name}
                    onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                    placeholder="John Smith"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input 
                    id="phone" 
                    value={newContact.phone}
                    onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                    placeholder="john.smith@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Contact Type</Label>
                  <Select 
                    value={newContact.type}
                    onValueChange={(value) => setNewContact({...newContact, type: value as ContactType})}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Customer">Customer</SelectItem>
                      <SelectItem value="Vendor">Vendor</SelectItem>
                      <SelectItem value="Prospect">Prospect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input 
                    id="company" 
                    value={newContact.company}
                    onChange={(e) => setNewContact({...newContact, company: e.target.value})}
                    placeholder="Acme Inc."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">Position/Designation</Label>
                  <Input 
                    id="position" 
                    value={newContact.position}
                    onChange={(e) => setNewContact({...newContact, position: e.target.value})}
                    placeholder="Sales Manager"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={newContact.address}
                  onChange={(e) => setNewContact({...newContact, address: e.target.value})}
                  placeholder="123 Business St, New York, NY 10001"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="starred"
                  checked={newContact.starred}
                  onChange={(e) => setNewContact({...newContact, starred: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="starred">Mark as starred</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingContact(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddContact}>
                Add Contact
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Header>

      <div className="p-4 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search contacts..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Contact Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterType(null)}>
                  All Contacts
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("Customer")}>
                  Customers Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("Vendor")}>
                  Vendors Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("Prospect")}>
                  Prospects Only
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setOnlyStarred(!onlyStarred)}>
                  {onlyStarred ? "Show All" : "Show Starred Only"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" size="sm" onClick={() => setSearchTerm("")}>
              Clear Filters
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full md:w-[400px]">
            <TabsTrigger value="all">All Contacts</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="prospects">Prospects</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <ContactCard 
                    key={contact.id}
                    contact={contact}
                    onToggleStar={() => toggleStarred(contact.id)}
                    onCall={() => callWhatsApp(contact.phone)}
                    onEmail={() => emailOutlook(contact.email)}
                    onDelete={() => deleteContact(contact.id)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <UserCircle className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">No contacts found</h3>
                  <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="customers" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContacts.filter(c => c.type === "Customer").length > 0 ? (
                filteredContacts
                  .filter(c => c.type === "Customer")
                  .map((contact) => (
                    <ContactCard 
                      key={contact.id}
                      contact={contact}
                      onToggleStar={() => toggleStarred(contact.id)}
                      onCall={() => callWhatsApp(contact.phone)}
                      onEmail={() => emailOutlook(contact.email)}
                      onDelete={() => deleteContact(contact.id)}
                    />
                  ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <Building className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">No customers found</h3>
                  <p className="text-sm text-gray-500 mt-1">Add some customers to see them here</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="vendors" className="mt-6">
            {/* Similar structure for vendors */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContacts.filter(c => c.type === "Vendor").length > 0 ? (
                filteredContacts
                  .filter(c => c.type === "Vendor")
                  .map((contact) => (
                    <ContactCard 
                      key={contact.id}
                      contact={contact}
                      onToggleStar={() => toggleStarred(contact.id)}
                      onCall={() => callWhatsApp(contact.phone)}
                      onEmail={() => emailOutlook(contact.email)}
                      onDelete={() => deleteContact(contact.id)}
                    />
                  ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <Building className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">No vendors found</h3>
                  <p className="text-sm text-gray-500 mt-1">Add some vendors to see them here</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="prospects" className="mt-6">
            {/* Similar structure for prospects */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContacts.filter(c => c.type === "Prospect").length > 0 ? (
                filteredContacts
                  .filter(c => c.type === "Prospect")
                  .map((contact) => (
                    <ContactCard 
                      key={contact.id}
                      contact={contact}
                      onToggleStar={() => toggleStarred(contact.id)}
                      onCall={() => callWhatsApp(contact.phone)}
                      onEmail={() => emailOutlook(contact.email)}
                      onDelete={() => deleteContact(contact.id)}
                    />
                  ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <Building className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">No prospects found</h3>
                  <p className="text-sm text-gray-500 mt-1">Add some prospects to see them here</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

interface ContactCardProps {
  contact: Contact;
  onToggleStar: () => void;
  onCall: () => void;
  onEmail: () => void;
  onDelete: () => void;
}

const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  onToggleStar,
  onCall,
  onEmail,
  onDelete
}) => {
  const getBadgeColor = (type: ContactType) => {
    switch (type) {
      case "Customer":
        return "bg-green-100 text-green-800 border-green-300";
      case "Vendor":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Prospect":
        return "bg-orange-100 text-orange-800 border-orange-300";
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 flex justify-between items-start">
          <div className="flex items-start space-x-3">
            <Avatar className="h-12 w-12">
              {contact.avatar ? (
                <AvatarImage src={contact.avatar} alt={contact.name} />
              ) : (
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {contact.name.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">{contact.name}</h3>
                <button
                  onClick={onToggleStar}
                  className="focus:outline-none"
                >
                  <Star className={`h-4 w-4 ${contact.starred ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                </button>
              </div>
              <Badge variant="outline" className={`mt-1 text-xs ${getBadgeColor(contact.type)}`}>
                {contact.type}
              </Badge>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={onToggleStar}>
                {contact.starred ? "Remove Star" : "Add Star"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Separator />
        
        <div className="p-4 space-y-2">
          {contact.position && contact.company && (
            <div className="flex items-start">
              <Building className="h-4 w-4 mt-0.5 mr-2 text-gray-500" />
              <div>
                <div className="text-sm">{contact.position}</div>
                <div className="text-sm font-medium">{contact.company}</div>
              </div>
            </div>
          )}
          
          <div className="flex items-start">
            <Phone className="h-4 w-4 mt-0.5 mr-2 text-gray-500" />
            <span className="text-sm">{contact.phone}</span>
          </div>
          
          {contact.email && (
            <div className="flex items-start">
              <Mail className="h-4 w-4 mt-0.5 mr-2 text-gray-500" />
              <span className="text-sm truncate max-w-[200px]">{contact.email}</span>
            </div>
          )}
          
          {contact.address && (
            <div className="flex items-start">
              <MapPin className="h-4 w-4 mt-0.5 mr-2 text-gray-500" />
              <span className="text-sm">{contact.address}</span>
            </div>
          )}
        </div>
        
        <div className="p-4 pt-0 flex space-x-2">
          <Button variant="secondary" size="sm" className="flex-1" onClick={onCall}>
            <Phone className="h-3 w-3 mr-1" /> WhatsApp
          </Button>
          <Button variant="secondary" size="sm" className="flex-1" onClick={onEmail}>
            <Mail className="h-3 w-3 mr-1" /> Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Contacts;
