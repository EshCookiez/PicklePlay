"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GoogleMap, MarkerF, InfoWindowF, useJsApiLoader } from '@react-google-maps/api'
import { Navigation, X } from 'lucide-react'
import { CourtWithDistance } from '@/types/court'
import { Button } from '@/components/ui/button'

interface MapViewProps {
  courts: CourtWithDistance[]
  userLocation: { latitude: number; longitude: number } | null
  onCourtClick?: (court: CourtWithDistance) => void
}

const containerStyle = {
  width: '100%',
  height: '100%'
}

const defaultCenter = {
  lat: 14.5995,
  lng: 120.9842
}

export default function MapView({ courts, userLocation, onCourtClick }: MapViewProps) {
  const router = useRouter()
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  })

  const [selectedCourt, setSelectedCourt] = useState<CourtWithDistance | null>(null)
  const [mapCenter, setMapCenter] = useState(
    userLocation ? { lat: userLocation.latitude, lng: userLocation.longitude } : defaultCenter
  )
  const [mapZoom, setMapZoom] = useState(userLocation ? 13 : 6)

  useEffect(() => {
    if (userLocation) {
      setMapCenter({ lat: userLocation.latitude, lng: userLocation.longitude })
      setMapZoom(13)
    }
  }, [userLocation])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-2xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0f2e22] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={mapZoom}
        options={{
          fullscreenControl: true,
          zoomControl: true,
          mapTypeControl: true,
          streetViewControl: false,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        }}
      >
        {/* User Location Marker */}
        {userLocation && (
          <MarkerF
            position={{ lat: userLocation.latitude, lng: userLocation.longitude }}
            title="Your Location"
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#3b82f6',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2
            }}
          />
        )}

        {/* Court Markers */}
        {courts.map((court) => {
          if (!court.latitude || !court.longitude) return null

          return (
            <MarkerF
              key={court.id}
              position={{ lat: court.latitude, lng: court.longitude }}
              title={court.name}
              icon={{
                path: 'M12 0C7.58 0 4 3.58 4 8c0 5.25 8 16 8 16s8-10.75 8-16c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z',
                scale: 1.8,
                fillColor: '#0f2e22',
                fillOpacity: 1,
                strokeColor: '#a3e635',
                strokeWeight: 2,
                anchor: new google.maps.Point(12, 24)
              }}
              onClick={() => {
                setSelectedCourt(court)
                if (onCourtClick) {
                  onCourtClick(court)
                }
              }}
            />
          )
        })}

        {/* Court Info Window */}
        {selectedCourt && selectedCourt.latitude && selectedCourt.longitude && (
          <InfoWindowF
            position={{ lat: selectedCourt.latitude, lng: selectedCourt.longitude }}
            onCloseClick={() => setSelectedCourt(null)}
            options={{
              pixelOffset: new google.maps.Size(0, -40),
              maxWidth: 300
            }}
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 pr-2">
                  <h3 className="font-bold text-slate-900 text-base leading-tight">
                    {selectedCourt.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {selectedCourt.city}
                  </p>
                </div>
              </div>

              {selectedCourt.distance && (
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                  <Navigation className="w-4 h-4" />
                  <span>{selectedCourt.distance.toFixed(1)} km away</span>
                </div>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Type:</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {selectedCourt.type || 'Indoor'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Price:</span>
                  <span className="text-sm font-semibold text-[#0f2e22]">
                    {selectedCourt.price_per_hour ? formatCurrency(selectedCourt.price_per_hour) : 'N/A'}/hr
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => router.push(`/courts/${selectedCourt.id}`)}
                  className="flex-1 bg-[#0f2e22] hover:bg-[#1a4332] text-white text-xs"
                  size="sm"
                >
                  View Details
                </Button>
                <Button
                  onClick={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedCourt.latitude},${selectedCourt.longitude}`
                    window.open(url, '_blank')
                  }}
                  variant="outline"
                  size="sm"
                  className="border-[#0f2e22] text-[#0f2e22] hover:bg-[#0f2e22] hover:text-white text-xs"
                >
                  <Navigation className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    </div>
  )
}
