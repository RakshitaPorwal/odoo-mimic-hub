import { supabase } from '@/lib/supabase';

export interface Event {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  attendees?: string[];
  tags?: string[];
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const eventService = {
  // Get all events for the current user
  async getEvents() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data as Event[];
  },

  // Get upcoming events (next 7 days)
  async getUpcomingEvents() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const now = new Date().toISOString();
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .gte('start_time', now)
      .lte('start_time', sevenDaysFromNow)
      .order('start_time', { ascending: true })
      .limit(5);

    if (error) throw error;
    return data as Event[];
  },

  // Create a new event
  async createEvent(event: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'user_id'>) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Auth error:', authError);
        throw new Error('Authentication error: ' + authError.message);
      }

      if (!user) {
        console.error('No user found');
        throw new Error('User not authenticated');
      }

      console.log('Creating event with data:', { ...event, user_id: user.id });

      const { data, error } = await supabase
        .from('events')
        .insert([{ ...event, user_id: user.id }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Failed to create event: ' + error.message);
      }

      console.log('Event created successfully:', data);
      return data as Event;
    } catch (error) {
      console.error('Error in createEvent:', error);
      throw error;
    }
  },

  // Update an event
  async updateEvent(id: string, event: Partial<Event>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('events')
      .update(event)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data as Event;
  },

  // Delete an event
  async deleteEvent(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  }
}; 