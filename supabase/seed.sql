-- This file contains sample data for your Namodaya Traders database
-- Run this after setting up your database structure

-- Create sample user profile (you'll need to sign up first through Supabase Auth)
-- Then update the ID below with your actual user ID from auth.users table

-- Insert sample products
INSERT INTO products (name, category, price, stock, min_stock, sku) VALUES
('Premium Rice 5kg', 'Grains', 12.99, 45, 10, 'GRN001'),
('Olive Oil 500ml', 'Cooking Oil', 8.50, 3, 5, 'OIL001'),
('Pasta 500g', 'Pasta', 2.99, 0, 8, 'PST001'),
('Canned Tomatoes 400g', 'Canned Goods', 1.89, 25, 12, 'CAN001'),
('Whole Wheat Bread', 'Bakery', 3.49, 15, 6, 'BKR001'),
('Fresh Milk 1L', 'Dairy', 4.25, 8, 10, 'DRY001'),
('Bananas 1kg', 'Fruits', 2.15, 30, 15, 'FRT001'),
('Dishwashing Liquid', 'Cleaning', 3.99, 12, 8, 'CLN001'),
('Laundry Detergent 2kg', 'Cleaning', 15.99, 6, 4, 'CLN002'),
('Shampoo 400ml', 'Personal Care', 6.75, 18, 10, 'PRC001')
ON CONFLICT (sku) DO NOTHING;

-- Insert sample customer
INSERT INTO customers (name, phone, email, address) VALUES
('John Doe', '+91-9876543210', 'john.doe@example.com', '123 Main Street, Mumbai, Maharashtra 400001'),
('Jane Smith', '+91-9876543211', 'jane.smith@example.com', '456 Park Avenue, Delhi 110001'),
('Raj Patel', '+91-9876543212', 'raj.patel@example.com', '789 Commercial Road, Bangalore, Karnataka 560001')
ON CONFLICT DO NOTHING;