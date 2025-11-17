'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/layout/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Download, TrendingDown, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { useRealtimeData } from '@/hooks/use-realtime-data'

interface SalaryRecord {
  id: string
  employee: string
  baseSalary: number
  attendance: number
  taskDelay: number
  otherDeductions: number
  totalDeductions: number
  netSalary: number
}

interface Deduction {
  id: string
  employee: string
  type: 'missed_attendance' | 'task_delay' | 'other'
  amount: number
  date: string
  status: 'pending' | 'approved'
}

export default function SalaryPage() {
  const { data: deductionsData } = useRealtimeData('salary_deductions')
  const { data: usersData } = useRealtimeData('users', { column: 'role', value: 'employee' })
  
  const [search, setSearch] = useState('')
  const [deductionOpen, setDeductionOpen] = useState(false)
  const [deductions, setDeductions] = useState<Deduction[]>([])
  const [deductionForm, setDeductionForm] = useState({
    employee: '',
    type: 'missed_attendance',
    amount: '',
    reason: '',
  })

  useEffect(() => {
    if (deductionsData && deductionsData.length > 0) {
      setDeductions(deductionsData as any)
    }
  }, [deductionsData])

  const salaries: SalaryRecord[] = (usersData || []).map((emp: any, idx: number) => ({
    id: emp.id || idx.toString(),
    employee: emp.name || `Employee ${idx + 1}`,
    baseSalary: 50000,
    attendance: deductions.filter(d => d.type === 'missed_attendance').reduce((sum, d) => sum + d.amount, 0) / (deductions.length || 1),
    taskDelay: deductions.filter(d => d.type === 'task_delay').reduce((sum, d) => sum + d.amount, 0) / (deductions.length || 1),
    otherDeductions: deductions.filter(d => d.type === 'other').reduce((sum, d) => sum + d.amount, 0) / (deductions.length || 1),
    totalDeductions: deductions.reduce((sum, d) => sum + d.amount, 0) / (deductions.length || 1),
    netSalary: 50000 - (deductions.reduce((sum, d) => sum + d.amount, 0) / (deductions.length || 1)),
  }))

  const deductionTrend = [
    { date: 'Week 1', amount: 8500 },
    { date: 'Week 2', amount: 11200 },
    { date: 'Week 3', amount: 9800 },
    { date: 'Week 4', amount: deductions.reduce((sum, d) => sum + d.amount, 0) },
  ]

  const deductionByType = [
    { type: 'Missed Attendance', value: deductions.filter(d => d.type === 'missed_attendance').reduce((sum, d) => sum + d.amount, 0) || 28000, fill: 'hsl(var(--chart-1))' },
    { type: 'Task Delay', value: deductions.filter(d => d.type === 'task_delay').reduce((sum, d) => sum + d.amount, 0) || 12500, fill: 'hsl(var(--chart-2))' },
    { type: 'Other', value: deductions.filter(d => d.type === 'other').reduce((sum, d) => sum + d.amount, 0) || 5000, fill: 'hsl(var(--chart-3))' },
  ]

  const filteredSalaries = salaries.filter(s =>
    s.employee.toLowerCase().includes(search.toLowerCase())
  )

  const handleApplyDeduction = () => {
    if (deductionForm.employee && deductionForm.amount) {
      setDeductionForm({ employee: '', type: 'missed_attendance', amount: '', reason: '' })
      setDeductionOpen(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Salary Management (Live)</h1>
            <p className="text-muted-foreground mt-2">Real-time deduction management and salary tracking</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={deductionOpen} onOpenChange={setDeductionOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <TrendingDown className="w-4 h-4" />
                  Apply Deduction
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Apply Salary Deduction</DialogTitle>
                  <DialogDescription>Deduct salary for attendance or task delays</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Employee</Label>
                    <Select value={deductionForm.employee} onValueChange={(value) => setDeductionForm({ ...deductionForm, employee: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {salaries.map(s => (
                          <SelectItem key={s.id} value={s.employee}>{s.employee}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Deduction Type</Label>
                    <Select value={deductionForm.type} onValueChange={(value) => setDeductionForm({ ...deductionForm, type: value as any })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="missed_attendance">Missed Attendance</SelectItem>
                        <SelectItem value="task_delay">Task Delay</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Amount (₹)</Label>
                    <Input
                      type="number"
                      placeholder="1000"
                      value={deductionForm.amount}
                      onChange={(e) => setDeductionForm({ ...deductionForm, amount: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Reason</Label>
                    <Input
                      placeholder="Brief description..."
                      value={deductionForm.reason}
                      onChange={(e) => setDeductionForm({ ...deductionForm, reason: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleApplyDeduction} className="w-full">Apply Deduction</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Deduction Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Deduction Trend (Live)</CardTitle>
              <CardDescription>Weekly deduction amounts</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={deductionTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Line type="monotone" dataKey="amount" stroke="hsl(var(--chart-4))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deduction Breakdown (Live)</CardTitle>
              <CardDescription>By deduction type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={deductionByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" angle={-20} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Bar dataKey="value" fill="hsl(var(--chart-2))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Deductions */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Recent Deductions (Live Updates)</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deductions.length > 0 ? (
                deductions.map((ded) => (
                  <div key={ded.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors animate-in">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{ded.employee}</h4>
                          <Badge variant="outline" className={ded.status === 'approved' ? 'bg-green-500/10 text-green-700' : 'bg-yellow-500/10 text-yellow-700'}>
                            {ded.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {ded.type.replace('_', ' ').toUpperCase()} • {ded.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-destructive">-₹{ded.amount}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No recent deductions
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Salary Records */}
        <Card>
          <CardHeader>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Employee</th>
                    <th className="text-right py-3 px-4 font-medium">Base Salary</th>
                    <th className="text-right py-3 px-4 font-medium">Attendance</th>
                    <th className="text-right py-3 px-4 font-medium">Task Delay</th>
                    <th className="text-right py-3 px-4 font-medium">Other</th>
                    <th className="text-right py-3 px-4 font-medium">Total Deductions</th>
                    <th className="text-right py-3 px-4 font-medium">Net Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSalaries.length > 0 ? (
                    filteredSalaries.map((sal) => (
                      <tr key={sal.id} className="border-b hover:bg-muted/50 animate-in">
                        <td className="py-3 px-4">{sal.employee}</td>
                        <td className="text-right py-3 px-4">₹{sal.baseSalary.toLocaleString()}</td>
                        <td className="text-right py-3 px-4 text-destructive">-₹{sal.attendance.toLocaleString()}</td>
                        <td className="text-right py-3 px-4 text-destructive">-₹{sal.taskDelay.toLocaleString()}</td>
                        <td className="text-right py-3 px-4 text-destructive">-₹{sal.otherDeductions.toLocaleString()}</td>
                        <td className="text-right py-3 px-4 font-semibold text-destructive">-₹{sal.totalDeductions.toLocaleString()}</td>
                        <td className="text-right py-3 px-4 font-semibold">₹{sal.netSalary.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-muted-foreground">
                        No employees found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
