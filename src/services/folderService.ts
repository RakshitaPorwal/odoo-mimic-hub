import { supabase } from '@/lib/supabase';

export interface Folder {
  id: number;
  name: string;
  color: string;
  created: string;
  modified: string;
  user_id: string;
  parent_id?: number;
}

class FolderService {
  async createFolder(name: string, color: string = 'blue'): Promise<Folder | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('folders')
        .insert([{
          name,
          color,
          user_id: user.id,
          created: new Date().toISOString(),
          modified: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  }

  async deleteFolder(id: number): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // First delete all files in the folder
      const { error: filesError } = await supabase
        .from('documents')
        .delete()
        .eq('folder_id', id)
        .eq('user_id', user.id);

      if (filesError) throw filesError;

      // Then delete the folder
      const { error: folderError } = await supabase
        .from('folders')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (folderError) throw folderError;
      return true;
    } catch (error) {
      console.error('Error deleting folder:', error);
      throw error;
    }
  }

  async getFolders(): Promise<Folder[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching folders:', error);
      throw error;
    }
  }

  async updateFolder(id: number, updates: Partial<Folder>): Promise<Folder | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('folders')
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
      console.error('Error updating folder:', error);
      throw error;
    }
  }
}

export const folderService = new FolderService(); 