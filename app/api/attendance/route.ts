import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase-server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('user_id')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await getSupabaseServer()
    const { data: records, error } = await supabase
      .from('attendance_records')
      .select('*')
      .order('marked_date', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ records })
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('user_id')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { status, location, checkInTime, checkOutTime } = await request.json()
    const supabase = await getSupabaseServer()

    const { data: record, error } = await supabase
      .from('attendance_records')
      .insert({
        employee_id: userId,
        marked_date: new Date().toISOString().split('T')[0],
        marked_time: new Date().toISOString(),
        status,
        location,
        check_in_time: checkInTime,
        check_out_time: checkOutTime,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ record }, { status: 201 })
  } catch (error) {
    console.error('Error creating attendance record:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
