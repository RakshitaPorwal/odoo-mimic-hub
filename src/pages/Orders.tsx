import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrdersTable } from '@/components/orders/OrdersTable';
import { CreateOrderModal } from '@/components/orders/CreateOrderModal';
import { EditOrderModal } from '@/components/orders/EditOrderModal';
import { ViewOrderModal } from '@/components/orders/ViewOrderModal';
import { Order, getOrders, updateOrderStatus, createOrder, generateOrderNumber, getOrderById } from '@/services/orderService';
import { toast } from 'sonner';
import { Layout } from '@/components/Layout/Layout';
import { Header } from '@/components/Header/Header';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { getCustomers } from '@/services/customerService';
import { getProducts, searchProducts } from '@/services/productService';
import type { Database } from '@/types/supabase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, Package, User, DollarSign } from "lucide-react";

type Customer = Database['public']['Tables']['customers']['Row'];
type Product = Database['public']['Tables']['products']['Row'];

interface OrderItem {
  product: Product;
  quantity: number;
  rate: number;
  amount: number;
  gst: number;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [gstApplicable, setGstApplicable] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchProducts();
  }, [statusFilter, refreshTrigger]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching orders with status filter:', statusFilter);
      const data = await getOrders({
        status: statusFilter === 'all' ? undefined : statusFilter,
      });
      console.log('Fetched orders:', data);
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

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
    try {
      const productsData = await getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    }
  };

  const handleSearch = async (query: string) => {
    setProductSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const results = await searchProducts(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching products:', error);
      toast.error('Failed to search products');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddItem = (product: Product) => {
    const existingItem = orderItems.find(item => item.product.id === product.id);
    if (existingItem) {
      setOrderItems(orderItems.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1, amount: (item.quantity + 1) * item.rate }
          : item
      ));
    } else {
      setOrderItems([...orderItems, {
        product,
        quantity: 1,
        rate: product.price,
        amount: product.price,
        gst: (product.price * product.gst_percentage) / 100
      }]);
    }
    setProductSearchQuery("");
    setSearchResults([]);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setOrderItems(orderItems.map(item =>
      item.product.id === productId
        ? {
            ...item,
            quantity,
            amount: quantity * item.rate,
            gst: (quantity * item.rate * item.product.gst_percentage) / 100
          }
        : item
    ));
  };

  const handleUpdateRate = (productId: string, rate: number) => {
    if (rate < 0) return;
    setOrderItems(orderItems.map(item =>
      item.product.id === productId
        ? {
            ...item,
            rate,
            amount: item.quantity * rate,
            gst: (item.quantity * rate * item.product.gst_percentage) / 100
          }
        : item
    ));
  };

  const handleRemoveItem = (productId: string) => {
    setOrderItems(orderItems.filter(item => item.product.id !== productId));
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateGST = () => {
    return orderItems.reduce((sum, item) => sum + item.gst, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateGST();
  };

  const handleOrderCreated = (order: Order) => {
    setOrders([order, ...orders]);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleOrderUpdated = (updatedOrder: Order) => {
    setOrders(orders.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    ));
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsEditModalOpen(true);
  };

  const handleCancelOrder = async (order: Order) => {
    try {
      await updateOrderStatus(order.id, 'cancelled');
      const updatedOrder = { ...order, status: 'cancelled' as const };
      handleOrderUpdated(updatedOrder);
      toast.success('Order cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel order');
      console.error('Error cancelling order:', error);
    }
  };

  const handleCreateOrder = async () => {
    if (!selectedCustomer || orderItems.length === 0) {
      toast.error('Please select a customer and add at least one product');
      return;
    }

    try {
      console.log('Starting order creation...');
      const orderNumber = generateOrderNumber();
      console.log('Generated order number:', orderNumber);

      const orderData = {
        order_number: orderNumber,
        customer_id: selectedCustomer,
        total_amount: calculateTotal(),
        status: 'pending' as const,
        gst_applicable: true,
        created_at: new Date().toISOString(),
      };
      console.log('Order data:', orderData);

      const orderItemsData = orderItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        rate: item.rate,
        gst_amount: item.gst,
        material_specifications: null,
      }));
      console.log('Order items data:', orderItemsData);

      console.log('Calling createOrder...');
      const createdOrder = await createOrder(orderData, orderItemsData);
      console.log('Created order:', createdOrder);
      
      console.log('Fetching complete order data...');
      const completeOrder = await getOrderById(createdOrder.id);
      console.log('Complete order data:', completeOrder);
      
      setOrders(prevOrders => {
        console.log('Previous orders:', prevOrders);
        const newOrders = [completeOrder, ...prevOrders];
        console.log('New orders array:', newOrders);
        return [...newOrders];
      });
      
      toast.success('Order created successfully');
      
      setSelectedCustomer("");
      setOrderItems([]);
      setProductSearchQuery("");
      setOrderSearchQuery("");
      setSearchResults([]);
      setStatusFilter('all');
      
      setTimeout(() => {
        console.log('Refreshing orders after timeout...');
        setRefreshTrigger(prev => prev + 1);
      }, 500);

    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const filteredOrders = orders.filter(order => {
    if (!order || !order.order_number) return false;
    
    const customerName = order.customer?.name || '';
    
    const matchesSearch = !orderSearchQuery || 
      order.order_number.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      customerName.toLowerCase().includes(orderSearchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Layout>
      <Header title="Create New Order" description="Add products and create a new order." />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Customer</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Search Products</Label>
                  <Input
                    placeholder="Search products..."
                    value={productSearchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>

                {searchResults.length > 0 && (
                  <div className="border rounded-lg p-2 space-y-2">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                        onClick={() => handleAddItem(product)}
                      >
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.description}
                          </div>
                        </div>
                        <div className="font-medium">
                          ${product.price.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {orderItems.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>GST</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.map((item) => (
                        <TableRow key={item.product.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.product.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {item.product.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleUpdateQuantity(item.product.id, parseInt(e.target.value))}
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.rate}
                              onChange={(e) => handleUpdateRate(item.product.id, parseFloat(e.target.value))}
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>${item.amount.toFixed(2)}</TableCell>
                          <TableCell>${item.gst.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(item.product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST</span>
                <span className="font-medium">${calculateGST().toFixed(2)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-medium">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              <Button 
                className="w-full" 
                disabled={!selectedCustomer || orderItems.length === 0}
                onClick={handleCreateOrder}
              >
                Create Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Orders</CardTitle>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search orders..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="w-60"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter as any}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading orders...</div>
            ) : (
              <OrdersTable
                orders={filteredOrders}
                onViewOrder={handleViewOrder}
                onEditOrder={handleEditOrder}
                onCancelOrder={handleCancelOrder}
                onGenerateInvoice={(order) => {
                  toast.info('Invoice generation coming soon');
                }}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onOrderCreated={handleOrderCreated}
      />

      {selectedOrder && (
        <>
          <EditOrderModal
            order={selectedOrder}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedOrder(null);
            }}
            onOrderUpdated={handleOrderUpdated}
          />

          <ViewOrderModal
            order={selectedOrder}
            isOpen={isViewModalOpen}
            onClose={() => {
              setIsViewModalOpen(false);
              setSelectedOrder(null);
            }}
          />
        </>
      )}
    </Layout>
  );
};

export default Orders;