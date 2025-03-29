
import React, { useState } from "react";
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

// Sample monthly revenue data
const monthlyRevenueData = [
  { month: "Jan", revenue: 45000, expenses: 30000, profit: 15000 },
  { month: "Feb", revenue: 48000, expenses: 32000, profit: 16000 },
  { month: "Mar", revenue: 52000, expenses: 34000, profit: 18000 },
  { month: "Apr", revenue: 55000, expenses: 36000, profit: 19000 },
  { month: "May", revenue: 59000, expenses: 38000, profit: 21000 },
  { month: "Jun", revenue: 62000, expenses: 40000, profit: 22000 },
  { month: "Jul", revenue: 65000, expenses: 41000, profit: 24000 },
  { month: "Aug", revenue: 68000, expenses: 43000, profit: 25000 },
  { month: "Sep", revenue: 72000, expenses: 45000, profit: 27000 },
  { month: "Oct", revenue: 76000, expenses: 47000, profit: 29000 },
  { month: "Nov", revenue: 80000, expenses: 49000, profit: 31000 },
  { month: "Dec", revenue: 85000, expenses: 52000, profit: 33000 },
];

// Sample revenue sources data for pie chart
const revenueSources = [
  { name: "Product Sales", value: 45 },
  { name: "Services", value: 30 },
  { name: "Subscriptions", value: 15 },
  { name: "Other", value: 10 },
];

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Calculate total revenue
const totalRevenue = monthlyRevenueData.reduce((sum, item) => sum + item.revenue, 0);
const totalProfit = monthlyRevenueData.reduce((sum, item) => sum + item.profit, 0);
const totalExpenses = monthlyRevenueData.reduce((sum, item) => sum + item.expenses, 0);

// Calculate YOY growth (assuming last year's revenue was 10% less)
const lastYearRevenue = totalRevenue * 0.9;
const revenueGrowth = ((totalRevenue - lastYearRevenue) / lastYearRevenue) * 100;

const RevenueReport = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("year");
  const [chartType, setChartType] = useState("bar");

  // Filter data based on selected period
  const getFilteredData = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-indexed (0 = January)
    
    switch (selectedPeriod) {
      case "month":
        // Current month only
        return monthlyRevenueData.slice(currentMonth, currentMonth + 1);
      case "quarter":
        // Current quarter (assuming quarters align with calendar months)
        const currentQuarter = Math.floor(currentMonth / 3);
        const startMonth = currentQuarter * 3;
        return monthlyRevenueData.slice(startMonth, startMonth + 3);
      case "half":
        // Current half-year
        const isFirstHalf = currentMonth < 6;
        return isFirstHalf 
          ? monthlyRevenueData.slice(0, 6) 
          : monthlyRevenueData.slice(6, 12);
      case "year":
      default:
        // Full year
        return monthlyRevenueData;
    }
  };

  const filteredData = getFilteredData();
  
  // Calculate period totals
  const periodTotals = {
    revenue: filteredData.reduce((sum, item) => sum + item.revenue, 0),
    expenses: filteredData.reduce((sum, item) => sum + item.expenses, 0),
    profit: filteredData.reduce((sum, item) => sum + item.profit, 0),
  };

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
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`${revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'} font-medium`}>
                {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth.toFixed(1)}%
              </span> from last year
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalProfit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">
                {(totalProfit/totalRevenue*100).toFixed(1)}%
              </span> profit margin
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-muted-foreground font-medium">
                {(totalExpenses/totalRevenue*100).toFixed(1)}%
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
                  <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                  <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                  <div className="text-2xl font-bold">${periodTotals.revenue.toLocaleString()}</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Expenses</div>
                  <div className="text-2xl font-bold">${periodTotals.expenses.toLocaleString()}</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Profit</div>
                  <div className="text-2xl font-bold">${periodTotals.profit.toLocaleString()}</div>
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
                  {filteredData.map((item) => (
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
                    <TableCell className="text-right">${periodTotals.revenue.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${periodTotals.expenses.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${periodTotals.profit.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      {(periodTotals.profit/periodTotals.revenue*100).toFixed(1)}%
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
                            ${((totalRevenue * source.value) / 100).toLocaleString()}
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
