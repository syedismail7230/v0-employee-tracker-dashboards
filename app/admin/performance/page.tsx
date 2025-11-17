'use client'

import AdminLayout from '@/components/layout/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Target, TrendingUp } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, HeatMap, ScatterChart, Scatter } from 'recharts'
import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface PerformanceTarget {
  id: string
  employee: string
  target: string
  targetValue: number
  currentValue: number
  metric: string
  progress: number
  status: 'active' | 'achieved' | 'failed'
}

export default function PerformancePage() {
  const [search, setSearch] = useState('')
  const [targetOpen, setTargetOpen] = useState(false)
  const [targetForm, setTargetForm] = useState({
    employee: '',
    target: '',
    targetValue: '',
    metric: 'tasks_completed',
  })

  const targets: PerformanceTarget[] = [
    { id: '1', employee: 'John Doe', target: 'Tasks Completed', targetValue: 50, currentValue: 48, metric: 'tasks_completed', progress: 96, status: 'active' },
    { id: '2', employee: 'Jane Smith', target: 'Productivity Score', targetValue: 90, currentValue: 88, metric: 'productivity_score', progress: 98, status: 'active' },
    { id: '3', employee: 'Bob Johnson', target: 'Attendance Rate', targetValue: 95, currentValue: 85, metric: 'attendance_percentage', progress: 89, status: 'active' },
    { id: '4', employee: 'Alice Brown', target: 'Tasks Completed', targetValue: 40, currentValue: 42, metric: 'tasks_completed', progress: 105, status: 'achieved' },
  ]

  const productivityData = [
    { date: 'Jan 15', productivity: 82, tasks: 12 },
    { date: 'Jan 16', productivity: 85, tasks: 14 },
    { date: 'Jan 17', productivity: 88, tasks: 15 },
    { date: 'Jan 18', productivity: 80, tasks: 11 },
    { date: 'Jan 19', productivity: 90, tasks: 16 },
  ]

  const employeePerformance = [
    { name: 'John Doe', score: 87, trend: 'up' },
    { name: 'Jane Smith', score: 92, trend: 'up' },
    { name: 'Bob Johnson', score: 78, trend: 'down' },
    { name: 'Alice Brown', score: 95, trend: 'up' },
    { name: 'Charlie Davis', score: 81, trend: 'stable' },
  ]

  const hourlyProductivity = [
    { hour: '9', productivity: 75 },
    { hour: '10', productivity: 82 },
    { hour: '11', productivity: 88 },
    { hour: '12', productivity: 70 },
    { hour: '13', productivity: 65 },
    { hour: '14', productivity: 78 },
    { hour: '15', productivity: 85 },
    { hour: '16', productivity: 90 },
    { hour: '17', productivity: 80 },
  ]

  const filteredTargets = targets.filter(t =>
    t.employee.toLowerCase().includes(search.toLowerCase())
  )

  const handleAddTarget = () => {
    if (targetForm.employee && targetForm.target && targetForm.targetValue) {
      // Handle adding target
      setTargetForm({ employee: '', target: '', targetValue: '', metric: 'tasks_completed' })
      setTargetOpen(false)
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500'
    if (progress >= 80) return 'bg-blue-500'
    if (progress >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
            <p className="text-muted-foreground mt-2">Targets, productivity heatmaps, and performance metrics</p>
          </div>
          <Dialog open={targetOpen} onOpenChange={setTargetOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Target className="w-4 h-4" />
                Set Target
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Performance Target</DialogTitle>
                <DialogDescription>Create a new performance target for an employee</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Employee</Label>
                  <Select value={targetForm.employee} onValueChange={(value) => setTargetForm({ ...targetForm, employee: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="John Doe">John Doe</SelectItem>
                      <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                      <SelectItem value="Bob Johnson">Bob Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Target Name</Label>
                  <Input
                    placeholder="e.g., Complete 50 tasks"
                    value={targetForm.target}
                    onChange={(e) => setTargetForm({ ...targetForm, target: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Metric Type</Label>
                  <Select value={targetForm.metric} onValueChange={(value) => setTargetForm({ ...targetForm, metric: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tasks_completed">Tasks Completed</SelectItem>
                      <SelectItem value="productivity_score">Productivity Score</SelectItem>
                      <SelectItem value="attendance_percentage">Attendance %</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Target Value</Label>
                  <Input
                    type="number"
                    placeholder="50"
                    value={targetForm.targetValue}
                    onChange={(e) => setTargetForm({ ...targetForm, targetValue: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddTarget} className="w-full">Create Target</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Performance Overview Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Productivity Trend</CardTitle>
              <CardDescription>Productivity score and tasks completed</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={productivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" domain={[0, 100]} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 20]} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="productivity" stroke="hsl(var(--chart-1))" name="Productivity %" />
                  <Line yAxisId="right" type="monotone" dataKey="tasks" stroke="hsl(var(--chart-2))" name="Tasks Completed" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Employee Performance Scores</CardTitle>
              <CardDescription>Overall performance rating</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={employeePerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="hsl(var(--chart-1))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Hourly Productivity Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle>Productivity Heatmap - Hourly Breakdown</CardTitle>
            <CardDescription>Peak productivity hours across all employees</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={hourlyProductivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Productivity %', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="productivity" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Targets */}
        <Card>
          <CardHeader>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTargets.map((target) => (
                <div key={target.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{target.employee}</h4>
                      <p className="text-sm text-muted-foreground">{target.target}</p>
                    </div>
                    <Badge variant={target.status === 'achieved' ? 'default' : target.status === 'failed' ? 'destructive' : 'secondary'}>
                      {target.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{target.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-full rounded-full transition-all ${getProgressColor(target.progress)}`}
                        style={{ width: `${Math.min(target.progress, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground pt-1">
                      <span>{target.currentValue} of {target.targetValue}</span>
                      <span className="text-muted-foreground">{target.metric.replace('_', ' ')}</span>
                    </div>
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
