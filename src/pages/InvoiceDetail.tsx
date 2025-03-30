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
import { Printer, ArrowLeft, MailIcon, Edit, Trash } from "lucide-react";
import InvoicePrintView from "@/components/Invoice/InvoicePrintView";
import { useReactToPrint } from "react-to-print";
import { getEmailLink, generateInvoicePDF } from "@/lib/emailUtils";
import { sendInvoiceEmail } from "@/services/emailService";

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);

  const { data: invoice, isLoading, error, refetch } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => getInvoice(id!),
    enabled: !!id,
  });

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Invoice-${invoice?.invoice_number}`,
  });

  const handleEmail = async () => {
    if (!invoice) return;
    
    if (!invoice.customer_email) {
      toast({
        title: "No email address",
        description: "Customer email address is not available",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGeneratingPDF(true);
      
      // Send email using SendGrid
      await sendInvoiceEmail(invoice);
      
      setIsGeneratingPDF(false);
      
      toast({
        title: "Success",
        description: "Invoice has been sent via email",
      });
    } catch (error) {
      console.error('Email sending error:', error);
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
      setIsGeneratingPDF(false);
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
            <Button 
              variant="outline" 
              onClick={handleEmail}
              disabled={isGeneratingPDF}
            >
              <MailIcon className="mr-2 h-4 w-4" /> 
              {isGeneratingPDF ? "Generating PDF..." : "Email"}
            </Button>
            <Button variant="outline" onClick={() => navigate(`/edit-invoice/${invoice?.id}`)}>
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
                    Are you sure you want to delete invoice {invoice?.invoice_number}? This action cannot be undone.
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
              <Badge variant="outline">
                {format(new Date(invoice.invoice_date), "MMM dd, yyyy")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Seller</h3>
                <p className="font-bold">{invoice.seller_name}</p>
                <p>{invoice.seller_address}</p>
                <p>GSTIN: {invoice.seller_gstin}</p>
                <p>State: {invoice.seller_state} ({invoice.seller_state_code})</p>
                <p>PAN: {invoice.seller_pan}</p>
                <p>Phone: {invoice.seller_phone}</p>
                <p>Email: {invoice.seller_email}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Buyer</h3>
                <p className="font-bold">{invoice.customer_name}</p>
                {invoice.customer_address && <p>{invoice.customer_address}</p>}
                {invoice.customer_gstin && <p>GSTIN: {invoice.customer_gstin}</p>}
                {invoice.customer_state && <p>State: {invoice.customer_state} ({invoice.customer_state_code})</p>}
                {invoice.customer_phone && <p>Phone: {invoice.customer_phone}</p>}
                {invoice.customer_email && <p>Email: {invoice.customer_email}</p>}
              </div>
            </div>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Description</th>
                    <th className="py-2 text-right">HSN Code</th>
                    <th className="py-2 text-right">Quantity</th>
                    <th className="py-2 text-right">Rate</th>
                    <th className="py-2 text-right">CGST (9%)</th>
                    <th className="py-2 text-right">SGST (9%)</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items?.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2">{item.description_of_goods}</td>
                      <td className="py-2 text-right">{item.hsn_code}</td>
                      <td className="py-2 text-right">{item.quantity}</td>
                      <td className="py-2 text-right">{formatCurrency(item.rate)}</td>
                      <td className="py-2 text-right">{formatCurrency(item.cgst_amount)}</td>
                      <td className="py-2 text-right">{formatCurrency(item.sgst_amount)}</td>
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
                <span>CGST (9%):</span>
                <span>{formatCurrency(invoice.cgst_total)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>SGST (9%):</span>
                <span>{formatCurrency(invoice.sgst_total)}</span>
              </div>
              <div className="flex justify-between py-1 font-bold border-t mt-2 pt-2">
                <span>Total Amount:</span>
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
