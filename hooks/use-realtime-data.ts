'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { getSupabaseClient } from '@/lib/supabase-client'
import { RealtimeChannel } from '@supabase/supabase-js'

export function useRealtimeData<T>(
  table: string,
  query?: { column: string; value: any },
  onUpdate?: (data: T[]) => void
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const supabase = getSupabaseClient()
      let queryBuilder = supabase.from(table).select('*')

      if (query) {
        queryBuilder = queryBuilder.eq(query.column, query.value)
      }

      const { data: result, error: err } = await queryBuilder
      if (err) throw err

      setData(result || [])
      onUpdate?.(result || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [table, query, onUpdate])

  useEffect(() => {
    fetchData()

    const supabase = getSupabaseClient()
    channelRef.current = supabase.channel(`${table}_changes`).on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table,
        ...(query && { filter: `${query.column}=eq.${query.value}` }),
      },
      (payload) => {
        setData((prevData) => {
          let newData = [...prevData]

          if (payload.eventType === 'INSERT') {
            newData = [...newData, payload.new as T]
          } else if (payload.eventType === 'UPDATE') {
            newData = newData.map((item: any) =>
              item.id === payload.new.id ? (payload.new as T) : item
            )
          } else if (payload.eventType === 'DELETE') {
            newData = newData.filter((item: any) => item.id !== payload.old.id)
          }

          onUpdate?.(newData)
          return newData
        })
      }
    ).subscribe()

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [table, query, fetchData, onUpdate])

  return { data, loading, error, refetch: fetchData }
}

export function useRealtimeStream<T>(
  table: string,
  onNewData?: (data: T) => void
) {
  const [latestUpdate, setLatestUpdate] = useState<T | null>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    const supabase = getSupabaseClient()
    channelRef.current = supabase.channel(`${table}_stream`).on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table,
      },
      (payload) => {
        const newData = payload.new as T
        setLatestUpdate(newData)
        onNewData?.(newData)
      }
    ).subscribe()

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [table, onNewData])

  return { latestUpdate }
}

export function useRealtimePresence(userId: string) {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [channelRef] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    const supabase = getSupabaseClient()
    const channel = supabase.channel('presence_channel', {
      config: {
        broadcast: { ack: true },
        presence: { key: userId },
      },
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const users = Object.keys(state)
        setOnlineUsers(users)
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        setOnlineUsers((prev) => [...new Set([...prev, key])])
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        setOnlineUsers((prev) => prev.filter((id) => id !== key))
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user_id: userId, online_at: new Date() })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  return { onlineUsers }
}
