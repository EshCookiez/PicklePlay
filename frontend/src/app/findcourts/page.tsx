"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, MapPin, Star, Clock, Users, Filter, ChevronDown, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { useCourts } from "@/hooks/useCourts";

// UI-normalized Court type used by the page regardless of data source
interface UICourt {
  id: string;
  name: string;
  address: string;
  city: string;
  rating: number;
  reviews: number;
  image: string;
  courts: number;
  indoor: boolean;
  outdoor: boolean;
  lights: boolean;
  equipment: boolean;
  price: string;
  hours: string;
  distance?: string;
  phone?: string;
  website?: string;
  description?: string;
}

const mockCourts: UICourt[] = [
  {
    id: "1",
    name: "Makati Sports Club",
    address: "123 Legazpi Street, Legazpi Village",
    city: "Makati City",
    rating: 4.8,
    reviews: 156,
    image: "https://placehold.co/600x400/0a56a7/white?text=Makati+Sports",
    courts: 4,
    indoor: true,
    outdoor: false,
    lights: true,
    equipment: true,
    price: "₱500/hour",
    hours: "6:00 AM - 10:00 PM",
    distance: "2.5 km",
    phone: "+63 2 8888 1234",
    website: "www.makatisports.com",
    description: "Premium indoor pickleball facility with professional courts and equipment rental."
  },
  {
    id: "2",
    name: "Bonifacio Global City Courts",
    address: "456 32nd Street, Bonifacio Global City",
    city: "Taguig",
    rating: 4.6,
    reviews: 89,
    image: "https://placehold.co/600x400/0a56a7/white?text=BGC+Courts",
    courts: 6,
    indoor: false,
    outdoor: true,
    lights: true,
    equipment: false,
    price: "₱300/hour",
    hours: "5:00 AM - 9:00 PM",
    distance: "3.8 km",
    phone: "+63 2 7777 5678",
    description: "Modern outdoor courts with excellent lighting and city views."
  },
  {
    id: "3",
    name: "Quezon City Circle Pickleball",
    address: "789 Elliptical Road, Quezon City Circle",
    city: "Quezon City",
    rating: 4.5,
    reviews: 234,
    image: "https://placehold.co/600x400/0a56a7/white?text=QC+Circle",
    courts: 8,
    indoor: false,
    outdoor: true,
    lights: true,
    equipment: true,
    price: "₱200/hour",
    hours: "24/7",
    distance: "5.2 km",
    phone: "+63 2 9999 8765",
    description: "Public courts available round-the-clock with affordable rates."
  },
  {
    id: "4",
    name: "Alabang Country Club",
    address: "321 Acacia Avenue, Ayala Alabang",
    city: "Muntinlupa",
    rating: 4.9,
    reviews: 67,
    image: "https://placehold.co/600x400/0a56a7/white?text=Alabang+CC",
    courts: 3,
    indoor: true,
    outdoor: true,
    lights: true,
    equipment: true,
    price: "₱800/hour",
    hours: "7:00 AM - 8:00 PM",
    distance: "12.3 km",
    phone: "+63 2 6666 4321",
    website: "www.alabangcc.com",
    description: "Exclusive club with both indoor and outdoor courts, premium amenities."
  },
  {
    id: "5",
    name: "Pasig Sports Complex",
    address: "654 Meralco Avenue, Pasig City",
    city: "Pasig",
    rating: 4.4,
    reviews: 123,
    image: "https://placehold.co/600x400/0a56a7/white?text=Pasig+Sports",
    courts: 5,
    indoor: false,
    outdoor: true,
    lights: false,
    equipment: true,
    price: "₱250/hour",
    hours: "6:00 AM - 6:00 PM",
    distance: "4.1 km",
    phone: "+63 2 5555 9876",
    description: "Community sports complex with well-maintained outdoor courts."
  },
  {
    id: "6",
    name: "Manila Bay Pickleball Center",
    address: "986 Roxas Boulevard, Manila",
    city: "Manila",
    rating: 4.7,
    reviews: 198,
    image: "https://placehold.co/600x400/0a56a7/white?text=Manila+Bay",
    courts: 4,
    indoor: true,
    outdoor: true,
    lights: true,
    equipment: true,
    price: "₱400/hour",
    hours: "7:00 AM - 10:00 PM",
    distance: "6.7 km",
    phone: "+63 2 3333 2109",
    website: "www.manilabaypickleball.com",
    description: "Scenic location near Manila Bay with both indoor and outdoor options."
  }
];

const cities = [
  "All Cities",
  "Manila",
  "Makati",
  "Quezon City",
  "Pasig",
  "Taguig",
  "Muntinlupa",
  "Mandaluyong",
  "San Juan",
  "Pasay"
];

// Helper to format hours from DB structure
function formatDbHours(hours: Record<string, { open: string; close: string }> | null): string {
  if (!hours || typeof hours !== "object") return "See hours";
  const days = Object.keys(hours);
  if (days.length === 0) return "See hours";
  // Check if all days have same open/close
  const first = hours[days[0]];
  const allSame = days.every((d) => hours[d]?.open === first.open && hours[d]?.close === first.close);
  if (allSame && first?.open && first?.close) {
    return `Daily ${first.open} - ${first.close}`;
  }
  return "Varies by day";
}

export default function FindCourts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredCourts, setFilteredCourts] = useState<UICourt[]>(mockCourts);
  const [selectedCourt, setSelectedCourt] = useState<UICourt | null>(null);
  const [useMock, setUseMock] = useState(false); // Toggle between live (Supabase) and mock
  
  // Filter states
  const [indoorOnly, setIndoorOnly] = useState(false);
  const [outdoorOnly, setOutdoorOnly] = useState(false);
  const [lightsOnly, setLightsOnly] = useState(false);
  const [equipmentOnly, setEquipmentOnly] = useState(false);

  // Build filters for live data
  const liveFilters = useMemo(() => {
    const type = indoorOnly && outdoorOnly
      ? "both"
      : indoorOnly
      ? "indoor"
      : outdoorOnly
      ? "outdoor"
      : undefined;
    return {
      status: "approved",
      city: selectedCity !== "All Cities" ? selectedCity : undefined,
      type,
    } as { status?: string; city?: string; type?: string };
  }, [indoorOnly, outdoorOnly, selectedCity]);

  // Fetch real courts when using live data
  const { courts: realCourts, loading: realLoading, error: realError } = useCourts(liveFilters);

  // Normalize real courts to UI type
  const normalizedRealCourts: UICourt[] = useMemo(() => {
    if (!realCourts) return [];
    return realCourts.map((c: any) => {
      const amenities: string[] = Array.isArray(c.amenities) ? c.amenities : [];
      const image = c.cover_image || (Array.isArray(c.images) && c.images.length > 0 ? c.images[0] : "https://placehold.co/600x400/0a56a7/white?text=PicklePlay+Court");
      const indoor = c.type === "indoor" || c.type === "both";
      const outdoor = c.type === "outdoor" || c.type === "both";
      const lights = amenities.map(a => a.toLowerCase()).includes("lights");
      const equipment = amenities.map(a => a.toLowerCase()).includes("equipment");
      const price = c.is_free ? "Free" : (typeof c.price_per_hour === "number" ? `₱${c.price_per_hour}/hour` : "See pricing");
      const hours = formatDbHours(c.hours_of_operation || null);
      return {
        id: String(c.id),
        name: c.name,
        address: c.address,
        city: c.city,
        rating: typeof c.rating === "number" ? c.rating : 0,
        reviews: typeof c.total_reviews === "number" ? c.total_reviews : 0,
        image,
        courts: typeof c.number_of_courts === "number" ? c.number_of_courts : 0,
        indoor,
        outdoor,
        lights,
        equipment,
        price,
        hours,
        phone: c.phone_number || undefined,
        website: c.website || undefined,
        description: c.description || undefined,
      } as UICourt;
    });
  }, [realCourts]);

  // Compute filtered list based on source
  useEffect(() => {
    if (useMock) {
      let filtered = mockCourts;

      // Search filter
      if (searchQuery.trim()) {
        filtered = filtered.filter(court =>
          court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          court.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          court.city.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // City filter
      if (selectedCity !== "All Cities") {
        filtered = filtered.filter(court => court.city === selectedCity);
      }

      // Feature filters
      if (indoorOnly) filtered = filtered.filter(court => court.indoor);
      if (outdoorOnly) filtered = filtered.filter(court => court.outdoor);
      if (lightsOnly) filtered = filtered.filter(court => court.lights);
      if (equipmentOnly) filtered = filtered.filter(court => court.equipment);

      setFilteredCourts(filtered);
    } else {
      // Live data: start from normalizedRealCourts and apply client-side search + amenities filters
      let filtered = normalizedRealCourts;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(court =>
          court.name.toLowerCase().includes(q) ||
          court.address.toLowerCase().includes(q) ||
          court.city.toLowerCase().includes(q)
        );
      }

      // City already filtered server-side, but keep as safety
      if (selectedCity !== "All Cities") {
        filtered = filtered.filter(court => court.city === selectedCity);
      }

      if (lightsOnly) filtered = filtered.filter(c => c.lights);
      if (equipmentOnly) filtered = filtered.filter(c => c.equipment);

      setFilteredCourts(filtered);
    }
  }, [useMock, searchQuery, selectedCity, indoorOnly, outdoorOnly, lightsOnly, equipmentOnly, normalizedRealCourts]);

  const clearFilters = () => {
    setIndoorOnly(false);
    setOutdoorOnly(false);
    setLightsOnly(false);
    setEquipmentOnly(false);
    setSelectedCity("All Cities");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-in fade-in duration-1000">
      <Header />

      {/* Colored Margin Section */}
      <div className="h-24 bg-[#0a56a7]"></div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0a56a7] to-blue-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Pickleball Courts</h1>
          <p className="text-xl text-white/90 mb-8">
            Discover the best pickleball courts in your area and connect with players
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courts by name, address, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b border-gray-200 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* City Dropdown */}
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#0a56a7] focus:border-transparent"
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
              {(indoorOnly || outdoorOnly || lightsOnly || equipmentOnly) && (
                <span className="w-2 h-2 bg-[#0a56a7] rounded-full"></span>
              )}
            </button>

            {/* Data Source Toggle */}
            <button
              onClick={() => setUseMock((v) => !v)}
              className={`px-4 py-2 rounded-lg border transition-colors ${useMock ? 'border-amber-400 text-amber-700 hover:bg-amber-50' : 'border-emerald-500 text-emerald-700 hover:bg-emerald-50'}`}
              title={useMock ? 'Currently showing mock data' : 'Currently showing live data'}
            >
              {useMock ? 'Use Live Data' : 'Use Mock Data'}
            </button>

            {/* Results Count */}
            <div className="ml-auto text-gray-600">
              {filteredCourts.length} courts found
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={indoorOnly}
                    onChange={(e) => setIndoorOnly(e.target.checked)}
                    className="w-4 h-4 text-[#0a56a7] rounded focus:ring-[#0a56a7]"
                  />
                  <span className="text-sm">Indoor Courts</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={outdoorOnly}
                    onChange={(e) => setOutdoorOnly(e.target.checked)}
                    className="w-4 h-4 text-[#0a56a7] rounded focus:ring-[#0a56a7]"
                  />
                  <span className="text-sm">Outdoor Courts</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lightsOnly}
                    onChange={(e) => setLightsOnly(e.target.checked)}
                    className="w-4 h-4 text-[#0a56a7] rounded focus:ring-[#0a56a7]"
                  />
                  <span className="text-sm">Night Lights</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={equipmentOnly}
                    onChange={(e) => setEquipmentOnly(e.target.checked)}
                    className="w-4 h-4 text-[#0a56a7] rounded focus:ring-[#0a56a7]"
                  />
                  <span className="text-sm">Equipment Rental</span>
                </label>
                <button
                  onClick={clearFilters}
                  className="ml-auto text-sm text-[#0a56a7] hover:text-[#0a56a7]/80 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Courts Grid */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          {!useMock && realLoading ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4">
                <svg className="animate-spin w-full h-full text-[#0a56a7]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-gray-600">Loading courts...</p>
            </div>
          ) : filteredCourts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courts found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-[#0a56a7] text-white rounded-lg hover:bg-[#0a56a7]/90 transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourts.map((court) => (
                <div
                  key={court.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedCourt(court)}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={court.image}
                      alt={court.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-medium text-[#0a56a7]">
                      {court.price}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#0a56a7] transition-colors">
                        {court.name}
                      </h3>
                      {court.distance && (
                        <span className="text-sm text-gray-500">{court.distance}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{court.address}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{court.rating}</span>
                      </div>
                      <span className="text-sm text-gray-400">({court.reviews} reviews)</span>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {court.indoor && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Indoor</span>
                      )}
                      {court.outdoor && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Outdoor</span>
                      )}
                      {court.lights && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Lights</span>
                      )}
                      {court.equipment && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Equipment</span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{court.courts} courts</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{court.hours}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Court Details Modal */}
      {selectedCourt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{selectedCourt.name}</h2>
              <button
                onClick={() => setSelectedCourt(null)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column - Image and Basic Info */}
                <div>
                  <img
                    src={selectedCourt.image}
                    alt={selectedCourt.name}
                    className="w-full h-64 object-cover rounded-xl mb-4"
                  />
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{selectedCourt.address}</span>
                    </div>
                    
                    {selectedCourt.phone && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">📞</span>
                        <span className="text-gray-700">{selectedCourt.phone}</span>
                      </div>
                    )}
                    
                    {selectedCourt.website && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">🌐</span>
                        <a href={`https://${selectedCourt.website}`} target="_blank" rel="noopener noreferrer" className="text-[#0a56a7] hover:underline">
                          {selectedCourt.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="space-y-6">
                  {/* Rating and Reviews */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="text-xl font-semibold">{selectedCourt.rating}</span>
                      </div>
                      <span className="text-gray-500">({selectedCourt.reviews} reviews)</span>
                    </div>
                  </div>

                  {/* Description */}
                  {selectedCourt.description && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                      <p className="text-gray-600">{selectedCourt.description}</p>
                    </div>
                  )}

                  {/* Features */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${selectedCourt.indoor ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        <span className="text-sm">Indoor Courts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${selectedCourt.outdoor ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        <span className="text-sm">Outdoor Courts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${selectedCourt.lights ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        <span className="text-sm">Night Lights</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${selectedCourt.equipment ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        <span className="text-sm">Equipment Rental</span>
                      </div>
                    </div>
                  </div>

                  {/* Court Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-500 mb-1">Number of Courts</div>
                      <div className="font-semibold">{selectedCourt.courts} courts</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-500 mb-1">Price</div>
                      <div className="font-semibold text-[#0a56a7]">{selectedCourt.price}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 md:col-span-2">
                      <div className="text-sm text-gray-500 mb-1">Operating Hours</div>
                      <div className="font-semibold">{selectedCourt.hours}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="flex-1 bg-[#0a56a7] text-white py-3 rounded-lg hover:bg-[#0a56a7]/90 transition-colors font-medium">
                      Book Court
                    </button>
                    <button className="flex-1 border border-[#0a56a7] text-[#0a56a7] py-3 rounded-lg hover:bg-[#0a56a7] hover:text-white transition-colors font-medium">
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ScrollToTop />
      <Footer />
    </div>
  );
}
