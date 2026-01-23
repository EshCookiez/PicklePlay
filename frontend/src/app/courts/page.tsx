"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
import { Search, MapPin, Navigation, Clock, Users, Zap, Star, Filter, X, LayoutGrid, List, Grip, Heart, Share2, TrendingUp, UserPlus, Trophy, Briefcase, Calendar } from "lucide-react";
import AnimatedContent from "@/animate/AnimatedContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Court } from "@/components/MapView";

interface Player {
  id: string;
  name: string;
  email: string;
  avatar: string;
  position: "Beginner" | "Intermediate" | "Advanced" | "Pro";
  profession: string;
  ranking: number;
  playFrequency: string;
  wins: number;
  rating: number;
  court?: string;
}

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-blue-50 animate-pulse rounded-lg" />,
});

// Mock player data
const mockPlayers: Player[] = [
  { id: "p1", name: "Marco Santos", email: "marco@email.com", avatar: "MS", position: "Advanced", profession: "Software Engineer", ranking: 1, playFrequency: "5x/week", wins: 48, rating: 4.9, court: "Makati Hub" },
  { id: "p2", name: "Ana Rivera", email: "ana@email.com", avatar: "AR", position: "Intermediate", profession: "Accountant", ranking: 2, playFrequency: "3x/week", wins: 32, rating: 4.7, court: "BGC Courts" },
  { id: "p3", name: "Jose Reyes", email: "jose@email.com", avatar: "JR", position: "Advanced", profession: "Coach", ranking: 3, playFrequency: "6x/week", wins: 54, rating: 4.8, court: "QC Sports Club" },
  { id: "p4", name: "Lisa Chen", email: "lisa@email.com", avatar: "LC", position: "Pro", profession: "Professional Player", ranking: 4, playFrequency: "7x/week", wins: 67, rating: 5.0, court: "Makati Hub" },
  { id: "p5", name: "Carlos Mendez", email: "carlos@email.com", avatar: "CM", position: "Beginner", profession: "Teacher", ranking: 5, playFrequency: "2x/week", wins: 8, rating: 4.2, court: "Pasig Courts" },
  { id: "p6", name: "Diana Lopez", email: "diana@email.com", avatar: "DL", position: "Intermediate", profession: "Marketing Manager", ranking: 6, playFrequency: "4x/week", wins: 26, rating: 4.5, court: "Cebu Complex" },
  { id: "p7", name: "Robert Kim", email: "robert@email.com", avatar: "RK", position: "Advanced", profession: "Lawyer", ranking: 7, playFrequency: "3x/week", wins: 41, rating: 4.6, court: "BGC Courts" },
  { id: "p8", name: "Sofia Torres", email: "sofia@email.com", avatar: "ST", position: "Intermediate", profession: "Nurse", ranking: 8, playFrequency: "2x/week", wins: 18, rating: 4.4, court: "Makati Hub" },
];

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
  {
    id: "cebu",
    name: "Cebu Sports Complex",
    city: "Cebu",
    address: "Cebu Business Park, Cebu City",
    lat: 10.3157,
    lng: 123.8854,
  },
  {
    id: "davao",
    name: "Davao Pickleball Arena",
    city: "Davao",
    address: "San Pedro St, Davao City",
    lat: 7.0731,
    lng: 125.6127,
  },
];

interface RatingBreakdown {
  totalReviews: number;
  distribution: { stars: number; count: number }[];
}

interface CourtWithRating extends Court {
  rating: number;
  courts: number;
  amenities: string[];
  hours: string;
  distance?: number;
  ratingBreakdown: RatingBreakdown;
}

const courtsWithDetails: CourtWithRating[] = [
  {
    ...courts[0],
    rating: 4.8,
    courts: 6,
    amenities: ["Air Conditioning", "Coaching Available", "Equipment Rental", "Lounge"],
    hours: "6am - 10pm",
    ratingBreakdown: {
      totalReviews: 142,
      distribution: [
        { stars: 5, count: 110 },
        { stars: 4, count: 25 },
        { stars: 3, count: 5 },
        { stars: 2, count: 2 },
        { stars: 1, count: 0 },
      ],
    },
  },
  {
    ...courts[1],
    rating: 4.6,
    courts: 4,
    amenities: ["Air Conditioning", "Equipment Rental", "Restaurant"],
    hours: "7am - 9pm",
    ratingBreakdown: {
      totalReviews: 98,
      distribution: [
        { stars: 5, count: 72 },
        { stars: 4, count: 20 },
        { stars: 3, count: 4 },
        { stars: 2, count: 2 },
        { stars: 1, count: 0 },
      ],
    },
  },
  {
    ...courts[2],
    rating: 4.7,
    courts: 8,
    amenities: ["Air Conditioning", "Coaching Available", "Lounge", "Parking"],
    hours: "6am - 11pm",
    ratingBreakdown: {
      totalReviews: 156,
      distribution: [
        { stars: 5, count: 125 },
        { stars: 4, count: 25 },
        { stars: 3, count: 4 },
        { stars: 2, count: 2 },
        { stars: 1, count: 0 },
      ],
    },
  },
  {
    ...courts[3],
    rating: 4.5,
    courts: 5,
    amenities: ["Scenic View", "Equipment Rental", "Lounge"],
    hours: "7am - 10pm",
    ratingBreakdown: {
      totalReviews: 87,
      distribution: [
        { stars: 5, count: 62 },
        { stars: 4, count: 20 },
        { stars: 3, count: 3 },
        { stars: 2, count: 2 },
        { stars: 1, count: 0 },
      ],
    },
  },
  {
    ...courts[4],
    rating: 4.9,
    courts: 10,
    amenities: ["Air Conditioning", "Coaching Available", "Restaurant", "Gym Access"],
    hours: "6am - 12am",
    ratingBreakdown: {
      totalReviews: 203,
      distribution: [
        { stars: 5, count: 190 },
        { stars: 4, count: 12 },
        { stars: 3, count: 1 },
        { stars: 2, count: 0 },
        { stars: 1, count: 0 },
      ],
    },
  },
  {
    ...courts[5],
    rating: 4.4,
    courts: 6,
    amenities: ["Equipment Rental", "Parking", "Lounge"],
    hours: "7am - 10pm",
    ratingBreakdown: {
      totalReviews: 64,
      distribution: [
        { stars: 5, count: 44 },
        { stars: 4, count: 16 },
        { stars: 3, count: 3 },
        { stars: 2, count: 1 },
        { stars: 1, count: 0 },
      ],
    },
  },
];

export default function FindCourtsPage() {
  const [center, setCenter] = useState<[number, number]>([14.5995, 120.9842]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState<CourtWithRating | null>(null);
  const [hoverRatingId, setHoverRatingId] = useState<string | null>(null);
  const [hoverStarLevel, setHoverStarLevel] = useState<number | null>(null);
  
  // All Courts section states
  const [gridLayout, setGridLayout] = useState<"grid" | "grid-compact" | "list">("grid");
  const [sortBy, setSortBy] = useState<"rating" | "distance" | "newest" | "popular" | "price">("rating");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<"all" | "budget" | "mid" | "premium">("all");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [allCourtsSearch, setAllCourtsSearch] = useState("");
  
  // Player Directory states
  const [playerSearch, setPlayerSearch] = useState("");
  const [playerPositionFilter, setPlayerPositionFilter] = useState<string>("all");
  const [playerSortBy, setPlayerSortBy] = useState<"ranking" | "rating" | "frequency">("ranking");
  const [connectedPlayers, setConnectedPlayers] = useState<Set<string>>(new Set());

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

  const filteredCourts = useMemo(() => {
    return courtsWithDetails.filter((court) => {
      const matchesSearch =
        court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        court.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        court.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRating = !selectedRating || court.rating >= selectedRating;

      return matchesSearch && matchesRating;
    });
  }, [searchQuery, selectedRating]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-4 pb-4 px-4 md:px-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <AnimatedContent
            distance={30}
            direction="vertical"
            duration={0.6}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
          >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Find Pickleball Courts</h1>
            <p className="text-sm text-gray-600">Discover all available pickleball courts near you</p>
          </AnimatedContent>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Minimal Search Bar */}
          <div className="mb-4 bg-gradient-to-r from-[#0a56a7] to-blue-700 rounded-lg p-3 shadow-lg border border-blue-800">
            <div className="flex flex-col sm:flex-row gap-2 items-stretch">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                <Input
                  type="text"
                  placeholder="Search courts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-sm focus:ring-[#a3ff01] bg-white text-gray-900 h-9"
                />
              </div>

              {/* Locate Button */}
              <Button
                onClick={handleLocate}
                disabled={locating}
                className="bg-[#a3ff01] hover:bg-[#a3ff01]/90 text-gray-900 font-bold h-9 px-4 shadow-lg whitespace-nowrap"
              >
                <Navigation className="w-4 h-4 mr-1" />
                {locating ? "Finding..." : "Near Me"}
              </Button>

              {/* Rating Filter */}
              <Select value={selectedRating ? selectedRating.toString() : "all"} onValueChange={(value) => setSelectedRating(value === "all" ? null : parseFloat(value))}>
                <SelectTrigger className="focus:ring-[#a3ff01] text-sm h-9 bg-white text-gray-900 w-full sm:w-32">
                  <SelectValue placeholder="Ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="4.9">⭐ 4.9+</SelectItem>
                  <SelectItem value="4.7">⭐ 4.7+</SelectItem>
                  <SelectItem value="4.5">⭐ 4.5+</SelectItem>
                  <SelectItem value="4.0">⭐ 4.0+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Results Count */}
            <div className="mt-2 text-white text-xs">
              <span className="font-bold text-[#a3ff01]">{filteredCourts.length}</span> courts available
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              <AnimatedContent
                distance={50}
                direction="vertical"
                duration={0.6}
                ease="power3.out"
                initialOpacity={0}
                animateOpacity
              >
                <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
                  <div className="h-[400px] w-full">
                    <MapView center={center} userLocation={userLocation} courts={courts} />
                  </div>
                </div>
              </AnimatedContent>
            </div>

            {/* Search & Court List Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              {/* Court List */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {filteredCourts.length > 0 ? (
                  filteredCourts.map((court, idx) => (
                    <AnimatedContent
                      key={court.id}
                      distance={30}
                      direction="horizontal"
                      duration={0.6}
                      ease="power3.out"
                      initialOpacity={0}
                      animateOpacity
                      delay={idx * 0.1}
                    >
                      <div
                        onClick={() => setSelectedCourt(court)}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 bg-white ${
                          selectedCourt?.id === court.id
                            ? "border-[#0a56a7] bg-blue-50 shadow-lg"
                            : "border-gray-200 hover:border-[#0a56a7] hover:shadow-md"
                        }`}
                      >
                        <h3 className="font-bold text-gray-900 text-xs mb-1">{court.name}</h3>
                        
                        <div 
                          className="flex items-center gap-1 mb-2 relative"
                          onMouseEnter={() => setHoverRatingId(court.id)}
                          onMouseLeave={() => {
                            setHoverRatingId(null);
                            setHoverStarLevel(null);
                          }}
                        >
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => {
                              const ratingData = court.ratingBreakdown.distribution.find(d => d.stars === star);
                              const count = ratingData?.count || 0;
                              const isFilled = star <= Math.round(court.rating);
                              
                              return (
                                <div
                                  key={star}
                                  className="relative"
                                  onMouseEnter={() => {
                                    setHoverRatingId(court.id);
                                    setHoverStarLevel(star);
                                  }}
                                >
                                  <Star
                                    className={`w-3 h-3 cursor-pointer transition-all ${
                                      isFilled
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    } ${
                                      hoverRatingId === court.id && hoverStarLevel === star
                                        ? 'scale-125'
                                        : 'scale-100'
                                    }`}
                                  />
                                  
                                  {/* Small Bubble Tooltip on Hover */}
                                  {hoverRatingId === court.id && hoverStarLevel === star && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-900 text-white px-1.5 py-0.5 rounded text-xs whitespace-nowrap z-50 pointer-events-none">
                                      {count} {count === 1 ? 'person' : 'people'}
                                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gray-900 rotate-45"></div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <span className="font-semibold text-xs text-gray-900 ml-1">{court.rating}</span>
                        </div>

                        <div className="space-y-1 text-xs text-gray-600 mb-2">
                          <div className="flex items-start gap-1">
                            <MapPin className="w-3 h-3 flex-shrink-0 text-[#0a56a7] mt-0.5" />
                            <span className="line-clamp-1">{court.address}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#0a56a7]" />
                            <span>{court.hours}</span>
                          </div>
                        </div>

                        <Button className="w-full bg-[#0a56a7] hover:bg-[#0a56a7]/90 text-white text-xs h-7">
                          View Details
                        </Button>
                      </div>
                    </AnimatedContent>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500 bg-white rounded-lg border border-gray-200">
                    <p className="text-xs">No courts found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Courts Section */}
      <section className="py-12 px-4 md:px-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">All Available Courts</h2>

          {/* Controls Bar */}
          <div className="mb-8 space-y-4">
            {/* Search and View Toggle */}
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search all courts..."
                  value={allCourtsSearch}
                  onChange={(e) => setAllCourtsSearch(e.target.value)}
                  className="pl-10 focus:ring-[#0a56a7]"
                />
              </div>

              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="focus:ring-[#0a56a7] w-auto">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">⭐ Highest Rated</SelectItem>
                  <SelectItem value="distance">📍 Closest</SelectItem>
                  <SelectItem value="popular">🔥 Most Popular</SelectItem>
                  <SelectItem value="newest">✨ Newest</SelectItem>
                  <SelectItem value="price">💰 Price</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <Button
                onClick={() => {
                  const layouts: Array<"grid" | "grid-compact" | "list"> = ["grid", "grid-compact", "list"];
                  const currentIndex = layouts.indexOf(gridLayout);
                  setGridLayout(layouts[(currentIndex + 1) % layouts.length]);
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
              >
                {gridLayout === "grid" && <LayoutGrid className="w-5 h-5" />}
                {gridLayout === "grid-compact" && <Grip className="w-5 h-5" />}
                {gridLayout === "list" && <List className="w-5 h-5" />}
              </Button>
            </div>

            {/* Amenities Filters */}
            <div className="flex flex-wrap gap-2">
              {["Air Conditioning", "Coaching Available", "Parking", "Restaurant", "Lounge"].map((amenity) => (
                <button
                  key={amenity}
                  onClick={() => {
                    setSelectedAmenities((prev) =>
                      prev.includes(amenity)
                        ? prev.filter((a) => a !== amenity)
                        : [...prev, amenity]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                    selectedAmenities.includes(amenity)
                      ? "bg-[#0a56a7] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>

            {/* Active Filters Display */}
            {(selectedAmenities.length > 0 || priceRange !== "all") && (
              <div className="flex flex-wrap gap-2">
                {selectedAmenities.map((amenity) => (
                  <span key={amenity} className="px-3 py-1 bg-blue-100 text-[#0a56a7] rounded-full text-sm font-semibold flex items-center gap-2">
                    {amenity}
                    <button
                      onClick={() =>
                        setSelectedAmenities((prev) =>
                          prev.filter((a) => a !== amenity)
                        )
                      }
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
                {priceRange !== "all" && (
                  <span className="px-3 py-1 bg-blue-100 text-[#0a56a7] rounded-full text-sm font-semibold flex items-center gap-2">
                    {priceRange === "budget" ? "Budget" : priceRange === "mid" ? "Mid-range" : "Premium"}
                    <button
                      onClick={() => setPriceRange("all")}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Sorted and Filtered Courts */}
          {useMemo(() => {
            let sortedCourts = [...courtsWithDetails];

            // Apply sorting
            if (sortBy === "rating") {
              sortedCourts.sort((a, b) => b.rating - a.rating);
            } else if (sortBy === "popular") {
              sortedCourts.sort((a, b) => b.ratingBreakdown.totalReviews - a.ratingBreakdown.totalReviews);
            } else if (sortBy === "price") {
              // Price sorting (assuming lower price first, can be reversed)
              sortedCourts.sort((a, b) => (a.courts || 0) - (b.courts || 0));
            } else if (sortBy === "newest") {
              // Newest - assuming the order in array is newest first
              sortedCourts.reverse();
            } else if (sortBy === "distance") {
              // Distance - closest first (based on array order for now)
              sortedCourts.sort((a, b) => (a.courts || 0) - (b.courts || 0));
            }

            return (
              <div
                className={
                  gridLayout === "list"
                    ? "space-y-4"
                    : gridLayout === "grid-compact"
                    ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4"
                    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                }
              >
                {sortedCourts.map((court, idx) => {
                  const isFavorite = favorites.has(court.id);
                  const isHighlyRated = court.rating >= 4.8;
                  const isPopular = court.ratingBreakdown.totalReviews > 150;
                  
                  if (
                    allCourtsSearch !== "" &&
                    !court.name.toLowerCase().includes(allCourtsSearch.toLowerCase())
                  ) {
                    return null;
                  }

                  if (selectedAmenities.length > 0) {
                    const hasAllAmenities = selectedAmenities.every((amenity) =>
                      court.amenities.includes(amenity)
                    );
                    if (!hasAllAmenities) return null;
                  }

                  return (
                <AnimatedContent
                  key={court.id}
                  distance={50}
                  direction="vertical"
                  duration={0.6}
                  ease="power3.out"
                  initialOpacity={0}
                  animateOpacity
                  delay={idx * 0.1}
                >
                  {gridLayout === "list" ? (
                    /* List View */
                    <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 p-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 bg-gradient-to-br from-[#0a56a7] to-blue-600 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                          🎾
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-gray-900 group-hover:text-[#0a56a7] transition-colors">
                                {court.name}
                              </h3>
                              <p className="text-xs text-gray-600">{court.city}</p>
                            </div>
                            <div className="flex gap-2">
                              {isHighlyRated && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                                  ⭐ Highly Rated
                                </span>
                              )}
                              {isPopular && (
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                                  🔥 Popular
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= Math.round(court.rating)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{court.rating}</span>
                            <span className="text-xs text-gray-600">({court.ratingBreakdown.totalReviews} reviews)</span>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {court.amenities.map((amenity) => (
                              <span
                                key={amenity}
                                className="px-2 py-0.5 bg-blue-100 text-[#0a56a7] text-xs rounded"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <Zap className="w-4 h-4 text-[#a3ff01]" />
                              {court.courts} Courts
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-[#0a56a7]" />
                              {court.hours}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button className="flex-1 bg-[#0a56a7] hover:bg-[#0a56a7]/90 text-sm">
                          Book Now
                        </Button>
                        <Button
                          onClick={() => {
                            const newFavorites = new Set(favorites);
                            if (isFavorite) {
                              newFavorites.delete(court.id);
                            } else {
                              newFavorites.add(court.id);
                            }
                            setFavorites(newFavorites);
                          }}
                          className={`text-sm ${
                            isFavorite
                              ? "bg-red-100 text-red-600 hover:bg-red-200"
                              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* Grid View */
                    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                      {/* Image */}
                      <div className="relative">
                        <div className={`bg-gradient-to-br from-[#0a56a7] to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                          gridLayout === "grid-compact" ? "h-24 text-2xl" : "h-40 text-4xl"
                        }`}>
                          🎾
                        </div>
                        
                        {/* Badges */}
                        <div className="absolute top-2 right-2 flex flex-col gap-1">
                          {isHighlyRated && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                              ⭐ Highly Rated
                            </span>
                          )}
                          {isPopular && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                              🔥 Popular
                            </span>
                          )}
                        </div>

                        {/* Favorite Button */}
                        <button
                          onClick={() => {
                            const newFavorites = new Set(favorites);
                            if (isFavorite) {
                              newFavorites.delete(court.id);
                            } else {
                              newFavorites.add(court.id);
                            }
                            setFavorites(newFavorites);
                          }}
                          className="absolute top-2 left-2 p-2 bg-white rounded-full hover:bg-gray-100 transition-all shadow-md"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              isFavorite
                                ? "fill-red-500 text-red-500"
                                : "text-gray-400"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Content */}
                      <div className={gridLayout === "grid-compact" ? "p-3" : "p-5"}>
                        <h3 className={`font-bold text-gray-900 group-hover:text-[#0a56a7] transition-colors ${
                          gridLayout === "grid-compact" ? "text-xs" : ""
                        }`}>
                          {court.name}
                        </h3>

                        <p className={`text-gray-600 mb-2 ${
                          gridLayout === "grid-compact" ? "text-xs" : "text-sm"
                        }`}>
                          {court.city}
                        </p>

                        {/* Rating */}
                        <div
                          className="flex items-center gap-2 mb-3"
                          onMouseLeave={() => {
                            setHoverRatingId(null);
                            setHoverStarLevel(null);
                          }}
                        >
                          <div className="relative">
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => {
                                const ratingData = court.ratingBreakdown.distribution.find(
                                  (d) => d.stars === star
                                );
                                const count = ratingData?.count || 0;
                                const isFilled = star <= Math.round(court.rating);

                                return (
                                  <div
                                    key={star}
                                    className="relative"
                                    onMouseEnter={() => {
                                      setHoverRatingId(court.id);
                                      setHoverStarLevel(star);
                                    }}
                                  >
                                    <Star
                                      className={`w-3 h-3 cursor-pointer transition-all ${
                                        isFilled
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      } ${
                                        hoverRatingId === court.id &&
                                        hoverStarLevel === star
                                          ? "scale-125"
                                          : "scale-100"
                                      }`}
                                    />

                                    {hoverRatingId === court.id &&
                                      hoverStarLevel === star && (
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-900 text-white px-1.5 py-0.5 rounded text-xs whitespace-nowrap z-50 pointer-events-none">
                                          {count}{" "}
                                          {count === 1 ? "person" : "people"}
                                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gray-900 rotate-45"></div>
                                        </div>
                                      )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <span className={`font-bold text-gray-900 ${
                            gridLayout === "grid-compact" ? "text-xs" : "text-sm"
                          }`}>
                            {court.rating}
                          </span>
                        </div>

                        {gridLayout !== "grid-compact" && (
                          <>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {court.amenities.slice(0, 2).map((amenity) => (
                                <span
                                  key={amenity}
                                  className="px-2 py-1 bg-blue-100 text-[#0a56a7] text-xs rounded"
                                >
                                  {amenity}
                                </span>
                              ))}
                              {court.amenities.length > 2 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                  +{court.amenities.length - 2}
                                </span>
                              )}
                            </div>

                            <Button className="w-full bg-[#0a56a7] hover:bg-[#0a56a7]/90 font-bold text-sm">
                              Book Now
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </AnimatedContent>
              );
            })}
              </div>
            );
          }, [sortBy, allCourtsSearch, selectedAmenities, gridLayout, favorites, hoverRatingId, hoverStarLevel])}
        </div>
      </section>

      {/* Player Directory Section */}
      <section className="py-12 px-4 md:px-8 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Player Directory</h2>

          {/* Controls Bar */}
          <div className="mb-8 space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search players by name..."
                  value={playerSearch}
                  onChange={(e) => setPlayerSearch(e.target.value)}
                  className="pl-10 focus:ring-[#0a56a7]"
                />
              </div>

              {/* Position Filter */}
              <Select value={playerPositionFilter} onValueChange={setPlayerPositionFilter}>
                <SelectTrigger className="focus:ring-[#0a56a7] w-full sm:w-40">
                  <SelectValue placeholder="Skill Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Pro">Pro</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort By */}
              <Select value={playerSortBy} onValueChange={(value: any) => setPlayerSortBy(value)}>
                <SelectTrigger className="focus:ring-[#0a56a7] w-full sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ranking">🏆 Ranking</SelectItem>
                  <SelectItem value="rating">⭐ Rating</SelectItem>
                  <SelectItem value="frequency">📅 Play Frequency</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Players Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useMemo(() => {
              let filtered = mockPlayers.filter((player) => {
                const matchesSearch = 
                  player.name.toLowerCase().includes(playerSearch.toLowerCase()) ||
                  player.email.toLowerCase().includes(playerSearch.toLowerCase()) ||
                  player.profession.toLowerCase().includes(playerSearch.toLowerCase());

                const matchesPosition = 
                  playerPositionFilter === "all" || player.position === playerPositionFilter;

                return matchesSearch && matchesPosition;
              });

              // Sort
              if (playerSortBy === "ranking") {
                filtered.sort((a, b) => a.ranking - b.ranking);
              } else if (playerSortBy === "rating") {
                filtered.sort((a, b) => b.rating - a.rating);
              } else if (playerSortBy === "frequency") {
                const freqMap: { [key: string]: number } = {
                  "2x/week": 2,
                  "3x/week": 3,
                  "4x/week": 4,
                  "5x/week": 5,
                  "6x/week": 6,
                  "7x/week": 7,
                };
                filtered.sort((a, b) => (freqMap[b.playFrequency] || 0) - (freqMap[a.playFrequency] || 0));
              }

              return filtered.map((player, idx) => {
                const isConnected = connectedPlayers.has(player.id);
                const getPositionColor = (pos: string) => {
                  switch(pos) {
                    case "Beginner": return "bg-blue-100 text-blue-700";
                    case "Intermediate": return "bg-yellow-100 text-yellow-700";
                    case "Advanced": return "bg-orange-100 text-orange-700";
                    case "Pro": return "bg-red-100 text-red-700";
                    default: return "bg-gray-100 text-gray-700";
                  }
                };

                return (
                  <AnimatedContent
                    key={player.id}
                    distance={50}
                    direction="vertical"
                    duration={0.6}
                    ease="power3.out"
                    initialOpacity={0}
                    animateOpacity
                    delay={idx * 0.05}
                  >
                    <div className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all overflow-hidden">
                      {/* Header with Avatar */}
                      <div className="bg-gradient-to-r from-[#0a56a7] to-blue-600 p-4 flex flex-col items-center pt-6">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-[#0a56a7] mb-2 shadow-lg">
                          {player.avatar}
                        </div>
                        <h3 className="font-bold text-white text-center">{player.name}</h3>
                        <p className="text-blue-100 text-xs text-center">{player.email}</p>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-3">
                        {/* Position Badge */}
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold text-center ${getPositionColor(player.position)}`}>
                          {player.position}
                        </div>

                        {/* Details */}
                        <div className="space-y-2 text-sm">
                          {/* Profession */}
                          <div className="flex items-start gap-2">
                            <Briefcase className="w-4 h-4 text-[#0a56a7] flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-600">Profession</p>
                              <p className="font-medium text-gray-900">{player.profession}</p>
                            </div>
                          </div>

                          {/* Ranking */}
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-gray-600">Ranking</p>
                              <p className="font-bold text-gray-900">#{player.ranking}</p>
                            </div>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-gray-600">Rating</p>
                              <p className="font-bold text-gray-900">{player.rating}</p>
                            </div>
                          </div>

                          {/* Play Frequency */}
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#a3ff01] flex-shrink-0" />
                            <div>
                              <p className="text-xs text-gray-600">Play Frequency</p>
                              <p className="font-medium text-gray-900">{player.playFrequency}</p>
                            </div>
                          </div>

                          {/* Wins */}
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-gray-600">Wins</p>
                              <p className="font-bold text-gray-900">{player.wins}</p>
                            </div>
                          </div>
                        </div>

                        {/* Court */}
                        {player.court && (
                          <div className="pt-2 border-t border-gray-200">
                            <p className="text-xs text-gray-600 mb-1">Plays at</p>
                            <p className="text-xs font-medium text-[#0a56a7]">{player.court}</p>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="px-4 pb-4">
                        <button
                          onClick={() => {
                            const newConnected = new Set(connectedPlayers);
                            if (isConnected) {
                              newConnected.delete(player.id);
                            } else {
                              newConnected.add(player.id);
                            }
                            setConnectedPlayers(newConnected);
                          }}
                          className={`w-full py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                            isConnected
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-[#0a56a7] text-white hover:bg-[#0a56a7]/90"
                          }`}
                        >
                          <UserPlus className="w-4 h-4" />
                          {isConnected ? "Connected" : "Connect"}
                        </button>
                      </div>
                    </div>
                  </AnimatedContent>
                );
              });
            }, [playerSearch, playerPositionFilter, playerSortBy, connectedPlayers])}
          </div>

          {/* No Results */}
          {useMemo(() => {
            const filtered = mockPlayers.filter((player) => {
              const matchesSearch = 
                player.name.toLowerCase().includes(playerSearch.toLowerCase()) ||
                player.email.toLowerCase().includes(playerSearch.toLowerCase()) ||
                player.profession.toLowerCase().includes(playerSearch.toLowerCase());
              const matchesPosition = 
                playerPositionFilter === "all" || player.position === playerPositionFilter;
              return matchesSearch && matchesPosition;
            });
            return filtered.length === 0;
          }, [playerSearch, playerPositionFilter]) && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No players found</p>
              <p className="text-sm text-gray-400">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
