'use client'

import { useState } from 'react'
import { Bill } from '@/lib/db'

interface PaymentStep2Props {
  bill: Bill
  onNext: (amount: number, bankAccount: string) => void
  onBack: () => void
}

export default function PaymentStep2({ bill, onNext, onBack }: PaymentStep2Props) {
  const [amount, setAmount] = useState(bill.amount.toString())
  const [bankAccount, setBankAccount] = useState('')
  const [errors, setErrors] = useState<{amount?: string, bank?: string}>({})

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount)
  }

  const validateForm = () => {
    const newErrors: {amount?: string, bank?: string} = {}
    
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'กรุณากรอกจำนวนเงินที่ถูกต้อง'
    } else if (parseFloat(amount) > bill.amount * 2) {
      newErrors.amount = 'จำนวนเงินสูงเกินไป'
    }
    
    if (!bankAccount) {
      newErrors.bank = 'กรุณาเลือกธนาคาร'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext(parseFloat(amount), bankAccount)
    }
  }

  const bankOptions = [
    { value: 'kbank', label: 'ธนาคารกสิกรไทย', color: 'bg-green-100 text-green-800' },
    { value: 'scb', label: 'ธนาคารไทยพาณิชย์', color: 'bg-purple-100 text-purple-800' },
    { value: 'bbl', label: 'ธนาคารกรุงเทพ', color: 'bg-blue-100 text-blue-800' },
    { value: 'ktb', label: 'ธนาคารกรุงไทย', color: 'bg-red-100 text-red-800' },
    { value: 'tmb', label: 'ธนาคารทหารไทยธนชาต', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'bay', label: 'ธนาคารกรุงศรีอยุธยา', color: 'bg-indigo-100 text-indigo-800' }
  ]

  const selectedBank = bankOptions.find(bank => bank.value === bankAccount)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pb-20">
      {/* Header with improved gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 dark:from-blue-800 dark:via-purple-800 dark:to-blue-900 rounded-2xl mx-4 mt-6 p-6 text-center text-white shadow-lg">
        <div className="text-sm font-medium mb-3 opacity-90">ยอดที่ต้องชำระ</div>
        <div className="text-4xl font-bold mb-2">{formatAmount(bill.amount)}</div>
        <div className="text-sm opacity-75">บิลหมายเลข: {bill.id}</div>
      </div>

      {/* Enhanced Warning Banner */}
      <div className="mx-4 mt-6 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 border border-orange-200 dark:border-orange-700 rounded-xl p-5 shadow-sm">
        <div className="flex items-start">
          <div className="flex-shrink-0 w-8 h-8 bg-orange-100 dark:bg-orange-800/50 rounded-full flex items-center justify-center mr-4">
            <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-orange-800 dark:text-orange-200 mb-1">
              สิทธิประโยชน์เมื่อชำระตรงเวลา
            </h3>
            <p className="text-sm text-orange-700 dark:text-orange-300 leading-relaxed">
              ยืมใหม่ปลดบล็อกจำนวนเงินสูงขึ้น และอันดับเครดิตดีขึ้น
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Payment Form */}
      <form onSubmit={handleSubmit} className="mx-4 mt-8 space-y-8">
        {/* Amount Input with better styling */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <label className="block text-base font-semibold text-gray-900 dark:text-white mb-4">
            <svg className="w-5 h-5 inline mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            จำนวนเงินที่ต้องการชำระ
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                if (errors.amount) setErrors(prev => ({...prev, amount: undefined}))
              }}
              className={`w-full p-4 pl-12 border-2 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.amount 
                  ? 'border-red-400 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
              }`}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-xl font-bold">
              ฿
            </div>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm">
              THB
            </div>
          </div>
          {errors.amount && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.amount}
            </p>
          )}
          <div className="mt-3 flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">ยอดขั้นต่ำ: ฿1000</span>
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              ยอดที่ต้องชำระ: {formatAmount(bill.amount)}
            </span>
          </div>
        </div>

        {/* Enhanced Bank Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <label className="block text-base font-semibold text-gray-900 dark:text-white mb-4">
            <svg className="w-5 h-5 inline mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v2H4V6zm0 4h12v6H4v-6z" clipRule="evenodd" />
            </svg>
            เลือกธนาคาร
          </label>
          
          <div className="relative">
            <select
              value={bankAccount}
              onChange={(e) => {
                setBankAccount(e.target.value)
                if (errors.bank) setErrors(prev => ({...prev, bank: undefined}))
              }}
              className={`w-full p-4 border-2 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none ${
                errors.bank 
                  ? 'border-red-400 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
              }`}
            >
              <option value="">กรุณาเลือกธนาคาร...</option>
              {bankOptions.map((bank) => (
                <option key={bank.value} value={bank.value}>
                  {bank.label}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Selected Bank Preview */}
          {selectedBank && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedBank.color}`}>
                  เลือกแล้ว
                </span>
                <span className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
                  {selectedBank.label}
                </span>
              </div>
            </div>
          )}

          {errors.bank && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.bank}
            </p>
          )}
        </div>

        {/* Enhanced Action Buttons */}
        <div className="space-y-4">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:from-blue-800 active:to-purple-800 text-white font-bold text-lg py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            <span className="flex items-center justify-center">
              ดำเนินการต่อ
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          
          <button
            type="button"
            onClick={onBack}
            className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-xl transition-all duration-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
          >
            <span className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              ย้อนกลับ
            </span>
          </button>
        </div>
      </form>

      {/* Additional Info Card */}
      <div className="mx-4 mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-800/50 rounded-full flex items-center justify-center mr-4">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
              ข้อมูลการชำระเงิน
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• การชำระจะดำเนินการผ่าน QR Code</li>
              <li>• ตรวจสอบข้อมูลให้ถูกต้องก่อนชำระ</li>
              <li>• การชำระจะมีผลทันทีหลังจากสำเร็จ</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}