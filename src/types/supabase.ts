export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          gst_percentage: number
          stock_quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          gst_percentage: number
          stock_quantity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          gst_percentage?: number
          stock_quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_id: string
          order_date: string
          status: 'pending' | 'processing' | 'completed' | 'cancelled'
          total_amount: number
          gst_applicable: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          customer_id: string
          order_date?: string
          status?: 'pending' | 'processing' | 'completed' | 'cancelled'
          total_amount: number
          gst_applicable?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          customer_id?: string
          order_date?: string
          status?: 'pending' | 'processing' | 'completed' | 'cancelled'
          total_amount?: number
          gst_applicable?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          material_specifications: string | null
          quantity: number
          rate: number
          gst_amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          material_specifications?: string | null
          quantity: number
          rate: number
          gst_amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          material_specifications?: string | null
          quantity?: number
          rate?: number
          gst_amount?: number
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          order_id: string
          payment_method: 'upi' | 'credit_card' | 'bank_transfer' | 'cash'
          transaction_id: string
          status: 'paid' | 'pending' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          payment_method: 'upi' | 'credit_card' | 'bank_transfer' | 'cash'
          transaction_id: string
          status?: 'paid' | 'pending' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          payment_method?: 'upi' | 'credit_card' | 'bank_transfer' | 'cash'
          transaction_id?: string
          status?: 'paid' | 'pending' | 'failed'
          created_at?: string
          updated_at?: string
        }
      }
      shipments: {
        Row: {
          id: string
          order_id: string
          tracking_number: string
          courier_service: string
          status: 'shipped' | 'delivered' | 'in_transit' | 'returned'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          tracking_number: string
          courier_service: string
          status?: 'shipped' | 'delivered' | 'in_transit' | 'returned'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          tracking_number?: string
          courier_service?: string
          status?: 'shipped' | 'delivered' | 'in_transit' | 'returned'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 