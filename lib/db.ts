import { Pool } from 'pg'

// In-memory fallback data for development when database is not available
const fallbackBills: Bill[] = [
  {
    id: 'BJEq2RBWpLclk1iSRT8A',
    customer_name: 'นายสมชาย ใจดี',
    amount: 10000.00,
    due_date: '2025-09-06',
    lender: 'Lend Pro',
    created_at: new Date().toISOString()
  },
  {
    id: 'test-bill-001',
    customer_name: 'นางสาวสมหญิง รักเรียน',
    amount: 15000.00,
    due_date: '2025-09-10',
    lender: 'Quick Cash',
    created_at: new Date().toISOString()
  },
  {
    id: 'test-bill-002',
    customer_name: 'นายประชา สุขใจ',
    amount: 8500.00,
    due_date: '2025-09-15',
    lender: 'Fast Money',
    created_at: new Date().toISOString()
  },
  {
    id: 'test-bill-003',
    customer_name: 'นางวิไล มั่งมี',
    amount: 25000.00,
    due_date: '2025-09-20',
    lender: 'Lend Pro',
    created_at: new Date().toISOString()
  }
]

let pool: Pool | null = null

// Try to initialize PostgreSQL connection
try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://oloan_user:oloan_password@localhost:5432/oloan_db_b',
  })
} catch (error) {
  console.warn('PostgreSQL not available, using in-memory fallback data')
}

export interface Bill {
  id: string
  customer_name: string | null
  amount: number
  due_date: string | null
  lender: string | null
  created_at: string
}

async function testDatabaseConnection(): Promise<boolean> {
  if (!pool) return false
  
  try {
    const client = await pool.connect()
    await client.query('SELECT 1')
    client.release()
    return true
  } catch (error) {
    return false
  }
}

export async function getBills(): Promise<Bill[]> {
  const isDbAvailable = await testDatabaseConnection()
  
  if (!isDbAvailable) {
    console.log('Using fallback data - PostgreSQL not available')
    return [...fallbackBills].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  const client = await pool!.connect()
  try {
    const result = await client.query('SELECT * FROM bills ORDER BY created_at DESC')
    return result.rows
  } finally {
    client.release()
  }
}

export async function getBillById(id: string): Promise<Bill | null> {
  const isDbAvailable = await testDatabaseConnection()
  
  if (!isDbAvailable) {
    console.log('Using fallback data - PostgreSQL not available')
    return fallbackBills.find(bill => bill.id === id) || null
  }

  const client = await pool!.connect()
  try {
    const result = await client.query('SELECT * FROM bills WHERE id = $1', [id])
    return result.rows[0] || null
  } finally {
    client.release()
  }
}

export async function deleteBill(id: string): Promise<boolean> {
  const isDbAvailable = await testDatabaseConnection()
  
  if (!isDbAvailable) {
    console.log('Using fallback data - PostgreSQL not available')
    const index = fallbackBills.findIndex(bill => bill.id === id)
    if (index > -1) {
      fallbackBills.splice(index, 1)
      return true
    }
    return false
  }

  const client = await pool!.connect()
  try {
    const result = await client.query('DELETE FROM bills WHERE id = $1', [id])
    return (result.rowCount ?? 0) > 0
  } finally {
    client.release()
  }
}

export async function createBill(bill: Omit<Bill, 'id' | 'created_at'>): Promise<Bill> {
  const isDbAvailable = await testDatabaseConnection()
  
  if (!isDbAvailable) {
    console.log('Using fallback data - PostgreSQL not available')
    const newBill: Bill = {
      id: Math.random().toString(36).substr(2, 20),
      ...bill,
      created_at: new Date().toISOString()
    }
    fallbackBills.unshift(newBill)
    return newBill
  }

  const client = await pool!.connect()
  try {
    const newId = Math.random().toString(36).substr(2, 20)
    const result = await client.query(
      'INSERT INTO bills (id, customer_name, amount, due_date, lender) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [newId, bill.customer_name, bill.amount, bill.due_date, bill.lender]
    )
    return result.rows[0]
  } finally {
    client.release()
  }
}
