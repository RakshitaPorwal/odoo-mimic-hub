
import React, { useState } from "react";
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
  ShoppingCart
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

// Monthly data for charts
const monthlyData = [
  { name: "Jan", income: 12000, expenses: 8000, profit: 4000 },
  { name: "Feb", income: 15000, expenses: 10000, profit: 5000 },
  { name: "Mar", income: 18000, expenses: 12000, profit: 6000 },
  { name: "Apr", income: 20000, expenses: 15000, profit: 5000 },
  { name: "May", income: 22000, expenses: 14000, profit: 8000 },
  { name: "Jun", income: 25000, expenses: 16000, profit: 9000 },
  { name: "Jul", income: 27000, expenses: 18000, profit: 9000 },
  { name: "Aug", income: 30000, expenses: 20000, profit: 10000 },
];

const Accounting = () => {
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

  const totalIncome = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = Math.abs(
    transactions
      .filter((t) => t.type === "Expense")
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const netProfit = totalIncome - totalExpenses;

  const handleAddTransaction = () => {
    if (!newTransaction.category || !newTransaction.amount) {
      return; // In a real app, show validation error
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

  return (
    <Layout>
      <Header 
        title="Accounting" 
        description="Manage your finances, transactions, and financial reports."
      >
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
      </Header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Income</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium flex items-center">
                +8.2% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <ShoppingCart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500 font-medium flex items-center">
                +4.5% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${netProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium flex items-center">
                +12.5% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Invoices Due</CardTitle>
            <Receipt className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              $12,500
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">5 invoices</span> pending payment
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
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <Receipt className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Invoice Management</h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    Create, manage, and track invoices for your clients. Send professional invoices and get paid faster.
                  </p>
                  <div className="flex gap-2 justify-center mt-4">
                    <Button variant="outline">View Invoices</Button>
                    <Button>Create Invoice</Button>
                  </div>
                </div>
              </div>
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
