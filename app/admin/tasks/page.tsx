'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/layout/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Clock, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRealtimeData } from '@/hooks/use-realtime-data'

interface Task {
  id: string
  title: string
  assignedTo: string
  status: 'pending' | 'in_progress' | 'completed' | 'delayed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  dueDate: string
  estimatedHours: number
  completionDate?: string
}

export default function TasksPage() {
  const { data: tasksData } = useRealtimeData('tasks')
  const [tasks, setTasks] = useState<Task[]>([])
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ title: '', assignedTo: '', priority: 'medium', estimatedHours: '', dueDate: '' })

  useEffect(() => {
    if (tasksData && tasksData.length > 0) {
      setTasks(tasksData as any)
    }
  }, [tasksData])

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase()) ||
    task.assignedTo.toLowerCase().includes(search.toLowerCase())
  )

  const handleAddTask = () => {
    if (formData.title && formData.assignedTo && formData.dueDate) {
      setTasks([...tasks, {
        id: Date.now().toString(),
        title: formData.title,
        assignedTo: formData.assignedTo,
        status: 'pending',
        priority: formData.priority as any,
        dueDate: formData.dueDate,
        estimatedHours: parseInt(formData.estimatedHours) || 0,
      }])
      setFormData({ title: '', assignedTo: '', priority: 'medium', estimatedHours: '', dueDate: '' })
      setOpen(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-700'
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-700'
      case 'delayed':
        return 'bg-red-500/10 text-red-700'
      default:
        return 'bg-yellow-500/10 text-yellow-700'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500'
      case 'high':
        return 'bg-orange-500'
      case 'medium':
        return 'bg-yellow-500'
      default:
        return 'bg-blue-500'
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tasks Management (Live)</h1>
            <p className="text-muted-foreground mt-2">Real-time task assignment and tracking</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Assign Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign New Task</DialogTitle>
                <DialogDescription>Create and assign a task to an employee</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Task Title</Label>
                  <Input
                    placeholder="Task name..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Assign To</Label>
                  <Select value={formData.assignedTo} onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}>
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
                  <Label>Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Estimated Hours</Label>
                  <Input
                    type="number"
                    placeholder="8"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddTask} className="w-full">Assign Task</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No tasks found
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div key={task.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors animate-in">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{task.title}</h3>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mt-3">
                          <div>
                            <p className="font-medium text-foreground">{task.assignedTo}</p>
                            <p>Assigned to</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{task.estimatedHours}h estimated</span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{task.dueDate}</p>
                            <p>Due date</p>
                          </div>
                          {task.completionDate && (
                            <div>
                              <p className="font-medium text-foreground">{task.completionDate}</p>
                              <p>Completed</p>
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
    </AdminLayout>
  )
}
