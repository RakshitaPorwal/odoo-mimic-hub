import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Plus, Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getInventoryItems } from "@/services/inventoryService";
import { createInvoice, addInvoiceItems, calculateInvoiceTotals } from "@/services/invoiceService";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import InvoiceItemRow from "./InvoiceItemRow";

const formSchema = z.object({
  customer_name: z.string().min(2, {
    message: "Customer name must be at least 2 characters.",
  }),
  customer_email: z.string().email().optional().or(z.literal('')),
  customer_address: z.string().optional(),
  invoice_date: z.date(),
  due_date: z.date(),
  status: z.enum(["draft", "sent", "paid", "cancelled", "overdue"]),
  notes: z.string().optional(),
  terms_conditions: z.string().optional(),
});

type InvoiceItem = {
  id?: string;
  item_id?: number | null;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate?: number;
  tax_amount?: number;
  discount_percent?: number;
  discount_amount?: number;
  total_amount: number;
};

const calculateItemTotal = (item: InvoiceItem): number => {
  const baseAmount = item.quantity * item.unit_price;
  const taxAmount = item.tax_rate ? (baseAmount * (item.tax_rate / 100)) : 0;
  
  let discountAmount = 0;
  if (item.discount_percent) {
    discountAmount = baseAmount * (item.discount_percent / 100);
  } else if (item.discount_amount) {
    discountAmount = item.discount_amount;
  }
  
  return baseAmount + taxAmount - discountAmount;
};

export default function CreateInvoiceForm() {
  const navigate = useNavigate();
  const [items, setItems] = useState<InvoiceItem[]>([{
    description: "",
    quantity: 1,
    unit_price: 0,
    tax_rate: 0,
    discount_percent: 0,
    total_amount: 0
  }]);
  const [subtotal, setSubtotal] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get inventory items for dropdown
  const { data: inventoryItems } = useQuery({
    queryKey: ["inventory"],
    queryFn: getInventoryItems,
  });

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_name: "",
      customer_email: "",
      customer_address: "",
      invoice_date: new Date(),
      due_date: addDays(new Date(), 30),
      status: "draft",
      notes: "",
      terms_conditions: "Payment is due within 30 days from the date of invoice. Late payment is subject to interest charges.",
    },
  });

  // Calculate totals when items change
  useEffect(() => {
    let calculatedSubtotal = 0;
    let calculatedTaxTotal = 0;

    // Calculate item totals
    const updatedItems = items.map(item => {
      const itemTotal = calculateItemTotal(item);
      calculatedSubtotal += item.quantity * item.unit_price;
      
      // Calculate tax
      const taxAmount = item.tax_rate ? (item.quantity * item.unit_price * (item.tax_rate / 100)) : 0;
      calculatedTaxTotal += taxAmount;

      return {
        ...item,
        tax_amount: taxAmount,
        total_amount: itemTotal
      };
    });

    setItems(updatedItems);
    setSubtotal(calculatedSubtotal);
    setTaxTotal(calculatedTaxTotal);

    // Calculate invoice total with global discount
    let calculatedDiscountAmount = 0;
    if (discountPercent > 0) {
      calculatedDiscountAmount = calculatedSubtotal * (discountPercent / 100);
    } else if (discountAmount > 0) {
      calculatedDiscountAmount = discountAmount;
    }

    setTotalAmount(calculatedSubtotal + calculatedTaxTotal - calculatedDiscountAmount);
  }, [items, discountPercent, discountAmount]);

  // Add a new empty item to the items array
  const addItem = () => {
    setItems([
      ...items,
      {
        description: "",
        quantity: 1,
        unit_price: 0,
        tax_rate: 0,
        discount_percent: 0,
        total_amount: 0
      }
    ]);
  };

  // Remove an item from the items array
  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // Update an item in the items array
  const updateItem = (index: number, updatedItem: InvoiceItem) => {
    const newItems = [...items];
    newItems[index] = updatedItem;
    setItems(newItems);
  };

  // Handle inventory item selection
  const handleItemSelect = (index: number, itemId: number | null) => {
    if (!itemId) return;

    const selectedItem = inventoryItems?.find(item => item.id === itemId);
    if (selectedItem) {
      const newItems = [...items];
      newItems[index] = {
        ...newItems[index],
        item_id: selectedItem.id,
        description: selectedItem.name,
        unit_price: selectedItem.value || 0,
      };
      setItems(newItems);
    }
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      // Check if items are valid
      if (items.some(item => !item.description || item.quantity <= 0)) {
        toast({
          title: "Invalid items",
          description: "Please check that all items have a description and quantity",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Create invoice object with all required fields
      const invoiceData = {
        customer_name: values.customer_name,
        customer_email: values.customer_email || "",
        customer_address: values.customer_address || "",
        invoice_date: format(values.invoice_date, "yyyy-MM-dd"),
        due_date: format(values.due_date, "yyyy-MM-dd"),
        status: values.status,
        notes: values.notes || "",
        terms_conditions: values.terms_conditions || "",
        subtotal,
        tax_total: taxTotal,
        discount_percent: discountPercent > 0 ? discountPercent : 0,
        discount_amount: discountAmount > 0 ? discountAmount : 0,
        total_amount: totalAmount,
      };

      // Create invoice
      const invoice = await createInvoice(invoiceData);

      // Add invoice items
      const invoiceItems = items.map(item => ({
        invoice_id: invoice.id,
        item_id: item.item_id || null,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate: item.tax_rate || 0,
        tax_amount: item.tax_amount || 0,
        discount_percent: item.discount_percent || 0,
        discount_amount: item.discount_amount || 0,
        total_amount: item.total_amount,
      }));

      await addInvoiceItems(invoiceItems);

      toast({
        title: "Invoice created",
        description: `Invoice #${invoice.invoice_number} has been created successfully.`,
      });

      navigate(`/invoices/${invoice.id}`);
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast({
        title: "Error",
        description: "An error occurred while creating the invoice.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="customer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter customer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customer_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter customer email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customer_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter customer address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Invoice Details */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">
                            <div className="flex items-center">
                              <Badge className="bg-gray-500 mr-2">Draft</Badge>
                              <span>Draft</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="sent">
                            <div className="flex items-center">
                              <Badge className="bg-blue-500 mr-2">Sent</Badge>
                              <span>Sent</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="paid">
                            <div className="flex items-center">
                              <Badge className="bg-green-500 mr-2">Paid</Badge>
                              <span>Paid</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="overdue">
                            <div className="flex items-center">
                              <Badge className="bg-amber-500 mr-2">Overdue</Badge>
                              <span>Overdue</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="cancelled">
                            <div className="flex items-center">
                              <Badge className="bg-red-500 mr-2">Cancelled</Badge>
                              <span>Cancelled</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="invoice_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Invoice Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="due_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Due Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invoice Items */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Invoice Items</CardTitle>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={addItem}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left px-2 py-3 w-[250px]">Description</th>
                      <th className="text-right px-2 py-3 w-[80px]">Quantity</th>
                      <th className="text-right px-2 py-3">Unit Price</th>
                      <th className="text-right px-2 py-3">Tax %</th>
                      <th className="text-right px-2 py-3">Discount %</th>
                      <th className="text-right px-2 py-3">Total</th>
                      <th className="w-[50px]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <InvoiceItemRow 
                        key={index}
                        inventoryItems={inventoryItems || []}
                        item={item}
                        index={index}
                        updateItem={updateItem}
                        removeItem={removeItem}
                        handleItemSelect={handleItemSelect}
                        showRemove={items.length > 1}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Invoice Totals */}
              <div className="mt-4 flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Tax:</span>
                    <span>{formatCurrency(taxTotal)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Discount:</span>
                    <div className="flex flex-col space-y-1 items-end">
                      <div className="flex space-x-2">
                        <Input 
                          type="number"
                          placeholder="%"
                          value={discountPercent || ''}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setDiscountPercent(val);
                            setDiscountAmount(0);
                          }}
                          className="w-16 h-8 text-xs"
                        />
                        <span className="text-sm">%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-2 border-t font-semibold">
                    <span>Total:</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes & Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any notes or comments"
                      className="h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="terms_conditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terms and Conditions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add terms and conditions"
                      className="h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate('/invoices')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Invoice"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
