
import { supabase } from '@/lib/supabase';

export interface InventoryItem {
  id: number;
  name: string;
  description?: string;
  category: string;
  stock: number;
  value: number;
  location: string;
  supplier?: string;
  unit_of_measure?: string;
  hsn_code?: string;
  batch_number?: string;
  created_at: string;
  last_updated: string;
}

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
export async function createInventoryItem(item: Omit<InventoryItem, 'id' | 'created_at' | 'last_updated'>) {
  const { data, error } = await supabase
    .from('inventory')
    .insert([item])
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
  const { error } = await supabase
    .from('inventory')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting inventory item:', error);
    throw error;
  }

  return true;
}
