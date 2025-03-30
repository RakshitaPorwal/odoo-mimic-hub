import { supabase } from '@/lib/supabase';
import { File, FileText, FileImage, FileSpreadsheet, Presentation } from 'lucide-react';

export interface Document {
  id: number;
  name: string;
  type: string;
  icon: typeof File | typeof FileText | typeof FileImage | typeof FileSpreadsheet | typeof Presentation;
  size: string;
  created: string;
  modified: string;
  owner: string;
  shared: boolean;
  starred: boolean;
  category: string;
  folder: string;
  file_url?: string;
  user_id?: string;
  folder_id?: number;
  mime_type?: string;
}

class DocumentService {
  async getRecentDocuments(limit: number = 5): Promise<Document[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('modified', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data.map(doc => ({
        ...doc,
        icon: this.getIconForType(doc.type)
      }));
    } catch (error) {
      console.error('Error fetching recent documents:', error);
      return [];
    }
  }

  async uploadDocument(file: File, folderId?: number): Promise<Document | null> {
    try {
      // Check file size (20MB limit)
      if (file.size > 20 * 1024 * 1024) {
        throw new Error('File size exceeds 20MB limit');
      }

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get folder name if folderId is provided
      let folderName = 'Root';
      if (folderId) {
        const { data: folder, error: folderError } = await supabase
          .from('folders')
          .select('name')
          .eq('id', folderId)
          .single();

        if (folderError) throw folderError;
        folderName = folder.name;
      }

      // Create a unique file name
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${folderName}/${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Failed to upload file: ${uploadError.message}`);
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Create document record in the database
      const documentData = {
        name: file.name,
        type: this.getFileType(file.name),
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        owner: user.email || 'Unknown User',
        shared: false,
        starred: false,
        category: 'uploads',
        folder: folderName,
        file_url: publicUrl,
        user_id: user.id,
        folder_id: folderId,
        mime_type: file.type || 'application/octet-stream'
      };

      const { data, error } = await supabase
        .from('documents')
        .insert([documentData])
        .select()
        .single();

      if (error) {
        console.error('Database insert error:', error);
        // If database insert fails, try to delete the uploaded file
        await supabase.storage
          .from('documents')
          .remove([filePath]);
        throw new Error(`Failed to save document record: ${error.message}`);
      }

      return {
        ...data,
        icon: this.getIconForType(data.type)
      };
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  async deleteDocument(id: number): Promise<boolean> {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // First get the document to get the file URL
      const { data: document, error: fetchError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      // Delete the file from storage
      if (document.file_url) {
        const filePath = document.file_url.split('/').slice(-3).join('/'); // Get the last 3 parts of the URL
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([filePath]);

        if (storageError) throw storageError;
      }

      // Delete the document record
      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  private getFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    if (['xlsx', 'xls', 'csv'].includes(extension)) {
      return 'spreadsheet';
    } else if (['pptx', 'ppt'].includes(extension)) {
      return 'presentation';
    } else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) {
      return 'image';
    } else if (['pdf'].includes(extension)) {
      return 'pdf';
    } else {
      return 'document';
    }
  }

  private getIconForType(type: string) {
    switch (type.toLowerCase()) {
      case 'pdf':
        return File;
      case 'document':
        return FileText;
      case 'image':
        return FileImage;
      case 'spreadsheet':
        return FileSpreadsheet;
      case 'presentation':
        return Presentation;
      default:
        return FileText;
    }
  }
}

export const documentService = new DocumentService(); 