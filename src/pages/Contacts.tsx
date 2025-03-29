
import React, { useState } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Header/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  Star, 
  Filter, 
  Download, 
  Upload, 
  MoreHorizontal,
  Star as StarIcon,
  Building,
  User,
  MapPin
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock contact data
const contactsData = [
  {
    id: 1,
    name: "John Doe",
    avatar: "JD",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Inc.",
    position: "CEO",
    address: "123 Business Ave, New York, NY",
    type: "Customer",
    starred: true,
    tags: ["VIP", "Enterprise"],
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "JS",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    company: "Tech Solutions Ltd.",
    position: "CTO",
    address: "456 Tech Blvd, San Francisco, CA",
    type: "Customer",
    starred: false,
    tags: ["Enterprise"],
  },
  {
    id: 3,
    name: "Mike Johnson",
    avatar: "MJ",
    email: "mike.johnson@example.com",
    phone: "+1 (555) 567-8901",
    company: "Supply Chain Co.",
    position: "Purchasing Manager",
    address: "789 Commerce St, Chicago, IL",
    type: "Vendor",
    starred: true,
    tags: ["Supplier"],
  },
  {
    id: 4,
    name: "Lisa Brown",
    avatar: "LB",
    email: "lisa.brown@example.com",
    phone: "+1 (555) 234-5678",
    company: "Marketing Experts",
    position: "Marketing Director",
    address: "321 Media Lane, Austin, TX",
    type: "Prospect",
    starred: false,
    tags: ["Lead", "Marketing"],
  },
  {
    id: 5,
    name: "David Miller",
    avatar: "DM",
    email: "david.miller@example.com",
    phone: "+1 (555) 345-6789",
    company: "Financial Services Inc.",
    position: "Financial Advisor",
    address: "654 Money Way, Boston, MA",
    type: "Customer",
    starred: false,
    tags: ["Finance"],
  },
];

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
  const [contacts, setContacts] = useState<Contact[]>(contactsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filter, setFilter] = useState<ContactType | "All">("All");
  const [newContact, setNewContact] = useState<Omit<Contact, "id" | "avatar">>({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    address: "",
    type: "Customer",
    starred: false,
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");

  const handleClearForm = () => {
    setNewContact({
      name: "",
      email: "",
      phone: "",
      company: "",
      position: "",
      address: "",
      type: "Customer",
      starred: false,
      tags: [],
    });
    setTagInput("");
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.email || !newContact.phone) {
      return; // In a real app, show validation errors
    }

    const avatar = newContact.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    const newContactWithId = {
      ...newContact,
      id: contacts.length > 0 ? Math.max(...contacts.map((c) => c.id)) + 1 : 1,
      avatar,
    };

    setContacts([newContactWithId, ...contacts]);
    setIsAddDialogOpen(false);
    handleClearForm();
  };

  const handleToggleStar = (id: number) => {
    setContacts(
      contacts.map((contact) =>
        contact.id === id
          ? { ...contact, starred: !contact.starred }
          : contact
      )
    );
  };

  const handleDeleteContact = (id: number) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
    if (selectedContact?.id === id) {
      setSelectedContact(null);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !newContact.tags.includes(tagInput.trim())) {
      setNewContact({
        ...newContact,
        tags: [...newContact.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewContact({
      ...newContact,
      tags: newContact.tags.filter((t) => t !== tag),
    });
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filter === "All" || contact.type === filter;

    return matchesSearch && matchesFilter;
  });

  const handleCallViaWhatsApp = (phone: string) => {
    // In a real app, this would open WhatsApp with the appropriate phone number
    window.open(`https://wa.me/${phone.replace(/\D/g, "")}`, "_blank");
  };

  const handleEmailViaOutlook = (email: string) => {
    // In a real app, this would open Outlook with the appropriate email
    window.open(`mailto:${email}`, "_blank");
  };

  return (
    <Layout>
      <Header 
        title="Contacts" 
        description="Manage your contacts and keep in touch with customers, vendors, and prospects."
      >
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
              <DialogDescription>
                Fill out the form below to add a new contact to your list.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-right">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    value={newContact.name}
                    onChange={(e) =>
                      setNewContact({ ...newContact, name: e.target.value })
                    }
                    placeholder="Full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-right">
                    Contact Type *
                  </Label>
                  <Select
                    value={newContact.type}
                    onValueChange={(value: ContactType) =>
                      setNewContact({ ...newContact, type: value })
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Customer">Customer</SelectItem>
                      <SelectItem value="Vendor">Vendor</SelectItem>
                      <SelectItem value="Prospect">Prospect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-right">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newContact.email}
                    onChange={(e) =>
                      setNewContact({ ...newContact, email: e.target.value })
                    }
                    placeholder="Email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-right">
                    Phone *
                  </Label>
                  <Input
                    id="phone"
                    value={newContact.phone}
                    onChange={(e) =>
                      setNewContact({ ...newContact, phone: e.target.value })
                    }
                    placeholder="Phone number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-right">
                    Company
                  </Label>
                  <Input
                    id="company"
                    value={newContact.company}
                    onChange={(e) =>
                      setNewContact({ ...newContact, company: e.target.value })
                    }
                    placeholder="Company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position" className="text-right">
                    Position
                  </Label>
                  <Input
                    id="position"
                    value={newContact.position}
                    onChange={(e) =>
                      setNewContact({ ...newContact, position: e.target.value })
                    }
                    placeholder="Job title"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={newContact.address}
                  onChange={(e) =>
                    setNewContact({ ...newContact, address: e.target.value })
                  }
                  placeholder="Full address"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="tags" className="text-right">
                    Tags
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag"
                      className="w-40"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleAddTag}
                    >
                      Add
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newContact.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="px-2 py-1">
                      {tag}
                      <button
                        type="button"
                        className="ml-1 text-muted-foreground"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="starred"
                  checked={newContact.starred}
                  onChange={(e) =>
                    setNewContact({ ...newContact, starred: e.target.checked })
                  }
                  className="mr-2"
                />
                <Label htmlFor="starred" className="cursor-pointer">
                  Mark as starred contact
                </Label>
              </div>
            </div>

            <DialogFooter className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  handleClearForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddContact}>Add Contact</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Search and filter sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search contacts..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div>
                <Label className="block mb-2">Filter by Type</Label>
                <Tabs
                  defaultValue="All"
                  value={filter}
                  onValueChange={(value) => setFilter(value as ContactType | "All")}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="All">All</TabsTrigger>
                    <TabsTrigger value="Customer">Customers</TabsTrigger>
                    <TabsTrigger value="Vendor">Vendors</TabsTrigger>
                    <TabsTrigger value="Prospect">Prospects</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="flex-1">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </div>

              <div className="pt-4 mt-4 border-t">
                <h3 className="font-medium text-sm mb-2">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-muted rounded">
                    <div className="text-xs text-muted-foreground">Total</div>
                    <div className="text-xl font-semibold">{contacts.length}</div>
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <div className="text-xs text-muted-foreground">Customers</div>
                    <div className="text-xl font-semibold">
                      {contacts.filter((c) => c.type === "Customer").length}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contacts list */}
        <div className="md:col-span-2">
          {filteredContacts.length === 0 ? (
            <div className="text-center p-8 border rounded-lg bg-white">
              <div className="text-muted-foreground mb-2">No contacts found</div>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setFilter("All");
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContacts.map((contact) => (
                <Card key={contact.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <div className="flex space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-lg">
                            {contact.avatar}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{contact.name}</h3>
                            <button
                              onClick={() => handleToggleStar(contact.id)}
                              className="ml-2"
                            >
                              <Star
                                className={`h-4 w-4 ${
                                  contact.starred
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </button>
                            <Badge
                              variant="outline"
                              className="ml-2"
                            >
                              {contact.type}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Phone className="h-3.5 w-3.5 mr-1" />
                              {contact.phone}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Mail className="h-3.5 w-3.5 mr-1" />
                              {contact.email}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Building className="h-3.5 w-3.5 mr-1" />
                              {contact.company}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <User className="h-3.5 w-3.5 mr-1" />
                              {contact.position}
                            </div>
                          </div>
                          <div className="flex items-start text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3.5 w-3.5 mr-1 mt-0.5" />
                            <span className="line-clamp-1">{contact.address}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {contact.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleCallViaWhatsApp(contact.phone)}
                            title="WhatsApp Call"
                          >
                            <Phone className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEmailViaOutlook(contact.email)}
                            title="Email with Outlook"
                          >
                            <Mail className="h-4 w-4 text-blue-600" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => setSelectedContact(contact)}
                              >
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteContact(contact.id)}
                              >
                                Delete Contact
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact Details Dialog */}
      {selectedContact && (
        <Dialog
          open={!!selectedContact}
          onOpenChange={(open) => !open && setSelectedContact(null)}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-lg mr-2">
                  {selectedContact.avatar}
                </div>
                {selectedContact.name}
                {selectedContact.starred && (
                  <StarIcon className="ml-2 h-4 w-4 fill-yellow-400 text-yellow-400" />
                )}
              </DialogTitle>
              <DialogDescription>
                {selectedContact.position} at {selectedContact.company}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-sm">Phone</Label>
                  <div className="font-medium flex items-center">
                    {selectedContact.phone}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 ml-1"
                      onClick={() => handleCallViaWhatsApp(selectedContact.phone)}
                    >
                      <Phone className="h-4 w-4 text-green-600" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Email</Label>
                  <div className="font-medium flex items-center">
                    {selectedContact.email}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 ml-1"
                      onClick={() => handleEmailViaOutlook(selectedContact.email)}
                    >
                      <Mail className="h-4 w-4 text-blue-600" />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm">Company</Label>
                <div className="font-medium">{selectedContact.company}</div>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm">Address</Label>
                <div className="font-medium">{selectedContact.address}</div>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm">
                  Contact Type
                </Label>
                <div>
                  <Badge variant="outline">{selectedContact.type}</Badge>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm">Tags</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedContact.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSelectedContact(null)}
              >
                Close
              </Button>
              <Button>Edit Contact</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
};

export default Contacts;
