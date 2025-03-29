
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
  const categories = items ? [...new Set(items.map(item => item.category))] : [];
  const locations = items ? [...new Set(items.map(item => item.location))] : [];

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
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
      const matchesLocation = locationFilter ? item.location === locationFilter : true;
      
      // Stock filter: low, normal, out
      const matchesStock = (() => {
        if (!stockFilter) return true;
        if (stockFilter === 'out' && item.stock === 0) return true;
        if (stockFilter === 'low' && item.stock > 0 && item.stock <= (item.reorder_level || 10)) return true;
        if (stockFilter === 'normal' && item.stock > (item.reorder_level || 10)) return true;
        return false;
      })();
      
      return matchesSearch && matchesCategory && matchesLocation && matchesStock;
    }
  );

  return (
    <Layout>
      <Header 
        title="Inventory" 
        description="Manage products, stock levels, and locations."
      >
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Create Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Inventory Item</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new inventory item to your stock.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Item Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Input
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description || ""}
                      onChange={handleInputChange}
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock">Initial Stock *</Label>
                      <Input
                        id="stock"
                        name="stock"
                        type="number"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="value">Value per Unit *</Label>
                      <Input
                        id="value"
                        name="value"
                        type="number"
                        step="0.01"
                        value={formData.value}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplier">Supplier</Label>
                      <Input
                        id="supplier"
                        name="supplier"
                        value={formData.supplier || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="unit_of_measure">Unit of Measure</Label>
                      <Select
                        name="unit_of_measure"
                        value={formData.unit_of_measure}
                        onValueChange={value => setFormData({...formData, unit_of_measure: value})}
                      >
                        <SelectTrigger id="unit_of_measure">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PCS">Pieces (PCS)</SelectItem>
                          <SelectItem value="KG">Kilograms (KG)</SelectItem>
                          <SelectItem value="LTR">Liters (LTR)</SelectItem>
                          <SelectItem value="BOX">Box (BOX)</SelectItem>
                          <SelectItem value="MTR">Meters (MTR)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock_valuation_method">Valuation Method</Label>
                      <Select
                        name="stock_valuation_method"
                        value={formData.stock_valuation_method}
                        onValueChange={value => setFormData({...formData, stock_valuation_method: value})}
                      >
                        <SelectTrigger id="stock_valuation_method">
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FIFO">FIFO</SelectItem>
                          <SelectItem value="LIFO">LIFO</SelectItem>
                          <SelectItem value="AVG">Average Cost</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hsn_code">HSN Code</Label>
                      <Input
                        id="hsn_code"
                        name="hsn_code"
                        value={formData.hsn_code || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="batch_number">Batch Number</Label>
                      <Input
                        id="batch_number"
                        name="batch_number"
                        value={formData.batch_number || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reorder_level">Reorder Level</Label>
                      <Input
                        id="reorder_level"
                        name="reorder_level"
                        type="number"
                        value={formData.reorder_level}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reorder_quantity">Reorder Quantity</Label>
                      <Input
                        id="reorder_quantity"
                        name="reorder_quantity"
                        type="number"
                        value={formData.reorder_quantity}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cgst_rate">CGST Rate (%)</Label>
                      <Input
                        id="cgst_rate"
                        name="cgst_rate"
                        type="number"
                        step="0.01"
                        value={formData.cgst_rate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sgst_rate">SGST Rate (%)</Label>
                      <Input
                        id="sgst_rate"
                        name="sgst_rate"
                        type="number"
                        step="0.01"
                        value={formData.sgst_rate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Item"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </Header>

      <Tabs defaultValue="items" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="items" className="border rounded-md mt-6">
          <ScrollArea className="overflow-x-auto">
            <div className="min-w-max">
              <div className="p-4 mb-2 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search items..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Locations</SelectItem>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={stockFilter} onValueChange={setStockFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by stock" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Stock Levels</SelectItem>
                        <SelectItem value="out">Out of Stock</SelectItem>
                        <SelectItem value="low">Low Stock</SelectItem>
                        <SelectItem value="normal">Normal Stock</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => {
                        setSearchTerm("");
                        setCategoryFilter("");
                        setLocationFilter("");
                        setStockFilter("");
                      }}
                    >
                      <Filter className="h-4 w-4" />
                      <span className="sr-only">Clear filters</span>
                    </Button>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading items...</span>
                </div>
              ) : error ? (
                <Alert variant="destructive" className="mx-4 my-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>Failed to load inventory items</AlertDescription>
                </Alert>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>HSN Code</TableHead>
                      <TableHead>GST Rates</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.description || "-"}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="mr-2">{item.stock}</span>
                            {item.stock === 0 ? (
                              <Badge variant="destructive">Out</Badge>
                            ) : item.stock <= (item.reorder_level || 10) ? (
                              <Badge variant="warning" className="bg-amber-500">Low</Badge>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell>{item.unit_of_measure || "PCS"}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{formatCurrency(item.value)}</TableCell>
                        <TableCell>{item.supplier || "-"}</TableCell>
                        <TableCell>{item.hsn_code || "-"}</TableCell>
                        <TableCell>
                          {item.cgst_rate || item.sgst_rate ? (
                            <div className="text-sm">
                              {item.cgst_rate ? `CGST: ${item.cgst_rate}%` : ""}<br />
                              {item.sgst_rate ? `SGST: ${item.sgst_rate}%` : ""}
                            </div>
                          ) : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => navigate(`/edit-item/${item.id}`)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <CopyToClipboard text={JSON.stringify(item)}
                                onCopy={() => toast({
                                  title: "Copied to clipboard!",
                                  description: "You can now paste this item's data.",
                                })}>
                                <DropdownMenuItem>
                                  <Copy className="mr-2 h-4 w-4" /> Copy Data
                                </DropdownMenuItem>
                              </CopyToClipboard>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-500"
                                onClick={() => handleDelete(item.id)}
                              >
                                <Trash className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredItems?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center h-24">
                          <Alert>
                            <Search className="h-4 w-4" />
                            <AlertTitle>No items found.</AlertTitle>
                            <AlertDescription>
                              Try adjusting your search or create a new item.
                            </AlertDescription>
                          </Alert>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="reports" className="p-6 flex flex-col items-center justify-center border rounded-md mt-6 text-center min-h-[300px]">
          <FilePlus className="h-16 w-16 mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Generate Inventory Reports</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            Create customized reports for stock levels, low stock items, and more.
          </p>
          <Button>Generate Report</Button>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
