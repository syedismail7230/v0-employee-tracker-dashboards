'use client'

import AdminLayout from '@/components/layout/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Download, FileText } from 'lucide-react'
import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ComplianceLog {
  id: string
  user: string
  action: string
  entityType: string
  details: string
  timestamp: string
  ipAddress: string
}

export default function CompliancePage() {
  const [search, setSearch] = useState('')
  const [dateRange, setDateRange] = useState('7days')

  const logs: ComplianceLog[] = [
    { id: '1', user: 'Admin User', action: 'Modified', entityType: 'Salary Record', details: 'Salary deduction applied for John Doe', timestamp: '2024-01-19 15:30:12', ipAddress: '192.168.1.100' },
    { id: '2', user: 'John Doe', action: 'Submitted', entityType: 'Task Update', details: 'Updated task API Integration to 65%', timestamp: '2024-01-19 14:45:30', ipAddress: '203.0.113.45' },
    { id: '3', user: 'Admin User', action: 'Approved', entityType: 'Leave Request', details: 'Approved half-day leave for Jane Smith', timestamp: '2024-01-19 13:20:00', ipAddress: '192.168.1.100' },
    { id: '4', user: 'Bob Johnson', action: 'Created', entityType: 'Attendance Mark', details: 'Marked attendance - Present', timestamp: '2024-01-19 09:15:45', ipAddress: '198.51.100.22' },
    { id: '5', user: 'Admin User', action: 'Generated', entityType: 'Report', details: 'Compliance report generated for January', timestamp: '2024-01-19 08:00:00', ipAddress: '192.168.1.100' },
  ]

  const deductionAudit = [
    { date: 'Jan 15', count: 3, amount: 4500 },
    { date: 'Jan 16', count: 2, amount: 3000 },
    { date: 'Jan 17', count: 4, amount: 6200 },
    { date: 'Jan 18', count: 2, amount: 2800 },
    { date: 'Jan 19', count: 5, amount: 7500 },
  ]

  const complianceByType = [
    { type: 'Salary Modifications', incidents: 8, fill: 'hsl(var(--chart-1))' },
    { type: 'Task Updates', incidents: 15, fill: 'hsl(var(--chart-2))' },
    { type: 'Leave Approvals', incidents: 6, fill: 'hsl(var(--chart-3))' },
    { type: 'Attendance Marks', incidents: 42, fill: 'hsl(var(--chart-4))' },
  ]

  const filteredLogs = logs.filter(l =>
    l.user.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Compliance Logger</h1>
            <p className="text-muted-foreground mt-2">Audit trail for salary deductions and system actions</p>
          </div>
          <Button className="gap-2" variant="outline">
            <Download className="w-4 h-4" />
            Export Audit Trail
          </Button>
        </div>

        {/* Compliance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Deduction Audit Trail</CardTitle>
              <CardDescription>Daily deduction events and amounts</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={deductionAudit}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="count" fill="hsl(var(--chart-1))" name="Deduction Events" />
                  <Bar yAxisId="right" dataKey="amount" fill="hsl(var(--chart-2))" name="Amount (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Incidents by Type</CardTitle>
              <CardDescription>Classification of all logged actions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={complianceByType} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="type" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="incidents" fill="hsl(var(--chart-1))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Logs */}
        <Card>
          <CardHeader>
            <div className="space-y-4">
              <h3 className="font-semibold">Audit Logs</h3>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="24hours">Last 24 Hours</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{log.user}</h4>
                        <Badge variant="outline">{log.action}</Badge>
                        <Badge className="bg-blue-500/10 text-blue-700">{log.entityType}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{log.details}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>🔗 {log.ipAddress}</span>
                        <span>⏰ {log.timestamp}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
