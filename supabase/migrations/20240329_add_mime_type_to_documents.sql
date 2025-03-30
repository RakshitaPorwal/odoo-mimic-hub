-- Add mime_type column to documents table
ALTER TABLE public.documents
ADD COLUMN IF NOT EXISTS mime_type TEXT; 