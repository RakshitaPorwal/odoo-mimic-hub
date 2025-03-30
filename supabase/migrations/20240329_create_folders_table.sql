-- Create folders table
CREATE TABLE folders (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT 'blue',
    created TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    modified TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    parent_id BIGINT REFERENCES folders(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX folders_user_id_idx ON folders(user_id);
CREATE INDEX folders_parent_id_idx ON folders(parent_id);

-- Enable RLS
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own folders"
    ON folders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own folders"
    ON folders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own folders"
    ON folders FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own folders"
    ON folders FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to update modified timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.modified = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update modified timestamp
CREATE TRIGGER update_folders_modified
    BEFORE UPDATE ON folders
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Add folder_id to documents table
ALTER TABLE documents ADD COLUMN folder_id BIGINT REFERENCES folders(id) ON DELETE SET NULL; 