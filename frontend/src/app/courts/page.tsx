"use client"

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CourtCard from '@/components/courts/CourtCard'
import CourtFiltersSidebar from '@/components/courts/CourtFiltersSidebar'
import { SkeletonCard } from '@/components/ui/skeleton'
import { CourtFilters, CourtWithDistance } from '@/types/court'
import { Court } from '@/types/database'
import { courtService } from '@/services/courtService'
import { calculateDistance, getUserLocation } from '@/lib/geolocation'
import { Grid, List, MapPin, ChevronLeft, ChevronRight, AlertCircle, MapPinned, Database, Map as MapIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mockCourts } from '@/data/mockCourts'
import { favoriteService } from '@/services/favoriteService'
import { useAuth } from '@/contexts/AuthContext'

// Dynamically import MapView to avoid SSR issues with mapbox
const MapView = dynamic(() => import('@/components/courts/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-100 rounded-2xl flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0f2e22] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  )
})

export default function CourtsPage() {
  const [courts, setCourts] = useState<Court[]>([])
  const [courtsWithDistance, setCourtsWithDistance] = useState<CourtWithDistance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<CourtFilters>({ status: 'approved' })
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid')
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [locationLoading, setLocationLoading] = useState(true)
  const [useMockData, setUseMockData] = useState(true) // Toggle for presentation
  const [favorites, setFavorites] = useState<number[]>([])
  const { user } = useAuth()
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCourts, setTotalCourts] = useState(0)
  const courtsPerPage = 12

  // Get unique cities for filter
  const cities = Array.from(new Set(courts.map(c => c.city).filter(Boolean))) as string[]

  // Get user location on mount
  useEffect(() => {
    setLocationLoading(true)
    getUserLocation()
      .then(location => {
        setUserLocation(location)
        setLocationLoading(false)
      })
      .catch(error => {
        console.log('Location access denied:', error)
        setLocationLoading(false)
      })
  }, [])

  // Fetch favorites on mount
  useEffect(() => {
    if (user) {
      fetchFavorites()
    }
  }, [user])

  // Fetch courts when filters or page changes
  useEffect(() => {
    fetchCourts()
  }, [filters, currentPage])

  // Calculate distances when courts or user location changes
  useEffect(() => {
    if (courts.length > 0 && userLocation) {
      const courtsWithDist = courts.map(court => {
        if (court.latitude && court.longitude) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            court.latitude,
            court.longitude
          )
          return { ...court, distance }
        }
        return court
      })
      setCourtsWithDistance(courtsWithDist)
    } else {
      setCourtsWithDistance(courts)
    }
  }, [courts, userLocation])

  const fetchCourts = async () => {
    setIsLoading(true)
    try {
      if (useMockData) {
        // Use mock data for presentation
        await new Promise(resolve => setTimeout(resolve, 500)) // Simulate loading
        
        let filteredCourts = [...mockCourts]
        
        // Apply filters
        if (filters.city) {
          filteredCourts = filteredCourts.filter(c => c.city === filters.city)
        }
        if (filters.type) {
          filteredCourts = filteredCourts.filter(c => c.type === filters.type)
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          filteredCourts = filteredCourts.filter(c => 
            c.name.toLowerCase().includes(searchLower) ||
            c.description?.toLowerCase().includes(searchLower) ||
            c.address.toLowerCase().includes(searchLower)
          )
        }
        if (filters.isFree) {
          filteredCourts = filteredCourts.filter(c => c.is_free)
        }
        if (filters.minPrice !== undefined) {
          filteredCourts = filteredCourts.filter(c => 
            c.is_free || (c.price_per_hour && c.price_per_hour >= filters.minPrice!)
          )
        }
        if (filters.maxPrice !== undefined) {
          filteredCourts = filteredCourts.filter(c => 
            c.is_free || (c.price_per_hour && c.price_per_hour <= filters.maxPrice!)
          )
        }
        if (filters.minRating !== undefined) {
          filteredCourts = filteredCourts.filter(c => c.rating >= filters.minRating!)
        }
        
        const total = filteredCourts.length
        const totalPagesCalc = Math.ceil(total / courtsPerPage)
        const start = (currentPage - 1) * courtsPerPage
        const paginatedCourts = filteredCourts.slice(start, start + courtsPerPage)
        
        setCourts(paginatedCourts)
        setTotalCourts(total)
        setTotalPages(totalPagesCalc)
      } else {
        // Use real Supabase data
        const result = await courtService.getCourts({
          ...filters,
          page: currentPage,
          limit: courtsPerPage
        })
        
        setCourts(result.data)
        setTotalCourts(result.total)
        setTotalPages(result.totalPages)
      }
    } catch (error) {
      console.error('Failed to fetch courts:', error)
      // Fallback to mock data on error
      if (!useMockData) {
        setUseMockData(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const fetchFavorites = async () => {
    if (!user) return
    const favIds = await favoriteService.getFavorites(user.id)
    setFavorites(favIds)
  }

  const handleFilterChange = (newFilters: CourtFilters) => {
    setFilters({ ...newFilters, status: 'approved' })
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Nearby courts (first 3 with distance)
  const nearbyCourts = userLocation 
    ? courtsWithDistance
        .filter(c => c.distance !== undefined)
        .sort((a, b) => (a.distance || 0) - (b.distance || 0))
        .slice(0, 3)
    : []

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Find Pickleball Courts
              </h1>
              <p className="text-gray-600">
                Discover and book the best pickleball courts near you
              </p>
            </div>
            
            {/* Data Source Toggle */}
            <Button
              variant={useMockData ? "default" : "outline"}
              onClick={() => setUseMockData(!useMockData)}
              className={`flex items-center gap-2 ${useMockData ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
            >
              <Database className="w-4 h-4" />
              {useMockData ? 'Demo Mode' : 'Live Data'}
            </Button>
          </div>
        </div>

        {/* Near  initialFavorited={favorites.includes(court.id)}
                  onFavorite={() => fetchFavorites()}
                by Courts Section */}
        {!locationLoading && nearbyCourts.length > 0 && (
          <div className="mb-8 bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <MapPinned className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900">Courts Near You</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {nearbyCourts.map(court => (
                <CourtCard
                  key={court.id}
                  court={court}
                  distance={court.distance}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main Content with Filters */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <CourtFiltersSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            cities={cities}
            isOpen={isFiltersOpen}
            onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
          />

          {/* Courts Grid */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-gray-200">
              <div className="text-sm text-gray-600">
                {isLoading ? (
                  <span>Loading courts...</span>
                ) : (
                  <span>
                    Showing {courts.length > 0 ? ((currentPage - 1) * courtsPerPage + 1) : 0} - {Math.min(currentPage * courtsPerPage, totalCourts)} of {totalCourts} courts
                  </span>
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className={viewMode === 'map' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  <MapIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Map View */}
            {viewMode === 'map' && !isLoading && (
              <div className="w-full h-[600px] mb-6">
                <MapView
                  courts={courtsWithDistance}
                  userLocation={userLocation}
                  onCourtClick={(court) => window.open(`/courts/${court.id}`, '_blank')}
                />
              </div>
            )}

            {/* Loading State */}
            {isLoading ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : courts.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200">
                <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Courts Found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
                <Button
                  onClick={() => handleFilterChange({})}
                  variant="outline"
                >
                  Clear All Filters
                </Button>
              </div>
            ) : viewMode !== 'map' ? (
              /* Courts Grid/List */
              <>
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                  {courtsWithDistance.map(court => (
                    <CourtCard
                      key={court.id}
                      court={court}
                      distance={court.distance}
                      initialFavorited={favorites.includes(court.id)}
                      onFavorite={() => fetchFavorites()}
                    />
                  ))}
                </div>

                {/* Pagination (only for grid/list views) */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>

                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum: number
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className={currentPage === pageNum ? 'bg-blue-600 hover:bg-blue-700' : ''}
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
