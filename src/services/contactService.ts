import { supabase } from '@/lib/supabase';

export interface Contact {
  id: number;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  address: string;
  type: 'Customer' | 'Vendor' | 'Prospect';
  starred: boolean;
  tags: string[];
  created: string;
  modified: string;
  user_id: string;
}

class ContactService {
  async getContacts(): Promise<Contact[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  }

  async createContact(contact: Omit<Contact, 'id' | 'created' | 'modified' | 'user_id'>): Promise<Contact | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('contacts')
        .insert([{
          ...contact,
          user_id: user.id,
          created: new Date().toISOString(),
          modified: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  async updateContact(id: number, updates: Partial<Contact>): Promise<Contact | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('contacts')
        .update({
          ...updates,
          modified: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }

  async deleteContact(id: number): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }

  async toggleStarred(id: number): Promise<Contact | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // First get the current starred status
      const { data: contact, error: fetchError } = await supabase
        .from('contacts')
        .select('starred')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      // Then update it to the opposite value
      const { data, error: updateError } = await supabase
        .from('contacts')
        .update({
          starred: !contact.starred,
          modified: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;
      return data;
    } catch (error) {
      console.error('Error toggling contact starred status:', error);
      throw error;
    }
  }
}

export const contactService = new ContactService(); 