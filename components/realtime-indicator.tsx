'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase-client'
import { cn } from '@/lib/utils'
import { RealtimeChannel } from '@supabase/supabase-js'

export function RealtimeIndicator() {
  const [isConnected, setIsConnected] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const supabase = getSupabaseClient()
      
      const channel = supabase.channel('connection-monitor')
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setIsConnected(true)
            setError(null)
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            setIsConnected(false)
          }
        })

      return () => {
        supabase.removeChannel(channel)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Connection error'
      setError(errorMsg)
      setIsConnected(false)
    }
  }, [])

  return (
    <div className="flex items-center gap-2 text-xs">
      <div
        className={cn(
          'h-2 w-2 rounded-full animate-pulse',
          isConnected ? 'bg-green-500' : 'bg-red-500'
        )}
      />
      <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
        {isConnected ? 'Live' : 'Offline'}
      </span>
    </div>
  )
}
