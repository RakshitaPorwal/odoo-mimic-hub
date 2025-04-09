import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Order = Database['public']['Tables']['orders']['Row'] & {
  customer?: Database['public']['Tables']['customers']['Row'];
  order_items?: (Database['public']['Tables']['order_items']['Row'] & {
    product?: Database['public']['Tables']['products']['Row'];
  })[];
};

type NewOrder = Omit<Database['public']['Tables']['orders']['Insert'], 'id' | 'created_at' | 'updated_at'>;
type NewOrderItem = Omit<Database['public']['Tables']['order_items']['Insert'], 'id' | 'created_at' | 'updated_at' | 'order_id'>;

export const createOrder = async (orderData: NewOrder, orderItems: NewOrderItem[]) => {
  console.log('Creating order with data:', orderData);
  console.log('Order items:', orderItems);

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    throw new Error(`Failed to create order: ${orderError.message}`);
  }

  console.log('Order created successfully:', order);

  const orderItemsWithId = orderItems.map(item => ({ ...item, order_id: order.id }));
  console.log('Creating order items:', orderItemsWithId);

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsWithId);

  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    throw new Error(`Failed to create order items: ${itemsError.message}`);
  }

  console.log('Order items created successfully');

  // Return the complete order data with customer and items
  const completeOrder = await getOrderById(order.id);
  console.log('Complete order data:', completeOrder);
  return completeOrder;
};

export const getOrderById = async (id: string): Promise<Order> => {
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      customer:customers(*),
      order_items:order_items(
        *,
        product:products(*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return order;
};

export const updateOrderStatus = async (id: string, status: Order['status']) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getOrders = async (filters: {
  status?: Order['status'];
  customer_id?: string;
  start_date?: string;
  end_date?: string;
  date_range?: 'lastweek' | 'lastmonth' | '6months' | '1year' | 'all';
}) => {
  let query = supabase
    .from('orders')
    .select(`
      *,
      customer:customers(*),
      order_items:order_items(
        *,
        product:products(*)
      )
    `)
    .order('created_at', { ascending: false });

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.customer_id) {
    query = query.eq('customer_id', filters.customer_id);
  }

  if (filters.date_range) {
    const now = new Date();
    let startDate = new Date();

    switch (filters.date_range) {
      case 'lastweek':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'lastmonth':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '6months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    if (filters.date_range !== 'all') {
      query = query.gte('created_at', startDate.toISOString());
    }
  }

  if (filters.start_date) {
    query = query.gte('created_at', filters.start_date);
  }

  if (filters.end_date) {
    query = query.lte('created_at', filters.end_date);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  return data || [];
};

export const calculateOrderTotal = (items: Order['order_items']) => {
  if (!items) return 0;
  return items.reduce((total, item) => total + (item.quantity * item.rate), 0);
};

export const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD${year}${month}${random}`;
};

export const updateOrder = async (id: string, orderData: Partial<Order>, orderItems: NewOrderItem[]) => {
  // Update order
  const { error: orderError } = await supabase
    .from('orders')
    .update(orderData)
    .eq('id', id);

  if (orderError) throw orderError;

  // Delete existing order items
  const { error: deleteError } = await supabase
    .from('order_items')
    .delete()
    .eq('order_id', id);

  if (deleteError) throw deleteError;

  // Insert new order items
  const { error: insertError } = await supabase
    .from('order_items')
    .insert(orderItems.map(item => ({ ...item, order_id: id })));

  if (insertError) throw insertError;

  // Return updated order
  return getOrderById(id);
};

export type { Order, NewOrder, NewOrderItem }; 