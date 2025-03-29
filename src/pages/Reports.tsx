
import React from "react";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Header/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Download,
  Filter,
  Calendar,
  ArrowUpRight
} from "lucide-react";
import { format } from "date-fns";
import { Task } from "@/services/taskService";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/services/taskService";

// Mock revenue data
const revenueData = [
  { month: "January", revenue: 42500, expenses: 28900, profit: 13600 },
  { month: "February", revenue: 38700, expenses: 25600, profit: 13100 },
  { month: "March", revenue: 45200, expenses: 29800, profit: 15400 },
  { month: "April", revenue: 51300, expenses: 32100, profit: 19200 },
  { month: "May", revenue: 49800, expenses: 30500, profit: 19300 },
  { month: "June", revenue: 55200, expenses: 33600, profit: 21600 },
];

// Calculate totals
const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
const totalExpenses = revenueData.reduce((sum, item) => sum + item.expenses, 0);
const totalProfit = revenueData.reduce((sum, item) => sum + item.profit, 0);

// Data for the Chart
const chartData = [
  { name: "Jan", revenue: 42500, expenses: 28900 },
  { name: "Feb", revenue: 38700, expenses: 25600 },
  { name: "Mar", revenue: 45200, expenses: 29800 },
  { name: "Apr", revenue: 51300, expenses: 32100 },
  { name: "May", revenue: 49800, expenses: 30500 },
  { name: "Jun", revenue: 55200, expenses: 33600 },
];

const Reports = () => {
  // Fetch tasks for the task report
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks
  });

  return (
    <Layout>
      <Header
        title="Reports"
        description="View detailed reports and analytics for your business"
      >
        <Button size="sm" variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Select Date Range
        </Button>
      </Header>

      <Tabs defaultValue="revenue" className="mt-6">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Report</TabsTrigger>
          <TabsTrigger value="tasks">Task Report</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="scale-enter">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 font-medium flex items-center">
                    +10.2% <ArrowUpRight className="h-3 w-3 ml-1" />
                  </span> from previous period
                </p>
              </CardContent>
            </Card>
            <Card className="scale-enter" style={{ animationDelay: "0.1s" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-500 font-medium flex items-center">
                    +7.8% <ArrowUpRight className="h-3 w-3 ml-1" />
                  </span> from previous period
                </p>
              </CardContent>
            </Card>
            <Card className="scale-enter" style={{ animationDelay: "0.2s" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalProfit.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 font-medium flex items-center">
                    +14.5% <ArrowUpRight className="h-3 w-3 ml-1" />
                  </span> from previous period
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Monthly Revenue Trends</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Monthly Revenue Table</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Expenses</TableHead>
                    <TableHead className="text-right">Profit</TableHead>
                    <TableHead className="text-right">Margin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenueData.map((item) => (
                    <TableRow key={item.month}>
                      <TableCell className="font-medium">{item.month}</TableCell>
                      <TableCell className="text-right">${item.revenue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${item.expenses.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${item.profit.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        {((item.profit / item.revenue) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Task Report</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {tasksLoading ? (
                <div className="text-center py-8">Loading tasks...</div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No tasks available. Create tasks to view the task report.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[350px]">Task Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Assigned To</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(tasks as Task[]).map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>
                          <div className={`px-2 py-1 rounded-full text-xs inline-block ${
                            task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.status}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`px-2 py-1 rounded-full text-xs inline-block ${
                            task.priority === 'High' ? 'bg-red-100 text-red-800' :
                            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </div>
                        </TableCell>
                        <TableCell>{format(new Date(task.due_date), 'MMM d, yyyy')}</TableCell>
                        <TableCell>{task.assigned_to || 'Unassigned'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Task Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                  data={[
                    { status: 'Not Started', count: (tasks as Task[]).filter(t => t.status === 'Not Started').length },
                    { status: 'In Progress', count: (tasks as Task[]).filter(t => t.status === 'In Progress').length },
                    { status: 'Completed', count: (tasks as Task[]).filter(t => t.status === 'Completed').length }
                  ]} 
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Generate custom reports based on your specific requirements
              </p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-6">
                  <FileText className="h-10 w-10 mb-2" />
                  <span className="text-lg font-medium">Sales by Product</span>
                  <span className="text-sm text-muted-foreground mt-1">
                    Analyze product performance
                  </span>
                </Button>
                <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-6">
                  <FileText className="h-10 w-10 mb-2" />
                  <span className="text-lg font-medium">Customer Analytics</span>
                  <span className="text-sm text-muted-foreground mt-1">
                    Customer behavior insights
                  </span>
                </Button>
                <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-6">
                  <FileText className="h-10 w-10 mb-2" />
                  <span className="text-lg font-medium">Financial Statement</span>
                  <span className="text-sm text-muted-foreground mt-1">
                    Complete financial analysis
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Reports;
