import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInvoices } from "@/services/invoiceService";
import { Layout } from "@/components/Layout/Layout";
import { format, isValid } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export default function Invoices() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: invoices, isLoading, error } = useQuery({
    queryKey: ["invoices"],
    queryFn: getInvoices,
  });

  const statusColors = {
    draft: "bg-gray-500",
    sent: "bg-blue-500",
    paid: "bg-green-500",
    cancelled: "bg-red-500",
    overdue: "bg-amber-500",
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-gray-500";
    return statusColors[status as keyof typeof statusColors] || "bg-gray-500";
  };

  const formatStatus = (status: string | undefined) => {
    if (!status) return "Draft";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return isValid(date) ? format(date, "MMM dd, yyyy") : "—";
  };

  const filteredInvoices = invoices?.filter(
    (invoice) =>
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (e: React.MouseEvent, invoiceId: string) => {
    e.stopPropagation();
    navigate(`/edit-invoice/${invoiceId}`);
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Invoices</h1>
          <Button onClick={() => navigate("/create-invoice")}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Invoice
          </Button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search invoices..."
            className="w-full p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div>Loading invoices...</div>
        ) : error ? (
          <div className="text-red-500">Error loading invoices</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInvoices?.map((invoice) => (
              <Card
                key={invoice.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/invoices/${invoice.id}`)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{invoice.invoice_number}</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleEdit(e, invoice.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Badge
                        className={`${getStatusColor(invoice.status)} text-white`}
                      >
                        {formatStatus(invoice.status)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="font-medium">{invoice.customer_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Date: {formatDate(invoice.invoice_date)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Due: {formatDate(invoice.due_date)}
                    </p>
                    <p className="font-bold mt-2">
                      {formatCurrency(invoice.total_amount)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredInvoices?.length === 0 && (
              <div className="col-span-3 text-center py-10">
                <p className="text-muted-foreground">No invoices found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
