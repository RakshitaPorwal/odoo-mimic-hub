import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Header/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus,
  User,
  Banknote,
  Calendar,
  Package,
  ShoppingCart,
  CreditCard,
  ArrowRight,
  ChevronRight,
  Filter,
  MoreVertical,
  BarChart3,
  Bell,
  Download,
  TrendingUp,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { CreateCustomerModal } from "@/components/customers/CreateCustomerModal";
import { EditCustomerModal } from "@/components/customers/EditCustomerModal";
import { getCustomers, deleteCustomer, getCustomerStats } from "@/services/customerService";
import { toast } from "sonner";
import type { Database } from "@/types/supabase";
import { CreateProductModal } from "@/components/products/CreateProductModal";
import { getProducts } from "@/services/productService";
import { OrdersTable } from '@/components/orders/OrdersTable';
import { Order, getOrders, updateOrderStatus, getOrderById } from '@/services/orderService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EditOrderModal } from "@/components/orders/EditOrderModal";
import { ViewOrderModal } from "@/components/orders/ViewOrderModal";
import { Label } from "@/components/ui/label";

type Customer = Database['public']['Tables']['customers']['Row'];
type Product = Database['public']['Tables']['products']['Row'];

const salesData = [
  { name: 'Jan', amount: 4000 },
  { name: 'Feb', amount: 3000 },
  { name: 'Mar', amount: 5000 },
  { name: 'Apr', amount: 4500 },
  { name: 'May', amount: 6000 },
  { name: 'Jun', amount: 5500 },
  { name: 'Jul', amount: 7000 },
];

const customers = [
  {
    id: 1,
    name: "Acme Inc.",
    contact: "John Doe",
    email: "john@acme.com",
    phone: "+1 (555) 123-4567",
    orders: 12,
    totalSpent: 24580,
    lastPurchase: "2023-07-15"
  },
  {
    id: 2,
    name: "TechCorp",
    contact: "Jane Smith",
    email: "jane@techcorp.com",
    phone: "+1 (555) 987-6543",
    orders: 8,
    totalSpent: 18750,
    lastPurchase: "2023-07-10"
  },
  {
    id: 3,
    name: "Global Industries",
    contact: "Robert Johnson",
    email: "robert@global.com",
    phone: "+1 (555) 555-5555",
    orders: 15,
    totalSpent: 32400,
    lastPurchase: "2023-07-05"
  },
  {
    id: 4,
    name: "Design Studio",
    contact: "Emily Davis",
    email: "emily@design.com",
    phone: "+1 (555) 222-3333",
    orders: 6,
    totalSpent: 9800,
    lastPurchase: "2023-06-28"
  },
  {
    id: 5,
    name: "Finance Partners",
    contact: "Michael Wilson",
    email: "michael@finance.com",
    phone: "+1 (555) 444-7777",
    orders: 9,
    totalSpent: 15900,
    lastPurchase: "2023-06-20"
  }
];

const orders = [
  {
    id: "ORD-2023-001",
    customer: "Acme Inc.",
    date: "2023-07-15",
    amount: 3250.50,
    status: "completed",
    items: 5,
    paymentMethod: "credit_card"
  },
  {
    id: "ORD-2023-002",
    customer: "TechCorp",
    date: "2023-07-14",
    amount: 1780.25,
    status: "processing",
    items: 3,
    paymentMethod: "bank_transfer"
  },
  {
    id: "ORD-2023-003",
    customer: "Global Industries",
    date: "2023-07-12",
    amount: 4200.00,
    status: "completed",
    items: 7,
    paymentMethod: "credit_card"
  },
  {
    id: "ORD-2023-004",
    customer: "Acme Inc.",
    date: "2023-07-10",
    amount: 950.75,
    status: "completed",
    items: 2,
    paymentMethod: "credit_card"
  },
  {
    id: "ORD-2023-005",
    customer: "Design Studio",
    date: "2023-07-08",
    amount: 1500.00,
    status: "pending",
    items: 4,
    paymentMethod: "paypal"
  },
  {
    id: "ORD-2023-006",
    customer: "Finance Partners",
    date: "2023-07-05",
    amount: 2800.50,
    status: "completed",
    items: 6,
    paymentMethod: "bank_transfer"
  },
  {
    id: "ORD-2023-007",
    customer: "TechCorp",
    date: "2023-07-03",
    amount: 1200.00,
    status: "cancelled",
    items: 3,
    paymentMethod: "credit_card"
  }
];

const products = [
  {
    id: "PROD-001",
    name: "Professional License",
    category: "Software",
    price: 1200.00,
    inventory: 999,
    sales: 124,
    rating: 4.8
  },
  {
    id: "PROD-002",
    name: "Advanced Analytics Module",
    category: "Software",
    price: 750.00,
    inventory: 999,
    sales: 86,
    rating: 4.6
  },
  {
    id: "PROD-003",
    name: "Multi-User Package (5 users)",
    category: "Subscription",
    price: 3200.00,
    inventory: 999,
    sales: 52,
    rating: 4.5
  },
  {
    id: "PROD-004",
    name: "Premium Support Plan",
    category: "Service",
    price: 500.00,
    inventory: 999,
    sales: 97,
    rating: 4.9
  },
  {
    id: "PROD-005",
    name: "Enterprise Integration",
    category: "Service",
    price: 2500.00,
    inventory: 999,
    sales: 38,
    rating: 4.7
  }
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const Sales = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState<'lastweek' | 'lastmonth' | '6months' | '1year' | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [orderNumberFilter, setOrderNumberFilter] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isCreateCustomerModalOpen, setIsCreateCustomerModalOpen] = useState(false);
  const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerStats, setCustomerStats] = useState<Record<string, { totalOrders: number; totalSpent: number; lastPurchase: string | null }>>({});
  const [isCreateProductModalOpen, setIsCreateProductModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [unfilteredOrders, setUnfilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');
  const [customerNameFilter, setCustomerNameFilter] = useState('');
  const [customerEmailFilter, setCustomerEmailFilter] = useState('');
  const [customerPhoneFilter, setCustomerPhoneFilter] = useState('');
  const [productNameFilter, setProductNameFilter] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching orders with filters:', { 
        status: selectedStatus, 
        dateRange: selectedDateRange,
        startDate,
        endDate
      });
      const data = await getOrders({
        status: selectedStatus === 'all' ? undefined : selectedStatus as Order['status'],
        date_range: selectedDateRange,
        start_date: startDate,
        end_date: endDate,
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

  const fetchUnfilteredOrders = async () => {
    try {
      const data = await getOrders({});
      setUnfilteredOrders(data || []);
    } catch (error) {
      console.error('Error fetching unfiltered orders:', error);
      toast.error('Failed to fetch order counts');
      setUnfilteredOrders([]);
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

  const fetchCustomerStats = async () => {
    const stats: Record<string, { totalOrders: number; totalSpent: number; lastPurchase: string | null }> = {};
    
    for (const customer of customers) {
      try {
        const customerData = await getCustomerStats(customer.id);
        stats[customer.id] = customerData;
      } catch (error) {
        console.error(`Error fetching stats for customer ${customer.id}:`, error);
      }
    }
    
    setCustomerStats(stats);
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

  useEffect(() => {
    fetchOrders();
    fetchUnfilteredOrders();
    fetchCustomers();
    fetchProducts();
  }, [selectedStatus, selectedDateRange, startDate, endDate]);

  useEffect(() => {
    if (customers.length > 0) {
      fetchCustomerStats();
    }
  }, [customers]);

  useEffect(() => {
    // Initialize filteredOrders with orders when orders change
    console.log('Orders changed:', orders);
    setFilteredOrders(orders);
  }, [orders]);

  useEffect(() => {
    console.log('Filtered orders changed:', filteredOrders);
  }, [filteredOrders]);

  const handleCreateCustomer = (customer: Customer) => {
    setCustomers([...customers, customer]);
    toast.success('Customer created successfully');
    setIsCreateCustomerModalOpen(false);
  };

  const handleEditCustomer = (customer: Customer) => {
    setCustomers(customers.map(c => c.id === customer.id ? customer : c));
    toast.success('Customer updated successfully');
    setIsEditCustomerModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      await deleteCustomer(customerId);
      setCustomers(customers.filter(c => c.id !== customerId));
      toast.success('Customer deleted successfully');
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer');
    }
  };

  const handleProductCreated = (product: Product) => {
    setProducts([...products, product]);
    toast.success('Product created successfully');
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
      setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
      toast.success('Order cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel order');
      console.error('Error cancelling order:', error);
    }
  };

  const handleOrderUpdated = (updatedOrder: Order) => {
    setOrders(orders.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    ));
  };

  const statusCounts = {
    completed: unfilteredOrders.filter(o => o.status === "completed").length,
    processing: unfilteredOrders.filter(o => o.status === "processing").length,
    pending: unfilteredOrders.filter(o => o.status === "pending").length,
    cancelled: unfilteredOrders.filter(o => o.status === "cancelled").length
  };

  const totalRevenue = unfilteredOrders.reduce((sum, order) => sum + order.total_amount, 0);
  const totalOrders = unfilteredOrders.length;
  const totalCustomers = customers.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const applyFilters = () => {
    setIsFilterApplied(true);
    
    // Filter orders
    const filteredOrdersResult = orders.filter(order => {
      if (!order || !order.order_number) return false;
      
      const customerName = order.customer?.name || '';
      const matchesSearch = !searchQuery || 
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customerName.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesOrderNumber = !orderNumberFilter || 
        order.order_number.toLowerCase().includes(orderNumberFilter.toLowerCase());
        
      return matchesSearch && matchesOrderNumber;
    });
    console.log('Applying filters:', {
      searchQuery,
      orderNumberFilter,
      totalOrders: orders.length,
      filteredOrders: filteredOrdersResult.length
    });
    setFilteredOrders(filteredOrdersResult);

    // Filter customers
    const filteredCustomersResult = customers.filter(customer => {
      const matchesName = !customerNameFilter || 
        customer.name.toLowerCase().includes(customerNameFilter.toLowerCase());
      const matchesEmail = !customerEmailFilter || 
        customer.email.toLowerCase().includes(customerEmailFilter.toLowerCase());
      const matchesPhone = !customerPhoneFilter || 
        (customer.phone && customer.phone.toLowerCase().includes(customerPhoneFilter.toLowerCase()));
      
      return matchesName && matchesEmail && matchesPhone;
    });
    setFilteredCustomers(filteredCustomersResult);

    // Filter products
    const filteredProductsResult = products.filter(product => {
      const matchesName = !productNameFilter || 
        product.name.toLowerCase().includes(productNameFilter.toLowerCase());
      const matchesCategory = productCategoryFilter === 'all' || 
        (product as any).category?.toLowerCase() === productCategoryFilter.toLowerCase();
      const matchesPriceRange = (!minPrice || product.price >= parseFloat(minPrice)) && 
        (!maxPrice || product.price <= parseFloat(maxPrice));
      
      return matchesName && matchesCategory && matchesPriceRange;
    });
    setFilteredProducts(filteredProductsResult);
  };

  const resetFilters = () => {
    setIsFilterApplied(false);
    
    // Reset all filter inputs
    setSearchQuery("");
    setOrderNumberFilter("");
    setSelectedStatus("all");
    setSelectedDateRange("all");
    setStartDate("");
    setEndDate("");
    setCustomerNameFilter("");
    setCustomerEmailFilter("");
    setCustomerPhoneFilter("");
    setProductNameFilter("");
    setProductCategoryFilter("all");
    setMinPrice("");
    setMaxPrice("");
    
    // Reset filtered data to original data
    setFilteredOrders(orders);
    setFilteredCustomers(customers);
    setFilteredProducts(products);
  };

  const getChartData = () => {
    const now = new Date();
    let startDate = new Date();
    
    switch (selectedDateRange) {
      case 'lastweek':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'lastmonth':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '6months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const filteredOrders = selectedDateRange === 'all' 
      ? orders 
      : orders.filter(order => new Date(order.created_at) >= startDate);

    return filteredOrders.map(order => ({
      name: format(new Date(order.created_at), 'MMM d'),
      total_amount: order.total_amount
    }));
  };

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Layout>
      <Header 
        title="Sales" 
        description="CRM, quotes, orders and invoices."
      >
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/orders')}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                New Order
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsCreateCustomerModalOpen(true)}>
                <User className="h-4 w-4 mr-2" />
                Add Customer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsCreateProductModalOpen(true)}>
                <Package className="h-4 w-4 mr-2" />
                Add Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statusCounts.completed}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium flex items-center">
                +12% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {statusCounts.processing}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-500 font-medium flex items-center">
                +8% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {statusCounts.pending}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-yellow-500 font-medium flex items-center">
                -3% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {statusCounts.cancelled}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500 font-medium flex items-center">
                -5% from last month
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium flex items-center">
                +8% from last month
              </span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {totalOrders}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium flex items-center">
                +12% from last month
              </span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalCustomers}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium flex items-center">
                +5% from last month
              </span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(avgOrderValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500 font-medium flex items-center">
                -2% from last month
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Revenue Overview</CardTitle>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {selectedDateRange === "lastweek" ? "Last Week" :
                     selectedDateRange === "lastmonth" ? "Last Month" :
                     selectedDateRange === "6months" ? "Last 6 Months" :
                     selectedDateRange === "1year" ? "Last Year" : "All Time"}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSelectedDateRange("lastweek")}>
                    Last Week
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedDateRange("lastmonth")}>
                    Last Month
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedDateRange("6months")}>
                    Last 6 Months
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedDateRange("1year")}>
                    Last Year
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedDateRange("all")}>
                    All Time
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => formatCurrency(Number(value))}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="total_amount" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Filters</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
                <Button onClick={applyFilters}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeTab === 'orders' && (
                <>
                  <div className="space-y-2">
                    <Label>Order Number</Label>
                    <Input
                      placeholder="Filter by order number..."
                      value={orderNumberFilter}
                      onChange={(e) => setOrderNumberFilter(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
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

                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <Select value={selectedDateRange} onValueChange={setSelectedDateRange as any}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lastweek">Last Week</SelectItem>
                        <SelectItem value="lastmonth">Last Month</SelectItem>
                        <SelectItem value="6months">Last 6 Months</SelectItem>
                        <SelectItem value="1year">Last Year</SelectItem>
                        <SelectItem value="all">All Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Custom Date Range</Label>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'customers' && (
                <>
                  <div className="space-y-2">
                    <Label>Customer Name</Label>
                    <Input
                      placeholder="Filter by customer name..."
                      value={customerNameFilter}
                      onChange={(e) => setCustomerNameFilter(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      placeholder="Filter by email..."
                      value={customerEmailFilter}
                      onChange={(e) => setCustomerEmailFilter(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      placeholder="Filter by phone..."
                      value={customerPhoneFilter}
                      onChange={(e) => setCustomerPhoneFilter(e.target.value)}
                    />
                  </div>
                </>
              )}

              {activeTab === 'products' && (
                <>
                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input
                      placeholder="Filter by product name..."
                      value={productNameFilter}
                      onChange={(e) => setProductNameFilter(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={productCategoryFilter} onValueChange={setProductCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="software">Software</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="subscription">Subscription</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Price Range</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="orders">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="customers">
            <User className="h-4 w-4 mr-2" />
            Customers
          </TabsTrigger>
          <TabsTrigger value="products">
            <Package className="h-4 w-4 mr-2" />
            Products
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Orders</CardTitle>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-60"
                />
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
        </TabsContent>
        
        <TabsContent value="customers" className="space-y-4">
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 bg-muted/50">Customer</th>
                    <th className="text-left p-3 bg-muted/50">Contact</th>
                    <th className="text-left p-3 bg-muted/50">Orders</th>
                    <th className="text-left p-3 bg-muted/50">Total Spent</th>
                    <th className="text-left p-3 bg-muted/50">Last Purchase</th>
                    <th className="text-left p-3 bg-muted/50">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(isFilterApplied ? filteredCustomers : customers).map((customer) => {
                    const stats = customerStats[customer.id] || { totalOrders: 0, totalSpent: 0, lastPurchase: null };
                    return (
                      <tr key={customer.id} className="border-b hover:bg-muted/30">
                        <td className="p-3 font-medium">{customer.name}</td>
                        <td className="p-3">
                          <div>{customer.email}</div>
                          <div className="text-sm text-muted-foreground">{customer.phone || '-'}</div>
                        </td>
                        <td className="p-3">{stats.totalOrders}</td>
                        <td className="p-3 font-medium">{formatCurrency(stats.totalSpent)}</td>
                        <td className="p-3">{stats.lastPurchase ? formatDate(stats.lastPurchase) : '-'}</td>
                        <td className="p-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedCustomer(customer);
                                setIsEditCustomerModalOpen(true);
                              }}>
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteCustomer(customer.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="p-3 border-t flex justify-between items-center bg-muted/30">
              <p className="text-sm text-muted-foreground">
                Showing {(isFilterApplied ? filteredCustomers : customers).length} of {totalCustomers} customers
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 bg-muted/50">ID</th>
                    <th className="text-left p-3 bg-muted/50">Product</th>
                    <th className="text-left p-3 bg-muted/50">Description</th>
                    <th className="text-left p-3 bg-muted/50">Price</th>
                    <th className="text-left p-3 bg-muted/50">Stock</th>
                    <th className="text-left p-3 bg-muted/50">GST %</th>
                    <th className="text-left p-3 bg-muted/50">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(isFilterApplied ? filteredProducts : products).map((product) => (
                    <tr key={product.id} className="border-b hover:bg-muted/30">
                      <td className="p-3 font-medium">{product.id}</td>
                      <td className="p-3">{product.name}</td>
                      <td className="p-3">{product.description}</td>
                      <td className="p-3 font-medium">{formatCurrency(product.price)}</td>
                      <td className="p-3">{product.stock_quantity}</td>
                      <td className="p-3">{product.gst_percentage}%</td>
                      <td className="p-3">
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-3 border-t flex justify-between items-center bg-muted/30">
              <p className="text-sm text-muted-foreground">
                Showing {(isFilterApplied ? filteredProducts : products).length} of {products.length} products
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-3">Sales by Product Category</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Software', value: 45000 },
                      { name: 'Service', value: 34000 },
                      { name: 'Subscription', value: 28000 },
                    ]}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white border rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-3">Sales by Customer</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={customers.map(c => ({ 
                      name: c.name, 
                      value: customerStats[c.id]?.totalSpent || 0 
                    }))}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white border rounded-lg shadow-sm p-4 md:col-span-2">
              <h3 className="text-lg font-semibold mb-3">Monthly Sales Trend</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salesData.concat([
                      { name: 'Aug', amount: 7500 },
                      { name: 'Sep', amount: 8200 },
                      { name: 'Oct', amount: 7800 },
                      { name: 'Nov', amount: 9000 },
                      { name: 'Dec', amount: 12000 },
                    ])}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <CreateCustomerModal
        isOpen={isCreateCustomerModalOpen}
        onClose={() => setIsCreateCustomerModalOpen(false)}
        onCustomerCreated={handleCreateCustomer}
      />

      {selectedCustomer && (
        <EditCustomerModal
          isOpen={isEditCustomerModalOpen}
          onClose={() => {
            setIsEditCustomerModalOpen(false);
            setSelectedCustomer(null);
          }}
          customer={selectedCustomer}
          onCustomerUpdated={handleEditCustomer}
        />
      )}

      <CreateProductModal
        isOpen={isCreateProductModalOpen}
        onClose={() => setIsCreateProductModalOpen(false)}
        onProductCreated={handleProductCreated}
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

export default Sales;
