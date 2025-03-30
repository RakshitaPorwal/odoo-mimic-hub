import { Invoice } from "@/services/invoiceService";
import { formatCurrency } from "./utils";
import { format } from "date-fns";
import html2pdf from 'html2pdf.js';

export function generateInvoiceEmail(invoice: Invoice) {
  const subject = `Invoice ${invoice.invoice_number} - ${invoice.seller_name}`;
  
  const body = `
Dear ${invoice.customer_name},

Thank you for your business. Please find attached the invoice for your reference.

Invoice Details:
---------------
Invoice Number: ${invoice.invoice_number}
Invoice Date: ${format(new Date(invoice.invoice_date), "dd MMM yyyy")}

Seller Information:
-----------------
${invoice.seller_name}
${invoice.seller_address}
GSTIN: ${invoice.seller_gstin}
State: ${invoice.seller_state} (${invoice.seller_state_code})
PAN: ${invoice.seller_pan}
Phone: ${invoice.seller_phone}
Email: ${invoice.seller_email}

Items:
${invoice.items?.map(item => `
• ${item.description_of_goods}
  HSN Code: ${item.hsn_code}
  Quantity: ${item.quantity} ${item.unit_of_measure}
  Rate: ${formatCurrency(item.rate)}
  CGST (9%): ${formatCurrency(item.cgst_amount)}
  SGST (9%): ${formatCurrency(item.sgst_amount)}
  Total: ${formatCurrency(item.total_amount)}
`).join('\n')}

Summary:
--------
Subtotal: ${formatCurrency(invoice.subtotal)}
CGST (9%): ${formatCurrency(invoice.cgst_total)}
SGST (9%): ${formatCurrency(invoice.sgst_total)}
Total Amount: ${formatCurrency(invoice.total_amount)}

${invoice.notes ? `\nNotes:\n${invoice.notes}` : ''}

${invoice.terms_conditions ? `\nTerms & Conditions:\n${invoice.terms_conditions}` : ''}

Payment Instructions:
-------------------
Bank Details:
Account Name: ${invoice.seller_name}
Bank Name: [Your Bank Name]
Account Number: [Your Account Number]
IFSC Code: [Your IFSC Code]

For any queries, please contact us at ${invoice.seller_email}.

Best regards,
${invoice.seller_name}
`;

  return {
    subject: encodeURIComponent(subject),
    body: encodeURIComponent(body),
    to: invoice.customer_email || '',
  };
}

interface PDFOptions {
  compress?: boolean;
  quality?: number;
  margin?: number;
  pageSize?: string;
  orientation?: 'portrait' | 'landscape';
}

export async function generateInvoicePDF(invoice: Invoice, options: PDFOptions = {}) {
  const {
    compress = true,
    quality = 0.7,
    margin = 10,
    pageSize = 'A4',
    orientation = 'portrait'
  } = options;

  // Create a temporary div for the invoice
  const div = document.createElement('div');
  div.innerHTML = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="margin: 0;">INVOICE</h1>
        <p style="margin: 5px 0;">${invoice.invoice_number}</p>
        <p style="margin: 5px 0;">Date: ${new Date(invoice.invoice_date).toLocaleDateString()}</p>
      </div>

      <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div>
          <h3 style="margin: 0 0 10px 0;">Seller</h3>
          <p style="margin: 5px 0;">${invoice.seller_name}</p>
          <p style="margin: 5px 0;">${invoice.seller_address}</p>
          <p style="margin: 5px 0;">GSTIN: ${invoice.seller_gstin}</p>
          <p style="margin: 5px 0;">State: ${invoice.seller_state} (${invoice.seller_state_code})</p>
          <p style="margin: 5px 0;">PAN: ${invoice.seller_pan}</p>
          <p style="margin: 5px 0;">Phone: ${invoice.seller_phone}</p>
          <p style="margin: 5px 0;">Email: ${invoice.seller_email}</p>
        </div>
        <div>
          <h3 style="margin: 0 0 10px 0;">Buyer</h3>
          <p style="margin: 5px 0;">${invoice.customer_name}</p>
          ${invoice.customer_address ? `<p style="margin: 5px 0;">${invoice.customer_address}</p>` : ''}
          ${invoice.customer_gstin ? `<p style="margin: 5px 0;">GSTIN: ${invoice.customer_gstin}</p>` : ''}
          ${invoice.customer_state ? `<p style="margin: 5px 0;">State: ${invoice.customer_state} (${invoice.customer_state_code})</p>` : ''}
          ${invoice.customer_phone ? `<p style="margin: 5px 0;">Phone: ${invoice.customer_phone}</p>` : ''}
          ${invoice.customer_email ? `<p style="margin: 5px 0;">Email: ${invoice.customer_email}</p>` : ''}
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Description</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">HSN Code</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Quantity</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Rate</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">CGST (9%)</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">SGST (9%)</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items?.map(item => `
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">${item.description_of_goods}</td>
              <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${item.hsn_code}</td>
              <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${item.quantity}</td>
              <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${item.rate}</td>
              <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${item.cgst_amount}</td>
              <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${item.sgst_amount}</td>
              <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${item.total_amount}</td>
            </tr>
          `).join('') || ''}
        </tbody>
      </table>

      <div style="float: right; width: 300px;">
        <div style="display: flex; justify-content: space-between; padding: 5px 0;">
          <span>Subtotal:</span>
          <span>${invoice.subtotal}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 5px 0;">
          <span>CGST (9%):</span>
          <span>${invoice.cgst_total}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 5px 0;">
          <span>SGST (9%):</span>
          <span>${invoice.sgst_total}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 5px 0; font-weight: bold; border-top: 1px solid #ddd; margin-top: 5px;">
          <span>Total Amount:</span>
          <span>${invoice.total_amount}</span>
        </div>
      </div>

      ${invoice.notes ? `
        <div style="margin-top: 20px;">
          <h4 style="margin: 0 0 10px 0;">Notes</h4>
          <p style="margin: 0;">${invoice.notes}</p>
        </div>
      ` : ''}

      ${invoice.terms_conditions ? `
        <div style="margin-top: 20px;">
          <h4 style="margin: 0 0 10px 0;">Terms & Conditions</h4>
          <p style="margin: 0;">${invoice.terms_conditions}</p>
        </div>
      ` : ''}
    </div>
  `;

  // Append the div to the document body
  document.body.appendChild(div);

  // Configure PDF options
  const opt = {
    margin: margin,
    filename: `Invoice-${invoice.invoice_number}.pdf`,
    image: { type: 'jpeg', quality: quality },
    html2canvas: { 
      scale: compress ? 1 : 2,
      useCORS: true,
      logging: false
    },
    jsPDF: { 
      unit: 'mm', 
      format: pageSize, 
      orientation: orientation,
      compress: compress
    }
  };

  try {
    // Generate PDF
    const pdf = await html2pdf().set(opt).from(div).output('datauristring');
    
    // Remove the temporary div
    document.body.removeChild(div);
    
    return pdf;
  } catch (error) {
    // Clean up in case of error
    document.body.removeChild(div);
    throw error;
  }
}

export async function getEmailLink(invoice: Invoice) {
  const { subject, body, to } = generateInvoiceEmail(invoice);
  
  // Generate PDF and get data URL
  const pdfDataUrl = await generateInvoicePDF(invoice);
  
  // Create a complete email body with the PDF data URL
  const completeBody = `${body}\n\n[PDF Invoice: ${pdfDataUrl}]`;
  
  return `mailto:${to}?subject=${subject}&body=${encodeURIComponent(completeBody)}`;
} 