
import { createClient } from '@supabase/supabase-js';

// Use the URL and key from our Supabase project
const supabaseUrl = 'https://xgcrdnroohmshcielfpc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnY3JkbnJvb2htc2hjaWVsZnBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNzE3MTYsImV4cCI6MjA1ODY0NzcxNn0.yN8uSTEGyX0PmsMopHMlDOYyPn_B-c4BXhmgGzUddeg';

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl.length > 0 && 
         supabaseAnonKey.length > 0 && 
         !supabaseUrl.includes('your-project-url') &&
         !supabaseAnonKey.includes('your-anon-key');
};
