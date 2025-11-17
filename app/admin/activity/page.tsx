'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/layout/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, ImageIcon, FileText, Eye, Download } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useRealtimeData } from '@/hooks/use-realtime-data'
import { RealtimeActivityStream } from '@/components/realtime-activity-stream'

interface ActivityEvidence {
  id: string
  employee: string
  task: string
  progressPercentage: number
  description: string
  type: 'screenshot' | 'attachment'
  timestamp: string
  fileUrl?: string
}

interface ActivityLog {
  id: string
  employee: string
  activity: string
  description: string
  timestamp: string
  deviceInfo: string
  location?: string
}

export default function ActivityPage() {
  const { data: evidenceData } = useRealtimeData('task_evidence')
  const { data: logsData } = useRealtimeData('activity_logs')
  
  const [search, setSearch] = useState('')
  const [selectedEvidence, setSelectedEvidence] = useState<ActivityEvidence | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [evidences, setEvidences] = useState<ActivityEvidence[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])

  useEffect(() => {
    if (evidenceData && evidenceData.length > 0) {
      setEvidences(evidenceData as any)
    }
  }, [evidenceData])

  useEffect(() => {
    if (logsData && logsData.length > 0) {
      setActivityLogs(logsData as any)
    }
  }, [logsData])

  const filteredEvidences = evidences.filter(e =>
    e.employee.toLowerCase().includes(search.toLowerCase()) ||
    e.task.toLowerCase().includes(search.toLowerCase())
  )

  const filteredLogs = activityLogs.filter(l =>
    l.employee.toLowerCase().includes(search.toLowerCase())
  )

  const handleViewEvidence = (evidence: ActivityEvidence) => {
    setSelectedEvidence(evidence)
    setViewOpen(true)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Evidence Layer (Live)</h1>
          <p className="text-muted-foreground mt-2">Real-time screenshots, attachments, and task progress evidence</p>
        </div>

        {/* Live Activity Stream */}
        <RealtimeActivityStream />

        {/* Task Progress Evidence */}
        <Card>
          <CardHeader>
            <CardTitle>Task Progress Evidence (Live Updates)</CardTitle>
            <CardDescription>Real-time screenshots and attachments from task work</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredEvidences.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No evidence records found
                </div>
              ) : (
                filteredEvidences.map((evidence) => (
                  <div key={evidence.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors animate-in">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{evidence.employee}</h4>
                          <Badge variant="outline">{evidence.task}</Badge>
                          <Badge className={evidence.progressPercentage >= 75 ? 'bg-green-500' : evidence.progressPercentage >= 50 ? 'bg-blue-500' : 'bg-yellow-500'}>
                            {evidence.progressPercentage}%
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{evidence.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {evidence.type === 'screenshot' ? (
                            <ImageIcon className="w-3 h-3" />
                          ) : (
                            <FileText className="w-3 h-3" />
                          )}
                          <span>{evidence.type === 'screenshot' ? 'Screenshot' : 'Attachment'}</span>
                          <span>•</span>
                          <span>{evidence.timestamp}</span>
                        </div>
                      </div>
                      <Dialog open={viewOpen && selectedEvidence?.id === evidence.id} onOpenChange={setViewOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => handleViewEvidence(evidence)}
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{selectedEvidence?.employee} - {selectedEvidence?.task}</DialogTitle>
                            <DialogDescription>{selectedEvidence?.description}</DialogDescription>
                          </DialogHeader>
                          {selectedEvidence?.fileUrl && (
                            <div className="space-y-4">
                              <img src={selectedEvidence.fileUrl || "/placeholder.svg"} alt="Evidence" className="w-full rounded-lg border" />
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Progress</p>
                                  <p className="font-semibold">{selectedEvidence.progressPercentage}%</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Timestamp</p>
                                  <p className="font-semibold">{selectedEvidence.timestamp}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Activity Logs */}
        <Card>
          <CardHeader>
            <div className="space-y-4">
              <h3 className="font-semibold">Activity Logs (Live Updates)</h3>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by employee..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No activity logs found
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div key={log.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors animate-in">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{log.employee}</h4>
                          <Badge variant="outline" className="text-xs">{log.activity}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{log.description}</p>
                        <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                          <span>{log.deviceInfo}</span>
                          <span>{log.timestamp}</span>
                          {log.location && <span>📍 {log.location}</span>}
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
