
import React from "react";
import { Invoice } from "@/services/invoiceService";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

interface InvoicePrintViewProps {
  invoice: Invoice;
}

const InvoicePrintView: React.FC<InvoicePrintViewProps> = ({ invoice }) => {
  return (
    <div className="p-8 max-w-4xl mx-auto bg-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold">INVOICE</h1>
          <p className="text-xl"># {invoice.invoice_number}</p>
        </div>
        <div className="text-right">
          <div className="font-bold text-xl">Your Company Name</div>
          <div>Your Company Address</div>
          <div>contact@yourcompany.com</div>
          <div>Tax ID: 123456789</div>
        </div>
      </div>

      {/* Customer and Invoice Details */}
      <div className="flex justify-between mb-8">
        <div>
          <div className="font-bold mb-1">Bill To:</div>
          <div className="font-medium">{invoice.customer_name}</div>
          {invoice.customer_email && <div>{invoice.customer_email}</div>}
          {invoice.customer_address && (
            <div className="whitespace-pre-line">{invoice.customer_address}</div>
          )}
        </div>
        <div className="text-right">
          <div className="mb-1">
            <span className="font-bold">Invoice Date: </span>
            {format(new Date(invoice.invoice_date), "MMM dd, yyyy")}
          </div>
          <div className="mb-1">
            <span className="font-bold">Due Date: </span>
            {format(new Date(invoice.due_date), "MMM dd, yyyy")}
          </div>
          <div>
            <span className="font-bold">Status: </span>
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-8 border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-300 py-2 px-3 bg-gray-100 text-left">Description</th>
            <th className="border border-gray-300 py-2 px-3 bg-gray-100 text-right">Quantity</th>
            <th className="border border-gray-300 py-2 px-3 bg-gray-100 text-right">Unit Price</th>
            <th className="border border-gray-300 py-2 px-3 bg-gray-100 text-right">Tax</th>
            <th className="border border-gray-300 py-2 px-3 bg-gray-100 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items?.map((item) => (
            <tr key={item.id}>
              <td className="border border-gray-300 py-2 px-3">{item.description}</td>
              <td className="border border-gray-300 py-2 px-3 text-right">{item.quantity}</td>
              <td className="border border-gray-300 py-2 px-3 text-right">{formatCurrency(item.unit_price)}</td>
              <td className="border border-gray-300 py-2 px-3 text-right">
                {item.tax_rate ? `${item.tax_rate}%` : "-"}
              </td>
              <td className="border border-gray-300 py-2 px-3 text-right">{formatCurrency(item.total_amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <div className="flex justify-end">
        <div className="w-64">
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
          <div className="flex justify-between py-1 font-bold border-t mt-1 pt-1">
            <span>Total:</span>
            <span>{formatCurrency(invoice.total_amount)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mt-8">
          <h4 className="font-bold mb-1">Notes</h4>
          <p className="whitespace-pre-line">{invoice.notes}</p>
        </div>
      )}

      {/* Terms & Conditions */}
      {invoice.terms_conditions && (
        <div className="mt-4">
          <h4 className="font-bold mb-1">Terms & Conditions</h4>
          <p className="whitespace-pre-line">{invoice.terms_conditions}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-10 text-center text-sm text-gray-500">
        <p>Thank you for your business!</p>
      </div>
    </div>
  );
};

export default InvoicePrintView;
