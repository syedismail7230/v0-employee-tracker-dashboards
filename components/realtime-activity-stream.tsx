'use client'

import { useState, useEffect } from 'react'
import { useRealtimeStream } from '@/hooks/use-realtime-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, AlertCircle, Users, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActivityEvent {
  id: string
  type: 'task_update' | 'attendance_marked' | 'leave_request' | 'deduction_applied' | 'task_completed'
  title: string
  description: string
  user: string
  timestamp: string
  severity: 'info' | 'warning' | 'error' | 'success'
}

export function RealtimeActivityStream() {
  const [activities, setActivities] = useState<ActivityEvent[]>([])
  const { latestUpdate } = useRealtimeStream('activity_logs', (data: any) => {
    const newActivity: ActivityEvent = {
      id: data.id || Date.now().toString(),
      type: data.type,
      title: data.title,
      description: data.description,
      user: data.user,
      timestamp: new Date().toLocaleTimeString(),
      severity: data.severity || 'info',
    }
    setActivities(prev => [newActivity, ...prev].slice(0, 20))
  })

  const getIcon = (type: string) => {
    switch (type) {
      case 'task_completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'task_update':
        return <Clock className="w-5 h-5 text-blue-500" />
      case 'attendance_marked':
        return <Users className="w-5 h-5 text-purple-500" />
      case 'leave_request':
        return <AlertCircle className="w-5 h-5 text-orange-500" />
      case 'deduction_applied':
        return <TrendingDown className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success':
        return 'bg-green-500/10 text-green-700'
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-700'
      case 'error':
        return 'bg-red-500/10 text-red-700'
      default:
        return 'bg-blue-500/10 text-blue-700'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Activity Stream</CardTitle>
        <CardDescription>Real-time system events and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Waiting for activity updates...
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="p-3 border rounded-lg hover:bg-muted/50 transition-colors animate-in flex gap-3"
              >
                <div className="flex-shrink-0 mt-1">
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm line-clamp-1">{activity.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {activity.description}
                      </p>
                    </div>
                    <Badge className={cn('flex-shrink-0', getSeverityColor(activity.severity))} variant="secondary">
                      <span className="text-xs">{activity.timestamp}</span>
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">By {activity.user}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function ActivityStreamWidget() {
  const [recentActivities, setRecentActivities] = useState<ActivityEvent[]>([])

  useRealtimeStream('activity_logs', (data: any) => {
    const newActivity: ActivityEvent = {
      id: data.id || Date.now().toString(),
      type: data.type,
      title: data.title,
      description: data.description,
      user: data.user,
      timestamp: new Date().toLocaleTimeString(),
      severity: data.severity || 'info',
    }
    setRecentActivities(prev => [newActivity, ...prev].slice(0, 5))
  })

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'task_completed':
        return 'border-l-green-500'
      case 'task_update':
        return 'border-l-blue-500'
      case 'attendance_marked':
        return 'border-l-purple-500'
      case 'leave_request':
        return 'border-l-orange-500'
      case 'deduction_applied':
        return 'border-l-red-500'
      default:
        return 'border-l-gray-500'
    }
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Recent Activity</h3>
      <div className="space-y-1">
        {recentActivities.length === 0 ? (
          <p className="text-xs text-muted-foreground">No recent activity</p>
        ) : (
          recentActivities.map((activity) => (
            <div
              key={activity.id}
              className={cn(
                'p-2 border-l-4 rounded-sm text-xs animate-in',
                getActivityColor(activity.type)
              )}
            >
              <p className="font-medium line-clamp-1">{activity.title}</p>
              <p className="text-muted-foreground line-clamp-1">{activity.timestamp}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
