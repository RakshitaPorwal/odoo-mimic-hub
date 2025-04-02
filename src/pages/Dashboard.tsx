import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Header/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { 
  ArrowUpRight,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Calendar,
  ClipboardList,
  Clock,
  Plus,
  ArrowRight,
  File,
  FileText,
  FileImage,
  FileSpreadsheet,
  Presentation
} from "lucide-react";
import TaskManager from "@/components/Task/TaskManager";
import { Link } from "react-router-dom";
import { eventService, Event } from "@/services/eventService";
import { documentService, Document } from "@/services/documentService";
import { Order, getOrders } from '@/services/orderService';
import { Badge } from "@/components/ui/badge";

const data = [
  { name: "Jan", revenue: 4000, expenses: 2400 },
  { name: "Feb", revenue: 3000, expenses: 1398 },
  { name: "Mar", revenue: 2000, expenses: 9800 },
  { name: "Apr", revenue: 2780, expenses: 3908 },
  { name: "May", revenue: 1890, expenses: 4800 },
  { name: "Jun", revenue: 2390, expenses: 3800 },
  { name: "Jul", revenue: 3490, expenses: 4300 },
  { name: "Aug", revenue: 3890, expenses: 4200 },
  { name: "Sep", revenue: 4290, expenses: 4100 },
  { name: "Oct", revenue: 4690, expenses: 4500 },
  { name: "Nov", revenue: 5290, expenses: 4700 },
  { name: "Dec", revenue: 5890, expenses: 5100 },
];

// Calculate total revenue
const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

// Calculate growth percentages (comparing last two months)
const lastMonthRevenue = data[data.length - 1].revenue;
const previousMonthRevenue = data[data.length - 2].revenue;
const revenueGrowth = ((lastMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;

// Customer data
const customerData = [
  { month: "Jan", count: 1900 },
  { month: "Feb", count: 2050 },
  { month: "Mar", count: 2150 },
  { month: "Apr", count: 2220 },
  { month: "May", count: 2280 },
  { month: "Jun", count: 2350 },
  { month: "Jul", count: 2420 },
  { month: "Aug", count: 2490 },
  { month: "Sep", count: 2550 },
  { month: "Oct", count: 2650 },
  { month: "Nov", count: 2750 },
  { month: "Dec", count: 2850 },
];

// Calculate new customers and growth
const newCustomers = customerData[customerData.length - 1].count - customerData[customerData.length - 2].count;
const lastMonthCustomers = customerData[customerData.length - 1].count;
const previousMonthCustomers = customerData[customerData.length - 2].count;
const customerGrowth = ((lastMonthCustomers - previousMonthCustomers) / previousMonthCustomers) * 100;

// Sales data
const salesData = [
  { month: "Jan", count: 10500 },
  { month: "Feb", count: 10890 },
  { month: "Mar", count: 11230 },
  { month: "Apr", count: 11600 },
  { month: "May", count: 11950 },
  { month: "Jun", count: 12234 },
  { month: "Jul", count: 12600 },
  { month: "Aug", count: 13000 },
  { month: "Sep", count: 13400 },
  { month: "Oct", count: 13900 },
  { month: "Nov", count: 14500 },
  { month: "Dec", count: 15200 },
];

// Calculate total sales and growth
const totalSales = salesData[salesData.length - 1].count;
const lastMonthSales = salesData[salesData.length - 1].count;
const previousMonthSales = salesData[salesData.length - 2].count;
const salesGrowth = ((lastMonthSales - previousMonthSales) / previousMonthSales) * 100;

// Active users data
const activeUsersData = [
  { week: "Week 1", count: 510 },
  { week: "Week 2", count: 530 },
  { week: "Week 3", count: 550 },
  { week: "Week 4", count: 573 },
];

// Calculate active users and growth
const activeUsers = activeUsersData[activeUsersData.length - 1].count;
const lastWeekUsers = activeUsersData[activeUsersData.length - 1].count;
const previousWeekUsers = activeUsersData[activeUsersData.length - 2].count;
const userGrowth = ((lastWeekUsers - previousWeekUsers) / previousWeekUsers) * 100;

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else {
    return `${Math.floor(diffInHours / 24)} days ago`;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

const Dashboard = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [avgOrderValue, setAvgOrderValue] = useState(0);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const events = await eventService.getUpcomingEvents();
        setUpcomingEvents(events);
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    const fetchRecentDocuments = async () => {
      try {
        const documents = await documentService.getRecentDocuments(5);
        setRecentDocuments(documents);
      } catch (error) {
        console.error('Error fetching recent documents:', error);
      } finally {
        setIsLoadingDocuments(false);
      }
    };

    const fetchOrdersData = async () => {
      try {
        const orders = await getOrders({});
        // Sort orders by created_at in descending order and take the 2 most recent
        const recent = orders.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ).slice(0, 2);
        setRecentOrders(recent);

        // Calculate metrics
        const total = orders.reduce((sum, order) => sum + order.total_amount, 0);
        setTotalRevenue(total);
        setTotalOrders(orders.length);
        setAvgOrderValue(orders.length > 0 ? total / orders.length : 0);
        
        // Get unique customers
        const uniqueCustomers = new Set(orders.map(order => order.customer?.id)).size;
        setTotalCustomers(uniqueCustomers);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchUpcomingEvents();
    fetchRecentDocuments();
    fetchOrdersData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Layout>
      <Header 
        title="Dashboard" 
        description="Welcome back, here's an overview of your business."
      >
        <Button 
          size="sm" 
          onClick={() => {
            const taskTabElement = document.querySelector('[data-value="tasks"]');
            if (taskTabElement) {
              (taskTabElement as HTMLElement).click();
              setTimeout(() => {
                const newTaskButton = document.querySelector('.task-tab-content button');
                if (newTaskButton) {
                  (newTaskButton as HTMLElement).click();
                }
              }, 100);
            }
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </Header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="scale-enter">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium flex items-center">
                From {totalOrders} orders
              </span>
            </p>
          </CardContent>
        </Card>
        <Card className="scale-enter" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium flex items-center">
                Active customers
              </span>
            </p>
          </CardContent>
        </Card>
        <Card className="scale-enter" style={{ animationDelay: "0.2s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium flex items-center">
                All time orders
              </span>
            </p>
          </CardContent>
        </Card>
        <Card className="scale-enter" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(avgOrderValue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium flex items-center">
                Per order
              </span>
            </p>
          </CardContent>
        </Card>
        <Card className="scale-enter" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Documents</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingDocuments ? (
              <div className="text-sm text-muted-foreground">Loading documents...</div>
            ) : recentDocuments.length > 0 ? (
              <div className="space-y-2">
                {recentDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-1 rounded-md bg-muted">
                        <doc.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium truncate max-w-[150px]" title={doc.name}>
                          {doc.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Modified {formatDate(doc.modified)}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/documents">
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No recent documents</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="tasks" data-value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 scale-enter">
              <CardHeader className="flex justify-between items-center">
                <CardTitle>Revenue Overview</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/revenue-report">
                    View Full Report
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3 scale-enter" style={{ animationDelay: "0.1s" }}>
              <CardHeader className="flex justify-between items-center">
                <CardTitle>Recent Tasks</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/task-report">
                    View All Tasks
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <TaskManager />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="scale-enter">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoadingEvents ? (
                  <div className="text-sm text-muted-foreground">Loading events...</div>
                ) : upcomingEvents.length > 0 ? (
                  <div className="space-y-2">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{event.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(event.start_time).toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit', 
                              hour12: true 
                            })}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/calendar">
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No upcoming events</div>
                )}
              </CardContent>
            </Card>
            <Card className="scale-enter" style={{ animationDelay: "0.1s" }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Project Status</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm">Website Redesign</div>
                <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[65%]"></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">65% Completed</p>
              </CardContent>
            </Card>
            <Card className="scale-enter" style={{ animationDelay: "0.3s" }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Sales</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <div className="text-sm text-muted-foreground">Loading recent sales...</div>
                ) : recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">
                            {order.customer?.name || 'Unknown Customer'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatCurrency(order.total_amount)} - {formatTimeAgo(order.created_at)}
                          </div>
                        </div>
                        <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No recent sales</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" />
                  <Line type="monotone" dataKey="expenses" stroke="hsl(var(--muted-foreground))" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tasks" className="task-tab-content">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Task Management</CardTitle>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </CardHeader>
            <CardContent>
              <TaskManager />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Available Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Select a report to view detailed information</p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/revenue-report">
                    <ClipboardList className="mr-2 h-4 w-4" />
                    Revenue Report
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/task-report">
                    <Users className="mr-2 h-4 w-4" />
                    Task Report
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Financial Statement
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Dashboard;
