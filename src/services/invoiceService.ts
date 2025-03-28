
import { supabase } from '@/lib/supabase';
import { InventoryItem } from './inventoryService';

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string | null;
  customer_address: string | null;
  invoice_date: string;
  due_date: string;
  status: 'draft' | 'sent' | 'paid' | 'cancelled' | 'overdue';
  subtotal: number;
  tax_total: number;
  discount_percent: number | null;
  discount_amount: number | null;
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
  quantity: number;
  unit_price: number;
  tax_rate: number | null;
  tax_amount: number | null;
  discount_percent: number | null;
  discount_amount: number | null;
  total_amount: number;
  created_at: string;
  item?: InventoryItem;
}

// Create a new invoice
export async function createInvoice(invoice: Omit<Invoice, 'id' | 'invoice_number' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('invoices')
    .insert([invoice])
    .select()
    .single();

  if (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
  return data;
}

// Add invoice items
export async function addInvoiceItems(items: Omit<InvoiceItem, 'id' | 'created_at'>[]) {
  const { data, error } = await supabase
    .from('invoice_items')
    .insert(items)
    .select();

  if (error) {
    console.error('Error adding invoice items:', error);
    throw error;
  }
  return data;
}

// Get all invoices
export async function getInvoices() {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
  return data;
}

// Get a single invoice with its items
export async function getInvoice(id: string) {
  // Get invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single();

  if (invoiceError) {
    console.error('Error fetching invoice:', invoiceError);
    throw invoiceError;
  }

  // Get invoice items with inventory details
  const { data: items, error: itemsError } = await supabase
    .from('invoice_items')
    .select(`
      *,
      inventory:item_id (*)
    `)
    .eq('invoice_id', id);

  if (itemsError) {
    console.error('Error fetching invoice items:', itemsError);
    throw itemsError;
  }

  return { ...invoice, items };
}

// Update invoice
export async function updateInvoice(id: string, updates: Partial<Invoice>) {
  const { data, error } = await supabase
    .from('invoices')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating invoice:', error);
    throw error;
  }
  return data;
}

// Delete invoice
export async function deleteInvoice(id: string) {
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting invoice:', error);
    throw error;
  }
}

// Calculate invoice totals
export function calculateInvoiceTotals(items: Omit<InvoiceItem, 'id' | 'invoice_id' | 'created_at'>[]) {
  let subtotal = 0;
  let taxTotal = 0;

  items.forEach(item => {
    // Calculate line total
    const lineTotal = item.quantity * item.unit_price;
    
    // Calculate tax if applicable
    const taxAmount = item.tax_rate ? (lineTotal * (item.tax_rate / 100)) : 0;
    
    // Calculate discount if applicable
    const discountAmount = item.discount_percent 
      ? (lineTotal * (item.discount_percent / 100))
      : (item.discount_amount || 0);
    
    // Add to subtotal
    subtotal += lineTotal;
    
    // Add to tax total
    taxTotal += taxAmount;
  });

  return { subtotal, taxTotal };
}
