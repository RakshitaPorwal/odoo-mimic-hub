
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
  Plus, 
  Download, 
  Filter, 
  Calendar,
  DollarSign,
  CreditCard,
  Receipt,
  FileText,
  Building,
  TrendingUp,
  ArrowUpRight,
  ShoppingCart,
  RefreshCw,
  ArrowDownRight,
  AlertCircle,
  ChevronRight
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getInvoices } from "@/services/invoiceService";
import { toast } from "@/hooks/use-toast";

// Mock transaction data
const transactionsData = [
  {
    id: 1,
    date: new Date(2023, 7, 5),
    type: "Income",
    category: "Sales Revenue",
    amount: 5000,
    description: "Monthly subscription payments",
    paymentMethod: "Bank Transfer",
    reference: "INV-2023-001",
  },
  {
    id: 2,
    date: new Date(2023, 7, 8),
    type: "Expense",
    category: "Office Expenses",
    amount: -1200,
    description: "Office rent for August",
    paymentMethod: "Bank Transfer",
    reference: "RENT-2023-08",
  },
  {
    id: 3,
    date: new Date(2023, 7, 12),
    type: "Expense",
    category: "Utilities",
    amount: -350,
    description: "Electricity bill",
    paymentMethod: "Credit Card",
    reference: "UTIL-2023-08-E",
  },
  {
    id: 4,
    date: new Date(2023, 7, 15),
    type: "Income",
    category: "Consulting",
    amount: 3500,
    description: "Consulting services for Client XYZ",
    paymentMethod: "Bank Transfer",
    reference: "INV-2023-002",
  },
  {
    id: 5,
    date: new Date(2023, 7, 20),
    type: "Expense",
    category: "Salaries",
    amount: -8500,
    description: "Employee salaries for August",
    paymentMethod: "Bank Transfer",
    reference: "SAL-2023-08",
  },
];

// Monthly data for charts with updated values to match card metrics
const monthlyData = [
  { name: "Jan", income: 6000, expenses: 4000, profit: 2000 },
  { name: "Feb", income: 7500, expenses: 5000, profit: 2500 },
  { name: "Mar", income: 9000, expenses: 6000, profit: 3000 },
  { name: "Apr", income: 10000, expenses: 7500, profit: 2500 },
  { name: "May", income: 11000, expenses: 7000, profit: 4000 },
  { name: "Jun", income: 12500, expenses: 8000, profit: 4500 },
  { name: "Jul", income: 13500, expenses: 9000, profit: 4500 },
  { name: "Aug", income: 15000, expenses: 10000, profit: 5000 },
  { name: "Sep", income: 16500, expenses: 11000, profit: 5500 },
  { name: "Oct", income: 17500, expenses: 11500, profit: 6000 },
  { name: "Nov", income: 18500, expenses: 12000, profit: 6500 },
  { name: "Dec", income: 20000, expenses: 13000, profit: 7000 }
];

// Customer growth data
const customerData = [
  { month: "Sep", count: 2100 },
  { month: "Oct", count: 2200 },
  { month: "Nov", count: 2250 },
  { month: "Dec", count: 2350 }
];

// Sales data
const salesData = [
  { month: "Sep", sales: 11200 },
  { month: "Oct", sales: 11700 },
  { month: "Nov", sales: 11900 },
  { month: "Dec", sales: 12234 }
];

// User activity data
const userActivityData = [
  { week: "Week 1", users: 530 },
  { week: "Week 2", users: 510 },
  { week: "Week 3", users: 560 },
  { week: "Week 4", users: 573 }
];

const Accounting = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState(transactionsData);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    type: "Income",
    category: "",
    amount: "",
    description: "",
    paymentMethod: "Bank Transfer",
    reference: "",
  });

  // Fetch invoices
  const { data: invoices, isLoading: invoicesLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: getInvoices,
  });

  // Calculate total income
  const currentMonthIncome = monthlyData[monthlyData.length - 1].income;
  const prevMonthIncome = monthlyData[monthlyData.length - 2].income;
  const incomeGrowthRate = ((currentMonthIncome - prevMonthIncome) / prevMonthIncome) * 100;

  // Calculate total income from transactions
  const totalIncome = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate total expenses (absolute value)
  const totalExpenses = Math.abs(
    transactions
      .filter((t) => t.type === "Expense")
      .reduce((sum, t) => sum + t.amount, 0)
  );

  // Calculate net profit
  const netProfit = totalIncome - totalExpenses;

  // Calculate customer growth
  const currentMonthCustomers = customerData[customerData.length - 1].count;
  const prevMonthCustomers = customerData[customerData.length - 2].count;
  const customerGrowthRate = ((currentMonthCustomers - prevMonthCustomers) / prevMonthCustomers) * 100;

  // Calculate sales growth
  const currentMonthSales = salesData[salesData.length - 1].sales;
  const prevMonthSales = salesData[salesData.length - 2].sales;
  const salesGrowthRate = ((currentMonthSales - prevMonthSales) / prevMonthSales) * 100;

  // Calculate user activity growth
  const currentWeekUsers = userActivityData[userActivityData.length - 1].users;
  const prevWeekUsers = userActivityData[userActivityData.length - 2].users;
  const userGrowthRate = ((currentWeekUsers - prevWeekUsers) / prevWeekUsers) * 100;

  // Calculate total revenue including previous months
  const totalRevenue = monthlyData.reduce((sum, month) => sum + month.income, 0);

  const handleAddTransaction = () => {
    if (!newTransaction.category || !newTransaction.amount) {
      toast({
        title: "Required fields missing",
        description: "Please fill in the category and amount fields",
        variant: "destructive"
      });
      return;
    }

    const amount =
      newTransaction.type === "Expense"
        ? -Math.abs(parseFloat(newTransaction.amount))
        : Math.abs(parseFloat(newTransaction.amount));

    const transactionWithId = {
      ...newTransaction,
      id: transactions.length > 0 ? Math.max(...transactions.map((t) => t.id)) + 1 : 1,
      date: new Date(newTransaction.date),
      amount: amount,
    };

    setTransactions([transactionWithId, ...transactions]);
    setIsAddTransactionOpen(false);
    resetTransactionForm();
    
    toast({
      title: "Transaction added",
      description: `A new ${newTransaction.type.toLowerCase()} transaction has been added.`
    });
  };

  const resetTransactionForm = () => {
    setNewTransaction({
      date: format(new Date(), "yyyy-MM-dd"),
      type: "Income",
      category: "",
      amount: "",
      description: "",
      paymentMethod: "Bank Transfer",
      reference: "",
    });
  };

  const handleCreateInvoice = () => {
    navigate("/create-invoice");
  };

  return (
    <Layout>
      <Header 
        title="Accounting" 
        description="Manage your finances, transactions, and financial reports."
      >
        <div className="flex flex-wrap gap-2">
          <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
                <DialogDescription>
                  Enter the details of your new transaction below.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newTransaction.date}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          date: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Transaction Type *</Label>
                    <Select
                      value={newTransaction.type}
                      onValueChange={(value) =>
                        setNewTransaction({
                          ...newTransaction,
                          type: value,
                        })
                      }
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Income">Income</SelectItem>
                        <SelectItem value="Expense">Expense</SelectItem>
                        <SelectItem value="Transfer">Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      value={newTransaction.category}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          category: e.target.value,
                        })
                      }
                      placeholder="e.g., Sales, Office Expenses"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="amount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={newTransaction.amount}
                        onChange={(e) =>
                          setNewTransaction({
                            ...newTransaction,
                            amount: e.target.value,
                          })
                        }
                        className="pl-7"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTransaction.description}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter a description"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select
                      value={newTransaction.paymentMethod}
                      onValueChange={(value) =>
                        setNewTransaction({
                          ...newTransaction,
                          paymentMethod: value,
                        })
                      }
                    >
                      <SelectTrigger id="paymentMethod">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="Check">Check</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reference">Reference ID</Label>
                    <Input
                      id="reference"
                      value={newTransaction.reference}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          reference: e.target.value,
                        })
                      }
                      placeholder="e.g., INV-2023-001"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddTransactionOpen(false);
                    resetTransactionForm();
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddTransaction}>Add Transaction</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button size="sm" variant="outline" onClick={() => navigate('/invoices')}>
            <Receipt className="h-4 w-4 mr-2" />
            View Invoices
          </Button>
        </div>
      </Header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium flex items-center">
                +{incomeGrowthRate.toFixed(1)}% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Building className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              +{currentMonthCustomers}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium flex items-center">
                +{customerGrowthRate.toFixed(1)}% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">
              +{currentMonthSales.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium flex items-center">
                +{salesGrowthRate.toFixed(1)}% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <CreditCard className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              +{currentWeekUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium flex items-center">
                +{userGrowthRate.toFixed(1)}% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span> from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="mt-6">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reports">Financial Reports</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="taxes">Taxes</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Recent Transactions</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-sm">
                      <th className="text-left pb-3 font-medium">Date</th>
                      <th className="text-left pb-3 font-medium">Description</th>
                      <th className="text-left pb-3 font-medium">Category</th>
                      <th className="text-left pb-3 font-medium">Amount</th>
                      <th className="text-left pb-3 font-medium">Type</th>
                      <th className="text-left pb-3 font-medium">Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 text-sm">
                          {format(transaction.date, "MMM d, yyyy")}
                        </td>
                        <td className="py-3 text-sm max-w-[200px] truncate">
                          {transaction.description || "-"}
                        </td>
                        <td className="py-3 text-sm">{transaction.category}</td>
                        <td className={`py-3 text-sm font-medium ${transaction.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {transaction.amount >= 0 ? "+" : ""}
                          ${Math.abs(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 text-sm">
                          <Badge 
                            variant="outline" 
                            className={
                              transaction.type === "Income" 
                                ? "bg-green-50 text-green-700 border-green-200" 
                                : transaction.type === "Expense"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                            }
                          >
                            {transaction.type}
                          </Badge>
                        </td>
                        <td className="py-3 text-sm">{transaction.paymentMethod}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Financial Reports</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Date Range
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="profit-loss">
                <TabsList className="w-full md:w-[400px] mb-4">
                  <TabsTrigger value="profit-loss">Profit & Loss</TabsTrigger>
                  <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
                  <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
                </TabsList>

                <TabsContent value="profit-loss">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="income" name="Income" fill="hsl(var(--primary))" />
                        <Bar dataKey="expenses" name="Expenses" fill="hsl(var(--destructive))" />
                        <Bar dataKey="profit" name="Profit" fill="hsl(var(--green-500))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-medium mb-3">Summary</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-muted-foreground text-sm">Total Income</div>
                        <div className="text-2xl font-bold text-green-600">$169,000</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-sm">Total Expenses</div>
                        <div className="text-2xl font-bold text-red-600">$113,000</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-sm">Net Profit</div>
                        <div className="text-2xl font-bold text-blue-600">$56,000</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="balance-sheet">
                  <div className="h-[400px] flex items-center justify-center">
                    <div className="text-center">
                      <Building className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium">Balance Sheet Report</h3>
                      <p className="text-muted-foreground mt-2 max-w-md">
                        View your company's financial position with assets, liabilities, and equity breakdown.
                      </p>
                      <Button className="mt-4">Generate Report</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="cash-flow">
                  <div className="h-[400px] flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium">Cash Flow Statement</h3>
                      <p className="text-muted-foreground mt-2 max-w-md">
                        Track the flow of cash in and out of your business over a specific period.
                      </p>
                      <Button className="mt-4">Generate Report</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Invoice Management</CardTitle>
                <Button size="sm" onClick={handleCreateInvoice}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {invoicesLoading ? (
                <div className="flex items-center justify-center h-[300px]">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading invoices...</span>
                </div>
              ) : invoices && invoices.length > 0 ? (
                <div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-sm">
                          <th className="text-left pb-3 font-medium">Invoice #</th>
                          <th className="text-left pb-3 font-medium">Customer</th>
                          <th className="text-left pb-3 font-medium">Date</th>
                          <th className="text-left pb-3 font-medium">Due Date</th>
                          <th className="text-left pb-3 font-medium">Status</th>
                          <th className="text-right pb-3 font-medium">Amount</th>
                          <th className="text-right pb-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.slice(0, 5).map((invoice) => (
                          <tr key={invoice.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 text-sm font-medium">
                              {invoice.invoice_number}
                            </td>
                            <td className="py-3 text-sm">
                              {invoice.customer_name}
                            </td>
                            <td className="py-3 text-sm">
                              {format(new Date(invoice.invoice_date), "MMM d, yyyy")}
                            </td>
                            <td className="py-3 text-sm">
                              {format(new Date(invoice.due_date), "MMM d, yyyy")}
                            </td>
                            <td className="py-3 text-sm">
                              <Badge 
                                className={
                                  invoice.status === "paid" 
                                    ? "bg-green-500" : 
                                  invoice.status === "overdue" 
                                    ? "bg-amber-500" : 
                                  invoice.status === "cancelled" 
                                    ? "bg-red-500" : 
                                  invoice.status === "sent" 
                                    ? "bg-blue-500" : 
                                  "bg-gray-500"
                                }
                              >
                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="py-3 text-sm text-right font-medium">
                              ${invoice.total_amount.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </td>
                            <td className="py-3 text-sm text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => navigate(`/invoices/${invoice.id}`)}
                              >
                                View <ChevronRight className="ml-1 h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {invoices.length > 5 && (
                    <div className="mt-4 text-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate('/invoices')}
                      >
                        View All Invoices
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <Receipt className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No Invoices Found</h3>
                    <p className="text-muted-foreground mt-2 max-w-md">
                      Create your first invoice to start managing your billing.
                    </p>
                    <Button className="mt-4" onClick={handleCreateInvoice}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Invoice
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="taxes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Tax Management</CardTitle>
                <Button size="sm" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Tax Reports
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <DollarSign className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Tax Management</h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    Manage your tax obligations, calculate taxes, and generate tax reports for compliance.
                  </p>
                  <Button className="mt-4">Generate Tax Report</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Accounting;
