'use client'

import { useState, useEffect } from 'react'
import { Bill } from '@/lib/db'

export default function AdminDashboard() {
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newBill, setNewBill] = useState({
    customer_name: '',
    amount: '',
    due_date: '',
    lender: ''
  })

  useEffect(() => {
    fetchBills()
  }, [])

  const fetchBills = async () => {
    try {
      const response = await fetch('/api/bills')
      if (response.ok) {
        const data = await response.json()
        setBills(data)
      }
    } catch (error) {
      console.error('Error fetching bills:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteBill = async (id: string) => {
    if (!confirm('คุณต้องการลบบิลนี้หรือไม่?')) return

    try {
      const response = await fetch(`/api/bills/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setBills(bills.filter(bill => bill.id !== id))
      }
    } catch (error) {
      console.error('Error deleting bill:', error)
    }
  }

  const addBill = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/bills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBill)
      })
      if (response.ok) {
        const bill = await response.json()
        setBills([bill, ...bills])
        setNewBill({ customer_name: '', amount: '', due_date: '', lender: '' })
        setShowAddForm(false)
      }
    } catch (error) {
      console.error('Error adding bill:', error)
    }
  }

  const copyLink = (id: string) => {
    const link = `${window.location.origin}/customer/${id}`
    navigator.clipboard.writeText(link)
    alert('ลิงก์ถูกคัดลอกแล้ว!')
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">กำลังโหลด กรุณารอสักครู่...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              ระบบจัดการบิลชำระหนี้
            </h1>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              เพิ่มบิลใหม่
            </button>
          </div>

          {showAddForm && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">เพิ่มบิลใหม่</h2>
              <form onSubmit={addBill} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="ชื่อลูกค้า"
                  value={newBill.customer_name}
                  onChange={(e) => setNewBill({...newBill, customer_name: e.target.value})}
                  className="p-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                />
                <input
                  type="number"
                  placeholder="จำนวนเงิน"
                  value={newBill.amount}
                  onChange={(e) => setNewBill({...newBill, amount: e.target.value})}
                  className="p-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                  required
                />
                <input
                  type="date"
                  value={newBill.due_date}
                  onChange={(e) => setNewBill({...newBill, due_date: e.target.value})}
                  className="p-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                />
                <input
                  type="text"
                  placeholder="ผู้ให้กู้"
                  value={newBill.lender}
                  onChange={(e) => setNewBill({...newBill, lender: e.target.value})}
                  className="p-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                />
                <div className="md:col-span-2 flex gap-2">
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    บันทึก
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="text-left p-3">ชื่อลูกค้า</th>
                  <th className="text-left p-3">จำนวนเงิน</th>
                  <th className="text-left p-3">วันครบกำหนด</th>
                  <th className="text-left p-3">ผู้ให้กู้</th>
                  <th className="text-left p-3">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill.id} className="border-b dark:border-gray-600">
                    <td className="p-3">{bill.customer_name || 'ไม่ระบุ'}</td>
                    <td className="p-3 font-semibold">{formatAmount(bill.amount)}</td>
                    <td className="p-3">{bill.due_date ? formatDate(bill.due_date) : 'ไม่ระบุ'}</td>
                    <td className="p-3">{bill.lender || 'ไม่ระบุ'}</td>
                    <td className="p-3">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => copyLink(bill.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                        >
                          คัดลอกลิงก์
                        </button>
                        <a
                          href={`/customer/${bill.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm inline-block"
                        >
                          ดูลิงก์
                        </a>
                        <button
                          onClick={() => deleteBill(bill.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {bills.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              ไม่มีข้อมูลบิล
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
