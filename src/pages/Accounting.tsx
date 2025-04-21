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
  ChevronRight,
  Trash2
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTransactions, addTransaction, deleteTransaction, calculateFinancialReports } from "@/services/accountingService";
import { getInvoices } from "@/services/invoiceService";
import { toast } from "@/hooks/use-toast";
import { Transaction } from "@/types/transaction";

const Accounting = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "all",
    category: "",
    payment_method: "all"
  });
  const [newTransaction, setNewTransaction] = useState<{
    date: string;
    type: "Income" | "Expense" | "Transfer";
    category: string;
    amount: string;
    description: string;
    payment_method: "Cash" | "Bank Transfer" | "Credit Card" | "UPI" | "Check";
    reference: string;
  }>({
    date: new Date().toISOString().split('T')[0],
    type: "Income",
    category: "",
    amount: "",
    description: "",
    payment_method: "Cash",
    reference: ""
  });

  // Fetch transactions with error handling and logging
  const { data: transactions = [], isLoading: transactionsLoading, error: transactionsError } = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      try {
        const data = await getTransactions();
        console.log('Fetched transactions:', data);
        return data;
      } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }
    },
  });

  // Fetch financial reports with error handling and logging
  const { data: financialReports, isLoading: reportsLoading, error: reportsError } = useQuery<{
    profitAndLoss: {
      income: number;
      expenses: number;
      profit: number;
    };
    cashFlow: {
      inflow: number;
      outflow: number;
      netFlow: number;
    };
    balanceSheet: {
      assets: number;
      liabilities: number;
      netWorth: number;
    };
    taxReport: {
      incomeByCategory: Record<string, number>;
      estimatedTax: number;
    };
  }>({
    queryKey: ["financialReports"],
    queryFn: async () => {
      try {
        const data = await calculateFinancialReports();
        console.log('Fetched financial reports:', data);
        return data;
      } catch (error) {
        console.error('Error fetching financial reports:', error);
        throw error;
      }
    },
  });

  // Log the current state
  console.log('Current state:', {
    transactionsLoading,
    reportsLoading,
    transactionsError,
    reportsError,
    transactions,
    financialReports
  });

  // Fetch invoices
  const { data: invoices, isLoading: invoicesLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: getInvoices,
  });

  // Add transaction mutation
  const addTransactionMutation = useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", "financialReports"] });
      setIsAddTransactionOpen(false);
      resetTransactionForm();
      toast({
        title: "Transaction added",
        description: "The transaction has been successfully added.",
      });
    },
  });

  // Delete transaction mutation
  const deleteTransactionMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", "financialReports"] });
      toast({
        title: "Transaction deleted",
        description: "The transaction has been successfully deleted.",
      });
    },
    onError: (error) => {
      console.error('Error deleting transaction:', error);
      toast({
        title: "Error",
        description: "Failed to delete transaction. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleAddTransaction = () => {
    try {
      console.log('New transaction data:', newTransaction);

      if (!newTransaction.category || !newTransaction.amount) {
        toast({
          title: "Required fields missing",
          description: "Please fill in the category and amount fields",
          variant: "destructive"
        });
        return;
      }

      const amount = parseFloat(newTransaction.amount);
      if (isNaN(amount)) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid number for the amount",
          variant: "destructive"
        });
        return;
      }

      const transaction: Omit<Transaction, 'id'> = {
        date: new Date(newTransaction.date),
        type: newTransaction.type,
        category: newTransaction.category,
        amount: parseFloat(newTransaction.amount),
        description: newTransaction.description,
        payment_method: newTransaction.payment_method,
        reference: newTransaction.reference
      };

      console.log('Prepared transaction for submission:', transaction);

      addTransactionMutation.mutate(transaction, {
        onSuccess: () => {
          console.log('Transaction added successfully');
          toast({
            title: "Success",
            description: "Transaction added successfully",
          });
          setIsAddTransactionOpen(false);
          resetTransactionForm();
        },
        onError: (error) => {
          console.error('Error adding transaction:', error);
          toast({
            title: "Error",
            description: "Failed to add transaction. Please try again.",
            variant: "destructive"
          });
        }
      });
    } catch (error) {
      console.error('Error in handleAddTransaction:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteTransactionMutation.mutateAsync(id);
        // Optimistically update the UI
        queryClient.setQueryData<Transaction[]>(["transactions"], (old) => 
          old?.filter(transaction => transaction.id !== id) || []
        );
      } catch (error) {
        console.error('Error in handleDeleteTransaction:', error);
      }
    }
  };

  const resetTransactionForm = () => {
    setNewTransaction({
      date: new Date().toISOString().split('T')[0],
      type: "Income",
      category: "",
      amount: "",
      description: "",
      payment_method: "Cash",
      reference: ""
    });
  };

  const handleCreateInvoice = () => {
    navigate("/create-invoice");
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesDate = (!filters.startDate || new Date(transaction.date) >= new Date(filters.startDate)) &&
                       (!filters.endDate || new Date(transaction.date) <= new Date(filters.endDate));
    const matchesType = filters.type === "all" || transaction.type === filters.type;
    const matchesCategory = !filters.category || transaction.category.toLowerCase().includes(filters.category.toLowerCase());
    const matchesPaymentMethod = filters.payment_method === "all" || transaction.payment_method === filters.payment_method;
    
    return matchesDate && matchesType && matchesCategory && matchesPaymentMethod;
  });

  const resetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      type: "all",
      category: "",
      payment_method: "all"
    });
  };

  // Add loading and error states
  if (transactionsLoading || reportsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="mt-2">Loading accounting data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (transactionsError || reportsError) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
            <p className="mt-2 text-destructive">
              Error loading accounting data. Please try again later.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ["transactions", "financialReports"] });
              }}
            >
              Retry
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

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
                      onValueChange={(value) => {
                        const transactionType = value as "Income" | "Expense" | "Transfer";
                        setNewTransaction({
                          ...newTransaction,
                          type: transactionType,
                        });
                      }}
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
                    <Label htmlFor="payment_method">Payment Method</Label>
                    <Select
                      value={newTransaction.payment_method}
                      onValueChange={(value) => {
                        const payment_method = value as "Cash" | "Bank Transfer" | "Credit Card" | "UPI" | "Check";
                        setNewTransaction({
                          ...newTransaction,
                          payment_method: payment_method,
                        });
                      }}
                    >
                      <SelectTrigger id="payment_method">
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
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${financialReports.profitAndLoss.income.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ShoppingCart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${financialReports.profitAndLoss.expenses.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${financialReports.profitAndLoss.profit.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
            <CreditCard className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ${financialReports.cashFlow.netFlow.toLocaleString()}
            </div>
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
                  <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Filter Transactions</DialogTitle>
                        <DialogDescription>
                          Apply filters to find specific transactions.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                              id="startDate"
                              type="date"
                              value={filters.startDate}
                              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input
                              id="endDate"
                              type="date"
                              value={filters.endDate}
                              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="type">Transaction Type</Label>
                          <Select
                            value={filters.type}
                            onValueChange={(value) => setFilters({ ...filters, type: value })}
                          >
                            <SelectTrigger id="type">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Types</SelectItem>
                              <SelectItem value="Income">Income</SelectItem>
                              <SelectItem value="Expense">Expense</SelectItem>
                              <SelectItem value="Transfer">Transfer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Input
                            id="category"
                            placeholder="Filter by category"
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="payment_method">Payment Method</Label>
                          <Select
                            value={filters.payment_method}
                            onValueChange={(value) => setFilters({ ...filters, payment_method: value })}
                          >
                            <SelectTrigger id="payment_method">
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Methods</SelectItem>
                              <SelectItem value="Cash">Cash</SelectItem>
                              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                              <SelectItem value="Credit Card">Credit Card</SelectItem>
                              <SelectItem value="UPI">UPI</SelectItem>
                              <SelectItem value="Check">Check</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={resetFilters}>
                          Reset Filters
                        </Button>
                        <Button onClick={() => setIsFilterOpen(false)}>
                          Apply Filters
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
                      <th className="text-left pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 text-sm">
                          {format(new Date(transaction.date), "MMM d, yyyy")}
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
                        <td className="py-3 text-sm">{transaction.payment_method}</td>
                        <td className="py-3 text-sm">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-muted-foreground">
                          No transactions found matching your filters.
                        </td>
                      </tr>
                    )}
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
                      <BarChart data={[
                        { name: "Income", value: financialReports.profitAndLoss.income },
                        { name: "Expenses", value: financialReports.profitAndLoss.expenses },
                        { name: "Profit", value: financialReports.profitAndLoss.profit }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-medium mb-3">Summary</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-muted-foreground text-sm">Total Income</div>
                        <div className="text-2xl font-bold text-green-600">
                          ${financialReports.profitAndLoss.income.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-sm">Total Expenses</div>
                        <div className="text-2xl font-bold text-red-600">
                          ${financialReports.profitAndLoss.expenses.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-sm">Net Profit</div>
                        <div className="text-2xl font-bold text-blue-600">
                          ${financialReports.profitAndLoss.profit.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="balance-sheet">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: "Assets", value: financialReports.balanceSheet.assets },
                        { name: "Liabilities", value: financialReports.balanceSheet.liabilities },
                        { name: "Net Worth", value: financialReports.balanceSheet.netWorth }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-medium mb-3">Summary</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-muted-foreground text-sm">Total Assets</div>
                        <div className="text-2xl font-bold text-green-600">
                          ${financialReports.balanceSheet.assets.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-sm">Total Liabilities</div>
                        <div className="text-2xl font-bold text-red-600">
                          ${financialReports.balanceSheet.liabilities.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-sm">Net Worth</div>
                        <div className="text-2xl font-bold text-blue-600">
                          ${financialReports.balanceSheet.netWorth.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="cash-flow">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: "Cash Inflow", value: financialReports.cashFlow.inflow },
                        { name: "Cash Outflow", value: financialReports.cashFlow.outflow },
                        { name: "Net Cash Flow", value: financialReports.cashFlow.netFlow }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-medium mb-3">Summary</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-muted-foreground text-sm">Cash Inflow</div>
                        <div className="text-2xl font-bold text-green-600">
                          ${financialReports.cashFlow.inflow.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-sm">Cash Outflow</div>
                        <div className="text-2xl font-bold text-red-600">
                          ${financialReports.cashFlow.outflow.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-sm">Net Cash Flow</div>
                        <div className="text-2xl font-bold text-blue-600">
                          ${financialReports.cashFlow.netFlow.toLocaleString()}
                        </div>
                      </div>
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
                              {invoice?.invoice_number || 'N/A'}
                            </td>
                            <td className="py-3 text-sm">
                              {invoice?.customer_name || 'N/A'}
                            </td>
                            <td className="py-3 text-sm">
                              {invoice?.invoice_date && new Date(invoice.invoice_date).toString() !== 'Invalid Date'
                                ? format(new Date(invoice.invoice_date), "MMM d, yyyy")
                                : "N/A"}
                            </td>
                            <td className="py-3 text-sm">
                              {invoice?.due_date && new Date(invoice.due_date).toString() !== 'Invalid Date'
                                ? format(new Date(invoice.due_date), "MMM d, yyyy")
                                : "N/A"}
                            </td>
                            <td className="py-3 text-sm">
                              <Badge 
                                className={
                                  (invoice?.status || 'draft') === "paid" 
                                    ? "bg-green-500" : 
                                  (invoice?.status || 'draft') === "overdue" 
                                    ? "bg-amber-500" : 
                                  (invoice?.status || 'draft') === "cancelled" 
                                    ? "bg-red-500" : 
                                  (invoice?.status || 'draft') === "sent" 
                                    ? "bg-blue-500" : 
                                  "bg-gray-500"
                                }
                              >
                                {(invoice?.status || 'draft').charAt(0).toUpperCase() + (invoice?.status || 'draft').slice(1)}
                              </Badge>
                            </td>
                            <td className="py-3 text-sm text-right font-medium">
                              ${(invoice?.total_amount || 0).toLocaleString(undefined, {
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
              <div className="grid gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Income by Category</h3>
                  <div className="grid gap-4">
                    {Object.entries(financialReports.taxReport.incomeByCategory).map(([category, amount]) => (
                      <div key={category} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">{category}</div>
                          <div className="text-sm text-muted-foreground">
                            {(amount / financialReports.profitAndLoss.income * 100).toFixed(1)}% of total income
                          </div>
                        </div>
                        <div className="text-lg font-bold">
                          ${amount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Estimated Tax Liability</h3>
                  <div className="grid gap-4">
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">Total Taxable Income</div>
                        <div className="text-sm text-muted-foreground">
                          Based on Indian tax slabs
                        </div>
                      </div>
                      <div className="text-lg font-bold">
                        ${financialReports.profitAndLoss.income.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">Estimated Tax</div>
                        <div className="text-sm text-muted-foreground">
                          Calculated using Indian tax rates
                        </div>
                      </div>
                      <div className="text-lg font-bold text-red-600">
                        ${financialReports.taxReport.estimatedTax.toLocaleString()}
                      </div>
                    </div>
                  </div>
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
