"use client"

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CourtCard from '@/components/courts/CourtCard'
import { SkeletonCard } from '@/components/ui/skeleton'
import { Court } from '@/types/database'
import { favoriteService } from '@/services/favoriteService'
import { useAuth } from '@/contexts/AuthContext'
import { Heart, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function FavoritesPage() {
  const [courts, setCourts] = useState<Court[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      fetchFavorites()
    } else {
      setIsLoading(false)
    }
  }, [user])

  const fetchFavorites = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const favCourts = await favoriteService.getFavoriteCourts(user.id)
      setCourts(favCourts as unknown as Court[])
    } catch (error) {
      console.error('Failed to fetch favorites:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFavoriteRemoved = (courtId: number) => {
    setCourts(prev => prev.filter(c => c.id !== courtId))
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Login Required</h2>
            <p className="text-gray-500 mb-6">Please login to view your favorite courts</p>
            <Button onClick={() => router.push('/auth')}>
              Login
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 fill-red-500 text-red-500" />
            <h1 className="text-4xl font-bold text-slate-900">
              My Favorite Courts
            </h1>
          </div>
          <p className="text-gray-600">
            {courts.length} {courts.length === 1 ? 'court' : 'courts'} saved
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : courts.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200">
            <Heart className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Favorites Yet</h3>
            <p className="text-gray-500 mb-6">Start adding courts to your favorites to see them here</p>
            <Button onClick={() => router.push('/courts')}>
              Browse Courts
            </Button>
          </div>
        ) : (
          /* Courts Grid */
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {courts.map(court => (
              <CourtCard
                key={court.id}
                court={court}
                initialFavorited={true}
                onFavorite={handleFavoriteRemoved}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
