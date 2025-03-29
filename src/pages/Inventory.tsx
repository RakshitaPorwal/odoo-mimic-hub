
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw, Edit, Copy, Trash, FilePlus, Search, Filter, Download, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInventoryItems, createInventoryItem, updateInventoryItem, deleteInventoryItem } from "@/services/inventoryService";
import { Layout } from "@/components/Layout/Layout";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Header } from "@/components/Header/Header";
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
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Inventory() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [stockFilter, setStockFilter] = useState<string>("");

  // Form state for new inventory item
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    stock: 0,
    value: 0,
    location: "",
    supplier: "",
    unit_of_measure: "PCS",
    hsn_code: "",
    batch_number: "",
    reorder_level: 10,
    reorder_quantity: 20,
    stock_valuation_method: "FIFO",
    cgst_rate: 0,
    sgst_rate: 0
  });

  const { data: items, isLoading, error, refetch } = useQuery({
    queryKey: ["inventory"],
    queryFn: getInventoryItems,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Inventory item created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create inventory item: " + error,
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast({
        title: "Success",
        description: "Inventory item deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete inventory item: " + error,
        variant: "destructive",
      });
    },
  });

  // Category and location lists for filtering
  const categories = items ? [...new Set(items.map(item => item.category).filter(Boolean))] : [];
  const locations = items ? [...new Set(items.map(item => item.location).filter(Boolean))] : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let parsedValue = value;
    
    // Parse numeric values
    if (["stock", "value", "reorder_level", "reorder_quantity", "cgst_rate", "sgst_rate"].includes(name)) {
      parsedValue = parseFloat(value) || 0;
    }
    
    setFormData({ ...formData, [name]: parsedValue });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      stock: 0,
      value: 0,
      location: "",
      supplier: "",
      unit_of_measure: "PCS",
      hsn_code: "",
      batch_number: "",
      reorder_level: 10,
      reorder_quantity: 20,
      stock_valuation_method: "FIFO",
      cgst_rate: 0,
      sgst_rate: 0
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate(id);
    }
  };

  // Filter items based on search term and other filters
  const filteredItems = items?.filter(
    (item) => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false; // Fallback for null/undefined cases
      
      const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
      const matchesLocation = locationFilter ? item.location === locationFilter : true;
      
      let matchesStock = true;
      if (stockFilter === "low") {
        matchesStock = (item.stock || 0) <= (item.reorder_level || 0);
      } else if (stockFilter === "out") {
        matchesStock = (item.stock || 0) === 0;
      } else if (stockFilter === "in") {
        matchesStock = (item.stock || 0) > 0;
      }
      
      return matchesSearch && matchesCategory && matchesLocation && matchesStock;
    }
  ) || [];

  return (
    <Layout>
      <Header 
        title="Inventory Management" 
        description="Track and manage your inventory items"
      >
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </Header>

      <div className="container mx-auto py-4 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{items?.length || 0}</div>
            </CardContent>
          </Card>
          
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {items?.filter(item => (item.stock || 0) <= (item.reorder_level || 0) && (item.stock || 0) > 0).length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {items?.filter(item => (item.stock || 0) === 0).length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(items?.reduce((acc, item) => acc + ((item.stock || 0) * (item.value || 0)), 0) || 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading inventory...</span>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load inventory items. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle>Inventory Items</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => refetch()}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // Handle export functionality
                        toast({
                          title: "Export started",
                          description: "Your inventory export is being prepared.",
                        });
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" /> Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search items..." 
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Select 
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category || "unknown"}>
                            {category || "Uncategorized"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={locationFilter}
                      onValueChange={setLocationFilter}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Locations</SelectItem>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location || "unknown"}>
                            {location || "Unspecified"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={stockFilter}
                      onValueChange={setStockFilter}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Stock Levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Stock Levels</SelectItem>
                        <SelectItem value="in">In Stock</SelectItem>
                        <SelectItem value="low">Low Stock</SelectItem>
                        <SelectItem value="out">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm("");
                        setCategoryFilter("");
                        setLocationFilter("");
                        setStockFilter("");
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
                
                <Tabs defaultValue="table" className="w-full">
                  <TabsList>
                    <TabsTrigger value="table">Table View</TabsTrigger>
                    <TabsTrigger value="grid">Grid View</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="table" className="mt-4">
                    <ScrollArea className="h-[calc(100vh-26rem)]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Stock</TableHead>
                            <TableHead className="text-right">Value</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                  {item.name}
                                  {item.description && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {item.description}
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {item.category || "—"}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex flex-col items-end">
                                    <span>{item.stock || 0}</span>
                                    {(item.stock || 0) <= (item.reorder_level || 0) ? (
                                      <Badge 
                                        variant="outline" 
                                        className="bg-red-100 text-red-800 mt-1"
                                      >
                                        Low Stock
                                      </Badge>
                                    ) : null}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(item.value || 0)}
                                </TableCell>
                                <TableCell>
                                  {item.location || "—"}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end items-center space-x-2">
                                    <Button variant="ghost" size="icon">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handleDelete(item.id)}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                          <span className="sr-only">Open menu</span>
                                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                          </svg>
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem>
                                          <Copy className="h-4 w-4 mr-2" /> Copy ID
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <FilePlus className="h-4 w-4 mr-2" /> Create Invoice
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-6">
                                No inventory items found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="grid" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                          <Card key={item.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{item.name}</h3>
                                  {item.category && (
                                    <Badge variant="outline" className="mt-1">
                                      {item.category}
                                    </Badge>
                                  )}
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <span className="sr-only">Open menu</span>
                                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                      </svg>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem>
                                      <Edit className="h-4 w-4 mr-2" /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDelete(item.id)}>
                                      <Trash className="h-4 w-4 mr-2" /> Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              
                              {item.description && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  {item.description}
                                </p>
                              )}
                              
                              <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="space-y-1">
                                  <p className="text-xs text-muted-foreground">Stock</p>
                                  <div className="flex items-center">
                                    <span className="font-medium">{item.stock || 0}</span>
                                    {(item.stock || 0) <= (item.reorder_level || 0) && (
                                      <Badge 
                                        variant="outline" 
                                        className="bg-red-100 text-red-800 ml-2"
                                      >
                                        Low
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="space-y-1">
                                  <p className="text-xs text-muted-foreground">Value</p>
                                  <p className="font-medium">{formatCurrency(item.value || 0)}</p>
                                </div>
                                
                                <div className="space-y-1">
                                  <p className="text-xs text-muted-foreground">Location</p>
                                  <p>{item.location || "—"}</p>
                                </div>
                                
                                <div className="space-y-1">
                                  <p className="text-xs text-muted-foreground">Supplier</p>
                                  <p>{item.supplier || "—"}</p>
                                </div>
                              </div>
                              
                              <div className="mt-4 flex justify-between">
                                <Badge 
                                  variant="secondary"
                                >
                                  {item.unit_of_measure || "PCS"}
                                </Badge>
                                <div className="text-sm font-medium">
                                  Total: {formatCurrency((item.stock || 0) * (item.value || 0))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-8">
                          No inventory items found matching your criteria
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Add Inventory Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Inventory Item</DialogTitle>
            <DialogDescription>
              Enter the details of the new inventory item
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Product name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g. Electronics, Stationery"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Item description"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock.toString()}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="value">Unit Value (₹) *</Label>
                  <Input
                    id="value"
                    name="value"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.value.toString()}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unit_of_measure">Unit of Measure</Label>
                  <Select 
                    value={formData.unit_of_measure}
                    onValueChange={(value) => setFormData({...formData, unit_of_measure: value})}
                  >
                    <SelectTrigger id="unit_of_measure">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PCS">Pieces (PCS)</SelectItem>
                      <SelectItem value="KG">Kilograms (KG)</SelectItem>
                      <SelectItem value="LTR">Liters (LTR)</SelectItem>
                      <SelectItem value="MTR">Meters (MTR)</SelectItem>
                      <SelectItem value="BOX">Box (BOX)</SelectItem>
                      <SelectItem value="UNIT">Unit (UNIT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Storage Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Warehouse A, Shelf 3"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    id="supplier"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    placeholder="Supplier name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="batch_number">Batch Number</Label>
                  <Input
                    id="batch_number"
                    name="batch_number"
                    value={formData.batch_number}
                    onChange={handleInputChange}
                    placeholder="e.g. BTC123"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reorder_level">Reorder Level</Label>
                  <Input
                    id="reorder_level"
                    name="reorder_level"
                    type="number"
                    min="0"
                    value={formData.reorder_level.toString()}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reorder_quantity">Reorder Quantity</Label>
                  <Input
                    id="reorder_quantity"
                    name="reorder_quantity"
                    type="number"
                    min="0"
                    value={formData.reorder_quantity.toString()}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock_valuation_method">Valuation Method</Label>
                  <Select 
                    value={formData.stock_valuation_method}
                    onValueChange={(value) => setFormData({...formData, stock_valuation_method: value})}
                  >
                    <SelectTrigger id="stock_valuation_method">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FIFO">FIFO</SelectItem>
                      <SelectItem value="LIFO">LIFO</SelectItem>
                      <SelectItem value="AVG">Weighted Average</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cgst_rate">CGST Rate (%)</Label>
                  <Input
                    id="cgst_rate"
                    name="cgst_rate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.cgst_rate.toString()}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sgst_rate">SGST Rate (%)</Label>
                  <Input
                    id="sgst_rate"
                    name="sgst_rate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.sgst_rate.toString()}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Item</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
