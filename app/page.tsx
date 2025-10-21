import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              OLoan Payment System
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              ระบบแจ้งยอดชำระหนี้ลูกค้า
            </p>
          </div>
          
          <div className="space-y-4">
            <Link 
              href="/adminLoan"
              className="block w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              เข้าสู่ระบบผู้ดูแล
            </Link>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              หรือ
            </div>
            
            <Link 
              href="/customer/BJEq2RBWpLclk1iSRT8A"
              className="block w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              ทดสอบหน้าลูกค้า
            </Link>
          </div>
          
          <div className="mt-8 text-xs text-gray-400 dark:text-gray-500">
            รองรับ Mobile Browser / WebView<br/>
            iOS Safari, Android Chrome
          </div>
        </div>
      </div>
    </div>
  )
}
