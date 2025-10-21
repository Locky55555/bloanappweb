'use client'

import { useState } from 'react'
import { Bill } from '@/lib/db'

interface PaymentStep1Props {
  bill: Bill
  onNext: () => void
}

export default function PaymentStep1({ bill, onNext }: PaymentStep1Props) {
  const [showLoanDetails, setShowLoanDetails] = useState(false)
  const [showQuotaDetails, setShowQuotaDetails] = useState(false)

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysUntilDue = bill.due_date ? getDaysUntilDue(bill.due_date) : 0
  const isUrgent = daysUntilDue <= 7 && daysUntilDue > 0
  const isOverdue = daysUntilDue < 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 pb-20">
      {/* Enhanced Header with Status Indicator */}
      <div className="relative overflow-hidden">
        <div className={`bg-gradient-to-r ${
          isOverdue 
            ? 'from-red-600 via-red-500 to-red-600' 
            : isUrgent 
              ? 'from-orange-600 via-amber-500 to-orange-600'
              : 'from-blue-600 via-purple-600 to-blue-700'
        } dark:from-blue-800 dark:via-purple-800 dark:to-blue-900 rounded-2xl mx-4 mt-6 p-6 text-center text-white shadow-2xl`}>
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="5" cy="5" r="2" fill="white" fillOpacity="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-center mb-3">
              <svg className="w-6 h-6 mr-2 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              <span className="text-sm font-medium opacity-90">ยอดที่ต้องชำระ</span>
            </div>
            
            <div className="text-4xl font-bold mb-4 tracking-tight">{formatAmount(bill.amount)}</div>
            
            {bill.due_date && (
              <>
                <div className="text-sm mb-4 opacity-90">
                  วันที่ครบกำหนด: {formatDate(bill.due_date)}
                </div>
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                  isOverdue 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : isUrgent 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-white/20 backdrop-blur-sm text-white border border-white/30'
                }`}>
                  {isOverdue ? (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      เกินกำหนด {Math.abs(daysUntilDue)} วัน
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      อีก {daysUntilDue} วันครบกำหนด
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Loan Information Card */}
      <div className="mx-4 mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
          onClick={() => setShowLoanDetails(!showLoanDetails)}
          className="flex items-center justify-between w-full text-left p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">ข้อมูลเงินกู้</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">รายละเอียดการกู้เงิน</p>
            </div>
          </div>
          <div className={`transform transition-transform duration-200 ${showLoanDetails ? 'rotate-180' : ''}`}>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showLoanDetails ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-700">
            <div className="pt-4 space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-1a1 1 0 00-1-1H9a1 1 0 00-1 1v1a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                  </svg>
                  กลไกปล่อยเงินกู้
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                  {bill.lender || 'Lend Pro'}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  ยอดเงินที่สมัครกู้
                </span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  {formatAmount(bill.amount)}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  วันครบกำหนด
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {bill.due_date ? formatDate(bill.due_date) : 'ไม่ระบุ'}
                </span>
              </div>
              
              <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                <button className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  ดาวน์โหลดหลักฐานการโอนเงิน
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Quota Information Card */}
      <div className="mx-4 mt-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
          onClick={() => setShowQuotaDetails(!showQuotaDetails)}
          className="flex items-center justify-between w-full text-left p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">วงเงินกู้</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">ชำระเงินกู้คืน วงเงินเพิ่ม</p>
            </div>
          </div>
          <div className={`transform transition-transform duration-200 ${showQuotaDetails ? 'rotate-180' : ''}`}>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showQuotaDetails ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-700">
            <div className="pt-4 space-y-4">
              {/* Quota Timeline */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full border-2 border-gray-400 dark:border-gray-500 mr-4"></div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">โควต้ารอบที่แล้ว</span>
                  </div>
                  <span className="text-sm font-bold text-gray-500 dark:text-gray-400">฿ 5,000</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-4 shadow-lg"></div>
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-200">โควต้ารอบนี้</span>
                  </div>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">฿ 10,000</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full border-2 border-green-400 dark:border-green-500 mr-4"></div>
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">โควต้ารอบต่อไป</span>
                  </div>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">฿ 20,000</span>
                </div>
              </div>
              
              {/* Incentive Banner */}
              <div className="mt-4 p-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-white shadow-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold mb-1">สิทธิพิเศษ!</h4>
                    <p className="text-xs opacity-90">
                      ชำระตรงเวลา ขอกู้ใหม่ได้ ฿ 50,000
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Payment Button */}
      <div className="mx-4 mt-8">
        <button
          onClick={onNext}
          className="group w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:from-blue-800 active:to-purple-800 text-white font-bold text-lg py-5 px-6 rounded-2xl transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
        >
          <span className="flex items-center justify-center">
            <svg className="w-6 h-6 mr-3 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            ชำระเงินกู้
            <svg className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </button>
      </div>

      {/* Additional Benefits Card */}
      <div className="mx-4 mt-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
        <div className="flex items-start">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-800/50 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
              ประโยชน์ของการชำระตรงเวลา
            </h3>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <li className="flex items-center">
                <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                เพิ่มวงเงินกู้สูงสุด
              </li>
              <li className="flex items-center">
                <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                สร้างประวัติเครดิตที่ดี
              </li>
              <li className="flex items-center">
                <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                รับสิทธิประโยชน์พิเศษ
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}