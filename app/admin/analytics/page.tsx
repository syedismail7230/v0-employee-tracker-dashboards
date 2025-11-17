'use client'

import AdminLayout from '@/components/layout/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ComposedChart, Area } from 'recharts'

export default function AnalyticsPage() {
  const productivityByHour = [
    { hour: '9', score: 65 },
    { hour: '10', score: 82 },
    { hour: '11', score: 88 },
    { hour: '12', score: 70 },
    { hour: '13', score: 55 },
    { hour: '14', score: 78 },
    { hour: '15', score: 85 },
    { hour: '16', score: 90 },
    { hour: '17', score: 75 },
  ]

  const employeeProductivity = [
    { name: 'John Doe', productivity: 85, tasks: 48, attendance: 98 },
    { name: 'Jane Smith', productivity: 92, tasks: 52, attendance: 96 },
    { name: 'Bob Johnson', productivity: 78, tasks: 38, attendance: 85 },
    { name: 'Alice Brown', productivity: 95, tasks: 58, attendance: 99 },
    { name: 'Charlie Davis', productivity: 81, tasks: 44, attendance: 90 },
  ]

  const utilizationByDept = [
    { department: 'Engineering', utilization: 92, target: 90 },
    { department: 'Marketing', utilization: 88, target: 85 },
    { department: 'Sales', utilization: 94, target: 95 },
    { department: 'HR', utilization: 85, target: 80 },
  ]

  const taskCompletionTrend = [
    { week: 'Week 1', completed: 125, delayed: 12, onTime: 113 },
    { week: 'Week 2', completed: 138, delayed: 14, onTime: 124 },
    { week: 'Week 3', completed: 142, delayed: 8, onTime: 134 },
    { week: 'Week 4', completed: 156, delayed: 10, onTime: 146 },
  ]

  const deductionImpact = [
    { month: 'Nov', avgSalary: 48200, deductions: 1800 },
    { month: 'Dec', avgSalary: 47800, deductions: 2200 },
    { month: 'Jan', avgSalary: 47500, deductions: 2500 },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advanced Analytics</h1>
          <p className="text-muted-foreground mt-2">Comprehensive insights into productivity and utilization</p>
        </div>

        <Tabs defaultValue="productivity" className="space-y-4">
          <TabsList>
            <TabsTrigger value="productivity">Productivity</TabsTrigger>
            <TabsTrigger value="utilization">Utilization</TabsTrigger>
            <TabsTrigger value="tasks">Task Metrics</TabsTrigger>
            <TabsTrigger value="deductions">Salary Impact</TabsTrigger>
          </TabsList>

          {/* Productivity Tab */}
          <TabsContent value="productivity" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hourly Productivity Heatmap</CardTitle>
                  <CardDescription>Peak productivity hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={productivityByHour}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5 }} />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Bar dataKey="score" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Employee Productivity Scores</CardTitle>
                  <CardDescription>Individual productivity ratings</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" dataKey="tasks" name="Tasks Completed" />
                      <YAxis type="number" dataKey="productivity" name="Productivity Score" domain={[0, 100]} />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="Employees" data={employeeProductivity} fill="hsl(var(--chart-2))" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Employees by productivity score</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {employeeProductivity.sort((a, b) => b.productivity - a.productivity).map((emp, idx) => (
                    <div key={emp.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-semibold">{emp.name}</p>
                          <p className="text-sm text-muted-foreground">{emp.tasks} tasks • {emp.attendance}% attendance</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{emp.productivity}%</p>
                        <div className="w-32 h-2 bg-muted rounded-full mt-1">
                          <div
                            className="h-full rounded-full bg-blue-500"
                            style={{ width: `${emp.productivity}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Utilization Tab */}
          <TabsContent value="utilization" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Utilization by Department</CardTitle>
                <CardDescription>Actual vs target utilization rates</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={utilizationByDept}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Bar dataKey="utilization" fill="hsl(var(--chart-1))" name="Actual Utilization" />
                    <Line type="monotone" dataKey="target" stroke="hsl(var(--chart-3))" name="Target" strokeDasharray="5 5" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Task Metrics Tab */}
          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Task Completion Trend</CardTitle>
                <CardDescription>Weekly on-time vs delayed tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={taskCompletionTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="onTime" fill="hsl(var(--chart-1))" name="On Time" />
                    <Bar dataKey="delayed" fill="hsl(var(--chart-4))" name="Delayed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Salary Impact Tab */}
          <TabsContent value="deductions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Salary Deduction Impact</CardTitle>
                <CardDescription>Average salary trend with deductions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={deductionImpact}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip formatter={(value) => `₹${value}`} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="avgSalary" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Avg Salary" />
                    <Line yAxisId="right" type="monotone" dataKey="deductions" stroke="hsl(var(--chart-4))" strokeWidth={2} name="Avg Deductions" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
