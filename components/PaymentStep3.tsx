'use client'

import { useState, useEffect } from 'react'
import { Bill } from '@/lib/db'
import Image from 'next/image'

interface PaymentStep3Props {
  bill: Bill
  amount: number
  bankAccount: string
  onBack: () => void
}

export default function PaymentStep3({ bill, amount, bankAccount, onBack }: PaymentStep3Props) {
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes countdown
  const [copied, setCopied] = useState('')

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount)
  }

  const generateTransactionId = () => {
    return `${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}`.toUpperCase()
  }

  const transactionId = generateTransactionId()

  const getBankName = (bankCode: string) => {
    const banks: { [key: string]: { name: string, color: string } } = {
      'kbank': { name: 'ธนาคารกสิกรไทย', color: 'bg-green-100 text-green-800' },
      'scb': { name: 'ธนาคารไทยพาณิชย์', color: 'bg-purple-100 text-purple-800' },
      'bbl': { name: 'ธนาคารกรุงเทพ', color: 'bg-blue-100 text-blue-800' },
      'ktb': { name: 'ธนาคารกรุงไทย', color: 'bg-red-100 text-red-800' },
      'tmb': { name: 'ธนาคารทหารไทยธนชาต', color: 'bg-yellow-100 text-yellow-800' },
      'bay': { name: 'ธนาคารกรุงศรีอยุธยา', color: 'bg-indigo-100 text-indigo-800' }
    }
    return banks[bankCode] || { name: bankCode, color: 'bg-gray-100 text-gray-800' }
  }

  const bankInfo = getBankName(bankAccount)

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 pb-20">
      {/* Enhanced Header with Countdown */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 dark:from-blue-800 dark:via-purple-800 dark:to-blue-900 rounded-2xl mx-4 mt-6 p-6 text-center text-white shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="payment-grid" width="8" height="8" patternUnits="userSpaceOnUse">
                  <circle cx="4" cy="4" r="1" fill="white" fillOpacity="0.4"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#payment-grid)" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-center mb-3">
              <svg className="w-6 h-6 mr-2 text-white/90" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              <span className="text-sm font-medium opacity-90">ยอดที่ต้องชำระ</span>
            </div>
            
            <div className="text-4xl font-bold mb-4">{formatAmount(amount)}</div>
            
            {/* Countdown Timer */}
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">
                เหลือเวลา {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Warning Messages */}
      <div className="mx-4 mt-6 space-y-3">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">ข้อสำคัญ!</h3>
              <p className="text-sm opacity-90">หน้านี้ชำระได้เพียงครั้งเดียว กรุณาตรวจสอบข้อมูลให้ถูกต้อง</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">วิธีการชำระ</h3>
              <p className="text-sm opacity-90">สแกน QR Code ด้วยแอปธนาคารหรือแอปพร้อมเพย์</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced QR Code Section */}
      <div className="mx-4 mt-8 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* QR Code Container */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-80 h-[28rem] max-w-[320px] max-h-[448px] bg-gradient-to-br from-white to-gray-50 dark:from-gray-100 dark:to-gray-200 rounded-2xl p-3 shadow-2xl border border-gray-200">
              <div className="relative w-full h-full overflow-hidden rounded-xl">
                <Image
                  src="/images/qrcode.jpg"
                  alt="QR Code for Payment"
                  fill
                  sizes="(max-width: 768px) 320px, 448px"
                  className="object-cover"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/images/qr-placeholder.svg'
                    target.onerror = null
                  }}
                />
              </div>
            </div>
            
            {/* Floating scan instruction */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 6.292 9.995 9.995 0 10-6.468 6.468 4 4 0 116.468-6.468z" />
                </svg>
                สแกนเลย
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details with Copy Function */}
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              รายละเอียดการชำระ
            </h3>
            
            <div className="space-y-4">
              {/* Transaction ID */}
              <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">หมายเลขธุรกรรม</span>
                  <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">{transactionId}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(transactionId, 'transaction')}
                  className="flex items-center px-3 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg transition-colors text-sm"
                >
                  {copied === 'transaction' ? (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      คัดลอกแล้ว
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      คัดลอก
                    </>
                  )}
                </button>
              </div>
              
              {/* Amount */}
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700">
                <div>
                  <span className="text-sm text-green-600 dark:text-green-400 block mb-1">จำนวนเงิน</span>
                  <span className="text-2xl font-bold text-green-700 dark:text-green-300">{formatAmount(amount)}</span>
                </div>
                <div className="w-10 h-10 bg-green-100 dark:bg-green-800/50 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </div>
              </div>
              
              {/* PromptPay Number */}
              <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">หมายเลขพร้อมเพย์</span>
                  <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">******9044*</span>
                </div>
                <button
                  onClick={() => copyToClipboard('0959999346', 'promptpay')}
                  className="flex items-center px-3 py-2 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-lg transition-colors text-sm"
                >
                  {copied === 'promptpay' ? (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      คัดลอกแล้ว
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      คัดลอก
                    </>
                  )}
                </button>
              </div>
              
              {/* Bank */}
              <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">ธนาคาร</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{bankInfo.name}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${bankInfo.color}`}>
                  เลือกแล้ว
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Note */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-700">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800/50 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                คำแนะนำการชำระเงิน
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li className="flex items-center">
                  <svg className="w-3 h-3 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  เปิดแอปธนาคารหรือแอปพร้อมเพย์
                </li>
                <li className="flex items-center">
                  <svg className="w-3 h-3 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  สแกน QR Code ด้านบน
                </li>
                <li className="flex items-center">
                  <svg className="w-3 h-3 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  ตรวจสอบจำนวนเงินให้ถูกต้อง
                </li>
                <li className="flex items-center">
                  <svg className="w-3 h-3 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  ยืนยันการโอนเงิน
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Back Button */}
      <div className="mx-4 mt-8 flex space-x-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-4 px-6 rounded-2xl transition-all duration-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
        >
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            ย้อนกลับ
          </span>
        </button>
        
        <button
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-4 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-800"
          disabled
        >
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            รอการชำระ...
          </span>
        </button>
      </div>

      {/* Security Badge */}
      <div className="mx-4 mt-6 flex justify-center">
        <div className="flex items-center bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          การทำรายการปลอดภัย 100%
        </div>
      </div>
    </div>
  )
}