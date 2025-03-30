import { Invoice } from "@/services/invoiceService";
import { generateInvoicePDF } from "@/lib/emailUtils";
import emailjs from '@emailjs/browser';

// Get EmailJS credentials from environment variables
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

export async function sendInvoiceEmail(invoice: Invoice) {
  try {
    console.log("Invoice Data:", JSON.stringify(invoice, null, 2)); 
    if (!invoice.customer_email) {
      throw new Error('Customer email address is required');
    }

    // Generate PDF with maximum compression
    const pdfDataUrl = await generateInvoicePDF(invoice, {
      compress: true,
      quality: 0.5, // Reduced quality
      margin: 5, // Reduced margins
      pageSize: 'A4',
      orientation: 'portrait'
    });

    // Create template parameters
    const templateParams = {
      to_name: invoice.customer_name,
      from_name: invoice.seller_name,
      invoice_number: invoice.invoice_number,
      invoice_date: new Date(invoice.invoice_date).toLocaleDateString(),
      total_amount: invoice.total_amount,
      pdf_url: `https://your-domain.com/api/invoices/${invoice.id}/pdf`
    };

    // Send email using EmailJS with the correct recipient format
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email: invoice.customer_email,
        ...templateParams
      },
      EMAILJS_PUBLIC_KEY
    );

    // Create a download link for the PDF
    const link = document.createElement('a');
    link.href = pdfDataUrl;
    link.download = `Invoice-${invoice.invoice_number}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// HTML template for EmailJS
export const emailTemplate = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="margin-bottom: 20px;">
    <p style="margin: 0;">Dear {{to_name}},</p>
  </div>
  
  <div style="margin-bottom: 20px;">
    <p style="margin: 0;">Thank you for your business. Please find attached the invoice for your reference.</p>
  </div>
  
  <div style="margin-bottom: 20px;">
    <h3 style="margin: 0 0 10px 0;">Invoice Details:</h3>
    <div style="border-left: 4px solid #e2e8f0; padding-left: 15px;">
      <p style="margin: 5px 0;"><strong>Invoice Number:</strong> {{invoice_number}}</p>
      <p style="margin: 5px 0;"><strong>Invoice Date:</strong> {{invoice_date}}</p>
      <p style="margin: 5px 0;"><strong>Total Amount:</strong> {{total_amount}}</p>
    </div>
  </div>
  
  <div style="margin-bottom: 20px;">
    <p style="margin: 0;">You can download the complete invoice PDF from the following link:</p>
    <p style="margin: 10px 0;">
      <a href="{{pdf_url}}" style="color: #2563eb; text-decoration: underline;">Download Invoice PDF</a>
    </p>
  </div>
  
  <div style="margin-top: 30px;">
    <p style="margin: 0;">Best regards,</p>
    <p style="margin: 5px 0 0 0; font-weight: bold;">{{from_name}}</p>
  </div>
</div>
`;

function generateEmailBody(invoice: Invoice): string {
  return `
Dear ${invoice.customer_name},

Thank you for your business. Please find attached the invoice for your reference.

Invoice Details:
---------------
Invoice Number: ${invoice.invoice_number}
Invoice Date: ${new Date(invoice.invoice_date).toLocaleDateString()}

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
  Rate: ${item.rate}
  CGST (9%): ${item.cgst_amount}
  SGST (9%): ${item.sgst_amount}
  Total: ${item.total_amount}
`).join('\n')}

Summary:
--------
Subtotal: ${invoice.subtotal}
CGST (9%): ${invoice.cgst_total}
SGST (9%): ${invoice.sgst_total}
Total Amount: ${invoice.total_amount}

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
} 