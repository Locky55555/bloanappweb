import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OLoan Payment System',
  description: 'Customer debt payment notification system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className="font-noto-thai">
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  )
}
