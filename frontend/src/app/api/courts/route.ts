import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Example API Route using Supabase
 * GET /api/courts - Fetch all courts
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const city = searchParams.get('city')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // Build query
    let query = supabase
      .from('courts')
      .select('*, owner:users!owner_id(*)', { count: 'exact' })
    
    // Apply filters
    if (status) query = query.eq('status', status)
    if (city) query = query.eq('city', city)
    
    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to).order('created_at', { ascending: false })
    
    // Execute query
    const { data, error, count } = await query
    
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/courts - Create a new court
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Get request body
    const body = await request.json()
    
    // Get user from public.users table
    const { data: userData } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', user.id)
      .single()
    
    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Insert court
    const { data, error } = await supabase
      .from('courts')
      .insert({
        ...body,
        owner_id: userData.id,
        status: 'pending', // All new courts start as pending
      })
      .select()
      .single()
    
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data,
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
