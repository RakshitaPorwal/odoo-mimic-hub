import { supabase } from '@/lib/supabase';
import { InventoryItem } from './inventoryService';

// Generate a unique invoice number
function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}${month}-${random}`;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  user_id: string;
  // Seller Information
  seller_name: string;
  seller_address: string;
  seller_gstin: string;
  seller_state: string;
  seller_state_code: string;
  seller_pan: string;
  seller_phone: string;
  seller_email: string;
  // Buyer Information
  customer_name: string;
  customer_email: string | null;
  customer_address: string | null;
  customer_gstin: string | null;
  customer_state: string | null;
  customer_state_code: string | null;
  customer_phone: string | null;
  // Invoice Details
  invoice_date: string;
  delivery_note: string | null;
  reference_date: string | null;
  reference_number: string | null;
  buyers_order_number: string | null;
  buyers_order_date: string | null;
  dispatch_doc_number: string | null;
  dispatch_doc_date: string | null;
  dispatched_through: string | null;
  destination: string | null;
  mode_of_payment: string | null;
  terms_of_delivery: string | null;
  other_references: string | null;
  // Totals
  subtotal: number;
  cgst_total: number;
  sgst_total: number;
  total_amount: number;
  notes: string | null;
  terms_conditions: string | null;
  created_at: string;
  updated_at: string;
  items?: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  item_id: number | null;
  description: string;
  description_of_goods: string;
  category: string;
  hsn_code: string;
  quantity: number;
  rate: number;
  unit_price: number;
  unit_of_measure: string;
  available_stock: number;
  current_stock: number;
  cgst_rate: number;
  sgst_rate: number;
  cgst_amount: number;
  sgst_amount: number;
  total_amount: number;
  created_at: string;
  item?: InventoryItem;
}

// Get all invoices
export async function getInvoices() {
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getInvoices:', error);
    throw error;
  }
}

// Get a single invoice by ID
export async function getInvoice(id: string) {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      items:invoice_items(*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Create a new invoice
export async function createInvoice(invoice: Omit<Invoice, "id" | "created_at" | "updated_at">) {
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase
      .from("invoices")
      .insert([
        {
          ...invoice,
          invoice_number: generateInvoiceNumber(),
          user_id: session.user.id, // Add user_id to associate with the authenticated user
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createInvoice:', error);
    throw error;
  }
}

// Add items to an invoice
export async function addInvoiceItems(invoiceId: number, items: Omit<InvoiceItem, "id" | "created_at" | "updated_at">[]) {
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase
      .from("invoice_items")
      .insert(
        items.map(item => ({
          ...item,
          invoice_id: invoiceId,
          user_id: session.user.id, // Add user_id to associate with the authenticated user
        }))
      )
      .select();

    if (error) {
      console.error('Error adding invoice items:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in addInvoiceItems:', error);
    throw error;
  }
}

// Update an invoice
export async function updateInvoice(id: string, invoice: Partial<Invoice>) {
  const { data, error } = await supabase
    .from('invoices')
    .update(invoice)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete an invoice
export async function deleteInvoice(id: string) {
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Get invoice items for an invoice
export async function getInvoiceItems(invoiceId: string) {
  const { data, error } = await supabase
    .from('invoice_items')
    .select(`
      *,
      item:inventory_items(*)
    `)
    .eq('invoice_id', invoiceId);

  if (error) throw error;
  return data;
}

// Update an invoice item
export async function updateInvoiceItem(id: string, item: Partial<InvoiceItem>) {
  const { data, error } = await supabase
    .from('invoice_items')
    .update(item)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete an invoice item
export async function deleteInvoiceItem(id: string) {
  const { error } = await supabase
    .from('invoice_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Calculate invoice totals
export function calculateInvoiceTotals(items: Omit<InvoiceItem, 'id' | 'invoice_id' | 'created_at'>[]) {
  let subtotal = 0;
  let cgstTotal = 0;
  let sgstTotal = 0;

  items.forEach(item => {
    // Calculate line total
    const lineTotal = item.quantity * item.rate;
    
    // Calculate CGST and SGST at 9% each
    const cgstAmount = lineTotal * 0.09; // 9% CGST
    const sgstAmount = lineTotal * 0.09; // 9% SGST
    
    // Add to totals
    subtotal += lineTotal;
    cgstTotal += cgstAmount;
    sgstTotal += sgstAmount;
  });

  // Calculate total amount including GST (subtotal + CGST + SGST)
  const totalAmount = subtotal + cgstTotal + sgstTotal;

  return { 
    subtotal, 
    cgstTotal, 
    sgstTotal,
    totalAmount 
  };
}
