
import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getInvoice, updateInvoice, deleteInvoice } from "@/services/invoiceService";
import { Layout } from "@/components/Layout/Layout";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { Printer, ArrowLeft, MailIcon, Edit, Trash, CheckCircle } from "lucide-react";
import InvoicePrintView from "@/components/Invoice/InvoicePrintView";
import { useReactToPrint } from "react-to-print";

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const { data: invoice, isLoading, error, refetch } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => getInvoice(id!),
    enabled: !!id,
  });

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Invoice-${invoice?.invoice_number}`,
  });

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await updateInvoice(id!, { 
        status: newStatus as 'draft' | 'sent' | 'paid' | 'cancelled' | 'overdue'
      });
      toast({
        title: "Invoice updated",
        description: `Invoice status changed to ${newStatus}`,
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update invoice status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteInvoice = async () => {
    try {
      await deleteInvoice(id!);
      toast({
        title: "Invoice deleted",
        description: "Invoice has been permanently deleted",
      });
      navigate("/invoices");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete invoice",
        variant: "destructive",
      });
    }
  };

  const statusColors = {
    draft: "bg-gray-500",
    sent: "bg-blue-500",
    paid: "bg-green-500",
    cancelled: "bg-red-500",
    overdue: "bg-amber-500",
  };

  if (isLoading) return <div className="p-6">Loading invoice...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading invoice</div>;
  if (!invoice) return <div className="p-6">Invoice not found</div>;

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={() => navigate("/invoices")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Invoices
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <Button variant="outline">
              <MailIcon className="mr-2 h-4 w-4" /> Email
            </Button>
            <Button variant="outline" onClick={() => navigate(`/edit-invoice/${invoice.id}`)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Invoice</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete invoice {invoice.invoice_number}? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                  <Button variant="destructive" onClick={handleDeleteInvoice}>Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Invoice #{invoice.invoice_number}</CardTitle>
              <Badge className={`${statusColors[invoice.status]} text-white`}>
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Customer</h3>
                <p className="font-bold">{invoice.customer_name}</p>
                {invoice.customer_email && <p>{invoice.customer_email}</p>}
                {invoice.customer_address && (
                  <p className="whitespace-pre-line">{invoice.customer_address}</p>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invoice Date:</span>
                  <span>{format(new Date(invoice.invoice_date), "MMM dd, yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Date:</span>
                  <span>{format(new Date(invoice.due_date), "MMM dd, yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span>{invoice.status}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Description</th>
                    <th className="py-2 text-right">Quantity</th>
                    <th className="py-2 text-right">Unit Price</th>
                    <th className="py-2 text-right">Tax</th>
                    <th className="py-2 text-right">Discount</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items?.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2">{item.description}</td>
                      <td className="py-2 text-right">{item.quantity}</td>
                      <td className="py-2 text-right">{formatCurrency(item.unit_price)}</td>
                      <td className="py-2 text-right">
                        {item.tax_rate ? `${item.tax_rate}%` : "-"}
                      </td>
                      <td className="py-2 text-right">
                        {item.discount_percent
                          ? `${item.discount_percent}%`
                          : item.discount_amount
                          ? formatCurrency(item.discount_amount)
                          : "-"}
                      </td>
                      <td className="py-2 text-right font-medium">
                        {formatCurrency(item.total_amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 ml-auto md:w-64">
              <div className="flex justify-between py-1">
                <span>Subtotal:</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Tax:</span>
                <span>{formatCurrency(invoice.tax_total)}</span>
              </div>
              {(invoice.discount_amount || invoice.discount_percent) && (
                <div className="flex justify-between py-1">
                  <span>Discount:</span>
                  <span>
                    {invoice.discount_percent
                      ? `${invoice.discount_percent}%`
                      : formatCurrency(invoice.discount_amount || 0)}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-1 font-bold border-t mt-2 pt-2">
                <span>Total:</span>
                <span>{formatCurrency(invoice.total_amount)}</span>
              </div>
            </div>

            {invoice.notes && (
              <div className="mt-6">
                <h4 className="font-medium mb-1">Notes</h4>
                <p className="text-sm whitespace-pre-line">{invoice.notes}</p>
              </div>
            )}

            {invoice.terms_conditions && (
              <div className="mt-4">
                <h4 className="font-medium mb-1">Terms & Conditions</h4>
                <p className="text-sm whitespace-pre-line">
                  {invoice.terms_conditions}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <div className="flex flex-wrap gap-2">
              {invoice.status === "draft" && (
                <>
                  <Button onClick={() => handleStatusUpdate("sent")}>
                    <MailIcon className="mr-2 h-4 w-4" /> Mark as Sent
                  </Button>
                  <Button onClick={() => handleStatusUpdate("cancelled")} variant="outline">
                    Cancel Invoice
                  </Button>
                </>
              )}
              {invoice.status === "sent" && (
                <Button onClick={() => handleStatusUpdate("paid")}>
                  <CheckCircle className="mr-2 h-4 w-4" /> Mark as Paid
                </Button>
              )}
              {invoice.status === "overdue" && (
                <Button onClick={() => handleStatusUpdate("paid")}>
                  <CheckCircle className="mr-2 h-4 w-4" /> Mark as Paid
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Hidden printable invoice view */}
      <div className="hidden">
        <div ref={printRef}>
          <InvoicePrintView invoice={invoice} />
        </div>
      </div>
    </Layout>
  );
}
