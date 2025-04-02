import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type Customer = Database['public']['Tables']['customers']['Row'];
type NewCustomer = Database['public']['Tables']['customers']['Insert'];
type UpdateCustomer = Database['public']['Tables']['customers']['Update'];

export async function createCustomer(customerData: NewCustomer) {
  const { data, error } = await supabase
    .from('customers')
    .insert([customerData])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getCustomers() {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('name');

  if (error) {
    throw error;
  }

  return data;
}

export async function getCustomerById(id: string) {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateCustomer(id: string, customerData: UpdateCustomer) {
  const { data, error } = await supabase
    .from('customers')
    .update(customerData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteCustomer(id: string) {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}

export async function getCustomerOrders(customerId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product:products (*)
      )
    `)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function getCustomerStats(customerId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('total_amount, status, created_at')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  const totalOrders = data.length;
  const totalSpent = data.reduce((sum, order) => sum + order.total_amount, 0);
  const lastPurchase = data.length > 0 
    ? data[0].created_at 
    : null;

  return {
    totalOrders,
    totalSpent,
    lastPurchase,
  };
} 