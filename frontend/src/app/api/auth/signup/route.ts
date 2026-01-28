import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/auth/signup - Register a new user
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { email, password, first_name, last_name, phone_number } = await request.json()
    
    // Validate input
    if (!email || !password || !first_name || !last_name) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }
    
    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name,
          phone_number,
        },
      },
    })
    
    if (authError) {
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 400 }
      )
    }
    
    // The user record in public.users is created automatically by the trigger
    // But let's verify it was created
    if (authData.user) {
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single()
      
      return NextResponse.json({
        success: true,
        data: {
          user: userData,
          session: authData.session,
        },
      }, { status: 201 })
    }
    
    return NextResponse.json({
      success: true,
      data: authData,
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
