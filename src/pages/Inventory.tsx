import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInventoryItems } from "@/services/inventoryService";
import { Layout } from "@/components/Layout/Layout";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MoreVertical, Edit, Copy, Trash, FilePlus, Search } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function Inventory() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: items, isLoading, error } = useQuery({
    queryKey: ["inventory"],
    queryFn: getInventoryItems,
  });

  const filteredItems = items?.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Inventory</h1>
          <Button onClick={() => navigate("/create-item")}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Item
          </Button>
        </div>

        <Tabs defaultValue="items" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="items" className="border rounded-md mt-6">
            <ScrollArea className="overflow-x-auto">
              <div className="min-w-max">
                <div className="mb-6 flex items-center justify-between">
                  <Input
                    type="text"
                    placeholder="Search items..."
                    className="w-1/3 p-2 border rounded"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {isLoading ? (
                  <div>Loading items...</div>
                ) : error ? (
                  <div className="text-red-500">Error loading items</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Item No.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.item_number}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{formatCurrency(item.price)}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => navigate(`/edit-item/${item.id}`)}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <CopyToClipboard text={JSON.stringify(item)}
                                  onCopy={() => toast({
                                    title: "Copied to clipboard!",
                                    description: "You can now paste this item's data.",
                                  })}>
                                  <DropdownMenuItem>
                                    <Copy className="mr-2 h-4 w-4" /> Copy Data
                                  </DropdownMenuItem>
                                </CopyToClipboard>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500">
                                  <Trash className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredItems?.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center h-24">
                            <Alert>
                              <Search className="h-4 w-4" />
                              <AlertTitle>No items found.</AlertTitle>
                              <AlertDescription>
                                Try adjusting your search or create a new item.
                              </AlertDescription>
                            </Alert>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="reports" className="p-6 flex flex-col items-center justify-center border rounded-md mt-6 text-center min-h-[300px]">
            <FilePlus className="h-16 w-16 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Generate Inventory Reports</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Create customized reports for stock levels, low stock items, and more.
            </p>
            <Button>Generate Report</Button>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
