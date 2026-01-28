import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Court } from '@/types/database'

/**
 * Hook to fetch and subscribe to court updates in real-time
 */
export function useCourts(filters?: {
  status?: string
  city?: string
  type?: string
}) {
  const [courts, setCourts] = useState<Court[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchCourts()

    // Subscribe to real-time changes
    const channel = supabase
      .channel('courts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'courts',
        },
        (payload) => {
          console.log('Court changed:', payload)
          fetchCourts() // Re-fetch on any change
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [filters?.status, filters?.city, filters?.type])

  const fetchCourts = async () => {
    try {
      setLoading(true)
      let query = supabase.from('courts').select('*, owner:users!owner_id(*)')

      if (filters?.status) query = query.eq('status', filters.status)
      if (filters?.city) query = query.eq('city', filters.city)
      if (filters?.type) query = query.eq('type', filters.type)

      const { data, error } = await query.order('created_at', {
        ascending: false,
      })

      if (error) throw error
      setCourts(data || [])
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { courts, loading, error, refetch: fetchCourts }
}

/**
 * Hook to get a single court by ID
 */
export function useCourt(id: number) {
  const [court, setCourt] = useState<Court | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!id) return

    fetchCourt()
  }, [id])

  const fetchCourt = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('courts')
        .select('*, owner:users!owner_id(*)')
        .eq('id', id)
        .single()

      if (error) throw error
      setCourt(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { court, loading, error, refetch: fetchCourt }
}
