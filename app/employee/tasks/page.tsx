'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/layout/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Clock, CheckCircle2, AlertCircle, Upload } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useRealtimeData } from '@/hooks/use-realtime-data'

interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'delayed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  dueDate: string
  assignedDate: string
  estimatedHours: number
  actualHours?: number
  progress: number
}

export default function EmployeeTasksPage() {
  const { data: tasksData } = useRealtimeData('tasks')
  const [tasks, setTasks] = useState<Task[]>([])
  const [search, setSearch] = useState('')
  const [updateOpen, setUpdateOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [updateForm, setUpdateForm] = useState({ progress: '', hoursLogged: '', notes: '' })

  useEffect(() => {
    if (tasksData && tasksData.length > 0) {
      setTasks(tasksData as any)
    }
  }, [tasksData])

  const filteredTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase())
  )

  const completedCount = tasks.filter(t => t.status === 'completed').length
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length
  const delayedCount = tasks.filter(t => t.status === 'delayed').length

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      completed: 'bg-green-500/10 text-green-700',
      in_progress: 'bg-blue-500/10 text-blue-700',
      delayed: 'bg-red-500/10 text-red-700',
      pending: 'bg-yellow-500/10 text-yellow-700',
    }
    return colors[status] || ''
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-blue-500',
    }
    return colors[priority] || ''
  }

  const handleUpdateTask = (task: Task) => {
    setSelectedTask(task)
    setUpdateForm({ progress: task.progress.toString(), hoursLogged: (task.actualHours || 0).toString(), notes: '' })
    setUpdateOpen(true)
  }

  const handleSaveUpdate = () => {
    if (selectedTask) {
      const updatedTasks = tasks.map(t =>
        t.id === selectedTask.id
          ? {
              ...t,
              progress: parseInt(updateForm.progress),
              actualHours: parseFloat(updateForm.hoursLogged),
              status: parseInt(updateForm.progress) === 100 ? 'completed' : t.status,
            }
          : t
      )
      setTasks(updatedTasks)
      setUpdateOpen(false)
    }
  }

  return (
    <div className="flex">
      <Sidebar role="employee" />
      <main className="flex-1 md:ml-64 min-h-screen bg-background">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Tasks (Live)</h1>
            <p className="text-muted-foreground mt-2">Real-time task updates and progress tracking</p>
          </div>

          {/* Task Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tasks.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{inProgressCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Delayed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{delayedCount}</div>
              </CardContent>
            </Card>
          </div>

          {/* Tasks List */}
          <Card>
            <CardHeader>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No tasks found
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <div key={task.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors animate-in">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{task.title}</h3>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                            <Badge className={getStatusBadge(task.status)}>
                              {task.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                          
                          {/* Progress Bar */}
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-semibold">{task.progress}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="h-full rounded-full bg-blue-500 transition-all duration-300"
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <p className="text-muted-foreground">Due Date</p>
                              <p className="font-medium">{task.dueDate}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Assigned</p>
                              <p className="font-medium">{task.assignedDate}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Est. Hours</p>
                              <p className="font-medium">{task.estimatedHours}h</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Actual Hours</p>
                              <p className="font-medium">{task.actualHours || 0}h</p>
                            </div>
                          </div>
                        </div>
                        
                        <Dialog open={updateOpen && selectedTask?.id === task.id} onOpenChange={setUpdateOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateTask(task)}
                              className="ml-4"
                            >
                              <Upload className="w-4 h-4 mr-1" />
                              Update
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update Task Progress</DialogTitle>
                              <DialogDescription>Update progress and hours logged for this task</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Progress (%)</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={updateForm.progress}
                                  onChange={(e) => setUpdateForm({ ...updateForm, progress: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label>Hours Logged</Label>
                                <Input
                                  type="number"
                                  step="0.5"
                                  value={updateForm.hoursLogged}
                                  onChange={(e) => setUpdateForm({ ...updateForm, hoursLogged: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label>Notes</Label>
                                <Textarea
                                  placeholder="Add any notes about progress..."
                                  value={updateForm.notes}
                                  onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                                />
                              </div>
                              <Button onClick={handleSaveUpdate} className="w-full">Save Update</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
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
