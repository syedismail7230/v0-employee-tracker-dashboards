import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function seedData() {
  console.log('[v0] Starting real-time data seeding...')

  try {
    // Seed tasks
    const { error: tasksError } = await supabase.from('tasks').insert([
      { title: 'Complete API Integration', assigned_to: 'John Doe', status: 'in_progress', priority: 'high', due_date: '2024-01-22', estimated_hours: 8 },
      { title: 'Design Dashboard UI', assigned_to: 'Jane Smith', status: 'pending', priority: 'medium', due_date: '2024-01-22', estimated_hours: 12 },
      { title: 'Database Optimization', assigned_to: 'Bob Johnson', status: 'delayed', priority: 'critical', due_date: '2024-01-18', estimated_hours: 6 },
    ])
    if (tasksError) console.error('[v0] Tasks error:', tasksError)
    else console.log('[v0] Tasks seeded successfully')

    // Seed attendance
    const { error: attendanceError } = await supabase.from('attendance').insert([
      { employee_id: '1', date: new Date().toISOString().split('T')[0], status: 'present', check_in_time: '09:25', check_out_time: '17:30', marking_time: '09:30', deduction: 0 },
      { employee_id: '2', date: new Date().toISOString().split('T')[0], status: 'late', check_in_time: '10:10', check_out_time: '18:00', marking_time: '10:15', deduction: 500 },
      { employee_id: '3', date: new Date().toISOString().split('T')[0], status: 'absent', deduction: 1500 },
    ])
    if (attendanceError) console.error('[v0] Attendance error:', attendanceError)
    else console.log('[v0] Attendance seeded successfully')

    // Seed salary deductions
    const { error: deductionsError } = await supabase.from('salary_deductions').insert([
      { employee_id: '1', type: 'Missed Attendance', amount: 1500, date: new Date().toISOString().split('T')[0], reason: 'Absent on previous day' },
      { employee_id: '2', type: 'Task Delay', amount: 500, date: new Date().toISOString().split('T')[0], reason: 'Task delayed by 2 days' },
    ])
    if (deductionsError) console.error('[v0] Deductions error:', deductionsError)
    else console.log('[v0] Salary deductions seeded successfully')

    // Seed leave requests
    const { error: leavesError } = await supabase.from('leave_requests').insert([
      { employee_id: '1', type: 'full_day', start_date: '2024-01-25', reason: 'Personal work', status: 'pending', requested_date: new Date().toISOString().split('T')[0] },
      { employee_id: '2', type: 'half_day', start_date: '2024-01-20', reason: 'Doctor appointment', status: 'approved', requested_date: '2024-01-16' },
    ])
    if (leavesError) console.error('[v0] Leaves error:', leavesError)
    else console.log('[v0] Leave requests seeded successfully')

    console.log('[v0] Data seeding completed successfully!')
  } catch (error) {
    console.error('[v0] Seeding error:', error)
  }
}

seedData()
