-- Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    size TEXT NOT NULL,
    created TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    owner TEXT NOT NULL,
    shared BOOLEAN DEFAULT false,
    starred BOOLEAN DEFAULT false,
    category TEXT,
    folder TEXT DEFAULT 'Uploads',
    file_url TEXT,
    user_id UUID REFERENCES auth.users(id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_modified ON public.documents(modified);

-- Enable Row Level Security (RLS)
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can view their own documents"
    ON public.documents
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents"
    ON public.documents
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents"
    ON public.documents
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
    ON public.documents
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to automatically update modified timestamp
CREATE OR REPLACE FUNCTION update_documents_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.modified = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update modified timestamp
CREATE TRIGGER update_documents_modified
    BEFORE UPDATE ON public.documents
    FOR EACH ROW
    EXECUTE FUNCTION update_documents_modified_column(); 