"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import paddleIcon from "../images/PinMarker.png";
import { MapPin, Star } from "lucide-react";
import "../styles/map.css";
import type { Marker as LeafletMarker } from "leaflet";
import CourtDetailsModal from "./CourtDetailsModal";

export type Court = {
  id: string;
  name: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
};

type MapViewProps = {
  center: [number, number];
  userLocation: [number, number] | null;
  courts: Court[];
  onViewDetails?: (court: Court & { distance?: number | null }) => void;
};

function RecenterMap({ position }: { position: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, map.getZoom(), { animate: true });
  }, [map, position]);

  return null;
}

export default function MapView({ center, userLocation, courts, onViewDetails }: MapViewProps) {
  // Create custom paddle icon for pickleball courts
  const customPaddleIcon = useMemo(() => {
    return L.icon({
      iconUrl: paddleIcon.src,
      iconRetinaUrl: paddleIcon.src,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
      shadowUrl: markerShadow.src,
      shadowSize: [41, 41],
      shadowAnchor: [12, 41],
      className: 'custom-paddle-marker'
    });
  }, []);

  // Create custom user location icon
  const userLocationIcon = useMemo(() => {
    return L.divIcon({
      html: `
        <div class="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg">
          <div class="w-3 h-3 bg-white rounded-full animate-pulse"></div>
        </div>
      `,
      className: 'custom-user-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });
  }, []);

  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x.src,
      iconUrl: markerIcon.src,
      shadowUrl: markerShadow.src,
    });
  }, []);

  const courtMarkers = useMemo(
    () =>
      courts.map((court) => (
        <Marker
          key={court.id}
          position={[court.lat, court.lng]}
          icon={customPaddleIcon}
        >
          <Popup>
            <div className="bg-white rounded-xl shadow-2xl border border-blue-100 p-6 min-w-[320px] max-w-[400px]">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0a56a7] to-[#0a56a7]/80 flex items-center justify-center text-white shadow-lg">
                    <img src={paddleIcon.src} alt="Pickleball" className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{court.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{court.city}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>4.8</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <button 
                    onClick={() => window.close()}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Court Info */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#0a56a7]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{court.address}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => onViewDetails && onViewDetails(court)}
                    className="flex-1 px-4 py-3 bg-[#0a56a7] text-white font-semibold rounded-xl hover:bg-[#0a56a7]/90 transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-2H8l-3-3 3 3h2v2h8l3-3-3-3H8v2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 8H5" />
                      </svg>
                      <span>View Details</span>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      // Get Directions functionality
                      const destination = `${court.lat},${court.lng}`;
                      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
                      window.open(googleMapsUrl, '_blank');
                    }}
                    className="flex-1 px-4 py-3 border-2 border-[#0a56a7] text-[#0a56a7] font-semibold rounded-xl hover:bg-[#0a56a7]/10 transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-9 9-9H3l3 3 3 3h2v2h8l3-3-3-3H8v2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3h6" />
                      </svg>
                      <span>Get Directions</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      )),
    [courts]
  );

  return (
    <MapContainer center={center} zoom={12} scrollWheelZoom={false} className="h-[420px] w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RecenterMap position={center} />
      {courtMarkers}
      {userLocation && (
        <Marker position={userLocation} icon={userLocationIcon}>
          <Popup>
            <div className="space-y-2 p-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <p className="font-bold text-blue-600">Your Location</p>
              </div>
              <p className="text-sm text-gray-600">Showing nearby pickleball courts</p>
              <div className="text-xs text-gray-500">
                {courts.length} courts found nearby
              </div>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
