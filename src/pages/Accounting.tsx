import React from "react";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Header/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  BadgeDollarSign, 
  BadgePercent, 
  ChartBar, 
  ChartPie, 
  Coins, 
  CreditCard, 
  FileSpreadsheet, 
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";

const invoicesData = [
  { id: "INV-001", client: "Acme Inc.", amount: 1250.00, status: "paid", date: "2023-09-15" },
  { id: "INV-002", client: "TechCorp", amount: 3450.50, status: "pending", date: "2023-09-20" },
  { id: "INV-003", client: "Global Industries", amount: 890.75, status: "paid", date: "2023-09-08" },
  { id: "INV-004", client: "Design Studio", amount: 1650.00, status: "overdue", date: "2023-08-30" },
  { id: "INV-005", client: "Marketing Experts", amount: 2780.25, status: "pending", date: "2023-09-25" },
];

const expensesData = [
  { id: "EXP-001", category: "Office Supplies", amount: 350.20, date: "2023-09-10", vendor: "Office Depot" },
  { id: "EXP-002", category: "Software", amount: 899.99, date: "2023-09-05", vendor: "Adobe" },
  { id: "EXP-003", category: "Utilities", amount: 245.67, date: "2023-09-15", vendor: "Electric Co." },
  { id: "EXP-004", category: "Travel", amount: 1230.50, date: "2023-09-20", vendor: "Airline Inc." },
  { id: "EXP-005", category: "Marketing", amount: 800.00, date: "2023-09-18", vendor: "Ad Agency" },
];

const Accounting = () => {
  return (
    <Layout>
      <Header 
        title="Accounting" 
        description="Manage your financial transactions, invoices, and expenses."
      >
        <div className="flex space-x-2">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Transaction
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link to="/invoices">View All Invoices</Link>
          </Button>
        </div>
      </Header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,580.00</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,430.50</div>
            <p className="text-xs text-muted-foreground">+4.5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <BadgePercent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">49.4%</div>
            <p className="text-xs text-muted-foreground">+2.3% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">$6,230.75 total</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="taxes">Taxes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="invoices" className="border rounded-md mt-6">
          <div className="p-4 flex justify-between items-center border-b">
            <h3 className="font-medium">Recent Invoices</h3>
            <div className="flex space-x-2">
              <Input 
                placeholder="Search invoices..." 
                className="w-[250px]"
              />
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create
              </Button>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoicesData.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.client}</TableCell>
                  <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center px-2.5 py-0.5 text-xs rounded-full capitalize ${
                      invoice.status === "paid" 
                        ? "bg-green-100 text-green-800" 
                        : invoice.status === "pending" 
                        ? "bg-yellow-100 text-yellow-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {invoice.status}
                    </div>
                  </TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/invoices">View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="expenses" className="border rounded-md mt-6">
          <div className="p-4 flex justify-between items-center border-b">
            <h3 className="font-medium">Recent Expenses</h3>
            <div className="flex space-x-2">
              <Input 
                placeholder="Search expenses..." 
                className="w-[250px]"
              />
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expensesData.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.id}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>${expense.amount.toFixed(2)}</TableCell>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>{expense.vendor}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="reports" className="p-6 flex flex-col items-center justify-center border rounded-md mt-6 text-center min-h-[300px]">
          <ChartBar className="h-16 w-16 mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Generate Financial Reports</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            Create customized financial reports for different time periods and categories.
          </p>
          <Button>Generate Report</Button>
        </TabsContent>
        
        <TabsContent value="taxes" className="p-6 flex flex-col items-center justify-center border rounded-md mt-6 text-center min-h-[300px]">
          <ChartPie className="h-16 w-16 mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Tax Management</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            Track and manage your tax obligations and prepare for tax filing.
          </p>
          <Button>Tax Settings</Button>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Accounting;
