-- Create contacts table
CREATE TABLE contacts (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT,
    email TEXT,
    phone TEXT NOT NULL,
    company TEXT,
    position TEXT,
    address TEXT,
    type TEXT NOT NULL CHECK (type IN ('Customer', 'Vendor', 'Prospect')),
    starred BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    created TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    modified TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Create indexes
CREATE INDEX contacts_user_id_idx ON contacts(user_id);
CREATE INDEX contacts_type_idx ON contacts(type);
CREATE INDEX contacts_starred_idx ON contacts(starred);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own contacts"
    ON contacts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own contacts"
    ON contacts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contacts"
    ON contacts FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contacts"
    ON contacts FOR DELETE
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
CREATE TRIGGER update_contacts_modified
    BEFORE UPDATE ON contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column(); 