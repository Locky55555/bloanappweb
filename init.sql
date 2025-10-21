-- Initialize the database schema and sample data
CREATE TABLE IF NOT EXISTS public.bills (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  due_date DATE,
  lender TEXT DEFAULT 'บริษัท โอโลน จำกัด',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample data
INSERT INTO public.bills (id, customer_name, amount, due_date, lender) VALUES
  ('BJEq2RBWpLclk1iSRT8A', 'Bee', 15000.00, '2024-12-31', 'บริษัท โอโลน จำกัด'),
  ('XyZ9mNpQrStUvWx1234B', 'Bee', 25000.00, '2024-11-15', 'บริษัท โอโลน จำกัด'),
  ('AbC5dEfGhIjKlMnOpQrS', 'Bee', 8500.50, '2024-10-20', 'บริษัท โอโลน จำกัด')
ON CONFLICT (id) DO NOTHING;
