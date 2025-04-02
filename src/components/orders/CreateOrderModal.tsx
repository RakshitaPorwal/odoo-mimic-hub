import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Order, NewOrder, NewOrderItem, createOrder, generateOrderNumber } from '@/services/orderService';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { getCustomers } from '@/services/customerService';
import { Plus, Trash2 } from 'lucide-react';
import { CreateCustomerModal } from '@/components/customers/CreateCustomerModal';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: (order: Order) => void;
}

interface Customer {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  rate: number;
}

interface OrderItem {
  product_id: string;
  product: Product;
  quantity: number;
  rate: number;
  material_specifications: string;
  gst_amount: number;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  onClose,
  onOrderCreated,
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [gstApplicable, setGstApplicable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateCustomerModalOpen, setIsCreateCustomerModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
      fetchProducts();
    }
  }, [isOpen]);

  const fetchCustomers = async () => {
    try {
      const customersData = await getCustomers();
      setCustomers(customersData);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to fetch customers');
    }
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, rate')
      .order('name');

    if (error) {
      toast.error('Failed to fetch products');
      console.error('Error fetching products:', error);
      return;
    }

    setProducts(data);
  };

  const handleAddItem = () => {
    if (products.length === 0) {
      toast.error('No products available');
      return;
    }

    const firstProduct = products[0];
    setOrderItems([
      ...orderItems,
      {
        product_id: firstProduct.id,
        product: firstProduct,
        quantity: 1,
        rate: firstProduct.rate,
        material_specifications: '',
        gst_amount: 0,
      },
    ]);
  };

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newItems = [...orderItems];
    newItems[index] = {
      ...newItems[index],
      product_id: product.id,
      product: product,
      rate: product.rate,
    };
    setOrderItems(newItems);
  };

  const handleQuantityChange = (index: number, value: string) => {
    const newItems = [...orderItems];
    newItems[index] = {
      ...newItems[index],
      quantity: parseInt(value) || 0,
    };
    setOrderItems(newItems);
  };

  const handleRateChange = (index: number, value: string) => {
    const newItems = [...orderItems];
    newItems[index] = {
      ...newItems[index],
      rate: parseFloat(value) || 0,
    };
    setOrderItems(newItems);
  };

  const handleSpecificationsChange = (index: number, value: string) => {
    const newItems = [...orderItems];
    newItems[index] = {
      ...newItems[index],
      material_specifications: value,
    };
    setOrderItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.quantity * item.rate), 0);
  };

  const handleSubmit = async () => {
    if (!selectedCustomer) {
      toast.error('Please select a customer');
      return;
    }

    if (orderItems.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    try {
      setIsSubmitting(true);

      const orderData: NewOrder = {
        order_number: generateOrderNumber(),
        customer_id: selectedCustomer,
        order_date: new Date().toISOString(),
        status: 'pending',
        total_amount: calculateTotal(),
        gst_applicable: gstApplicable,
      };

      const orderItemsData: NewOrderItem[] = orderItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        rate: item.rate,
        material_specifications: item.material_specifications,
        gst_amount: item.gst_amount,
      }));

      const order = await createOrder(orderData, orderItemsData);
      onOrderCreated(order);
      toast.success('Order created successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to create order');
      console.error('Error creating order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomerCreated = (customer: Customer) => {
    setCustomers([...customers, customer]);
    setSelectedCustomer(customer.id);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <Label>Customer</Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="gst-applicable"
                checked={gstApplicable}
                onCheckedChange={setGstApplicable}
              />
              <Label htmlFor="gst-applicable">GST Applicable</Label>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Order Items</h3>
                <Button onClick={handleAddItem}>Add Item</Button>
              </div>

              {orderItems.map((item, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between">
                    <div className="flex-1 mr-4">
                      <Label>Product</Label>
                      <Select
                        value={item.product_id}
                        onValueChange={(value) => handleProductChange(index, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(index)}
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Rate</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => handleRateChange(index, e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Material Specifications</Label>
                    <Input
                      value={item.material_specifications}
                      onChange={(e) => handleSpecificationsChange(index, e.target.value)}
                      placeholder="Enter specifications (optional)"
                    />
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Subtotal: {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(item.quantity * item.rate)}
                    </p>
                  </div>
                </div>
              ))}

              {orderItems.length > 0 && (
                <div className="flex justify-between items-center pt-4">
                  <p className="font-medium">Total Amount</p>
                  <p className="font-medium">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(calculateTotal())}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Order'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CreateCustomerModal
        isOpen={isCreateCustomerModalOpen}
        onClose={() => setIsCreateCustomerModalOpen(false)}
        onCustomerCreated={handleCustomerCreated}
      />
    </>
  );
}; 