
import React from "react";
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
  Plus
} from "lucide-react";
import TaskManager from "@/components/Task/TaskManager";

const data = [
  { name: "Jan", revenue: 4000, expenses: 2400 },
  { name: "Feb", revenue: 3000, expenses: 1398 },
  { name: "Mar", revenue: 2000, expenses: 9800 },
  { name: "Apr", revenue: 2780, expenses: 3908 },
  { name: "May", revenue: 1890, expenses: 4800 },
  { name: "Jun", revenue: 2390, expenses: 3800 },
];

// Calculate total revenue
const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

// Calculate growth percentages (comparing last two months)
const lastMonthRevenue = data[data.length - 1].revenue;
const previousMonthRevenue = data[data.length - 2].revenue;
const revenueGrowth = ((lastMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;

// Mock customer data
const customerData = [
  { month: "Jan", count: 1900 },
  { month: "Feb", count: 2050 },
  { month: "Mar", count: 2150 },
  { month: "Apr", count: 2220 },
  { month: "May", count: 2280 },
  { month: "Jun", count: 2350 },
];

// Calculate new customers and growth
const newCustomers = customerData[customerData.length - 1].count;
const lastMonthCustomers = customerData[customerData.length - 1].count;
const previousMonthCustomers = customerData[customerData.length - 2].count;
const customerGrowth = ((lastMonthCustomers - previousMonthCustomers) / previousMonthCustomers) * 100;

// Mock sales data
const salesData = [
  { month: "Jan", count: 10500 },
  { month: "Feb", count: 10890 },
  { month: "Mar", count: 11230 },
  { month: "Apr", count: 11600 },
  { month: "May", count: 11950 },
  { month: "Jun", count: 12234 },
];

// Calculate total sales and growth
const totalSales = salesData[salesData.length - 1].count;
const lastMonthSales = salesData[salesData.length - 1].count;
const previousMonthSales = salesData[salesData.length - 2].count;
const salesGrowth = ((lastMonthSales - previousMonthSales) / previousMonthSales) * 100;

// Mock active users data
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

const Dashboard = () => {
  return (
    <Layout>
      <Header 
        title="Dashboard" 
        description="Welcome back, here's an overview of your business."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="scale-enter">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`${revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'} font-medium flex items-center`}>
                {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth.toFixed(1)}% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span> from last month
            </p>
          </CardContent>
        </Card>
        <Card className="scale-enter" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{newCustomers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`${customerGrowth >= 0 ? 'text-green-500' : 'text-red-500'} font-medium flex items-center`}>
                {customerGrowth >= 0 ? '+' : ''}{customerGrowth.toFixed(1)}% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span> from last month
            </p>
          </CardContent>
        </Card>
        <Card className="scale-enter" style={{ animationDelay: "0.2s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`${salesGrowth >= 0 ? 'text-green-500' : 'text-red-500'} font-medium flex items-center`}>
                {salesGrowth >= 0 ? '+' : ''}{salesGrowth.toFixed(1)}% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span> from last month
            </p>
          </CardContent>
        </Card>
        <Card className="scale-enter" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`${userGrowth >= 0 ? 'text-green-500' : 'text-red-500'} font-medium flex items-center`}>
                {userGrowth >= 0 ? '+' : ''}{userGrowth.toFixed(1)}% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span> from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 scale-enter">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
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
              <CardHeader>
                <CardTitle>Recent Tasks</CardTitle>
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
                <div className="text-sm">Strategy Meeting</div>
                <p className="text-xs text-muted-foreground">Today, 2:00 PM</p>
              </CardContent>
            </Card>
            <Card className="scale-enter" style={{ animationDelay: "0.1s" }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Documents</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm">Q2 Sales Report.pdf</div>
                <p className="text-xs text-muted-foreground">Modified 2 days ago</p>
              </CardContent>
            </Card>
            <Card className="scale-enter" style={{ animationDelay: "0.2s" }}>
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
                <div className="text-sm">Premium Plan - Acme Inc.</div>
                <p className="text-xs text-muted-foreground">$2,500.00 - 2 hours ago</p>
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
        
        <TabsContent value="tasks">
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
                <Button variant="outline" className="w-full justify-start">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Sales Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Customer Analytics
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
