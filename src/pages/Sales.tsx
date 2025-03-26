
import React, { useState } from "react";
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
  BarChart3
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Layout>
      <Header 
        title="Sales" 
        description="CRM, quotes, orders and invoices."
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create New
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <ShoppingCart className="h-4 w-4 mr-2" />
              New Order
            </DropdownMenuItem>
            <DropdownMenuItem>
              <User className="h-4 w-4 mr-2" />
              Add Customer
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Package className="h-4 w-4 mr-2" />
              Add Product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-1">{formatCurrency(125780.50)}</h3>
              <p className="text-xs text-green-600 mt-1">+8% from last month</p>
            </div>
            <div className="p-2 bg-blue-100 text-blue-700 rounded-md">
              <Banknote className="h-5 w-5" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Orders</p>
              <h3 className="text-2xl font-bold mt-1">243</h3>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </div>
            <div className="p-2 bg-purple-100 text-purple-700 rounded-md">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Customers</p>
              <h3 className="text-2xl font-bold mt-1">128</h3>
              <p className="text-xs text-green-600 mt-1">+5% from last month</p>
            </div>
            <div className="p-2 bg-green-100 text-green-700 rounded-md">
              <User className="h-5 w-5" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Avg. Order Value</p>
              <h3 className="text-2xl font-bold mt-1">{formatCurrency(517.62)}</h3>
              <p className="text-xs text-red-600 mt-1">-2% from last month</p>
            </div>
            <div className="p-2 bg-orange-100 text-orange-700 rounded-md">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6 bg-white border rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Revenue Overview</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Last 6 Months
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Last 30 Days</DropdownMenuItem>
              <DropdownMenuItem>Last 6 Months</DropdownMenuItem>
              <DropdownMenuItem>Last Year</DropdownMenuItem>
              <DropdownMenuItem>All Time</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={salesData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders, customers, products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
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
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 bg-muted/50">Order ID</th>
                    <th className="text-left p-3 bg-muted/50">Customer</th>
                    <th className="text-left p-3 bg-muted/50">Date</th>
                    <th className="text-left p-3 bg-muted/50">Items</th>
                    <th className="text-left p-3 bg-muted/50">Amount</th>
                    <th className="text-left p-3 bg-muted/50">Status</th>
                    <th className="text-left p-3 bg-muted/50">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-muted/30">
                      <td className="p-3 font-medium">{order.id}</td>
                      <td className="p-3">{order.customer}</td>
                      <td className="p-3">{formatDate(order.date)}</td>
                      <td className="p-3">{order.items}</td>
                      <td className="p-3 font-medium">{formatCurrency(order.amount)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
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
              <p className="text-sm text-muted-foreground">Showing 7 of 243 orders</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </div>
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
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-muted/30">
                      <td className="p-3 font-medium">{customer.name}</td>
                      <td className="p-3">
                        <div>{customer.contact}</div>
                        <div className="text-sm text-muted-foreground">{customer.email}</div>
                      </td>
                      <td className="p-3">{customer.orders}</td>
                      <td className="p-3 font-medium">{formatCurrency(customer.totalSpent)}</td>
                      <td className="p-3">{formatDate(customer.lastPurchase)}</td>
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
              <p className="text-sm text-muted-foreground">Showing 5 of 128 customers</p>
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
                    <th className="text-left p-3 bg-muted/50">Category</th>
                    <th className="text-left p-3 bg-muted/50">Price</th>
                    <th className="text-left p-3 bg-muted/50">Sales</th>
                    <th className="text-left p-3 bg-muted/50">Rating</th>
                    <th className="text-left p-3 bg-muted/50">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-muted/30">
                      <td className="p-3 font-medium">{product.id}</td>
                      <td className="p-3">{product.name}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 text-xs rounded-full bg-muted">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-3 font-medium">{formatCurrency(product.price)}</td>
                      <td className="p-3">{product.sales}</td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <span className="text-yellow-500 mr-1">★</span>
                          {product.rating}
                        </div>
                      </td>
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
              <p className="text-sm text-muted-foreground">Showing 5 of 24 products</p>
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
                    data={customers.map(c => ({ name: c.name, value: c.totalSpent }))}
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
    </Layout>
  );
};

export default Sales;
