
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and Anon Key from environment variables or use placeholders
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://your-project-url.supabase.co' && 
         supabaseAnonKey !== 'your-anon-key';
};
