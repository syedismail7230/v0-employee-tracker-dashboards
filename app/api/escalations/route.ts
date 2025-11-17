import { NextRequest, NextResponse } from 'next/server'

interface EscalationRequest {
  taskId: string
  employeeId: string
  reason: string
  level: number
}

export async function POST(request: NextRequest) {
  try {
    const body: EscalationRequest = await request.json()
    
    // In production, this would write to Supabase
    const escalation = {
      id: Date.now().toString(),
      task_id: body.taskId,
      employee_id: body.employeeId,
      escalation_reason: body.reason,
      escalation_level: body.level,
      status: 'pending',
      created_at: new Date().toISOString(),
    }

    console.log('[v0] Escalation created:', escalation)
    
    return NextResponse.json(escalation, { status: 201 })
  } catch (error) {
    console.error('Escalation error:', error)
    return NextResponse.json({ error: 'Failed to create escalation' }, { status: 500 })
  }
}

export async function GET() {
  // Fetch escalations from database
  const mockEscalations = [
    { id: '1', taskId: 'task-1', employee: 'John Doe', task: 'API Integration', reason: 'Blocked by dependencies', level: 1, status: 'pending' },
    { id: '2', taskId: 'task-3', employee: 'Bob Johnson', task: 'Database Optimization', reason: 'Critical blockers', level: 2, status: 'in_progress' },
  ]
  
  return NextResponse.json(mockEscalations)
}
