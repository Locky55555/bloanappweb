import { NextRequest, NextResponse } from 'next/server'
import { getBills, createBill } from '@/lib/db'

export async function GET() {
  try {
    const bills = await getBills()
    return NextResponse.json(bills)
  } catch (error) {
    console.error('Error fetching bills:', error)
    return NextResponse.json({ error: 'Failed to fetch bills' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_name, amount, due_date, lender } = body

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 })
    }

    const bill = await createBill({
      customer_name,
      amount: parseFloat(amount),
      due_date,
      lender
    })

    return NextResponse.json(bill, { status: 201 })
  } catch (error) {
    console.error('Error creating bill:', error)
    return NextResponse.json({ error: 'Failed to create bill' }, { status: 500 })
  }
}
