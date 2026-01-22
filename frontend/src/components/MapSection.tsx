"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, Navigation } from "lucide-react";
import type { Court } from "./MapView";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <div className="h-[420px] w-full bg-blue-50 animate-pulse" />,
});

const courts: Court[] = [
  {
    id: "makati",
    name: "Makati Pickleball Hub",
    city: "Makati",
    address: "Circuit Makati, Makati City",
    lat: 14.5625,
    lng: 121.0107,
  },
  {
    id: "qc",
    name: "Quezon City Sports Club",
    city: "Quezon City",
    address: "E. Rodriguez Sr. Ave, QC",
    lat: 14.6236,
    lng: 121.0395,
  },
  {
    id: "bgc",
    name: "BGC Active Courts",
    city: "Taguig",
    address: "Bonifacio Global City, Taguig",
    lat: 14.5547,
    lng: 121.0509,
  },
  {
    id: "pasig",
    name: "Pasig Riverside Courts",
    city: "Pasig",
    address: "Ortigas Center, Pasig",
    lat: 14.5832,
    lng: 121.0603,
  },
];

export default function MapSection() {
  const [center, setCenter] = useState<[number, number]>([14.5995, 120.9842]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);

  const handleLocate = () => {
    if (!navigator.geolocation) return;

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCenter: [number, number] = [position.coords.latitude, position.coords.longitude];
        setCenter(nextCenter);
        setUserLocation(nextCenter);
        setLocating(false);
      },
      () => {
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <section className="py-16 bg-white/70" id="map">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <p className="text-sm font-semibold text-[#0a56a7] uppercase tracking-wider">Map View</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Courts Near You</h2>
            <p className="text-gray-600 mt-2 max-w-xl">
              Discover nearby pickleball courts, tap markers for details, and use “Near me” to jump to
              your location.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLocate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0a56a7] text-white font-semibold shadow-lg hover:bg-[#0a56a7]/90 transition"
          >
            <Navigation className="w-4 h-4" />
            {locating ? "Locating..." : "Near me"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
          <div className="rounded-3xl overflow-hidden shadow-xl border border-blue-100">
            <MapView center={center} userLocation={userLocation} courts={courts} />
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Featured Courts</h3>
            <div className="space-y-3">
              {courts.map((court) => (
                <button
                  key={court.id}
                  type="button"
                  onClick={() => setCenter([court.lat, court.lng])}
                  className="w-full text-left p-4 rounded-2xl border border-gray-100 hover:border-[#0a56a7]/40 hover:bg-blue-50/50 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#0a56a7]">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{court.name}</p>
                      <p className="text-sm text-gray-600">{court.address}</p>
                      <p className="text-xs text-[#0a56a7] mt-1">{court.city}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
