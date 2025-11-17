'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/layout/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Download, AlertCircle } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useRealtimeData } from '@/hooks/use-realtime-data'

interface AttendanceRecord {
  id: string
  employee: string
  date: string
  markingTime: string
  status: 'present' | 'absent' | 'late' | 'half_day'
  checkInTime?: string
  checkOutTime?: string
  deduction: number
}

export default function AttendancePage() {
  const { data: attendanceData } = useRealtimeData('attendance')
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    if (attendanceData && attendanceData.length > 0) {
      setRecords(attendanceData as any)
    }
  }, [attendanceData])

  const filteredRecords = records.filter(r =>
    r.employee.toLowerCase().includes(search.toLowerCase()) && r.date === dateFilter
  )

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split('T')[0]
  }).reverse()

  const attendanceTrendData = last7Days.map((day) => {
    const dayRecords = records.filter((r) => r.date === day)
    return {
      date: new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      present: dayRecords.filter((r) => r.status === 'present').length,
      absent: dayRecords.filter((r) => r.status === 'absent').length,
      late: dayRecords.filter((r) => r.status === 'late').length,
    }
  })

  const employeeAttendanceData = Array.from(
    new Map(records.map((r) => [r.employee, r])).entries()
  ).map(([employee]) => {
    const employeeRecords = records.filter((r) => r.employee === employee)
    const presentCount = employeeRecords.filter((r) => r.status === 'present').length
    const percentage = employeeRecords.length > 0 
      ? Math.round((presentCount / employeeRecords.length) * 100)
      : 0
    return { name: employee, percentage }
  })

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      present: 'bg-green-500/10 text-green-700',
      absent: 'bg-red-500/10 text-red-700',
      late: 'bg-yellow-500/10 text-yellow-700',
      half_day: 'bg-blue-500/10 text-blue-700',
    }
    return colors[status] || 'bg-gray-500/10 text-gray-700'
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Attendance Tracking (Live)</h1>
            <p className="text-muted-foreground mt-2">Real-time 30-minute interval attendance monitoring</p>
          </div>
          <Button className="gap-2" variant="outline">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Attendance Trend (Live)</CardTitle>
              <CardDescription>Past 7 days overview</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="present" stroke="hsl(var(--chart-1))" />
                  <Line type="monotone" dataKey="late" stroke="hsl(var(--chart-2))" />
                  <Line type="monotone" dataKey="absent" stroke="hsl(var(--chart-4))" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Employee Attendance % (Live)</CardTitle>
              <CardDescription>Monthly attendance rate</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={employeeAttendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="percentage" fill="hsl(var(--chart-1))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Records */}
        <Card>
          <CardHeader>
            <div className="space-y-4">
              <h3 className="font-semibold">Daily Attendance Records (Live Updates)</h3>
              <div className="flex gap-2 flex-wrap">
                <div className="flex-1 min-w-[200px] relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search employees..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="max-w-[200px]"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredRecords.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No attendance records found for this date
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <div key={record.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors animate-in">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{record.employee}</h4>
                          <Badge className={getStatusBadge(record.status)}>
                            {record.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          {record.deduction > 0 && (
                            <Badge variant="outline" className="text-destructive">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              ₹{record.deduction} deducted
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <p className="text-xs">Date</p>
                            <p className="font-medium text-foreground">{record.date}</p>
                          </div>
                          <div>
                            <p className="text-xs">Marked Time</p>
                            <p className="font-medium text-foreground">{record.markingTime}</p>
                          </div>
                          {record.checkInTime && (
                            <>
                              <div>
                                <p className="text-xs">Check In</p>
                                <p className="font-medium text-foreground">{record.checkInTime}</p>
                              </div>
                              <div>
                                <p className="text-xs">Check Out</p>
                                <p className="font-medium text-foreground">{record.checkOutTime}</p>
                              </div>
                            </>
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
    </AdminLayout>
  )
}
