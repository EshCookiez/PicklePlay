"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

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
};

function RecenterMap({ position }: { position: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, map.getZoom(), { animate: true });
  }, [map, position]);

  return null;
}

export default function MapView({ center, userLocation, courts }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x.src,
      iconUrl: markerIcon.src,
      shadowUrl: markerShadow.src,
    });
  }, [isClient]);

  const courtMarkers = useMemo(
    () =>
      courts.map((court) => (
        <Marker key={court.id} position={[court.lat, court.lng]}>
          <Popup>
            <div className="space-y-1">
              <p className="font-semibold text-[#0a56a7]">{court.name}</p>
              <p className="text-sm text-gray-600">{court.address}</p>
            </div>
          </Popup>
        </Marker>
      )),
    [courts]
  );

  if (!isClient) {
    return (
      <div 
        ref={containerRef} 
        className="h-[600px] w-full relative bg-gray-200 rounded-lg flex items-center justify-center text-gray-500"
      >
        Loading map...
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-[600px] w-full relative z-10">
      <MapContainer 
        center={center} 
        zoom={12} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%" }}
        className="leaflet-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap position={center} />
        {courtMarkers}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <div className="space-y-1">
                <p className="font-semibold text-[#0a56a7]">You are here</p>
                <p className="text-sm text-gray-600">Showing nearby courts</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
