"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Navigation, Filter, Search, MapPin, Star, Clock } from "lucide-react";
import philippinesPickleballCourts from "../data/philippinesPickleballCourts";
import type { Court } from "./MapView";
import CourtDetailsModal from "./CourtDetailsModal";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] w-full bg-gradient-to-br from-blue-50 to-blue-100 animate-pulse rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#0a56a7] rounded-full mx-auto mb-4 animate-pulse"></div>
        <p className="text-[#0a56a7] font-semibold">Loading Philippines Pickleball Courts...</p>
      </div>
    </div>
  ),
});

// Transform comprehensive court data to match Court interface
const courts: (Court & { distance?: number | null })[] = philippinesPickleballCourts.map(court => ({
  id: court.id,
  name: court.name,
  city: court.city,
  address: court.address,
  lat: court.lat,
  lng: court.lng
}));

export default function MapViewPage() {
  const [center, setCenter] = useState<[number, number]>([14.5995, 120.9842]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [showNearbyOnly, setShowNearbyOnly] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState<Court & { distance?: number | null } | null>(null);

  // Calculate distance between two points in kilometers
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Add distance to courts
  const courtsWithDistance = courts.map(court => ({
    ...court,
    distance: userLocation ? calculateDistance(userLocation[0], userLocation[1], court.lat, court.lng) : null
  }));

  // Filter courts based on search, city, and nearby filter
  const filteredCourts = courtsWithDistance.filter(court => {
    const matchesSearch = court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         court.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === "all" || court.city === selectedCity;
    const matchesNearby = !showNearbyOnly || !userLocation || (court.distance !== null && court.distance <= 50); // Within 50km
    return matchesSearch && matchesCity && matchesNearby;
  });

  // Sort by distance when nearby filter is active
  const sortedCourts = showNearbyOnly && userLocation 
    ? filteredCourts.sort((a, b) => (a.distance || 0) - (b.distance || 0))
    : filteredCourts;

  const handleLocate = () => {
    if (!navigator.geolocation) return;

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCenter: [number, number] = [position.coords.latitude, position.coords.longitude];
        setCenter(nextCenter);
        setUserLocation(nextCenter);
        setShowNearbyOnly(true); // Auto-enable nearby filter when locating
        setLocating(false);
      },
      () => {
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleViewDetails = (court: Court & { distance?: number | null }) => {
    setSelectedCourt(court);
  };

  const handleGetDirections = (court: Court & { distance?: number | null }) => {
    // Open Google Maps with directions to the court
    const destination = `${court.lat},${court.lng}`;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    
    // If user location is available, use it as starting point
    if (userLocation) {
      const origin = `${userLocation[0]},${userLocation[1]}`;
      window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`, '_blank');
    } else {
      window.open(googleMapsUrl, '_blank');
    }
  };

  const cities = Array.from(new Set(courts.map(court => court.city)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#0a56a7]">Map View</h1>
              <p className="text-gray-600 mt-1">Discover nearby pickleball courts across the Philippines</p>
            </div>
            <div className="flex gap-3">
              {showNearbyOnly && (
                <button
                  type="button"
                  onClick={() => setShowNearbyOnly(false)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all duration-200"
                >
                  <Filter className="w-4 h-4" />
                  Show All Courts
                </button>
              )}
              <button
                type="button"
                onClick={handleLocate}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0a56a7] text-white font-semibold shadow-lg hover:bg-[#0a56a7]/90 transition-all duration-200 hover:scale-105"
              >
                <Navigation className="w-5 h-5" />
                {locating ? "Locating..." : "Near me"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courts or addresses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0a56a7]/50 focus:border-[#0a56a7]"
              />
            </div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0a56a7]/50 focus:border-[#0a56a7]"
            >
              <option value="all">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowNearbyOnly(!showNearbyOnly)}
              disabled={!userLocation}
              className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                showNearbyOnly 
                  ? 'bg-[#0a56a7] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } ${!userLocation ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
            >
              <Filter className="w-4 h-4 inline mr-2" />
              Nearby Only
            </button>
            <div className="flex items-center gap-2 px-4 py-3 bg-[#0a56a7]/10 rounded-xl">
              <MapPin className="w-5 h-5 text-[#0a56a7]" />
              <span className="text-[#0a56a7] font-semibold">{sortedCourts.length} Courts Found</span>
            </div>
          </div>
          {showNearbyOnly && userLocation && (
            <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Nearby courts within 50km:</strong> Showing {sortedCourts.length} courts closest to your location
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Map and Courts List */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
          {/* Map */}
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-blue-100">
            <MapView center={center} userLocation={userLocation} courts={sortedCourts} onViewDetails={handleViewDetails} />
          </div>

          {/* Courts List */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {showNearbyOnly ? 'Nearby Courts' : 'Featured Courts'}
              </h2>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {sortedCourts.map((court: Court & { distance?: number | null }) => (
                  <div
                    key={court.id}
                    className="group cursor-pointer"
                    onClick={() => setCenter([court.lat, court.lng])}
                  >
                    <div className="p-4 rounded-xl border border-gray-200 hover:border-[#0a56a7]/40 hover:bg-blue-50/50 transition-all duration-200">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0a56a7] to-[#0a56a7]/80 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                          <img src="/images/PinMarker.png" alt="Pickleball" className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h3 className="font-bold text-gray-900 group-hover:text-[#0a56a7] transition-colors">
                              {court.name}
                            </h3>
                            {court.distance !== null && court.distance !== undefined && (
                              <span className="text-xs text-[#0a56a7] font-semibold bg-[#0a56a7]/10 px-2 py-1 rounded-full">
                                {court.distance.toFixed(1)} km
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{court.address}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-[#0a56a7] font-semibold bg-[#0a56a7]/10 px-2 py-1 rounded-full">
                              {court.city}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>4.8</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>Open now</span>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3 flex-wrap">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(court);
                              }}
                              className="px-3 py-1 bg-[#0a56a7] text-white text-xs rounded-full hover:bg-[#0a56a7]/90 transition transform hover:scale-105 active:scale-95"
                            >
                              View Details
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleGetDirections(court);
                              }}
                              className="px-3 py-1 border border-[#0a56a7] text-[#0a56a7] text-xs rounded-full hover:bg-[#0a56a7]/10 transition transform hover:scale-105 active:scale-95"
                            >
                              Get Directions
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Legend */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Map Legend</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0a56a7] to-[#0a56a7]/80 flex items-center justify-center">
                    <img src="/images/PinMarker.png" alt="Pickleball" className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-gray-700">Pickleball Court</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">Your Location</span>
                </div>
                {showNearbyOnly && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-xs text-blue-800">
                      <strong>Nearby Filter Active:</strong> Showing courts within 50km of your location
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Court Details Modal */}
      <CourtDetailsModal
        isOpen={selectedCourt !== null}
        onClose={() => setSelectedCourt(null)}
        court={selectedCourt!}
        userLocation={userLocation}
      />
    </div>
  );
}
