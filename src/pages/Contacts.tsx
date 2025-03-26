
import React, { useState } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Header/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus,
  Mail,
  Phone,
  User,
  Building,
  MapPin,
  MoreHorizontal,
  Star,
  StarOff,
  Filter
} from "lucide-react";

const contactsData = [
  {
    id: 1,
    name: "John Doe",
    avatar: "JD",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Inc.",
    position: "CEO",
    address: "123 Main St, New York, NY",
    starred: true,
    type: "customer"
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "JS",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    company: "TechCorp",
    position: "CTO",
    address: "456 Tech Ave, San Francisco, CA",
    starred: false,
    type: "vendor"
  },
  {
    id: 3,
    name: "Robert Johnson",
    avatar: "RJ",
    email: "robert.johnson@example.com",
    phone: "+1 (555) 555-5555",
    company: "Global Industries",
    position: "Sales Manager",
    address: "789 Business Blvd, Chicago, IL",
    starred: true,
    type: "customer"
  },
  {
    id: 4,
    name: "Emily Davis",
    avatar: "ED",
    email: "emily.davis@example.com",
    phone: "+1 (555) 222-3333",
    company: "Design Studio",
    position: "Lead Designer",
    address: "321 Creative St, Austin, TX",
    starred: false,
    type: "vendor"
  },
  {
    id: 5,
    name: "Michael Wilson",
    avatar: "MW",
    email: "michael.wilson@example.com",
    phone: "+1 (555) 444-7777",
    company: "Finance Partners",
    position: "Financial Advisor",
    address: "555 Money Lane, Boston, MA",
    starred: false,
    type: "prospect"
  },
  {
    id: 6,
    name: "Sarah Brown",
    avatar: "SB",
    email: "sarah.brown@example.com",
    phone: "+1 (555) 888-9999",
    company: "Marketing Experts",
    position: "Marketing Director",
    address: "999 Brand Ave, Seattle, WA",
    starred: true,
    type: "customer"
  },
];

const Contacts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState(contactsData[0]);
  const [contactsList, setContactsList] = useState(contactsData);

  const handleToggleStar = (id: number) => {
    setContactsList(prevContacts => 
      prevContacts.map(contact => 
        contact.id === id 
          ? { ...contact, starred: !contact.starred } 
          : contact
      )
    );
    
    if (selectedContact.id === id) {
      setSelectedContact(prev => ({ ...prev, starred: !prev.starred }));
    }
  };

  const filteredContacts = contactsList.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <Header 
        title="Contacts" 
        description="Manage your contacts and client relationships."
      >
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </Header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-12rem)]">
        {/* Contacts List */}
        <div className="md:col-span-1 border rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="p-3 border-b">
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" size="sm" className="text-xs">
                <Filter className="h-3 w-3 mr-1" />
                Filter
              </Button>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="text-xs">All</Button>
                <Button variant="outline" size="sm" className="text-xs">Customers</Button>
                <Button variant="outline" size="sm" className="text-xs">Vendors</Button>
              </div>
            </div>
          </div>
          
          <div className="overflow-y-auto max-h-[calc(100vh-16rem)]">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="starred" className="flex-1">Starred</TabsTrigger>
                <TabsTrigger value="recent" className="flex-1">Recent</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="m-0">
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <div 
                      key={contact.id} 
                      className={`flex items-center p-3 hover:bg-muted cursor-pointer border-b ${selectedContact.id === contact.id ? 'bg-muted' : ''}`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground mr-3">
                        {contact.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium truncate">{contact.name}</h4>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-yellow-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStar(contact.id);
                            }}
                          >
                            {contact.starred ? <Star className="h-4 w-4 fill-yellow-500" /> : <StarOff className="h-4 w-4" />}
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{contact.company}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No contacts found
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="starred" className="m-0">
                {filteredContacts.filter(c => c.starred).length > 0 ? (
                  filteredContacts
                    .filter(contact => contact.starred)
                    .map((contact) => (
                      <div 
                        key={contact.id} 
                        className={`flex items-center p-3 hover:bg-muted cursor-pointer border-b ${selectedContact.id === contact.id ? 'bg-muted' : ''}`}
                        onClick={() => setSelectedContact(contact)}
                      >
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground mr-3">
                          {contact.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium truncate">{contact.name}</h4>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-yellow-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStar(contact.id);
                              }}
                            >
                              <Star className="h-4 w-4 fill-yellow-500" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{contact.company}</p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No starred contacts
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="recent" className="m-0">
                {filteredContacts.slice(0, 3).length > 0 ? (
                  filteredContacts
                    .slice(0, 3)
                    .map((contact) => (
                      <div 
                        key={contact.id} 
                        className={`flex items-center p-3 hover:bg-muted cursor-pointer border-b ${selectedContact.id === contact.id ? 'bg-muted' : ''}`}
                        onClick={() => setSelectedContact(contact)}
                      >
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground mr-3">
                          {contact.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium truncate">{contact.name}</h4>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-yellow-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStar(contact.id);
                              }}
                            >
                              {contact.starred ? <Star className="h-4 w-4 fill-yellow-500" /> : <StarOff className="h-4 w-4" />}
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{contact.company}</p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No recent contacts
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Contact Details */}
        <div className="md:col-span-2 border rounded-lg bg-white shadow-sm overflow-hidden">
          {selectedContact ? (
            <>
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">Contact Details</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold mb-3">
                      {selectedContact.avatar}
                    </div>
                    <h2 className="text-xl font-semibold">{selectedContact.name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedContact.position}</p>
                    <p className="text-sm font-medium mt-1">{selectedContact.company}</p>
                    <div className="mt-3 flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleToggleStar(selectedContact.id)}
                      >
                        {selectedContact.starred ? (
                          <>
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                            Starred
                          </>
                        ) : (
                          <>
                            <Star className="h-4 w-4 mr-1" />
                            Star
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Tag
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Email</p>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p>{selectedContact.email}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p>{selectedContact.phone}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Company</p>
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p>{selectedContact.company}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Position</p>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p>{selectedContact.position}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Address</p>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                        <p>{selectedContact.address}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Type</h4>
                      <div className="flex gap-2">
                        <Button 
                          variant={selectedContact.type === "customer" ? "default" : "outline"} 
                          size="sm"
                          className="rounded-full"
                        >
                          Customer
                        </Button>
                        <Button 
                          variant={selectedContact.type === "vendor" ? "default" : "outline"} 
                          size="sm"
                          className="rounded-full"
                        >
                          Vendor
                        </Button>
                        <Button 
                          variant={selectedContact.type === "prospect" ? "default" : "outline"} 
                          size="sm"
                          className="rounded-full"
                        >
                          Prospect
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 border-t pt-6">
                  <Tabs defaultValue="activity">
                    <TabsList>
                      <TabsTrigger value="activity">Activity</TabsTrigger>
                      <TabsTrigger value="notes">Notes</TabsTrigger>
                      <TabsTrigger value="files">Files</TabsTrigger>
                      <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="activity" className="py-4">
                      <div className="text-center text-muted-foreground py-8">
                        <p>No recent activity</p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="notes" className="py-4">
                      <div className="text-center text-muted-foreground py-8">
                        <p>No notes available</p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="files" className="py-4">
                      <div className="text-center text-muted-foreground py-8">
                        <p>No files uploaded</p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="tasks" className="py-4">
                      <div className="text-center text-muted-foreground py-8">
                        <p>No tasks assigned</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              Select a contact to view details
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Contacts;
