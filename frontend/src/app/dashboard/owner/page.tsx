"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { courtService } from '@/services/courtService'
import { bookingService, Booking } from '@/services/bookingService'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Building2, 
  Calendar, 
  DollarSign, 
  Users, 
  Clock, 
  MapPin,
  Plus,
  Settings,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Loader2
} from 'lucide-react'

interface OwnerCourt {
  id: number
  name: string
  address: string
  city: string
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  price_per_hour: number
  type?: string
  court_type?: string
  created_at: string
}

interface BookingWithCourt extends Booking {
  court?: {
    name: string
    address: string
  }
}

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Approval' },
  approved: { color: 'bg-green-100 text-green-800', label: 'Active' },
  rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
  suspended: { color: 'bg-gray-100 text-gray-800', label: 'Suspended' }
}

const bookingStatusConfig = {
  pending: { color: 'bg-yellow-50 text-yellow-700', icon: Clock, label: 'Pending' },
  confirmed: { color: 'bg-blue-50 text-blue-700', icon: CheckCircle, label: 'Confirmed' },
  completed: { color: 'bg-green-50 text-green-700', icon: CheckCircle, label: 'Completed' },
  cancelled: { color: 'bg-red-50 text-red-700', icon: XCircle, label: 'Cancelled' },
  'no-show': { color: 'bg-gray-50 text-gray-700', icon: AlertCircle, label: 'No Show' }
}

export default function OwnerDashboardPage() {
  const [courts, setCourts] = useState<OwnerCourt[]>([])
  const [allBookings, setAllBookings] = useState<BookingWithCourt[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCourts: 0,
    activeCourts: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0
  })
  const [selectedCourt, setSelectedCourt] = useState<number | null>(null)
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchOwnerData()
    }
  }, [user])

  const fetchOwnerData = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      // Fetch courts owned by this user
      const courtsResult = await courtService.getOwnerCourts(user.id)
      const ownerCourts = (courtsResult.data || []) as OwnerCourt[]
      setCourts(ownerCourts)

      // Fetch bookings for all owner's courts
      const bookingsPromises = ownerCourts.map(court => 
        bookingService.getCourtBookings(court.id)
      )
      const bookingsResults = await Promise.all(bookingsPromises)
      
      // Flatten and add court info to bookings
      const allBookingsData: BookingWithCourt[] = []
      bookingsResults.forEach((bookings, index) => {
        bookings.forEach(booking => {
          allBookingsData.push({
            ...booking,
            court: {
              name: ownerCourts[index].name,
              address: ownerCourts[index].address
            }
          })
        })
      })
      
      // Sort by booking date
      allBookingsData.sort((a, b) => 
        new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime()
      )
      setAllBookings(allBookingsData)

      // Calculate stats
      const activeCourts = ownerCourts.filter(c => c.status === 'approved').length
      const pendingBookings = allBookingsData.filter(b => b.status === 'pending').length
      const totalRevenue = allBookingsData
        .filter(b => b.payment_status === 'paid')
        .reduce((sum, b) => sum + b.total_price, 0)

      setStats({
        totalCourts: ownerCourts.length,
        activeCourts,
        totalBookings: allBookingsData.length,
        pendingBookings,
        totalRevenue
      })
    } catch (error) {
      console.error('Failed to fetch owner data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmBooking = async (bookingId: number) => {
    const result = await bookingService.updateBookingStatus(bookingId, 'confirmed')
    if (result.success) {
      setAllBookings(prev =>
        prev.map(b => b.id === bookingId ? { ...b, status: 'confirmed' } : b)
      )
      setStats(prev => ({ ...prev, pendingBookings: prev.pendingBookings - 1 }))
    }
  }

  const handleRejectBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to reject this booking?')) return
    
    const result = await bookingService.updateBookingStatus(bookingId, 'cancelled')
    if (result.success) {
      setAllBookings(prev =>
        prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b)
      )
      setStats(prev => ({ ...prev, pendingBookings: prev.pendingBookings - 1 }))
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount)
  }

  const getFilteredBookings = () => {
    if (selectedCourt === null) return allBookings
    return allBookings.filter(b => b.court_id === selectedCourt)
  }

  if (authLoading || isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 pt-16 lg:pt-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 pt-16 lg:pt-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Court Owner Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your courts and bookings
              </p>
            </div>
            <Button 
              onClick={() => router.push('/courts/create')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Court
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalCourts}</p>
                  <p className="text-sm text-gray-500">Total Courts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activeCourts}</p>
                  <p className="text-sm text-gray-500">Active Courts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalBookings}</p>
                  <p className="text-sm text-gray-500">Total Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pendingBookings}</p>
                  <p className="text-sm text-gray-500">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-2 lg:col-span-1">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
                  <p className="text-sm text-gray-500">Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="bookings" className="data-[state=active]:bg-blue-50">
              <Calendar className="w-4 h-4 mr-2" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="courts" className="data-[state=active]:bg-blue-50">
              <Building2 className="w-4 h-4 mr-2" />
              My Courts
            </TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Court Bookings</CardTitle>
                    <CardDescription>
                      Manage and track all bookings for your courts
                    </CardDescription>
                  </div>
                  
                  {/* Court Filter */}
                  <select
                    value={selectedCourt || ''}
                    onChange={(e) => setSelectedCourt(e.target.value ? Number(e.target.value) : null)}
                    className="px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="">All Courts</option>
                    {courts.map(court => (
                      <option key={court.id} value={court.id}>{court.name}</option>
                    ))}
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                {getFilteredBookings().length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No bookings yet</h3>
                    <p className="text-gray-500">Bookings will appear here when customers book your courts</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getFilteredBookings().map(booking => {
                      const statusInfo = bookingStatusConfig[booking.status]
                      const StatusIcon = statusInfo.icon

                      return (
                        <div 
                          key={booking.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${statusInfo.color}`}>
                                  <StatusIcon className="w-4 h-4" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">
                                    {booking.court?.name}
                                  </h4>
                                  <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {booking.court?.address}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {formatDate(booking.booking_date)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {booking.start_time} - {booking.end_time}
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-4 h-4" />
                                  {formatCurrency(booking.total_price)}
                                </span>
                              </div>

                              {booking.customer_notes && (
                                <p className="mt-2 text-sm text-gray-500 italic">
                                  Note: {booking.customer_notes}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <Badge className={statusInfo.color}>
                                {statusInfo.label}
                              </Badge>

                              {booking.status === 'pending' && (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleConfirmBooking(booking.id)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Confirm
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleRejectBooking(booking.id)}
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courts Tab */}
          <TabsContent value="courts">
            <Card>
              <CardHeader>
                <CardTitle>My Courts</CardTitle>
                <CardDescription>
                  View and manage your registered courts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {courts.length === 0 ? (
                  <div className="text-center py-12">
                    <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No courts registered</h3>
                    <p className="text-gray-500 mb-4">Start by adding your first court</p>
                    <Button onClick={() => router.push('/courts/create')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Court
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {courts.map(court => {
                      const courtStatus = statusConfig[court.status]
                      const courtBookings = allBookings.filter(b => b.court_id === court.id)
                      const upcomingCount = courtBookings.filter(
                        b => b.booking_date >= new Date().toISOString().split('T')[0] && 
                             b.status !== 'cancelled'
                      ).length

                      return (
                        <div
                          key={court.id}
                          className="border rounded-xl p-4 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-gray-900">{court.name}</h3>
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {court.city}
                              </p>
                            </div>
                            <Badge className={courtStatus.color}>
                              {courtStatus.label}
                            </Badge>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Type</span>
                              <span className="font-medium">{court.type || court.court_type || 'N/A'}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Price/Hour</span>
                              <span className="font-medium">{formatCurrency(court.price_per_hour)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Upcoming Bookings</span>
                              <span className="font-medium">{upcomingCount}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => router.push(`/courts/${court.id}`)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => router.push(`/courts/${court.id}/edit`)}
                            >
                              <Settings className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
