"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleMap, MarkerF, InfoWindowF, useJsApiLoader } from "@react-google-maps/api";
import { Star, Navigation } from "lucide-react";
import CourtDetailsModal from "./CourtDetailsModal";

export type Court = {
  id: string;
  name: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
};

const containerStyle = {
  width: "100%",
  height: "100%"
};

type MapViewProps = {
  center: [number, number];
  userLocation: [number, number] | null;
  courts: Court[];
  onViewDetails?: (court: Court & { distance?: number | null }) => void;
};

export default function MapView({ center, userLocation, courts, onViewDetails }: MapViewProps) {
  const router = useRouter()
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

  const [selectedCourt, setSelectedCourt] = useState<Court & { distance?: number } | null>(null);
  const [mapCenter, setMapCenter] = useState({
    lat: center[0],
    lng: center[1]
  });

  if (!isLoaded) {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-gray-100 rounded-xl">
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-[#0f2e22] mx-auto mb-3 sm:mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  const handleCourtClick = (court: Court) => {
    setSelectedCourt({ ...court, distance: 0 });
    setMapCenter({ lat: court.lat, lng: court.lng });
  };

  return (
    <div className="w-full h-full min-h-[300px] relative z-10 rounded-xl overflow-hidden">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={13}
        options={{
          fullscreenControl: true,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          gestureHandling: 'greedy'
        }}
      >
        {/* User Location Marker */}
        {userLocation && (
          <MarkerF
            position={{ lat: userLocation[0], lng: userLocation[1] }}
            title="Your Location"
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#3b82f6",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2
            }}
          />
        )}

        {/* Court Markers */}
        {courts.map((court) => (
          <MarkerF
            key={court.id}
            position={{ lat: court.lat, lng: court.lng }}
            title={court.name}
            icon={{
              path: 'M12 0C7.58 0 4 3.58 4 8c0 5.25 8 16 8 16s8-10.75 8-16c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z',
              scale: 1.8,
              fillColor: '#0a56a7',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
              anchor: new google.maps.Point(12, 24)
            }}
            onClick={() => handleCourtClick(court)}
          />
        ))}

        {/* Court Info Window */}
        {selectedCourt && (
          <InfoWindowF
            position={{ lat: selectedCourt.lat, lng: selectedCourt.lng }}
            onCloseClick={() => setSelectedCourt(null)}
            options={{
              pixelOffset: new google.maps.Size(0, -40),
              maxWidth: 280
            }}
          >
            <div className="p-3 sm:p-4 bg-white rounded-lg max-w-[260px]">
              <h3 className="font-bold text-base sm:text-lg text-gray-900 line-clamp-2">{selectedCourt.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">{selectedCourt.city}</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 line-clamp-2">{selectedCourt.address}</p>
              <div className="flex gap-2 mt-3 sm:mt-4">
                <button
                  onClick={() => router.push(`/courts/${selectedCourt.id}`)}
                  className="flex-1 px-2 sm:px-3 py-2 bg-[#0a56a7] text-white font-semibold rounded-lg hover:bg-[#0a56a7]/90 active:scale-95 text-xs sm:text-sm transition-all touch-target"
                >
                  View Details
                </button>
                <button
                  onClick={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedCourt.lat},${selectedCourt.lng}`;
                    window.open(url, "_blank");
                  }}
                  className="flex-1 px-2 sm:px-3 py-2 border border-[#0a56a7] text-[#0a56a7] font-semibold rounded-lg hover:bg-[#0a56a7]/10 active:scale-95 text-xs sm:text-sm transition-all touch-target"
                >
                  Directions
                </button>
              </div>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    </div>
  );
}
