export interface Bill {
  id: string
  customer_name: string | null
  amount: number
  due_date: string | null
  lender: string | null
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      bills: {
        Row: Bill
        Insert: Omit<Bill, 'id' | 'created_at'> & { id?: string, created_at?: string }
        Update: Partial<Bill>
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