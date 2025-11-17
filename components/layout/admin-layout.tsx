'use client'

import { useState, useEffect } from 'react'
import Sidebar from './sidebar'
import { NotificationCenter } from '@/components/notifications/notification-center'
import { RealtimeIndicator } from '@/components/realtime-indicator'
import { RealtimeProvider } from '@/lib/realtime-context'

interface AdminLayoutProps {
  children: React.ReactNode
  userId?: string
}

export default function AdminLayout({ children, userId = 'admin-1' }: AdminLayoutProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="flex">
        <Sidebar role="admin" />
        <main className="flex-1 md:ml-64 min-h-screen bg-background">
          <div className="p-6">{children}</div>
        </main>
      </div>
    )
  }

  return (
    <RealtimeProvider userId={userId}>
      <div className="flex">
        <Sidebar role="admin" />
        <main className="flex-1 md:ml-64 min-h-screen bg-background">
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div />
              <div className="flex items-center gap-4">
                <RealtimeIndicator />
                <NotificationCenter />
              </div>
            </div>
            <div>{children}</div>
          </div>
        </main>
      </div>
    </RealtimeProvider>
  )
}
