import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase-server'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServer()

    // Check if admin already exists
    const { data: existingAdmin } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'admin@zawrindustries.com')
      .maybeSingle()

    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Admin account already exists' },
        { status: 200 }
      )
    }

    // Hash the password: Zawr@2009$$
    const passwordHash = await bcrypt.hash('Zawr@2009$$', 10)

    // Create admin account
    const { data: admin, error } = await supabase
      .from('users')
      .insert({
        email: 'admin@zawrindustries.com',
        password_hash: passwordHash,
        full_name: 'System Administrator',
        role: 'admin',
        status: 'active',
        department: 'Management',
        base_salary: 0.00,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating admin:', error)
      return NextResponse.json(
        { error: 'Failed to create admin account' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Admin account created successfully',
      admin: {
        email: admin.email,
        role: admin.role,
      },
    })
  } catch (error) {
    console.error('Seed admin error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
