
import { supabase } from '@/lib/supabase';

// Types for our database tables
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  location_id: number;
  location: string; // Denormalized for convenience
  value: number;
  last_updated: string;
  created_at?: string;
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
  item_id: string;
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
    .from('inventory_items')
    .select('*, locations(name)')
    .order('name');
  
  if (error) {
    console.error('Error fetching inventory items:', error);
    throw error;
  }
  
  // Transform the data to match our expected format
  return data.map(item => ({
    ...item,
    location: item.locations.name,
  }));
};

export const getInventoryItem = async (id: string): Promise<InventoryItem> => {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*, locations(name)')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching inventory item with id ${id}:`, error);
    throw error;
  }
  
  return {
    ...data,
    location: data.locations.name,
  };
};

export const createInventoryItem = async (item: Omit<InventoryItem, 'id' | 'created_at'>): Promise<InventoryItem> => {
  const { data, error } = await supabase
    .from('inventory_items')
    .insert([{
      ...item,
      last_updated: new Date().toISOString(),
    }])
    .select('*, locations(name)')
    .single();
  
  if (error) {
    console.error('Error creating inventory item:', error);
    throw error;
  }
  
  return {
    ...data,
    location: data.locations.name,
  };
};

export const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>): Promise<InventoryItem> => {
  const { data, error } = await supabase
    .from('inventory_items')
    .update({
      ...updates,
      last_updated: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*, locations(name)')
    .single();
  
  if (error) {
    console.error(`Error updating inventory item with id ${id}:`, error);
    throw error;
  }
  
  return {
    ...data,
    location: data.locations.name,
  };
};

export const deleteInventoryItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('inventory_items')
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
  
  return data;
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
    .select('*, inventory_items(name), from_location:locations!from_location_id(name), to_location:locations!to_location_id(name)')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching recent transactions:', error);
    throw error;
  }
  
  return data;
};

// Calculate Inventory Metrics
export const getInventoryMetrics = async () => {
  // Get total items and value
  const { data: itemsData, error: itemsError } = await supabase
    .from('inventory_items')
    .select('stock, value');
  
  if (itemsError) {
    console.error('Error calculating inventory metrics:', itemsError);
    throw itemsError;
  }
  
  // Calculate metrics
  const totalItems = itemsData.reduce((sum, item) => sum + item.stock, 0);
  const totalValue = itemsData.reduce((sum, item) => sum + (item.stock * item.value), 0);
  
  // Get low stock items count
  const { count: lowStockItems, error: lowStockError } = await supabase
    .from('inventory_items')
    .select('id', { count: 'exact', head: true })
    .lt('stock', 20);
  
  if (lowStockError) {
    console.error('Error getting low stock items count:', lowStockError);
    throw lowStockError;
  }
  
  // Get location capacity data
  const { data: locationsData, error: locationsError } = await supabase
    .from('locations')
    .select('capacity, available, item_count');
  
  if (locationsError) {
    console.error('Error getting location capacity data:', locationsError);
    throw locationsError;
  }
  
  // Calculate capacity usage
  const totalCapacity = locationsData.reduce((sum, loc) => sum + loc.capacity, 0);
  const usedCapacity = locationsData.reduce((sum, loc) => sum + loc.item_count, 0);
  const capacityUsagePercentage = Math.round((usedCapacity / totalCapacity) * 100);
  
  return {
    totalItems,
    totalValue,
    lowStockItems,
    capacityUsagePercentage,
    locationCount: locationsData.length
  };
};
