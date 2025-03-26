
import React, { useState } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Header/Header";
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
import { 
  Package, 
  PackageOpen, 
  Warehouse, 
  Search, 
  Plus, 
  ArrowUpDown,
  MoreVertical,
  Boxes,
  RefreshCcw,
  BarChart3
} from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample inventory data
const inventoryItems = [
  { id: "INV001", name: "Professional Software License", category: "Digital", stock: 985, location: "Server 1", value: 1200, lastUpdated: "2023-08-15" },
  { id: "INV002", name: "Advanced Analytics Module", category: "Digital", stock: 756, location: "Server 2", value: 750, lastUpdated: "2023-08-14" },
  { id: "INV003", name: "Office Desk", category: "Furniture", stock: 12, location: "Warehouse A", value: 350, lastUpdated: "2023-08-10" },
  { id: "INV004", name: "Office Chair", category: "Furniture", stock: 24, location: "Warehouse A", value: 250, lastUpdated: "2023-08-09" },
  { id: "INV005", name: "Laptop - Dell XPS", category: "Hardware", stock: 18, location: "Tech Room", value: 1800, lastUpdated: "2023-08-07" },
  { id: "INV006", name: "Monitor - 27" 4K", category: "Hardware", stock: 15, location: "Tech Room", value: 400, lastUpdated: "2023-08-05" },
  { id: "INV007", name: "Keyboard Mechanical", category: "Hardware", stock: 32, location: "Storage B", value: 120, lastUpdated: "2023-08-03" },
  { id: "INV008", name: "Mouse Wireless", category: "Hardware", stock: 45, location: "Storage B", value: 80, lastUpdated: "2023-08-01" },
];

// Sample locations data
const locations = [
  { id: 1, name: "Warehouse A", address: "123 Main St, City", capacity: 1500, available: 650, itemCount: 350 },
  { id: 2, name: "Tech Room", address: "456 Office Blvd, City", capacity: 200, available: 75, itemCount: 125 },
  { id: 3, name: "Storage B", address: "789 Storage Ln, City", capacity: 800, available: 320, itemCount: 480 },
  { id: 4, name: "Server 1", address: "Digital", capacity: 1000, available: 15, itemCount: 985 },
  { id: 5, name: "Server 2", address: "Digital", capacity: 1000, available: 244, itemCount: 756 },
];

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter inventory items based on search query
  const filteredItems = inventoryItems.filter(
    item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate inventory metrics
  const totalItems = inventoryItems.reduce((sum, item) => sum + item.stock, 0);
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.stock * item.value), 0);
  const lowStockItems = inventoryItems.filter(item => item.stock < 20).length;
  
  return (
    <Layout>
      <Header 
        title="Inventory" 
        description="Manage products, stock levels, and locations."
      >
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Inventory Item</DialogTitle>
                <DialogDescription>
                  Add a new item to your inventory system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="item-name" className="text-right">
                    Name
                  </Label>
                  <Input id="item-name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Input id="category" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stock" className="text-right">
                    Stock
                  </Label>
                  <Input id="stock" type="number" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Input id="location" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="value" className="text-right">
                    Value ($)
                  </Label>
                  <Input id="value" type="number" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Item</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across {locations.length} locations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-muted-foreground">Total value of all items</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Storage Capacity</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(totalItems / (totalItems + locations.reduce((sum, loc) => sum + loc.available, 0)) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Of total capacity used</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <PackageOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Items with less than 20 units</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Inventory Management</h3>
        <div className="relative w-[350px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search inventory items..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="items" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="items" className="border rounded-md mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 text-xs rounded-full bg-muted">
                      {item.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {item.stock < 20 ? (
                        <span className="w-2 h-2 rounded-full bg-red-500 mr-2" title="Low stock"></span>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2" title="Good stock level"></span>
                      )}
                      {item.stock}
                    </div>
                  </TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{formatCurrency(item.value)}</TableCell>
                  <TableCell>{formatDate(item.lastUpdated)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <RefreshCcw className="h-4 w-4 mr-2" />
                          Update Stock
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowUpDown className="h-4 w-4 mr-2" />
                          Move Item
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="locations" className="border rounded-md mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Total Capacity</TableHead>
                <TableHead>Available Space</TableHead>
                <TableHead>Item Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell className="font-medium">{location.name}</TableCell>
                  <TableCell>{location.address}</TableCell>
                  <TableCell>{location.capacity.toLocaleString()} units</TableCell>
                  <TableCell>{location.available.toLocaleString()} units</TableCell>
                  <TableCell>{location.itemCount.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View Items</Button>
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
            <h3 className="text-lg font-medium mb-2">Inventory Analytics</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Track stock levels, inventory turnover, and other key metrics to optimize your inventory management.
            </p>
            <Button>View Reports</Button>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Inventory;
