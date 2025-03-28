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
  AlertTriangle,
  Calendar,
  Tag
} from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
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
const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Format percentage
const formatPercentage = (value: number | null) => {
  if (value === null) return "N/A";
  return `${value.toFixed(2)}%`;
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
    location: "",
    value: 0,
    unit_of_measure: "PCS",
    batch_number: "",
    hsn_code: "",
    supplier: "",
    reorder_level: 10,
    reorder_quantity: 20,
    stock_valuation_method: "FIFO",
    barcode: "",
    cgst_rate: 0,
    sgst_rate: 0,
    expiry_date: "",
    warehouse_id: null as number | null
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
        const [itemsData, metricsData] = await Promise.all([
          getInventoryItems(),
          getInventoryMetrics()
        ]);
        
        setItems(itemsData);
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
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.supplier && item.supplier.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.hsn_code && item.hsn_code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.batch_number && item.batch_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.barcode && item.barcode.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [id]: ['stock', 'value', 'reorder_level', 'reorder_quantity'].includes(id) ? Number(value) : value
    }));
  };
  
  // Handle form submission
  const handleAddItem = async () => {
    try {
      setIsAddingItem(true);
      
      // Validate form
      if (!newItem.name || !newItem.category || newItem.stock < 0 || !newItem.location || newItem.value <= 0) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields with valid values.",
          variant: "destructive"
        });
        return;
      }
      
      // Create new item
      const createdItem = await createInventoryItem({
        ...newItem,
        cgst_rate: 0,
        sgst_rate: 0,
        warehouse_id: null,
        expiry_date: null
      });
      
      // Update state
      setItems(prev => [...prev, createdItem]);
      
      // Reset form
      setNewItem({
        name: "",
        category: "",
        stock: 0,
        location: "",
        value: 0,
        unit_of_measure: "PCS",
        batch_number: "",
        hsn_code: "",
        supplier: "",
        reorder_level: 10,
        reorder_quantity: 20,
        stock_valuation_method: "FIFO",
        barcode: "",
        cgst_rate: 0,
        sgst_rate: 0,
        expiry_date: "",
        warehouse_id: null as number | null
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
  const handleUpdateStock = async (id: number, currentStock: number) => {
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
  const handleMoveItem = async (id: number, currentLocation: string) => {
    try {
      const newLocation = window.prompt(
        `Enter new location (current: ${currentLocation}):`,
        currentLocation
      );
      
      if (newLocation === null || newLocation === currentLocation) return; // User cancelled or no change
      
      // Update the item
      const updatedItem = await updateInventoryItem(id, { location: newLocation });
      
      // Update state
      setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
      
      // Show success message
      toast({
        title: "Success",
        description: `Item moved to ${newLocation}.`
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
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Inventory Item</DialogTitle>
                <DialogDescription>
                  Add a new item to your inventory system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input 
                      id="name" 
                      value={newItem.name}
                      onChange={handleInputChange}
                      placeholder="Item name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input 
                      id="category" 
                      value={newItem.category}
                      onChange={handleInputChange}
                      placeholder="Category"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input 
                      id="stock" 
                      type="number" 
                      value={newItem.stock}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="value">Value ($) *</Label>
                    <Input 
                      id="value" 
                      type="number" 
                      value={newItem.value}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input 
                      id="location" 
                      value={newItem.location}
                      onChange={handleInputChange}
                      placeholder="Storage location"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit_of_measure">Unit of Measure</Label>
                    <select 
                      id="unit_of_measure" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      value={newItem.unit_of_measure}
                      onChange={handleInputChange}
                    >
                      <option value="PCS">PCS (Pieces)</option>
                      <option value="UNITS">UNITS</option>
                      <option value="KG">KG (Kilograms)</option>
                      <option value="PACKS">PACKS</option>
                      <option value="BOXES">BOXES</option>
                      <option value="METERS">METERS</option>
                      <option value="LITERS">LITERS</option>
                      <option value="REAMS">REAMS</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batch_number">Batch Number</Label>
                    <Input 
                      id="batch_number" 
                      value={newItem.batch_number}
                      onChange={handleInputChange}
                      placeholder="Batch identification"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barcode">Barcode</Label>
                    <Input 
                      id="barcode" 
                      value={newItem.barcode}
                      onChange={handleInputChange}
                      placeholder="Item barcode"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Input 
                      id="supplier" 
                      value={newItem.supplier}
                      onChange={handleInputChange}
                      placeholder="Supplier name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hsn_code">HSN Code</Label>
                    <Input 
                      id="hsn_code" 
                      value={newItem.hsn_code}
                      onChange={handleInputChange}
                      placeholder="HSN code"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reorder_level">Reorder Level</Label>
                    <Input 
                      id="reorder_level" 
                      type="number" 
                      value={newItem.reorder_level}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reorder_quantity">Reorder Quantity</Label>
                    <Input 
                      id="reorder_quantity" 
                      type="number" 
                      value={newItem.reorder_quantity}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock_valuation_method">Valuation Method</Label>
                    <select 
                      id="stock_valuation_method" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      value={newItem.stock_valuation_method}
                      onChange={handleInputChange}
                    >
                      <option value="FIFO">FIFO (First In, First Out)</option>
                      <option value="LIFO">LIFO (Last In, First Out)</option>
                      <option value="AVG">Average Cost</option>
                      <option value="SPECIFIC">Specific Identification</option>
                    </select>
                  </div>
                  
                  {/* Additional fields for all Supabase inventory columns */}
                  <div className="space-y-2">
                    <Label htmlFor="cgst_rate">CGST Rate (%)</Label>
                    <Input 
                      id="cgst_rate" 
                      type="number" 
                      value={newItem.cgst_rate || 0}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sgst_rate">SGST Rate (%)</Label>
                    <Input 
                      id="sgst_rate" 
                      type="number" 
                      value={newItem.sgst_rate || 0}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry_date">Expiry Date</Label>
                    <Input 
                      id="expiry_date" 
                      type="date" 
                      value={newItem.expiry_date || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warehouse_id">Warehouse ID</Label>
                    <Input 
                      id="warehouse_id" 
                      type="number" 
                      value={newItem.warehouse_id || ''}
                      onChange={handleInputChange}
                      min="0"
                      placeholder="Optional"
                    />
                  </div>
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
                    <p className="text-xs text-muted-foreground">Items in inventory</p>
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
                    <CardTitle className="text-sm font-medium">Categories</CardTitle>
                    <Tag className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {new Set(items.map(item => item.category)).size}
                    </div>
                    <p className="text-xs text-muted-foreground">Unique product categories</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                    <PackageOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.lowStockItems}</div>
                    <p className="text-xs text-muted-foreground">Items below reorder level</p>
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
                  <ScrollArea className="overflow-x-auto" orientation="horizontal">
                    <div className="min-w-max">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Warehouse ID</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>CGST Rate</TableHead>
                            <TableHead>SGST Rate</TableHead>
                            <TableHead>Total GST</TableHead>
                            <TableHead>Stock Method</TableHead>
                            <TableHead>Reorder Level</TableHead>
                            <TableHead>Reorder Qty</TableHead>
                            <TableHead>Batch No.</TableHead>
                            <TableHead>HSN Code</TableHead>
                            <TableHead>Barcode</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead>Expiry Date</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredItems.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={22} className="text-center h-24">
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
                                    {item.stock < item.reorder_level ? (
                                      <span className="w-2 h-2 rounded-full bg-red-500 mr-2" title="Low stock"></span>
                                    ) : (
                                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2" title="Good stock level"></span>
                                    )}
                                    {item.stock}
                                  </div>
                                </TableCell>
                                <TableCell>{item.unit_of_measure}</TableCell>
                                <TableCell>{item.location}</TableCell>
                                <TableCell>{item.warehouse_id || 'N/A'}</TableCell>
                                <TableCell>{formatCurrency(item.value)}</TableCell>
                                <TableCell>{formatPercentage(item.cgst_rate)}</TableCell>
                                <TableCell>{formatPercentage(item.sgst_rate)}</TableCell>
                                <TableCell>{item.total_gst ? formatCurrency(item.total_gst) : 'N/A'}</TableCell>
                                <TableCell>{item.stock_valuation_method || 'FIFO'}</TableCell>
                                <TableCell>{item.reorder_level}</TableCell>
                                <TableCell>{item.reorder_quantity}</TableCell>
                                <TableCell>{item.batch_number || 'N/A'}</TableCell>
                                <TableCell>{item.hsn_code || 'N/A'}</TableCell>
                                <TableCell>{item.barcode || 'N/A'}</TableCell>
                                <TableCell>{item.supplier || 'N/A'}</TableCell>
                                <TableCell>{item.expiry_date ? formatDate(item.expiry_date) : 'N/A'}</TableCell>
                                <TableCell>{formatDate(item.last_updated)}</TableCell>
                                <TableCell>{formatDate(item.created_at)}</TableCell>
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
                                      <DropdownMenuItem onClick={() => handleMoveItem(item.id, item.location)}>
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
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="locations" className="border rounded-md mt-6 p-6 flex flex-col items-center justify-center min-h-[300px]">
                  <div className="flex flex-col items-center text-center max-w-md">
                    <Warehouse className="h-12 w-12 mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Warehouse Management</h3>
                    <p className="text-muted-foreground mb-4">
                      Create and manage warehouses and storage locations to organize your inventory efficiently.
                    </p>
                    <Button>Setup Warehouses</Button>
                  </div>
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
