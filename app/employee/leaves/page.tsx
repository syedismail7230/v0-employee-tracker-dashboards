'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/layout/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Plus, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRealtimeData } from '@/hooks/use-realtime-data'

interface LeaveRequest {
  id: string
  type: 'full_day' | 'half_day' | 'hourly'
  startDate: string
  endDate?: string
  startTime?: string
  endTime?: string
  hours?: number
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  requestedDate: string
}

export default function EmployeeLeavesPage() {
  const { data: leavesData } = useRealtimeData('leave_requests')
  const [leaves, setLeaves] = useState<LeaveRequest[]>([])
  const [requestOpen, setRequestOpen] = useState(false)
  const [leaveForm, setLeaveForm] = useState({
    type: 'full_day',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    reason: '',
  })

  useEffect(() => {
    if (leavesData && leavesData.length > 0) {
      setLeaves(leavesData as any)
    }
  }, [leavesData])

  const handleRequestLeave = () => {
    if (leaveForm.startDate && leaveForm.reason) {
      const newLeave: LeaveRequest = {
        id: Date.now().toString(),
        type: leaveForm.type as any,
        startDate: leaveForm.startDate,
        endDate: leaveForm.endDate,
        startTime: leaveForm.startTime,
        endTime: leaveForm.endTime,
        hours: leaveForm.type === 'hourly' ? 1 : undefined,
        reason: leaveForm.reason,
        status: 'pending',
        requestedDate: new Date().toISOString().split('T')[0],
      }
      setLeaves([newLeave, ...leaves])
      setLeaveForm({ type: 'full_day', startDate: '', endDate: '', startTime: '', endTime: '', reason: '' })
      setRequestOpen(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/10 text-yellow-700',
      approved: 'bg-green-500/10 text-green-700',
      rejected: 'bg-red-500/10 text-red-700',
    }
    return colors[status] || ''
  }

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      full_day: 'bg-blue-500',
      half_day: 'bg-purple-500',
      hourly: 'bg-orange-500',
    }
    return colors[type] || ''
  }

  const approvedLeaves = leaves.filter(l => l.status === 'approved').length
  const pendingLeaves = leaves.filter(l => l.status === 'pending').length
  const rejectedLeaves = leaves.filter(l => l.status === 'rejected').length
  const balanceRemaining = 12 - approvedLeaves

  return (
    <div className="flex">
      <Sidebar role="employee" />
      <main className="flex-1 md:ml-64 min-h-screen bg-background">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Leave Requests (Live)</h1>
              <p className="text-muted-foreground mt-2">Real-time request management and approval tracking</p>
            </div>
            <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Request Leave
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Request Leave</DialogTitle>
                  <DialogDescription>Submit a leave request for approval</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Leave Type</Label>
                    <Select value={leaveForm.type} onValueChange={(value) => setLeaveForm({ ...leaveForm, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full_day">Full Day</SelectItem>
                        <SelectItem value="half_day">Half Day</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {leaveForm.type === 'full_day' && (
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={leaveForm.startDate}
                        onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                      />
                    </div>
                  )}

                  {leaveForm.type === 'half_day' && (
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={leaveForm.startDate}
                        onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                      />
                    </div>
                  )}

                  {leaveForm.type === 'hourly' && (
                    <>
                      <div>
                        <Label>Date</Label>
                        <Input
                          type="date"
                          value={leaveForm.startDate}
                          onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Start Time</Label>
                          <Input
                            type="time"
                            value={leaveForm.startTime}
                            onChange={(e) => setLeaveForm({ ...leaveForm, startTime: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">End Time</Label>
                          <Input
                            type="time"
                            value={leaveForm.endTime}
                            onChange={(e) => setLeaveForm({ ...leaveForm, endTime: e.target.value })}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <Label>Reason</Label>
                    <Textarea
                      placeholder="Reason for leave request..."
                      value={leaveForm.reason}
                      onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                    />
                  </div>

                  <Button onClick={handleRequestLeave} className="w-full">Submit Request</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Leave Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{balanceRemaining}</div>
                <p className="text-xs text-muted-foreground mt-1">Days remaining</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{approvedLeaves}</div>
                <p className="text-xs text-muted-foreground mt-1">Leaves</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingLeaves}</div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{rejectedLeaves}</div>
                <p className="text-xs text-muted-foreground mt-1">Requests</p>
              </CardContent>
            </Card>
          </div>

          {/* Leave Requests List */}
          <Card>
            <CardHeader>
              <CardTitle>Leave Requests (Live Updates)</CardTitle>
              <CardDescription>Your submitted leave requests and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaves.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No leave requests yet
                  </div>
                ) : (
                  leaves.map((leave) => (
                    <div key={leave.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors animate-in">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getTypeBadge(leave.type)}>
                              {leave.type.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <Badge className={getStatusBadge(leave.status)}>
                              {leave.status.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <p className="text-muted-foreground">Start Date</p>
                              <p className="font-medium">{leave.startDate}</p>
                            </div>
                            {leave.endDate && (
                              <div>
                                <p className="text-muted-foreground">End Date</p>
                                <p className="font-medium">{leave.endDate}</p>
                              </div>
                            )}
                            {leave.startTime && (
                              <div>
                                <p className="text-muted-foreground">Time</p>
                                <p className="font-medium">{leave.startTime} - {leave.endTime}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-muted-foreground">Reason</p>
                              <p className="font-medium text-xs">{leave.reason}</p>
                            </div>
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
      </main>
    </div>
  )
}
