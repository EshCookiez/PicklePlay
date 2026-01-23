"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Navigation, Filter, Search, MapPin, Star, Clock, Globe, ZoomIn, ZoomOut } from "lucide-react";
import type { Court } from "./MapView";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full bg-gradient-to-br from-blue-50 to-blue-100 animate-pulse rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#0a56a7] rounded-full mx-auto mb-4 animate-pulse"></div>
        <p className="text-[#0a56a7] font-semibold">Loading Philippines Map...</p>
      </div>
    </div>
  ),
});

const courts: Court[] = [
  // Metro Manila Courts
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
  {
    id: "mandaluyong",
    name: "Mandaluyong Sports Complex",
    city: "Mandaluyong",
    address: "Shaw Boulevard, Mandaluyong",
    lat: 14.5794,
    lng: 121.0359,
  },
  {
    id: "sanjuan",
    name: "San Juan Pickleball Center",
    city: "San Juan",
    address: "Pinaglabanan Street, San Juan",
    lat: 14.6019,
    lng: 121.0375,
  },
  {
    id: "manila",
    name: "Manila Bay Courts",
    city: "Manila",
    address: "Roxas Boulevard, Manila",
    lat: 14.5587,
    lng: 120.9834,
  },
  {
    id: "pasay",
    name: "Pasay City Sports Club",
    city: "Pasay",
    address: "EDSA Extension, Pasay",
    lat: 14.5378,
    lng: 121.0015,
  },

  // Luzon Courts
  {
    id: "baguio",
    name: "Baguio Mountain Courts",
    city: "Baguio",
    address: "Session Road, Baguio City",
    lat: 16.4023,
    lng: 120.5960,
  },
  {
    id: "pampanga",
    name: "Pampanga Pickleball Arena",
    city: "Angeles",
    address: "Clark Freeport Zone, Pampanga",
    lat: 15.1475,
    lng: 120.5330,
  },
  {
    id: "batangas",
    name: "Batangas Coastal Courts",
    city: "Batangas City",
    address: "Batangas Port Area, Batangas",
    lat: 13.7565,
    lng: 121.0583,
  },
  {
    id: "laguna",
    name: "Laguna Sports Complex",
    city: "Santa Rosa",
    address: "Santa Rosa, Laguna",
    lat: 14.3116,
    lng: 121.1114,
  },

  // Visayas Courts
  {
    id: "cebu1",
    name: "Cebu City Pickleball Club",
    city: "Cebu City",
    address: "Osmeña Boulevard, Cebu City",
    lat: 10.3157,
    lng: 123.8854,
  },
  {
    id: "cebu2",
    name: "Mactan Island Courts",
    city: "Lapu-Lapu",
    address: "Mactan Island, Lapu-Lapu City",
    lat: 10.3169,
    lng: 123.9553,
  },
  {
    id: "bohol",
    name: "Bohol Pickleball Paradise",
    city: "Tagbilaran",
    address: "Tagbilaran City, Bohol",
    lat: 9.6403,
    lng: 123.8523,
  },
  {
    id: "iloilo",
    name: "Iloilo Sports Hub",
    city: "Iloilo City",
    address: "Iloilo Business Park, Iloilo",
    lat: 10.7202,
    lng: 122.5621,
  },
  {
    id: "bacolod",
    name: "Bacolod City Courts",
    city: "Bacolod",
    address: "Lacson Street, Bacolod City",
    lat: 10.6713,
    lng: 122.9510,
  },

  // Mindanao Courts
  {
    id: "davao1",
    name: "Davao City Pickleball Center",
    city: "Davao City",
    address: "Matina, Davao City",
    lat: 7.0731,
    lng: 125.6128,
  },
  {
    id: "davao2",
    name: "Davao Marina Courts",
    city: "Davao City",
    address: "Davao Marina, Davao City",
    lat: 7.0644,
    lng: 125.6088,
  },
  {
    id: "cagayan",
    name: "Cagayan de Oro Courts",
    city: "Cagayan de Oro",
    address: "Cagayan de Oro City",
    lat: 8.4542,
    lng: 124.6319,
  },
  {
    id: "general",
    name: "General Santos Sports Complex",
    city: "General Santos",
    address: "General Santos City",
    lat: 6.1164,
    lng: 125.1715,
  },
  {
    id: "zamboanga",
    name: "Zamboanga City Courts",
    city: "Zamboanga",
    address: "Zamboanga City",
    lat: 6.9214,
    lng: 122.0790,
  },

  // Other Major Cities
  {
    id: "palawan",
    name: "Palawan Paradise Courts",
    city: "Puerto Princesa",
    address: "Puerto Princesa City, Palawan",
    lat: 9.7390,
    lng: 118.7354,
  },
  {
    id: "legazpi",
    name: "Legazpi City Courts",
    city: "Legazpi",
    address: "Legazpi City, Albay",
    lat: 13.1391,
    lng: 123.7438,
  },
  {
    id: "tacloban",
    name: "Tacloban Sports Center",
    city: "Tacloban",
    address: "Tacloban City, Leyte",
    lat: 11.2470,
    lng: 125.0016,
  },
  {
    id: "butuan",
    name: "Butuan City Courts",
    city: "Butuan",
    address: "Butuan City, Agusan del Norte",
    lat: 8.9491,
    lng: 125.5436,
  },
];

type RegionType = "all" | "luzon" | "visayas" | "mindanao" | "others";

export default function AllPhilippinesCourtsView() {
  const [center, setCenter] = useState<[number, number]>([11.0, 122.5]); // Center of Philippines
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<RegionType>("all");
  const [zoomLevel, setZoomLevel] = useState(6); // Zoom level to see entire Philippines

  // Group courts by region
  const regions = {
    all: { name: "All Philippines", courts: courts },
    luzon: { 
      name: "Luzon", 
      courts: courts.filter(c => 
        ["Makati", "Quezon City", "Taguig", "Pasig", "Mandaluyong", "San Juan", "Manila", "Pasay", "Baguio", "Angeles", "Batangas City", "Santa Rosa"].includes(c.city)
      )
    },
    visayas: { 
      name: "Visayas", 
      courts: courts.filter(c => 
        ["Cebu City", "Lapu-Lapu", "Tagbilaran", "Iloilo City", "Bacolod"].includes(c.city)
      )
    },
    mindanao: { 
      name: "Mindanao", 
      courts: courts.filter(c => 
        ["Davao City", "Cagayan de Oro", "General Santos", "Zamboanga"].includes(c.city)
      )
    },
    others: { 
      name: "Other Islands", 
      courts: courts.filter(c => 
        ["Puerto Princesa", "Legazpi", "Tacloban", "Butuan"].includes(c.city)
      )
    }
  };

  const filteredCourts = regions[selectedRegion].courts.filter((court: Court) => {
    const matchesSearch = court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         court.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleLocate = () => {
    if (!navigator.geolocation) return;

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCenter: [number, number] = [position.coords.latitude, position.coords.longitude];
        setCenter(nextCenter);
        setUserLocation(nextCenter);
        setZoomLevel(12); // Zoom in when locating
        setLocating(false);
      },
      () => {
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleRegionChange = (region: RegionType) => {
    setSelectedRegion(region);
    const regionData = regions[region];
    
    // Adjust center and zoom based on region
    switch(region) {
      case "luzon":
        setCenter([16.0, 121.0]);
        setZoomLevel(7);
        break;
      case "visayas":
        setCenter([10.5, 123.0]);
        setZoomLevel(8);
        break;
      case "mindanao":
        setCenter([7.5, 125.0]);
        setZoomLevel(7);
        break;
      case "others":
        setCenter([11.0, 124.0]);
        setZoomLevel(7);
        break;
      default:
        setCenter([11.0, 122.5]);
        setZoomLevel(6);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 2));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#0a56a7]">All Philippines Courts</h1>
              <p className="text-gray-600 mt-1">View all {courts.length} pickleball courts across the Philippines</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
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
              value={selectedRegion}
              onChange={(e) => handleRegionChange(e.target.value as RegionType)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0a56a7]/50 focus:border-[#0a56a7]"
            >
              {Object.entries(regions).map(([key, region]) => (
                <option key={key} value={key}>
                  {region.name} ({region.courts.length} courts)
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2 px-4 py-3 bg-[#0a56a7]/10 rounded-xl">
              <MapPin className="w-5 h-5 text-[#0a56a7]" />
              <span className="text-[#0a56a7] font-semibold">{filteredCourts.length} Courts</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-3 bg-green-50 rounded-xl">
              <Globe className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-semibold">Zoom: {zoomLevel}</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Philippines Coverage:</strong> {regions.luzon.courts.length} Luzon • {regions.visayas.courts.length} Visayas • {regions.mindanao.courts.length} Mindanao • {regions.others.courts.length} Other Islands
            </p>
          </div>
        </div>
      </div>

      {/* Map and Courts List */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
          {/* Map */}
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-blue-100">
            <MapView center={center} userLocation={userLocation} courts={filteredCourts} />
          </div>

          {/* Courts List */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {regions[selectedRegion].name} Courts
              </h2>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {filteredCourts.map((court: Court) => (
                  <div
                    key={court.id}
                    className="group cursor-pointer"
                    onClick={() => {
                      setCenter([court.lat, court.lng]);
                      setZoomLevel(14);
                    }}
                  >
                    <div className="p-4 rounded-xl border border-gray-200 hover:border-[#0a56a7]/40 hover:bg-blue-50/50 transition-all duration-200">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0a56a7] to-[#0a56a7]/80 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                          <img src="/images/PinMarker.png" alt="Pickleball" className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 group-hover:text-[#0a56a7] transition-colors">
                            {court.name}
                          </h3>
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
                          <div className="flex gap-2 mt-3">
                            <button className="px-3 py-1 bg-[#0a56a7] text-white text-xs rounded-full hover:bg-[#0a56a7]/90 transition">
                              View Details
                            </button>
                            <button className="px-3 py-1 border border-[#0a56a7] text-[#0a56a7] text-xs rounded-full hover:bg-[#0a56a7]/10 transition">
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

            {/* Statistics */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Philippines Coverage</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                  <span className="text-sm font-semibold text-blue-800">Total Courts</span>
                  <span className="text-lg font-bold text-blue-600">{courts.length}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <div className="text-lg font-bold text-gray-700">{regions.luzon.courts.length}</div>
                    <div className="text-xs text-gray-600">Luzon</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <div className="text-lg font-bold text-gray-700">{regions.visayas.courts.length}</div>
                    <div className="text-xs text-gray-600">Visayas</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <div className="text-lg font-bold text-gray-700">{regions.mindanao.courts.length}</div>
                    <div className="text-xs text-gray-600">Mindanao</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <div className="text-lg font-bold text-gray-700">{regions.others.courts.length}</div>
                    <div className="text-xs text-gray-600">Other Islands</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
