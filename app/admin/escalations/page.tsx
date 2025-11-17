'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/layout/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, CheckCircle2, Clock, Zap } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Escalation {
  id: string
  taskId: string
  employee: string
  task: string
  reason: string
  level: 1 | 2 | 3
  status: 'pending' | 'in_progress' | 'resolved'
  createdAt: string
}

export default function EscalationsPage() {
  const [escalations, setEscalations] = useState<Escalation[]>([
    { id: '1', taskId: 'task-1', employee: 'John Doe', task: 'API Integration', reason: 'Blocked by payment service dependency', level: 1, status: 'pending', createdAt: '2024-01-19 14:30' },
    { id: '2', taskId: 'task-3', employee: 'Bob Johnson', task: 'Database Optimization', reason: 'Critical performance blocker', level: 2, status: 'in_progress', createdAt: '2024-01-18 11:00' },
  ])

  const [resolveOpen, setResolveOpen] = useState(false)
  const [selectedEscalation, setSelectedEscalation] = useState<Escalation | null>(null)
  const [resolution, setResolution] = useState('')

  const handleResolveEscalation = async () => {
    if (selectedEscalation && resolution) {
      const updated = escalations.map(e =>
        e.id === selectedEscalation.id ? { ...e, status: 'resolved' as const } : e
      )
      setEscalations(updated)
      setResolveOpen(false)
      setResolution('')
    }
  }

  const getLevelBadge = (level: number) => {
    const colors = {
      1: 'bg-yellow-500/10 text-yellow-700',
      2: 'bg-orange-500/10 text-orange-700',
      3: 'bg-red-500/10 text-red-700',
    }
    return colors[level as 1 | 2 | 3] || ''
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
    }
  }

  const pendingCount = escalations.filter(e => e.status === 'pending').length
  const level2Count = escalations.filter(e => e.level === 2).length
  const level3Count = escalations.filter(e => e.level === 3).length

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Escalation Workflow</h1>
          <p className="text-muted-foreground mt-2">Manage task escalations and blocking issues</p>
        </div>

        {/* Escalation Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting action</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Level 2+ Issues</CardTitle>
              <Zap className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{level2Count + level3Count}</div>
              <p className="text-xs text-muted-foreground mt-1">High priority</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical (Level 3)</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{level3Count}</div>
              <p className="text-xs text-muted-foreground mt-1">Immediate attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Escalations List */}
        <Card>
          <CardHeader>
            <CardTitle>Active Escalations</CardTitle>
            <CardDescription>Task escalations requiring management intervention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {escalations.map((escalation) => (
                <div key={escalation.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(escalation.status)}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{escalation.employee} - {escalation.task}</h4>
                          <Badge className={getLevelBadge(escalation.level)}>
                            Level {escalation.level}
                          </Badge>
                          <Badge variant={escalation.status === 'resolved' ? 'default' : escalation.status === 'in_progress' ? 'secondary' : 'outline'}>
                            {escalation.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{escalation.reason}</p>
                        <p className="text-xs text-muted-foreground">{escalation.createdAt}</p>
                      </div>
                    </div>

                    {escalation.status !== 'resolved' && (
                      <Dialog open={resolveOpen && selectedEscalation?.id === escalation.id} onOpenChange={setResolveOpen}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedEscalation(escalation)}
                          >
                            Resolve
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Resolve Escalation</DialogTitle>
                            <DialogDescription>
                              {selectedEscalation?.employee} - {selectedEscalation?.task}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Resolution</Label>
                              <Textarea
                                placeholder="Describe how this escalation was resolved..."
                                value={resolution}
                                onChange={(e) => setResolution(e.target.value)}
                              />
                            </div>
                            <Button onClick={handleResolveEscalation} className="w-full">Mark as Resolved</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
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
