
# Supabase Database Setup for Inventory Management

This document contains instructions for setting up the database in Supabase for the Inventory Management system.

## Database Schema

### 1. Create Tables

Run these SQL queries in the Supabase SQL Editor to create the necessary tables:

```sql
-- Locations Table
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(255) NOT NULL,
  capacity INTEGER NOT NULL,
  available INTEGER NOT NULL,
  item_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Inventory Items Table
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  location_id INTEGER NOT NULL REFERENCES locations(id),
  value DECIMAL(10, 2) NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Inventory Transactions Table
CREATE TABLE inventory_transactions (
  id SERIAL PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES inventory_items(id),
  from_location_id INTEGER REFERENCES locations(id),
  to_location_id INTEGER REFERENCES locations(id),
  quantity INTEGER NOT NULL,
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('addition', 'removal', 'transfer')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
```

### 2. Create Indexes

```sql
-- Create indexes for performance
CREATE INDEX idx_inventory_items_location_id ON inventory_items(location_id);
CREATE INDEX idx_inventory_transactions_item_id ON inventory_transactions(item_id);
CREATE INDEX idx_inventory_transactions_from_location_id ON inventory_transactions(from_location_id);
CREATE INDEX idx_inventory_transactions_to_location_id ON inventory_transactions(to_location_id);
```

### 3. Create Functions and Triggers

```sql
-- Function to update available space in location when items are added/removed
CREATE OR REPLACE FUNCTION update_location_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- If inserting or updating
  IF (TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.location_id != NEW.location_id OR OLD.stock != NEW.stock)) THEN
    -- If updating and location changed, update old location first
    IF (TG_OP = 'UPDATE' AND OLD.location_id != NEW.location_id) THEN
      UPDATE locations
      SET 
        item_count = item_count - OLD.stock,
        available = available + OLD.stock
      WHERE id = OLD.location_id;
    END IF;
    
    -- If updating stock within same location
    IF (TG_OP = 'UPDATE' AND OLD.location_id = NEW.location_id AND OLD.stock != NEW.stock) THEN
      UPDATE locations
      SET 
        item_count = item_count - OLD.stock + NEW.stock,
        available = available + OLD.stock - NEW.stock
      WHERE id = NEW.location_id;
    ELSE
      -- For new items or location change
      UPDATE locations
      SET 
        item_count = item_count + NEW.stock,
        available = available - NEW.stock
      WHERE id = NEW.location_id;
    END IF;
  END IF;
  
  -- If deleting
  IF (TG_OP = 'DELETE') THEN
    UPDATE locations
    SET 
      item_count = item_count - OLD.stock,
      available = available + OLD.stock
    WHERE id = OLD.location_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER inventory_items_update_trigger
AFTER INSERT OR UPDATE OR DELETE ON inventory_items
FOR EACH ROW EXECUTE FUNCTION update_location_metrics();
```

### 4. Set up Row Level Security Policies

```sql
-- Enable RLS
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users full access to locations"
ON locations
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to inventory_items"
ON inventory_items
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to inventory_transactions"
ON inventory_transactions
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
```

### 5. Insert Sample Data

```sql
-- Insert sample locations
INSERT INTO locations (name, address, capacity, available, item_count)
VALUES 
  ('Warehouse A', '123 Main St, City', 1500, 1500, 0),
  ('Tech Room', '456 Office Blvd, City', 200, 200, 0),
  ('Storage B', '789 Storage Ln, City', 800, 800, 0),
  ('Server 1', 'Digital', 1000, 1000, 0),
  ('Server 2', 'Digital', 1000, 1000, 0);

-- Now insert sample inventory items
INSERT INTO inventory_items (name, category, stock, location_id, value, last_updated)
VALUES 
  ('Professional Software License', 'Digital', 985, 4, 1200, NOW()),
  ('Advanced Analytics Module', 'Digital', 756, 5, 750, NOW()),
  ('Office Desk', 'Furniture', 12, 1, 350, NOW()),
  ('Office Chair', 'Furniture', 24, 1, 250, NOW()),
  ('Laptop - Dell XPS', 'Hardware', 18, 2, 1800, NOW()),
  ('Monitor - 27" 4K', 'Hardware', 15, 2, 400, NOW()),
  ('Keyboard Mechanical', 'Hardware', 32, 3, 120, NOW()),
  ('Mouse Wireless', 'Hardware', 45, 3, 80, NOW());
```

## Environment Variables

To connect your application to Supabase, you'll need to set the following environment variables:

- `VITE_SUPABASE_URL`: Your Supabase project URL (e.g., https://xxxxxxxxxxxx.supabase.co)
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon/public key
