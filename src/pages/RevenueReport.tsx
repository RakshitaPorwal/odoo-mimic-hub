import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Header/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Download,
  FileText,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon
} from "lucide-react";
import { Order, getOrders } from '@/services/orderService';
import { format } from "date-fns";

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

const RevenueReport = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("year");
  const [chartType, setChartType] = useState("bar");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [selectedPeriod]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const currentDate = new Date();
      let startDate: Date | undefined;
      let endDate: Date | undefined;

      switch (selectedPeriod) {
        case "month":
          startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
          break;
        case "quarter":
          const currentQuarter = Math.floor(currentDate.getMonth() / 3);
          startDate = new Date(currentDate.getFullYear(), currentQuarter * 3, 1);
          endDate = new Date(currentDate.getFullYear(), (currentQuarter + 1) * 3, 0);
          break;
        case "half":
          const isFirstHalf = currentDate.getMonth() < 6;
          startDate = new Date(currentDate.getFullYear(), isFirstHalf ? 0 : 6, 1);
          endDate = new Date(currentDate.getFullYear(), isFirstHalf ? 5 : 11, 31);
          break;
        case "year":
          startDate = new Date(currentDate.getFullYear(), 0, 1);
          endDate = new Date(currentDate.getFullYear(), 11, 31);
          break;
      }

      const ordersData = await getOrders({
        start_date: startDate?.toISOString(),
        end_date: endDate?.toISOString(),
      });
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Process orders data for charts
  const getChartData = () => {
    const monthlyData = new Map();
    
    orders.forEach(order => {
      const date = new Date(order.created_at);
      const monthKey = format(date, 'MMM');
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, {
          month: monthKey,
          revenue: 0,
          expenses: 0,
          profit: 0
        });
      }
      
      const data = monthlyData.get(monthKey);
      data.revenue += order.total_amount;
      // Assuming expenses are 70% of revenue for this example
      data.expenses += order.total_amount * 0.7;
      data.profit += order.total_amount * 0.3;
    });

    return Array.from(monthlyData.values());
  };

  // Calculate revenue sources
  const getRevenueSources = () => {
    const sources = new Map();
    
    orders.forEach(order => {
      order.order_items?.forEach(item => {
        const category = (item.product as any)?.category || 'Other';
        if (!sources.has(category)) {
          sources.set(category, 0);
        }
        sources.set(category, sources.get(category) + (item.quantity * item.rate));
      });
    });

    const total = Array.from(sources.values()).reduce((sum, value) => sum + value, 0);
    
    return Array.from(sources.entries()).map(([name, value]) => ({
      name,
      value: Math.round((value / total) * 100)
    }));
  };

  const chartData = getChartData();
  const revenueSources = getRevenueSources();
  
  // Calculate totals
  const totals = chartData.reduce((acc, item) => ({
    revenue: acc.revenue + item.revenue,
    expenses: acc.expenses + item.expenses,
    profit: acc.profit + item.profit
  }), { revenue: 0, expenses: 0, profit: 0 });

  // Calculate growth (comparing with previous period)
  const calculateGrowth = () => {
    if (chartData.length < 2) return 0;
    const currentPeriod = chartData[chartData.length - 1].revenue;
    const previousPeriod = chartData[chartData.length - 2].revenue;
    return ((currentPeriod - previousPeriod) / previousPeriod) * 100;
  };

  const growth = calculateGrowth();

  return (
    <Layout>
      <Header 
        title="Revenue Report" 
        description="Analyze your financial performance"
      >
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </Header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totals.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`${growth >= 0 ? 'text-green-500' : 'text-red-500'} font-medium`}>
                {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
              </span> from last year
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totals.profit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">
                {(totals.profit/totals.revenue*100).toFixed(1)}%
              </span> profit margin
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totals.expenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-muted-foreground font-medium">
                {(totals.expenses/totals.revenue*100).toFixed(1)}%
              </span> of revenue
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-sm font-medium mr-2">Time Period:</span>
            <Select
              value={selectedPeriod}
              onValueChange={setSelectedPeriod}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Current Month</SelectItem>
                <SelectItem value="quarter">Current Quarter</SelectItem>
                <SelectItem value="half">Current Half-Year</SelectItem>
                <SelectItem value="year">Full Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium mr-2">Chart Type:</span>
          <Button 
            variant={chartType === "bar" ? "default" : "outline"} 
            size="sm"
            onClick={() => setChartType("bar")}
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Button 
            variant={chartType === "line" ? "default" : "outline"} 
            size="sm"
            onClick={() => setChartType("line")}
          >
            <LineChartIcon className="h-4 w-4" />
          </Button>
          <Button 
            variant={chartType === "pie" ? "default" : "outline"} 
            size="sm"
            onClick={() => setChartType("pie")}
          >
            <PieChartIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="chart" className="w-full">
        <TabsList>
          <TabsTrigger value="chart">Chart View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="sources">Revenue Sources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              {chartType === "bar" && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#4f46e5" />
                    <Bar dataKey="expenses" name="Expenses" fill="#94a3b8" />
                    <Bar dataKey="profit" name="Profit" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              )}
              
              {chartType === "line" && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#4f46e5" strokeWidth={2} />
                    <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#94a3b8" strokeWidth={2} />
                    <Line type="monotone" dataKey="profit" name="Profit" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
              
              {chartType === "pie" && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueSources}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {revenueSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Period Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Revenue</div>
                  <div className="text-2xl font-bold">${totals.revenue.toLocaleString()}</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Expenses</div>
                  <div className="text-2xl font-bold">${totals.expenses.toLocaleString()}</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Profit</div>
                  <div className="text-2xl font-bold">${totals.profit.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Expenses</TableHead>
                    <TableHead className="text-right">Profit</TableHead>
                    <TableHead className="text-right">Profit Margin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chartData.map((item) => (
                    <TableRow key={item.month}>
                      <TableCell className="font-medium">{item.month}</TableCell>
                      <TableCell className="text-right">${item.revenue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${item.expenses.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${item.profit.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        {(item.profit/item.revenue*100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-right">${totals.revenue.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${totals.expenses.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${totals.profit.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      {(totals.profit/totals.revenue*100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sources">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueSources}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {revenueSources.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Source</TableHead>
                        <TableHead className="text-right">Percentage</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {revenueSources.map((source, index) => (
                        <TableRow key={source.name}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2" 
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              />
                              {source.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{source.value}%</TableCell>
                          <TableCell className="text-right">
                            ${((totals.revenue * source.value) / 100).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default RevenueReport;
