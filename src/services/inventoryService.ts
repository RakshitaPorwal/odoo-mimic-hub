
import { supabase } from '@/lib/supabase';

// Types for our database tables
export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  location: string;
  value: number;
  unit_of_measure: string;
  batch_number: string | null;
  expiry_date: string | null;
  cgst_rate: number;
  sgst_rate: number;
  total_gst: number;
  hsn_code: string | null;
  supplier: string | null;
  reorder_level: number;
  reorder_quantity: number;
  stock_valuation_method: string;
  warehouse_id: number | null;
  barcode: string | null;
  last_updated: string;
  created_at: string;
}

export interface Location {
  id: number;
  name: string;
  address: string;
  capacity: number;
  available: number;
  item_count: number;
  created_at?: string;
}

export interface InventoryTransaction {
  id: number;
  item_id: number;
  from_location_id: number | null;
  to_location_id: number | null;
  quantity: number;
  transaction_type: 'addition' | 'removal' | 'transfer';
  notes: string | null;
  created_at: string;
}

// Inventory Item Operations
export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching inventory items:', error);
    throw error;
  }
  
  return data || [];
};

export const getInventoryItem = async (id: number): Promise<InventoryItem> => {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching inventory item with id ${id}:`, error);
    throw error;
  }
  
  return data;
};

export const createInventoryItem = async (item: Omit<InventoryItem, 'id' | 'created_at' | 'last_updated' | 'total_gst'>): Promise<InventoryItem> => {
  const { data, error } = await supabase
    .from('inventory')
    .insert([{
      ...item,
      last_updated: new Date().toISOString(),
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating inventory item:', error);
    throw error;
  }
  
  return data;
};

export const updateInventoryItem = async (id: number, updates: Partial<Omit<InventoryItem, 'id' | 'created_at' | 'total_gst'>>): Promise<InventoryItem> => {
  const { data, error } = await supabase
    .from('inventory')
    .update({
      ...updates,
      last_updated: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating inventory item with id ${id}:`, error);
    throw error;
  }
  
  return data;
};

export const deleteInventoryItem = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('inventory')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting inventory item with id ${id}:`, error);
    throw error;
  }
};

// Location Operations
export const getLocations = async (): Promise<Location[]> => {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
  
  return data || [];
};

export const createLocation = async (location: Omit<Location, 'id' | 'created_at'>): Promise<Location> => {
  const { data, error } = await supabase
    .from('locations')
    .insert([location])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating location:', error);
    throw error;
  }
  
  return data;
};

// Inventory Transaction Operations
export const createTransaction = async (transaction: Omit<InventoryTransaction, 'id' | 'created_at'>): Promise<InventoryTransaction> => {
  const { data, error } = await supabase
    .from('inventory_transactions')
    .insert([transaction])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating inventory transaction:', error);
    throw error;
  }
  
  return data;
};

export const getRecentTransactions = async (limit: number = 10): Promise<InventoryTransaction[]> => {
  const { data, error } = await supabase
    .from('inventory_transactions')
    .select('*, inventory!inner(*), from_location:locations!from_location_id(*), to_location:locations!to_location_id(*)')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching recent transactions:', error);
    throw error;
  }
  
  return data || [];
};

// Calculate Inventory Metrics
export const getInventoryMetrics = async () => {
  // Get total items and value
  const { data: itemsData, error: itemsError } = await supabase
    .from('inventory')
    .select('stock, value');
  
  if (itemsError) {
    console.error('Error calculating inventory metrics:', itemsError);
    throw itemsError;
  }
  
  // Calculate metrics
  const totalItems = (itemsData || []).reduce((sum, item) => sum + item.stock, 0);
  const totalValue = (itemsData || []).reduce((sum, item) => sum + (item.stock * item.value), 0);
  
  // Get low stock items count (below reorder_level)
  const { count: lowStockItems, error: lowStockError } = await supabase
    .from('inventory')
    .select('id', { count: 'exact', head: true })
    .lt('stock', 20);
  
  if (lowStockError) {
    console.error('Error getting low stock items count:', lowStockError);
    throw lowStockError;
  }
  
  return {
    totalItems,
    totalValue,
    lowStockItems: lowStockItems || 0,
    capacityUsagePercentage: 0, // We'll need to populate this later when we have warehouse data
    locationCount: 0 // Will be updated when we create locations table
  };
};
