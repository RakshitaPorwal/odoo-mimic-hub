import { supabase } from '@/lib/supabase';

export type InventoryItem = {
  id: string;
  name: string;
  category: string | null;
  stock: number;
  value: number;
  location: string | null;
  supplier: string | null;
  unit_of_measure: string;
  hsn_code: string | null;
  batch_number: string | null;
  reorder_level: number;
  reorder_quantity: number;
  stock_valuation_method: string;
  cgst_rate: number;
  sgst_rate: number;
  created_at: string;
  updated_at: string;
};

// Get all inventory items
export async function getInventoryItems() {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching inventory items:', error);
    throw error;
  }

  return data;
}

// Get a single inventory item
export async function getInventoryItem(id: number) {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching inventory item:', error);
    throw error;
  }

  return data;
}

// Create a new inventory item
export async function createInventoryItem(item: Omit<InventoryItem, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('inventory')
    .insert([{
      name: item.name,
      category: item.category,
      stock: item.stock,
      value: item.value,
      location: item.location,
      supplier: item.supplier,
      unit_of_measure: item.unit_of_measure,
      hsn_code: item.hsn_code,
      batch_number: item.batch_number,
      reorder_level: item.reorder_level,
      reorder_quantity: item.reorder_quantity,
      stock_valuation_method: item.stock_valuation_method,
      cgst_rate: item.cgst_rate,
      sgst_rate: item.sgst_rate
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating inventory item:', error);
    throw error;
  }

  return data;
}

// Update an inventory item
export async function updateInventoryItem(id: number, updates: Partial<InventoryItem>) {
  const { data, error } = await supabase
    .from('inventory')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating inventory item:', error);
    throw error;
  }

  return data;
}

// Delete an inventory item
export async function deleteInventoryItem(id: number) {
  try {
    // First, check if the item is referenced in any invoice items
    const { data: invoiceItems, error: checkError } = await supabase
      .from('invoice_items')
      .select('id')
      .eq('item_id', id);

    if (checkError) {
      console.error('Error checking invoice items:', checkError);
      throw checkError;
    }

    if (invoiceItems && invoiceItems.length > 0) {
      throw new Error('Cannot delete item: It is referenced in existing invoices');
    }

    // If no references found, proceed with deletion
    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting inventory item:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteInventoryItem:', error);
    throw error;
  }
}
