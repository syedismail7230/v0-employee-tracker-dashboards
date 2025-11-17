'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/layout/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Users, CheckSquare, Clock, TrendingDown } from 'lucide-react'
import { useRealtimeData } from '@/hooks/use-realtime-data'

export default function AdminDashboard() {
  const { data: employeeData } = useRealtimeData('users', { column: 'role', value: 'employee' })
  const { data: taskData } = useRealtimeData('tasks')
  const { data: attendanceData } = useRealtimeData('attendance')
  const { data: deductionData } = useRealtimeData('salary_deductions')

  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeToday: 0,
    pendingTasks: 0,
    averageAttendance: 0,
    salaryDeductions: 0,
  })

  const [chartsData, setChartsData] = useState({
    attendanceChart: [] as any[],
    taskChart: [] as any[],
  })

  useEffect(() => {
    const activeToday = attendanceData.filter(
      (a: any) => new Date(a.date).toDateString() === new Date().toDateString()
    ).length

    const totalDeductions = deductionData.reduce(
      (sum: number, d: any) => sum + (d.amount || 0),
      0
    )

    const pendingTasks = taskData.filter((t: any) => t.status !== 'completed').length

    const attendancePercentage =
      employeeData.length > 0
        ? Math.round((activeToday / employeeData.length) * 100)
        : 0

    setStats({
      totalEmployees: employeeData.length,
      activeToday,
      pendingTasks,
      averageAttendance: attendancePercentage,
      salaryDeductions: totalDeductions,
    })

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split('T')[0]
    }).reverse()

    const attendanceByDay = last7Days.map((day) => {
      const dayAttendance = attendanceData.filter((a: any) => a.date === day)
      return {
        day: new Date(day).toLocaleDateString('en-US', { weekday: 'short' }),
        present: dayAttendance.filter((a: any) => a.status === 'present').length,
        absent: dayAttendance.filter((a: any) => a.status === 'absent').length,
        late: dayAttendance.filter((a: any) => a.status === 'late').length,
      }
    })

    const taskStats = [
      {
        status: 'Completed',
        value: taskData.filter((t: any) => t.status === 'completed').length,
        fill: 'hsl(var(--chart-1))',
      },
      {
        status: 'In Progress',
        value: taskData.filter((t: any) => t.status === 'in_progress').length,
        fill: 'hsl(var(--chart-2))',
      },
      {
        status: 'Pending',
        value: taskData.filter((t: any) => t.status === 'pending').length,
        fill: 'hsl(var(--chart-3))',
      },
      {
        status: 'Delayed',
        value: taskData.filter((t: any) => t.status === 'delayed').length,
        fill: 'hsl(var(--chart-4))',
      },
    ]

    setChartsData({
      attendanceChart: attendanceByDay,
      taskChart: taskStats,
    })
  }, [employeeData, taskData, attendanceData, deductionData])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Live overview of all employee activities and performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">Active employees</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Today</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeToday}</div>
              <p className="text-xs text-muted-foreground">{stats.averageAttendance}% attendance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingTasks}</div>
              <p className="text-xs text-muted-foreground">Awaiting completion</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageAttendance}%</div>
              <p className="text-xs text-muted-foreground">This week average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Salary Deductions</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{(stats.salaryDeductions / 1000).toFixed(0)}K</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Attendance (Live)</CardTitle>
              <CardDescription>Real-time employee attendance tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartsData.attendanceChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="hsl(var(--chart-1))" name="Present" />
                  <Bar dataKey="late" fill="hsl(var(--chart-2))" name="Late" />
                  <Bar dataKey="absent" fill="hsl(var(--chart-4))" name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Task Distribution (Live)</CardTitle>
              <CardDescription>Real-time status breakdown of all tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartsData.taskChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, value }) => `${status}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartsData.taskChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
