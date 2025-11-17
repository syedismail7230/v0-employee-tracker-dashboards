'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/layout/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, TrendingDown, AlertCircle } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useRealtimeData } from '@/hooks/use-realtime-data'

interface SalaryDeduction {
  type: string
  amount: number
  date: string
  reason: string
}

export default function EmployeeSalaryPage() {
  const { data: deductionsData } = useRealtimeData('salary_deductions')
  const [deductions, setDeductions] = useState<SalaryDeduction[]>([])
  
  useEffect(() => {
    if (deductionsData && deductionsData.length > 0) {
      setDeductions(deductionsData as any)
    }
  }, [deductionsData])

  const baseSalary = 50000
  const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0)
  const netSalary = baseSalary - totalDeductions

  const salaryTrend = [
    { month: 'Dec', gross: 50000, deductions: 2000, net: 48000 },
    { month: 'Jan', gross: 50000, deductions: totalDeductions, net: netSalary },
  ]

  return (
    <div className="flex">
      <Sidebar role="employee" />
      <main className="flex-1 md:ml-64 min-h-screen bg-background">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Salary & Deductions (Live)</h1>
            <p className="text-muted-foreground mt-2">Real-time salary details and deduction tracking</p>
          </div>

          {/* Salary Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Base Salary</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{baseSalary.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">Current month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Deductions</CardTitle>
                <TrendingDown className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">-₹{totalDeductions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Salary</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">₹{netSalary.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">After deductions</p>
              </CardContent>
            </Card>
          </div>

          {/* Salary Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Salary Trend (Live)</CardTitle>
              <CardDescription>Last 2 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salaryTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Legend />
                  <Bar dataKey="gross" fill="hsl(var(--chart-1))" name="Gross Salary" />
                  <Bar dataKey="deductions" fill="hsl(var(--chart-4))" name="Deductions" />
                  <Bar dataKey="net" fill="hsl(var(--chart-2))" name="Net Salary" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Deductions Details */}
          <Card>
            <CardHeader>
              <CardTitle>Deductions Breakdown (Live Updates)</CardTitle>
              <CardDescription>Details of all salary deductions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deductions.length > 0 ? (
                  deductions.map((ded, idx) => (
                    <div key={idx} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors animate-in">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm">{ded.type}</h4>
                            <Badge variant="outline" className="text-xs">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {ded.date}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{ded.reason}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-semibold text-destructive">-₹{ded.amount}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No deductions this month</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
