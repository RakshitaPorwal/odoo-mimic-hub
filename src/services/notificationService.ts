import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface Notification {
  id: number;
  title: string;
  description: string;
  type: 'task' | 'document' | 'invoice' | 'message' | 'system';
  read: boolean;
  created: string;
  user_id: string;
  related_id?: string;
  related_type?: string;
}

class NotificationService {
  private channel: RealtimeChannel | null = null;

  async getNotifications(): Promise<Notification[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // First, clean up old notifications
      await this.cleanupOldNotifications();

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  async cleanupOldNotifications(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id)
        .eq('read', true)
        .lt('created', thirtyDaysAgo.toISOString());

      if (error) throw error;
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
      throw error;
    }
  }

  async createNotification(notification: Omit<Notification, 'id' | 'created' | 'user_id'>): Promise<Notification | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          ...notification,
          user_id: user.id,
          created: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async markAsRead(id: number): Promise<Notification | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  async deleteNotification(id: number): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  async clearAll(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error clearing all notifications:', error);
      throw error;
    }
  }

  async subscribeToNotifications(callback: (notification: Notification) => void): Promise<() => void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Subscribe to new notifications
    this.channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          callback(payload.new as Notification);
        }
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      if (this.channel) {
        this.channel.unsubscribe();
        this.channel = null;
      }
    };
  }

  // Helper method to create task notifications
  async createTaskNotification(taskId: string, title: string, description: string): Promise<void> {
    await this.createNotification({
      title,
      description,
      type: 'task',
      read: false,
      related_id: taskId,
      related_type: 'task'
    });
  }

  // Helper method to create document notifications
  async createDocumentNotification(documentId: string, title: string, description: string): Promise<void> {
    await this.createNotification({
      title,
      description,
      type: 'document',
      read: false,
      related_id: documentId,
      related_type: 'document'
    });
  }

  // Helper method to create invoice notifications
  async createInvoiceNotification(invoiceId: string, title: string, description: string): Promise<void> {
    await this.createNotification({
      title,
      description,
      type: 'invoice',
      read: false,
      related_id: invoiceId,
      related_type: 'invoice'
    });
  }

  // Helper method to create system notifications
  async createSystemNotification(title: string, description: string): Promise<void> {
    await this.createNotification({
      title,
      description,
      type: 'system',
      read: false
    });
  }
}

export const notificationService = new NotificationService(); 