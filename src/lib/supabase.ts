import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          category: string
          price: number
          stock: number
          min_stock: number
          sku: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          price: number
          stock: number
          min_stock: number
          sku: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          price?: number
          stock?: number
          min_stock?: number
          sku?: string
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          phone: string | null
          email: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone?: string | null
          email?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          email?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          invoice_number: string
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          subtotal: number
          tax: number
          total: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_number: string
          customer_id?: string | null
          customer_name: string
          customer_phone?: string | null
          subtotal: number
          tax: number
          total: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_number?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          subtotal?: number
          tax?: number
          total?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      invoice_items: {
        Row: {
          id: string
          invoice_id: string
          product_id: string | null
          product_name: string
          product_sku: string
          price: number
          quantity: number
          total: number
          created_at: string
        }
        Insert: {
          id?: string
          invoice_id: string
          product_id?: string | null
          product_name: string
          product_sku: string
          price: number
          quantity: number
          total: number
          created_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string
          product_id?: string | null
          product_name?: string
          product_sku?: string
          price?: number
          quantity?: number
          total?: number
          created_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}