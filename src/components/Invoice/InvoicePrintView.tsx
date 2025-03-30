import React from "react";
import { format } from "date-fns";
import { Invoice } from "@/services/invoiceService";
import { formatCurrency } from "@/lib/utils";

interface InvoicePrintViewProps {
  invoice: Invoice;
}

export default function InvoicePrintView({ invoice }: InvoicePrintViewProps) {
  // Helper function to safely format dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "—";
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold">{invoice.seller_name}</h1>
          <p>{invoice.seller_address}</p>
          <p>GSTIN: {invoice.seller_gstin}</p>
          <p>State: {invoice.seller_state} ({invoice.seller_state_code})</p>
          <p>PAN: {invoice.seller_pan}</p>
          <p>Phone: {invoice.seller_phone}</p>
          <p>Email: {invoice.seller_email}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold">Invoice #{invoice.invoice_number}</h2>
          <p>Date: {formatDate(invoice.invoice_date)}</p>
        </div>
      </div>

      {/* Buyer Information */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-2">Bill To:</h3>
        <p className="font-bold">{invoice.customer_name}</p>
        {invoice.customer_address && <p>{invoice.customer_address}</p>}
        {invoice.customer_gstin && <p>GSTIN: {invoice.customer_gstin}</p>}
        {invoice.customer_state && <p>State: {invoice.customer_state} ({invoice.customer_state_code})</p>}
        {invoice.customer_phone && <p>Phone: {invoice.customer_phone}</p>}
        {invoice.customer_email && <p>Email: {invoice.customer_email}</p>}
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <h3 className="text-lg font-medium mb-2">Invoice Details</h3>
          <div className="space-y-1">
            <p><span className="font-medium">Delivery Note:</span> {invoice.delivery_note || "—"}</p>
            <p><span className="font-medium">Reference Number:</span> {invoice.reference_number || "—"}</p>
            <p><span className="font-medium">Reference Date:</span> {formatDate(invoice.reference_date)}</p>
            <p><span className="font-medium">Buyer's Order No:</span> {invoice.buyers_order_number || "—"}</p>
            <p><span className="font-medium">Buyer's Order Date:</span> {formatDate(invoice.buyers_order_date)}</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Dispatch Details</h3>
          <div className="space-y-1">
            <p><span className="font-medium">Dispatch Doc No:</span> {invoice.dispatch_doc_number || "—"}</p>
            <p><span className="font-medium">Dispatch Doc Date:</span> {formatDate(invoice.dispatch_doc_date)}</p>
            <p><span className="font-medium">Dispatched Through:</span> {invoice.dispatched_through || "—"}</p>
            <p><span className="font-medium">Destination:</span> {invoice.destination || "—"}</p>
            <p><span className="font-medium">Mode of Payment:</span> {invoice.mode_of_payment || "—"}</p>
            <p><span className="font-medium">Terms of Delivery:</span> {invoice.terms_of_delivery || "—"}</p>
            <p><span className="font-medium">Other References:</span> {invoice.other_references || "—"}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full border-collapse mb-8">
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

      <div className="ml-auto w-64">
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
        <div className="mt-8">
          <h4 className="font-medium mb-1">Notes</h4>
          <p className="text-sm whitespace-pre-line">{invoice.notes}</p>
        </div>
      )}

      {invoice.terms_conditions && (
        <div className="mt-4">
          <h4 className="font-medium mb-1">Terms & Conditions</h4>
          <p className="text-sm whitespace-pre-line">{invoice.terms_conditions}</p>
        </div>
      )}
    </div>
  );
}
