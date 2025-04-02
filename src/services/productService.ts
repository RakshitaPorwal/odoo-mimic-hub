import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type Product = Database['public']['Tables']['products']['Row'];
type NewProduct = Database['public']['Tables']['products']['Insert'];

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');

  if (error) {
    throw error;
  }

  return data;
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function searchProducts(query: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('name')
    .limit(10);

  if (error) {
    throw error;
  }

  return data;
}

export async function createProduct(product: Omit<NewProduct, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
} 