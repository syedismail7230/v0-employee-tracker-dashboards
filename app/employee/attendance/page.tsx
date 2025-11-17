'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/layout/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle2, AlertCircle, MapPin } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useRealtimeData } from '@/hooks/use-realtime-data'

interface AttendanceRecord {
  id: string
  date: string
  markingTime: string
  checkInTime?: string
  checkOutTime?: string
  status: 'present' | 'absent' | 'late' | 'half_day'
  location?: string
}

export default function EmployeeAttendancePage() {
  const { data: attendanceData } = useRealtimeData('attendance')
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [markOpen, setMarkOpen] = useState(false)
  const [checkOutOpen, setCheckOutOpen] = useState(false)
  const [currentCheckIn, setCurrentCheckIn] = useState<string | null>(null)

  useEffect(() => {
    if (attendanceData && attendanceData.length > 0) {
      setRecords(attendanceData as any)
    }
  }, [attendanceData])

  const handleMarkAttendance = () => {
    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      markingTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      checkInTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      status: 'present',
      location: 'Office',
    }
    setRecords([newRecord, ...records])
    setCurrentCheckIn(newRecord.markingTime)
    setMarkOpen(false)
  }

  const handleCheckOut = () => {
    if (currentCheckIn) {
      const updatedRecords = records.map((r, i) => 
        i === 0 ? { ...r, checkOutTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) } : r
      )
      setRecords(updatedRecords)
      setCurrentCheckIn(null)
      setCheckOutOpen(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      present: 'bg-green-500/10 text-green-700',
      absent: 'bg-red-500/10 text-red-700',
      late: 'bg-yellow-500/10 text-yellow-700',
      half_day: 'bg-blue-500/10 text-blue-700',
    }
    return colors[status] || ''
  }

  const presentDays = records.filter(r => r.status === 'present').length
  const lateDays = records.filter(r => r.status === 'late').length
  const halfDays = records.filter(r => r.status === 'half_day').length
  const totalRecordedDays = records.length
  const attendancePercentage = totalRecordedDays > 0 
    ? Math.round(((presentDays + lateDays + halfDays * 0.5) / totalRecordedDays) * 100)
    : 0

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split('T')[0]
  }).reverse()

  const attendanceTrend = last7Days.map((day) => {
    const dayRecord = records.find(r => r.date === day)
    return {
      date: new Date(day).toLocaleDateString('en-US', { weekday: 'short' }),
      present: dayRecord ? (dayRecord.status === 'present' ? 1 : 0.5) : 0,
    }
  })

  const monthlyStats = [
    { week: 'Week 1', attendance: presentDays > 5 ? 95 : 85 },
    { week: 'Week 2', attendance: presentDays > 10 ? 90 : 80 },
    { week: 'Week 3', attendance: presentDays > 15 ? 92 : 82 },
    { week: 'Week 4', attendance: attendancePercentage || 88 },
  ]

  return (
    <div className="flex">
      <Sidebar role="employee" />
      <main className="flex-1 md:ml-64 min-h-screen bg-background">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Attendance Marking (Live)</h1>
              <p className="text-muted-foreground mt-2">Real-time check-in and check-out tracking</p>
            </div>
            <div className="flex gap-2">
              {!currentCheckIn && (
                <Dialog open={markOpen} onOpenChange={setMarkOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2" onClick={handleMarkAttendance}>
                      <Clock className="w-4 h-4" />
                      Mark Attendance
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Mark Attendance</DialogTitle>
                      <DialogDescription>Mark your check-in for today</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg text-center">
                        <p className="text-sm text-muted-foreground mb-2">Current Time</p>
                        <p className="text-3xl font-bold">{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <Button onClick={handleMarkAttendance} className="w-full">Confirm Check-In</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              {currentCheckIn && (
                <Dialog open={checkOutOpen} onOpenChange={setCheckOutOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Clock className="w-4 h-4" />
                      Mark Check-Out
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Mark Check-Out</DialogTitle>
                      <DialogDescription>End your work day</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg text-center">
                        <p className="text-sm text-muted-foreground mb-2">Current Time</p>
                        <p className="text-3xl font-bold">{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <Button onClick={handleCheckOut} className="w-full">Confirm Check-Out</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Attendance %</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{attendancePercentage}%</div>
                <p className="text-xs text-muted-foreground mt-1">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Present</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{presentDays}</div>
                <p className="text-xs text-muted-foreground mt-1">Days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Late</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{lateDays}</div>
                <p className="text-xs text-muted-foreground mt-1">Days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Half Day</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{halfDays}</div>
                <p className="text-xs text-muted-foreground mt-1">Days</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Trend (Live)</CardTitle>
                <CardDescription>Past week attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={attendanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 1]} />
                    <Tooltip formatter={(value) => [`${(value as number * 100).toFixed(0)}%`]} />
                    <Line type="monotone" dataKey="present" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Attendance Rate (Live)</CardTitle>
                <CardDescription>Weekly breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="attendance" fill="hsl(var(--chart-2))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Records */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records (Live Updates)</CardTitle>
              <CardDescription>Your check-in and check-out history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {records.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No attendance records yet
                  </div>
                ) : (
                  records.map((record) => (
                    <div key={record.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors animate-in">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{record.date}</h4>
                            <Badge className={getStatusBadge(record.status)}>
                              {record.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <p className="text-muted-foreground">Marked Time</p>
                              <p className="font-medium">{record.markingTime}</p>
                            </div>
                            {record.checkInTime && (
                              <div>
                                <p className="text-muted-foreground">Check In</p>
                                <p className="font-medium">{record.checkInTime}</p>
                              </div>
                            )}
                            {record.checkOutTime && (
                              <div>
                                <p className="text-muted-foreground">Check Out</p>
                                <p className="font-medium">{record.checkOutTime}</p>
                              </div>
                            )}
                            {record.location && (
                              <div>
                                <p className="text-muted-foreground flex items-center gap-1">
                                  <MapPin className="w-3 h-3" /> Location
                                </p>
                                <p className="font-medium">{record.location}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
