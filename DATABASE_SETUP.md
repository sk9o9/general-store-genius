# Database Setup for Namodaya Traders

## Overview
This application uses Supabase as the backend database. Follow these steps to set up your database structure.

## Prerequisites
- A Supabase account (https://supabase.com)
- A new Supabase project created

## Database Schema Setup

### 1. Create Tables
Run the following SQL commands in your Supabase SQL Editor:

```sql
-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    min_stock INTEGER NOT NULL DEFAULT 0,
    sku VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create user profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    full_name VARCHAR(255),
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### 2. Enable Row Level Security
```sql
-- Enable Row Level Security on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
```

### 3. Create RLS Policies
```sql
-- Create RLS policies (allow authenticated users to do everything for now)
CREATE POLICY "Allow authenticated users to read products" ON products FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert products" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update products" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete products" ON products FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read customers" ON customers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert customers" ON customers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update customers" ON customers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete customers" ON customers FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read invoices" ON invoices FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert invoices" ON invoices FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update invoices" ON invoices FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete invoices" ON invoices FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read invoice_items" ON invoice_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert invoice_items" ON invoice_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update invoice_items" ON invoice_items FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete invoice_items" ON invoice_items FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow users to read own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow users to update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow users to insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
```

### 4. Create Functions and Triggers
```sql
-- Create function to handle user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, username, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'username', NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 5. Insert Sample Data
Run the contents of `supabase/seed.sql` to populate your database with sample products.

## Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in your Supabase project URL and anon key:
   - Go to your Supabase project dashboard
   - Navigate to Settings > API
   - Copy the Project URL and anon/public key

## Authentication Setup

1. In your Supabase dashboard, go to Authentication > Settings
2. Set up your authentication providers as needed
3. Create your first user account through the app's login form

## Testing

After completing the setup:
1. Start your development server
2. Navigate to the application
3. Sign up for a new account
4. The sample products should appear in your inventory

## Troubleshooting

- Make sure RLS policies are correctly set up
- Check that your environment variables are correct
- Verify that authentication is working by checking the auth.users table
- Check the browser console for any API errors