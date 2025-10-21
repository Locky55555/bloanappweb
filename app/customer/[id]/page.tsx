'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Bill } from '@/lib/db'
import PaymentStep1 from '@/components/PaymentStep1'
import PaymentStep2 from '@/components/PaymentStep2'
import PaymentStep3 from '@/components/PaymentStep3'
import MobileBottomNav from '@/components/MobileBottomNav'

export default function CustomerPayment() {
  const params = useParams()
  const [bill, setBill] = useState<Bill | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [paymentData, setPaymentData] = useState<{
    amount: number
    bankAccount: string
  } | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchBill(params.id as string)
    }
  }, [params.id])

  const fetchBill = async (id: string) => {
    try {
      const response = await fetch(`/api/bills/${id}`)
      if (response.ok) {
        const data = await response.json()
        setBill(data)
      } else if (response.status === 404) {
        setError('ไม่พบข้อมูลบิลที่ระบุ')
      } else {
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล')
      }
    } catch (error) {
      console.error('Error fetching bill:', error)
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ')
    } finally {
      setLoading(false)
    }
  }

  const handleStep1Next = () => {
    setCurrentStep(2)
  }

  const handleStep2Next = (amount: number, bankAccount: string) => {
    setPaymentData({ amount, bankAccount })
    setCurrentStep(3)
  }

  const handleStep2Back = () => {
    setCurrentStep(1)
  }

  const handleStep3Back = () => {
    setCurrentStep(2)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <div className="text-lg text-gray-900 dark:text-white">กำลังโหลด กรุณารอสักครู่...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <div className="space-y-2">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              โหลดใหม่
            </button>
            {/* <a
              href="/"
              className="block w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              กลับหน้าหลัก
            </a> */}
          </div>
          
          {error === 'ไม่พบข้อมูลบิลที่ระบุ' && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                <strong>ลิงก์ทดสอบ:</strong><br/>
                <a href="/customer/BJEq2RBWpLclk1iSRT8A" className="underline">
                  /customer/BJEq2RBWpLclk1iSRT8A
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (!bill) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <div className="text-lg text-gray-900 dark:text-white">ไม่พบข้อมูลบิล</div>
        </div>
      </div>
    )
  }

  return (
    <>
      {currentStep === 1 && (
        <PaymentStep1 bill={bill} onNext={handleStep1Next} />
      )}
      
      {currentStep === 2 && (
        <PaymentStep2 
          bill={bill} 
          onNext={handleStep2Next} 
          onBack={handleStep2Back} 
        />
      )}
      
      {currentStep === 3 && paymentData && (
        <PaymentStep3 
          bill={bill} 
          amount={paymentData.amount}
          bankAccount={paymentData.bankAccount}
          onBack={handleStep3Back} 
        />
      )}
      
      <MobileBottomNav />
    </>
  )
}
