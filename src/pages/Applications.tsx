
import React from "react";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Header/Header";
import { AppCard } from "@/components/AppCard/AppCard";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus,
  MessageCircle,
  ShoppingCart,
  FileText,
  Calendar,
  Users,
  TrendingUp,
  Settings,
  Database,
  Box,
  LayoutGrid,
  Mail,
  Phone
} from "lucide-react";

const appCategories = [
  {
    name: "All",
    value: "all",
  },
  {
    name: "Sales",
    value: "sales",
  },
  {
    name: "Productivity",
    value: "productivity",
  },
  {
    name: "Marketing",
    value: "marketing",
  },
  {
    name: "Finance",
    value: "finance",
  },
];

const apps = [
  {
    id: 1,
    title: "Messaging",
    description: "Team chat, channels and instant messaging",
    icon: MessageCircle,
    category: "productivity",
    color: "blue",
  },
  {
    id: 2,
    title: "Sales",
    description: "CRM, quotes, orders and invoices",
    icon: ShoppingCart,
    category: "sales",
    color: "orange",
  },
  {
    id: 3,
    title: "Documents",
    description: "Create, share and collaborate on documents",
    icon: FileText,
    category: "productivity",
    color: "green",
  },
  {
    id: 4,
    title: "Calendar",
    description: "Scheduling and time management",
    icon: Calendar,
    category: "productivity",
    color: "blue",
  },
  {
    id: 5,
    title: "Contacts",
    description: "Manage contacts and client relationships",
    icon: Users,
    category: "sales",
    color: "purple",
  },
  {
    id: 6,
    title: "Analytics",
    description: "Business intelligence and reporting",
    icon: TrendingUp,
    category: "finance",
    color: "indigo",
  },
  {
    id: 7,
    title: "Settings",
    description: "Configure system preferences",
    icon: Settings,
    category: "productivity",
    color: "gray",
  },
  {
    id: 8,
    title: "Inventory",
    description: "Stock management and logistics",
    icon: Database,
    category: "sales",
    color: "yellow",
  },
  {
    id: 9,
    title: "Products",
    description: "Product catalog and management",
    icon: Box,
    category: "sales",
    color: "pink",
  },
  {
    id: 10,
    title: "Website",
    description: "Website builder and content management",
    icon: LayoutGrid,
    category: "marketing",
    color: "teal",
  },
  {
    id: 11,
    title: "Email Marketing",
    description: "Create and send email campaigns",
    icon: Mail,
    category: "marketing",
    color: "red",
  },
  {
    id: 12,
    title: "Helpdesk",
    description: "Customer support and ticketing",
    icon: Phone,
    category: "sales",
    color: "blue",
  },
];

const Applications = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredApps = (category: string) => {
    return apps.filter((app) => {
      const matchesCategory = category === "all" || app.category === category;
      const matchesSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  };

  return (
    <Layout>
      <Header 
        title="Applications" 
        description="Discover and launch business applications."
      >
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Install App
        </Button>
      </Header>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applications..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          {appCategories.map((category) => (
            <TabsTrigger key={category.value} value={category.value}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {appCategories.map((category) => (
          <TabsContent key={category.value} value={category.value}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredApps(category.value).map((app, index) => (
                <AppCard
                  key={app.id}
                  title={app.title}
                  description={app.description}
                  icon={app.icon}
                  color={app.color}
                  onClick={() => {
                    console.log(`Opening ${app.title}`);
                    // Navigate to app page (if implemented)
                  }}
                />
              ))}
            </div>
            
            {filteredApps(category.value).length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No applications found. Try adjusting your search.</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </Layout>
  );
};

export default Applications;
