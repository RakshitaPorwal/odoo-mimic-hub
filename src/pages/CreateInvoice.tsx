import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";
import { createInvoice, addInvoiceItems, calculateInvoiceTotals } from "@/services/invoiceService";
import { toast } from "@/hooks/use-toast";
import { InventoryItem } from "@/services/inventoryService";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getInventoryItems } from "@/services/inventoryService";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";

export default function CreateInvoice() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [invoiceData, setInvoiceData] = useState({
    // Seller Information
    seller_name: "Your Company Name",
    seller_address: "123 Business Street, City, State, Country",
    seller_gstin: "GSTIN123456789",
    seller_state: "State Name",
    seller_state_code: "ST01",
    seller_pan: "PAN123456789",
    seller_phone: "+1234567890",
    seller_email: "contact@yourcompany.com",

    // Buyer Information
    customer_name: "",
    customer_address: "",
    customer_gstin: "",
    customer_state: "",
    customer_state_code: "",
    customer_phone: "",
    customer_email: "",

    // Invoice Details
    invoice_number: "",
    invoice_date: format(new Date(), "yyyy-MM-dd"),
    delivery_note: "",
    reference_date: "",
    reference_number: "",
    buyers_order_number: "",
    buyers_order_date: "",
    dispatch_doc_number: "",
    dispatch_doc_date: "",
    dispatched_through: "",
    destination: "",
    mode_of_payment: "",
    terms_of_delivery: "",
    other_references: "",

    // Totals
    subtotal: 0,
    cgst_total: 0,
    sgst_total: 0,
    total_amount: 0,
    notes: "",
    terms_conditions: "",
  });

  const [selectedItems, setSelectedItems] = useState<InventoryItem[]>([]);
  const [itemQuantities, setItemQuantities] = useState<{ [key: number]: number }>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [availableItems, setAvailableItems] = useState<InventoryItem[]>([]);
  const [showItemSelector, setShowItemSelector] = useState(false);

  // Fetch inventory items
  const { data: inventoryItems } = useQuery({
    queryKey: ["inventory"],
    queryFn: getInventoryItems,
  });

  // Get unique categories
  const categories = inventoryItems ? [...new Set(inventoryItems.map(item => item.category).filter(Boolean))] : [];

  // Filter items by selected category
  useEffect(() => {
    if (selectedCategory && inventoryItems) {
      const filtered = inventoryItems.filter(item => item.category === selectedCategory);
      setAvailableItems(filtered);
      setShowItemSelector(true);
    } else {
      setAvailableItems([]);
      setShowItemSelector(false);
    }
  }, [selectedCategory, inventoryItems]);

  const handleAddItem = (item: InventoryItem) => {
    setSelectedItems(prev => {
      if (prev.find(i => i.id === item.id)) {
        return prev;
      }
      return [...prev, item];
    });
    setShowItemSelector(false);
    setSelectedCategory("");
    toast({
      title: "Item added",
      description: `${item.name} has been added to the invoice`,
    });
  };

  useEffect(() => {
    const itemsParam = searchParams.get("items");
    if (itemsParam) {
      try {
        const items = JSON.parse(decodeURIComponent(itemsParam));
        setSelectedItems(items);
        // Initialize quantities to 1 for each item
        const initialQuantities = items.reduce((acc: { [key: number]: number }, item: InventoryItem) => {
          acc[item.id] = 1;
          return acc;
        }, {});
        setItemQuantities(initialQuantities);
        
        // Calculate initial totals
        const subtotal = items.reduce((sum: number, item: InventoryItem) => {
          return sum + ((item.value || 0) * initialQuantities[item.id]);
        }, 0);
        
        const cgstTotal = items.reduce((sum: number, item: InventoryItem) => {
          return sum + ((item.value || 0) * initialQuantities[item.id] * ((item.cgst_rate || 0) / 100));
        }, 0);
        
        const sgstTotal = items.reduce((sum: number, item: InventoryItem) => {
          return sum + ((item.value || 0) * initialQuantities[item.id] * ((item.sgst_rate || 0) / 100));
        }, 0);

        setInvoiceData(prev => ({
          ...prev,
          subtotal,
          cgst_total: cgstTotal,
          sgst_total: sgstTotal,
          total_amount: subtotal + cgstTotal + sgstTotal,
        }));
      } catch (error) {
        console.error("Error parsing items data:", error);
        toast({
          title: "Error",
          description: "Failed to load inventory items data",
          variant: "destructive",
        });
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Format dates to ISO string
      const formattedInvoiceData = {
        ...invoiceData,
        invoice_date: new Date(invoiceData.invoice_date).toISOString(),
        buyers_order_date: invoiceData.buyers_order_date ? new Date(invoiceData.buyers_order_date).toISOString() : null,
        dispatch_doc_date: invoiceData.dispatch_doc_date ? new Date(invoiceData.dispatch_doc_date).toISOString() : null,
        reference_date: invoiceData.reference_date ? new Date(invoiceData.reference_date).toISOString() : null,
      };

      // Create invoice items with fixed GST rates
      const invoiceItems = selectedItems.map(item => ({
        invoice_id: "", // Will be set after invoice creation
        item_id: item.id,
        description: item.name,
        description_of_goods: item.name,
        category: item.category || "",
        hsn_code: item.hsn_code || "",
        quantity: itemQuantities[item.id] || 1,
        rate: item.value,
        unit_price: item.value,
        unit_of_measure: item.unit_of_measure,
        available_stock: item.stock,
        current_stock: item.stock,
        cgst_rate: 9, // Fixed 9% CGST
        sgst_rate: 9, // Fixed 9% SGST
        cgst_amount: (item.value * itemQuantities[item.id] * 0.09),
        sgst_amount: (item.value * itemQuantities[item.id] * 0.09),
        total_amount: (item.value * itemQuantities[item.id] * 1.18) // Including 18% total GST
      }));

      // Calculate totals
      const { subtotal, cgstTotal, sgstTotal, totalAmount } = calculateInvoiceTotals(invoiceItems);

      // Create invoice with formatted dates
      const invoice = await createInvoice({
        ...formattedInvoiceData,
        subtotal,
        cgst_total: cgstTotal,
        sgst_total: sgstTotal,
        total_amount: totalAmount,
      });

      // Add items to invoice
      await addInvoiceItems(invoiceItems.map(item => ({
        ...item,
        invoice_id: invoice.id
      })));

      toast({
        title: "Success",
        description: "Invoice created successfully",
      });

      navigate(`/invoices/${invoice.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create invoice: " + error,
        variant: "destructive",
      });
    }
  };

  const handleQuantityChange = (itemId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0; // Default to 0 if invalid input
    setItemQuantities(prev => ({
      ...prev,
      [itemId]: value
    }));

    // Recalculate totals
    const invoiceItems = selectedItems.map(item => {
      const quantity = itemId === item.id ? value : itemQuantities[item.id] || 0;
      const lineTotal = item.value * quantity;
      const cgstAmount = lineTotal * 0.09; // 9% CGST
      const sgstAmount = lineTotal * 0.09; // 9% SGST
      const totalAmount = lineTotal + cgstAmount + sgstAmount;

      return {
        item_id: item.id,
        description: item.name,
        description_of_goods: item.name,
        category: item.category || "",
        hsn_code: item.hsn_code || "",
        quantity: quantity,
        rate: item.value,
        unit_price: item.value,
        unit_of_measure: item.unit_of_measure,
        available_stock: item.stock,
        current_stock: item.stock,
        cgst_rate: 9,
        sgst_rate: 9,
        cgst_amount: cgstAmount,
        sgst_amount: sgstAmount,
        total_amount: totalAmount
      };
    });

    const { subtotal, cgstTotal, sgstTotal, totalAmount } = calculateInvoiceTotals(invoiceItems);

    setInvoiceData(prev => ({
      ...prev,
      subtotal,
      cgst_total: cgstTotal,
      sgst_total: sgstTotal,
      total_amount: totalAmount
    }));
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Seller Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Seller Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Company Name</Label>
                    <p className="font-medium">{invoiceData.seller_name}</p>
                  </div>
                  <div>
                    <Label>GSTIN</Label>
                    <p className="font-medium">{invoiceData.seller_gstin}</p>
                  </div>
                  <div>
                    <Label>Address</Label>
                    <p className="font-medium">{invoiceData.seller_address}</p>
                  </div>
                  <div>
                    <Label>State</Label>
                    <p className="font-medium">{invoiceData.seller_state} ({invoiceData.seller_state_code})</p>
                  </div>
                  <div>
                    <Label>PAN</Label>
                    <p className="font-medium">{invoiceData.seller_pan}</p>
                  </div>
                  <div>
                    <Label>Contact</Label>
                    <p className="font-medium">{invoiceData.seller_phone}</p>
                  </div>
                </div>
              </div>

              {/* Buyer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Buyer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer_name">Customer Name *</Label>
                    <Input
                      id="customer_name"
                      value={invoiceData.customer_name}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, customer_name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer_gstin">GSTIN</Label>
                    <Input
                      id="customer_gstin"
                      value={invoiceData.customer_gstin}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, customer_gstin: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer_address">Address</Label>
                    <Textarea
                      id="customer_address"
                      value={invoiceData.customer_address}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, customer_address: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer_state">State</Label>
                    <Input
                      id="customer_state"
                      value={invoiceData.customer_state}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, customer_state: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer_state_code">State Code</Label>
                    <Input
                      id="customer_state_code"
                      value={invoiceData.customer_state_code}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, customer_state_code: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer_phone">Phone</Label>
                    <Input
                      id="customer_phone"
                      value={invoiceData.customer_phone}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, customer_phone: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Invoice Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoice_number">Invoice Number *</Label>
                    <Input
                      id="invoice_number"
                      value={invoiceData.invoice_number}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, invoice_number: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoice_date">Invoice Date *</Label>
                    <Input
                      id="invoice_date"
                      type="date"
                      value={invoiceData.invoice_date}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, invoice_date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery_note">Delivery Note</Label>
                    <Input
                      id="delivery_note"
                      value={invoiceData.delivery_note}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, delivery_note: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mode_of_payment">Mode of Payment</Label>
                    <Input
                      id="mode_of_payment"
                      value={invoiceData.mode_of_payment}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, mode_of_payment: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reference_number">Reference Number</Label>
                    <Input
                      id="reference_number"
                      value={invoiceData.reference_number}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, reference_number: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="other_references">Other References</Label>
                    <Input
                      id="other_references"
                      value={invoiceData.other_references}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, other_references: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyers_order_number">Buyer's Order Number</Label>
                    <Input
                      id="buyers_order_number"
                      value={invoiceData.buyers_order_number}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, buyers_order_number: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyers_order_date">Buyer's Order Date</Label>
                    <Input
                      id="buyers_order_date"
                      type="date"
                      value={invoiceData.buyers_order_date}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, buyers_order_date: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dispatch_doc_number">Dispatch Document Number</Label>
                    <Input
                      id="dispatch_doc_number"
                      value={invoiceData.dispatch_doc_number}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, dispatch_doc_number: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dispatch_doc_date">Dispatch Document Date</Label>
                    <Input
                      id="dispatch_doc_date"
                      type="date"
                      value={invoiceData.dispatch_doc_date}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, dispatch_doc_date: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dispatched_through">Dispatched Through</Label>
                    <Input
                      id="dispatched_through"
                      value={invoiceData.dispatched_through}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, dispatched_through: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination</Label>
                    <Input
                      id="destination"
                      value={invoiceData.destination}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, destination: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="terms_of_delivery">Terms of Delivery</Label>
                    <Input
                      id="terms_of_delivery"
                      value={invoiceData.terms_of_delivery}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, terms_of_delivery: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Items</h3>
                  <div className="flex gap-2">
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category: string) => (
                          <SelectItem key={category} value={category}>
                            {category || "Uncategorized"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Item Selector Dialog */}
                <Dialog open={showItemSelector} onOpenChange={setShowItemSelector}>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Select Items from {selectedCategory}</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {availableItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.description || "—"}</TableCell>
                              <TableCell>{item.stock}</TableCell>
                              <TableCell>{formatCurrency(item.value)}</TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAddItem(item)}
                                >
                                  Add
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Items Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>HSN Code</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">CGST (9%)</TableHead>
                      <TableHead className="text-right">SGST (9%)</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-4">
                          No items added to invoice
                        </TableCell>
                      </TableRow>
                    ) : (
                      selectedItems.map((item) => {
                        const quantity = itemQuantities[item.id] || 0;
                        const lineTotal = item.value * quantity;
                        const cgstAmount = lineTotal * 0.09;
                        const sgstAmount = lineTotal * 0.09;
                        const totalAmount = lineTotal + cgstAmount + sgstAmount;

                        return (
                          <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.hsn_code || "—"}</TableCell>
                            <TableCell>{item.category || "—"}</TableCell>
                            <TableCell className="text-right">
                              <Input
                                type="number"
                                min="0"
                                max={item.stock}
                                value={quantity}
                                onChange={(e) => handleQuantityChange(item.id, e)}
                                className="w-20 text-right"
                              />
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(item.value)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(cgstAmount)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(sgstAmount)}</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(totalAmount)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedItems(prev => prev.filter(i => i.id !== item.id));
                                  toast({
                                    title: "Item removed",
                                    description: "Item has been removed from the invoice",
                                  });
                                }}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>

                {/* Totals */}
                <div className="mt-6 ml-auto md:w-64">
                  <div className="flex justify-between py-1">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(invoiceData.subtotal)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>CGST (9%):</span>
                    <span>{formatCurrency(invoiceData.cgst_total)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>SGST (9%):</span>
                    <span>{formatCurrency(invoiceData.sgst_total)}</span>
                  </div>
                  <div className="flex justify-between py-1 font-bold border-t mt-2 pt-2">
                    <span>Total Amount:</span>
                    <span>{formatCurrency(invoiceData.total_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={invoiceData.notes}
                    onChange={(e) =>
                      setInvoiceData({ ...invoiceData, notes: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terms_conditions">Terms & Conditions</Label>
                  <Textarea
                    id="terms_conditions"
                    value={invoiceData.terms_conditions}
                    onChange={(e) =>
                      setInvoiceData({ ...invoiceData, terms_conditions: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/inventory")}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Invoice</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
