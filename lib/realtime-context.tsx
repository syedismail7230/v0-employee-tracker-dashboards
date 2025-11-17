'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { useRealtimeNotifications, type Notification } from '@/hooks/use-realtime-notifications'

interface RealtimeContextType {
  notifications: Notification[]
  unreadCount: number
  notificationsLoading: boolean
  markNotificationRead: (id: string) => void
  markAllRead: () => void
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

export function RealtimeProvider({
  children,
  userId,
}: {
  children: ReactNode
  userId: string
}) {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useRealtimeNotifications(userId)

  return (
    <RealtimeContext.Provider
      value={{
        notifications,
        unreadCount,
        notificationsLoading: loading,
        markNotificationRead: markAsRead,
        markAllRead: markAllAsRead,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  )
}

export function useRealtimeContext() {
  const context = useContext(RealtimeContext)
  if (!context) {
    throw new Error('useRealtimeContext must be used within RealtimeProvider')
  }
  return context
}
