'use client'

export default function MobileBottomNav() {
  const navItems = [
    { id: 'orders', label: 'คำสั่ง', icon: '📋' },
    { id: 'progress', label: 'ความคืบหน้าการชำระ', icon: '📊' },
    { id: 'service', label: 'การบริการลูกค้า', icon: '🎧' }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 h-14 flex items-center justify-around px-4 z-50">
      {navItems.map((item) => (
        <div key={item.id} className="flex flex-col items-center justify-center flex-1">
          <div className="text-lg mb-1">{item.icon}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 text-center leading-tight">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}
