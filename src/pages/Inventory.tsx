import React, { useState, useEffect } from "react";
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
  BarChart3,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { 
  getInventoryItems, 
  getLocations, 
  getInventoryMetrics,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  createLocation,
  InventoryItem,
  Location
} from "@/services/inventoryService";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [metrics, setMetrics] = useState({
    totalItems: 0,
    totalValue: 0,
    lowStockItems: 0,
    capacityUsagePercentage: 0,
    locationCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    stock: 0,
    location_id: 0,
    value: 0
  });
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [supabaseConfigured, setSupabaseConfigured] = useState(true);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        setSupabaseConfigured(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [itemsData, locationsData, metricsData] = await Promise.all([
          getInventoryItems(),
          getLocations(),
          getInventoryMetrics()
        ]);
        
        setItems(itemsData);
        setLocations(locationsData);
        setMetrics(metricsData);
      } catch (error) {
        console.error("Error loading inventory data:", error);
        toast({
          title: "Error",
          description: "Failed to load inventory data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Filter inventory items based on search query
  const filteredItems = items.filter(
    item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [id]: id === 'stock' || id === 'value' || id === 'location_id' ? Number(value) : value
    }));
  };
  
  // Handle form submission
  const handleAddItem = async () => {
    try {
      setIsAddingItem(true);
      
      // Validate form
      if (!newItem.name || !newItem.category || newItem.stock < 0 || !newItem.location_id || newItem.value <= 0) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields with valid values.",
          variant: "destructive"
        });
        return;
      }
      
      // Get location name for display
      const location = locations.find(loc => loc.id === newItem.location_id);
      if (!location) {
        toast({
          title: "Error",
          description: "Selected location not found.",
          variant: "destructive"
        });
        return;
      }
      
      // Create new item
      const createdItem = await createInventoryItem({
        ...newItem,
        location: location.name,
        last_updated: new Date().toISOString()
      });
      
      // Update state
      setItems(prev => [...prev, createdItem]);
      
      // Reset form
      setNewItem({
        name: "",
        category: "",
        stock: 0,
        location_id: 0,
        value: 0
      });
      
      // Show success message
      toast({
        title: "Success",
        description: "Inventory item added successfully."
      });
      
      // Refresh metrics
      const updatedMetrics = await getInventoryMetrics();
      setMetrics(updatedMetrics);
      
    } catch (error) {
      console.error("Error adding inventory item:", error);
      toast({
        title: "Error",
        description: "Failed to add inventory item. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAddingItem(false);
    }
  };
  
  // Handle updating stock
  const handleUpdateStock = async (id: string, currentStock: number) => {
    try {
      const newStock = window.prompt("Enter new stock quantity:", currentStock.toString());
      
      if (newStock === null) return; // User cancelled
      
      const stockNumber = parseInt(newStock);
      if (isNaN(stockNumber) || stockNumber < 0) {
        toast({
          title: "Invalid Input",
          description: "Please enter a valid number greater than or equal to 0.",
          variant: "destructive"
        });
        return;
      }
      
      // Update the item
      const updatedItem = await updateInventoryItem(id, { stock: stockNumber });
      
      // Update state
      setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
      
      // Show success message
      toast({
        title: "Success",
        description: `Stock updated to ${stockNumber}.`
      });
      
      // Refresh metrics
      const updatedMetrics = await getInventoryMetrics();
      setMetrics(updatedMetrics);
      
    } catch (error) {
      console.error("Error updating stock:", error);
      toast({
        title: "Error",
        description: "Failed to update stock. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle moving item
  const handleMoveItem = async (id: string, currentLocationId: number) => {
    try {
      // Create a simple dropdown with available locations
      const locationOptions = locations
        .filter(loc => loc.id !== currentLocationId)
        .map(loc => `<option value="${loc.id}">${loc.name}</option>`)
        .join('');
      
      const newLocationInput = window.prompt(
        `Select new location:\n${locations.map(loc => `${loc.id}: ${loc.name}`).join('\n')}`,
        ""
      );
      
      if (newLocationInput === null) return; // User cancelled
      
      const newLocationId = parseInt(newLocationInput);
      if (isNaN(newLocationId) || !locations.some(loc => loc.id === newLocationId)) {
        toast({
          title: "Invalid Input",
          description: "Please select a valid location.",
          variant: "destructive"
        });
        return;
      }
      
      const newLocation = locations.find(loc => loc.id === newLocationId);
      
      // Update the item
      const updatedItem = await updateInventoryItem(id, { 
        location_id: newLocationId,
        location: newLocation?.name || ""
      });
      
      // Update state
      setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
      
      // Show success message
      toast({
        title: "Success",
        description: `Item moved to ${newLocation?.name}.`
      });
      
    } catch (error) {
      console.error("Error moving item:", error);
      toast({
        title: "Error",
        description: "Failed to move item. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Layout>
      <Header 
        title="Inventory" 
        description="Manage products, stock levels, and locations."
      >
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" disabled={!supabaseConfigured}>
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
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input 
                    id="name" 
                    className="col-span-3" 
                    value={newItem.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Input 
                    id="category" 
                    className="col-span-3" 
                    value={newItem.category}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stock" className="text-right">
                    Stock
                  </Label>
                  <Input 
                    id="stock" 
                    type="number" 
                    className="col-span-3" 
                    value={newItem.stock}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location_id" className="text-right">
                    Location
                  </Label>
                  <select 
                    id="location_id" 
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={newItem.location_id}
                    onChange={(e) => setNewItem({...newItem, location_id: Number(e.target.value)})}
                  >
                    <option value={0}>Select a location</option>
                    {locations.map(location => (
                      <option key={location.id} value={location.id}>{location.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="value" className="text-right">
                    Value ($)
                  </Label>
                  <Input 
                    id="value" 
                    type="number" 
                    className="col-span-3" 
                    value={newItem.value}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  onClick={handleAddItem} 
                  disabled={isAddingItem}
                >
                  {isAddingItem && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Item
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Header>

      {!supabaseConfigured && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Supabase Configuration Missing</AlertTitle>
          <AlertDescription>
            <p>You need to add your Supabase credentials to connect to the database.</p>
            <ol className="list-decimal ml-6 mt-2">
              <li>Create a Supabase project at <a href="https://app.supabase.io" target="_blank" rel="noopener noreferrer" className="underline">https://app.supabase.io</a></li>
              <li>Set up database tables according to the instructions in <code>supabase-setup.md</code></li>
              <li>Create a <code>.env</code> file in the project root with the following variables:</li>
            </ol>
            <pre className="bg-slate-800 text-white p-3 rounded mt-2 overflow-x-auto">
              VITE_SUPABASE_URL=https://your-project-url.supabase.co
              VITE_SUPABASE_ANON_KEY=your-anon-key
            </pre>
            <p className="mt-2">Restart your development server after setting up the environment variables.</p>
          </AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading inventory data...</span>
        </div>
      ) : (
        <>
          {supabaseConfigured && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                    <Boxes className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.totalItems.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Across {metrics.locationCount} locations</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(metrics.totalValue)}</div>
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
                      {metrics.capacityUsagePercentage}%
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
                    <div className="text-2xl font-bold">{metrics.lowStockItems}</div>
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
                      {filteredItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center h-24">
                            No inventory items found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredItems.map((item) => (
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
                            <TableCell>{formatDate(item.last_updated)}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleUpdateStock(item.id, item.stock)}>
                                    <RefreshCcw className="h-4 w-4 mr-2" />
                                    Update Stock
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleMoveItem(item.id, item.location_id)}>
                                    <ArrowUpDown className="h-4 w-4 mr-2" />
                                    Move Item
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
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
                      {locations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center h-24">
                            No locations found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        locations.map((location) => (
                          <TableRow key={location.id}>
                            <TableCell className="font-medium">{location.name}</TableCell>
                            <TableCell>{location.address}</TableCell>
                            <TableCell>{location.capacity.toLocaleString()} units</TableCell>
                            <TableCell>{location.available.toLocaleString()} units</TableCell>
                            <TableCell>{location.item_count.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">View Items</Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
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
            </>
          )}
        </>
      )}
    </Layout>
  );
};

export default Inventory;
