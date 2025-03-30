-- Update invoices table
ALTER TABLE public.invoices
ADD COLUMN IF NOT EXISTS seller_name TEXT NOT NULL DEFAULT 'Your Company Name',
ADD COLUMN IF NOT EXISTS seller_address TEXT NOT NULL DEFAULT '123 Business Street, City, State, Country',
ADD COLUMN IF NOT EXISTS seller_gstin TEXT NOT NULL DEFAULT 'GSTIN123456789',
ADD COLUMN IF NOT EXISTS seller_state TEXT NOT NULL DEFAULT 'State Name',
ADD COLUMN IF NOT EXISTS seller_state_code TEXT NOT NULL DEFAULT 'ST01',
ADD COLUMN IF NOT EXISTS seller_pan TEXT NOT NULL DEFAULT 'PAN123456789',
ADD COLUMN IF NOT EXISTS seller_phone TEXT NOT NULL DEFAULT '+1234567890',
ADD COLUMN IF NOT EXISTS seller_email TEXT NOT NULL DEFAULT 'contact@yourcompany.com',
ADD COLUMN IF NOT EXISTS customer_gstin TEXT,
ADD COLUMN IF NOT EXISTS customer_state TEXT,
ADD COLUMN IF NOT EXISTS customer_state_code TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT,
ADD COLUMN IF NOT EXISTS delivery_note TEXT,
ADD COLUMN IF NOT EXISTS reference_date TEXT,
ADD COLUMN IF NOT EXISTS reference_number TEXT,
ADD COLUMN IF NOT EXISTS buyers_order_number TEXT,
ADD COLUMN IF NOT EXISTS buyers_order_date TEXT,
ADD COLUMN IF NOT EXISTS dispatch_doc_number TEXT,
ADD COLUMN IF NOT EXISTS dispatch_doc_date TEXT,
ADD COLUMN IF NOT EXISTS dispatched_through TEXT,
ADD COLUMN IF NOT EXISTS destination TEXT,
ADD COLUMN IF NOT EXISTS mode_of_payment TEXT,
ADD COLUMN IF NOT EXISTS terms_of_delivery TEXT,
ADD COLUMN IF NOT EXISTS other_references TEXT,
ADD COLUMN IF NOT EXISTS cgst_total DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS sgst_total DECIMAL(10,2) NOT NULL DEFAULT 0;

-- Update invoice_items table
ALTER TABLE public.invoice_items
ADD COLUMN IF NOT EXISTS hsn_code TEXT,
ADD COLUMN IF NOT EXISTS rate DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS cgst_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS sgst_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS cgst_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS sgst_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS description_of_goods TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS unit_of_measure TEXT DEFAULT 'PCS',
ADD COLUMN IF NOT EXISTS available_stock INTEGER,
ADD COLUMN IF NOT EXISTS current_stock INTEGER;

-- Update existing records with data from inventory table
UPDATE public.invoice_items ii
SET description_of_goods = i.name,
    category = i.category,
    unit_of_measure = i.unit_of_measure,
    available_stock = i.stock,
    current_stock = i.stock
FROM public.inventory i
WHERE ii.item_id = i.id;

-- Drop old columns
ALTER TABLE public.invoices
DROP COLUMN IF EXISTS due_date,
DROP COLUMN IF EXISTS status,
DROP COLUMN IF EXISTS tax_total,
DROP COLUMN IF EXISTS discount_percent,
DROP COLUMN IF EXISTS discount_amount;

ALTER TABLE public.invoice_items
DROP COLUMN IF EXISTS tax_rate,
DROP COLUMN IF EXISTS discount_percent,
DROP COLUMN IF EXISTS discount_amount; 