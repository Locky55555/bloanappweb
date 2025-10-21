import { createClient } from '@supabase/supabase-js'
import type { Database, Bill } from '../types/supabase'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Initialize Supabase client
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function getBills(): Promise<Bill[]> {
  const { data, error } = await supabase
    .from('bills')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bills:', error)
    return []
  }

  return data || []
}

export async function getBillById(id: string): Promise<Bill | null> {
  const { data, error } = await supabase
    .from('bills')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching bill:', error)
    return null
  }

  return data
}

export async function deleteBill(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('bills')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting bill:', error)
    return false
  }

  return true
}

export async function createBill(bill: Omit<Bill, 'id' | 'created_at'>): Promise<Bill | null> {
  const { data, error } = await supabase
    .from('bills')
    .insert([{
      ...bill,
      id: Math.random().toString(36).substr(2, 20),
      created_at: new Date().toISOString()
    }])
    .select()
    .single()

  if (error) {
    console.error('Error creating bill:', error)
    return null
  }

  return data
}
