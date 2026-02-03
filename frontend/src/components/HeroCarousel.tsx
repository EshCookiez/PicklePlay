"use client";

import { useState, useEffect, useRef } from "react";
import { MotionFade } from "../animate/MotionFade";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import PinMarker from "@/images/PinMarker.png";
const slides = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner2-9udq6hGbqmfwbCgB0GZdznI0Og0YVD.png",
    alt: "Pickleball players at net",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner4-asoJBfEYYmJRVg9Y0AKkiOr0dA73GV.png",
    alt: "Players playing pickleball",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner5-SwAiVYRMsfUCqZMBq1uTm9yK0DsC3F.png",
    alt: "Pickleball on court",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner3-8TIlKFgqX304DRHWOmnB9ShvykMTdd.png",
    alt: "Yellow pickleball on blue court",
  },
];
export default function HeroCarousel() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [current, setCurrent] = useState(2);
  const heroRef = useRef<HTMLElement>(null);
  
  // Scroll to hero section
  const scrollToHero = () => {
    if (heroRef.current) {
      heroRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResult, setSearchResult] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyMessage, setNearbyMessage] = useState('');
  
  // Get user's geolocation on component mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setNearbyMessage('📍 Found your location - showing nearby courts');
        },
        (error) => {
          console.log('Geolocation error:', error);
          setNearbyMessage('📍 Enable location for courts near you');
        }
      );
    }
  }, []);
  
  
  // Philippine places data
  const philippinePlaces = [
    'Manila', 'Quezon City', 'Caloocan', 'Davao City', 'Cebu City',
    'Makati', 'Pasig', 'Taguig', 'Pasay', 'Mandaluyong',
    'Baguio', 'Angeles City', 'Bacolod', 'Iloilo City', 'Cagayan de Oro',
    'General Santos', 'San Pablo', 'Antipolo', 'Zamboanga City', 'Lapu-Lapu City',
    'Batangas City', 'Lipa City', 'Tuguegarao', 'Legazpi', 'Puerto Princesa',
    'Dagupan', 'Naga', 'Butuan', 'Tacloban', 'Ormoc',
    'Iligan', 'Malaybalay', 'Surigao City', 'Marawi', 'Cotabato City',
    'Laoag', 'Santiago', 'Tarlac City', 'San Fernando', 'Malolos',
    'Meycauayan', 'San Jose del Monte', 'Baliuag', 'San Miguel', 'Gapan',
    'Cabuyao', 'Santa Rosa', 'Biñan', 'San Pedro', 'Calamba',
    'Lipa', 'Batangas', 'Legaspi', 'Iriga', 'Naga',
    'Dumaguete', 'Bais', 'Tanjay', 'Bayawan', 'Canlaon',
    'Roxas City', 'Passi', 'Pototan', 'Iloilo', 'Bacolod',
    'Bago', 'Cadiz', 'Escalante', 'Himamaylan', 'Kabankalan',
    'Sagay', 'San Carlos', 'Silay', 'Sipalay', 'Talisay',
    'Victorias', 'Baybay', 'Bogo', 'Carcar', 'Catbalogan',
    'Cebu', 'Danao', 'Dapitan', 'Digos', 'Dipolog',
    'El Salvador', 'Gingoog', 'Guihulngan', 'Hinigaran', 'Iligan',
    'Ilog', 'Isabela', 'Kabankalan', 'Kidapawan', 'Koronadal',
    'Laoag', 'Lapu-Lapu', 'Ligao', 'Lingayen', 'Maasin',
    'Mabalacat', 'Malaybalay', 'Malolos', 'Mandaue', 'Mangaldan',
    'Marawi', 'Marilao', 'Masbate City', 'Mati', 'Meycauayan',
    'Midsayap', 'Minglanilla', 'Muntinlupa', 'Naga', 'Navotas',
    'Olongapo', 'Ormoc', 'Oroquieta', 'Ozamiz', 'Pagadian',
    'Palayan', 'Panabo', 'Parañaque', 'Pasay', 'Pasig',
    'Puerto Princesa', 'Quezon City', 'Roxas City', 'San Carlos',
    'San Fernando', 'San Jose', 'San Juan', 'San Pablo',
    'San Pedro', 'Silay', 'Sorsogon City', 'Surigao', 'Tacloban',
    'Tagaytay', 'Taguig', 'Tagum', 'Talisay', 'Tanauan',
    'Tandag', 'Tangub', 'Tarlac City', 'Taytay', 'Tuguegarao',
    'Urdaneta', 'Valencia', 'Victorias', 'Vigan', 'Zamboanga City'
  ];

  // Sample courts data
  const sampleCourts = [
    { name: 'KAI Multipurpose Hall', distance: '1.0 miles away', location: 'Mandaluyong, NCR' },
    { name: 'Flair Pickleball Club', distance: '1.1 miles away', location: 'Mandaluyong, NCR' },
    { name: 'Rockwell Club, Amorsolo Square', distance: '1.2 miles away', location: 'Makati City, NCR' },
    { name: 'Greenhills West Clubhouse', distance: '1.2 miles away', location: 'San Juan, NCR' },
    { name: 'Street Pickleball Ortigas', distance: '1.7 miles away', location: 'Pasig City, NCR' },
  ];
  
  // Filter places based on search query
  const filteredPlaces = philippinePlaces.filter(place =>
    place.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter courts based on search query
  const filteredCourts = sampleCourts.filter(court =>
    court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    court.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchResult(searchQuery);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

  return (
    <>
      <style jsx>{``}</style>
      
      {showSuggestions && (filteredPlaces.length > 0 || filteredCourts.length > 0) && (
        <div></div>
      )}

      <section className="relative w-full h-lvh md:h-screen bg-gray-200" ref={heroRef}>
        {/* Video Background */}
        <video
          src="/images/home-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 pointer-events-none z-10"></div>

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center z-30 px-4">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex flex-col items-center justify-center text-center">
              <MotionFade delay={0.1} y={-40}>
                <div className="w-full max-w-7xl mb-8 mt-8 flex items-center justify-center mx-4 relative cursor-pointer" onClick={scrollToHero}>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-0 mb-0">
                      <h1 className="text-8xl md:text-[120px] font-black text-white mb-0 drop-shadow-lg leading-none" style={{ fontSize: 'clamp(80px, 20vw, 200px)' }}>
                        P
                      </h1>
                      <Image src={PinMarker} alt="Pin Marker" className="w-32 h-32 md:w-52 md:h-52 object-contain -mx-1 md:-mx-2" style={{ marginBottom: 'clamp(80px, 20vw, 200px) * 0.15', filter: 'drop-shadow(0 0 20px #a3ff01)' }} />
                      <h1 className="text-8xl md:text-[120px] font-black text-white mb-0 drop-shadow-lg leading-none" style={{ fontSize: 'clamp(80px, 20vw, 200px)' }}>
                        CKLEPLAY
                      </h1>
                    </div>
                    <h2 className="text-4xl md:text-[60px] font-bold text-[#a3ff01] drop-shadow-lg" style={{ fontSize: 'clamp(35px, 8vw, 90px)', letterSpacing: '0.35em' }}>
                      PHILIPPINES
                    </h2>
                  </div>
                </div>
              </MotionFade>

              <MotionFade delay={0.2} y={-20}>
                <div className="flex flex-col items-center justify-center mb-8">
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-4">
                    FIND A LOCAL COURT NEAR YOU
                  </h2>
                  <p className="text-base sm:text-lg md:text-2xl text-white drop-shadow-lg max-w-4xl px-4 mb-6 text-center">
                    Connect with pickleball courts in your area and start playing
                  </p>
                </div>
              </MotionFade>

              {/* Search Bar */}
              <MotionFade delay={0.3} y={-10} className="w-full px-4">
                <div className="w-full max-w-4xl mx-auto mb-6">
                  <div className="relative z-40">
                    <input
                      type="text"
                      placeholder="Search for courts or places in the Philippines..."
                      className="w-full px-5 py-4 pl-14 pr-14 text-gray-900 bg-white border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg md:text-xl"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    />
                    {/* Location Button */}
                    <button
                      onClick={() => {
                        if (userLocation) {
                          router.push(`/findcourts?lat=${userLocation.lat}&lng=${userLocation.lng}&near=true`);
                        } else {
                          alert('Please enable location access to find courts near you');
                        }
                      }}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-gray-100 text-blue-500 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Find courts near you"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5z" />
                      </svg>
                    </button>
                    {/* Search Button */}
                    <button
                      onClick={handleSearch}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>

                    {/* Autocomplete Dropdown */}
                    {showSuggestions && (filteredPlaces.length > 0 || filteredCourts.length > 0) && (
                      <div className="absolute z-[1000] w-full bg-white border border-gray-200 rounded-lg shadow-2xl max-h-96 overflow-y-auto top-full mt-2">
                        {/* PLACES Section */}
                        {filteredPlaces.length > 0 && (
                          <div>
                            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 sticky top-0">
                              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Places</p>
                            </div>
                            {filteredPlaces.slice(0, 3).map((place, index) => (
                              <button
                                key={`place-${index}`}
                                onClick={() => {
                                  setSearchQuery(place);
                                  setSearchResult(place);
                                  router.push(`/findcourts?location=${place}`);
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-100 transition-colors"
                              >
                                <div className="flex items-center justify-between text-gray-900">
                                  <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="font-medium">{place}, Philippines</span>
                                  </div>
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">View Courts</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* COURTS Section */}
                        {filteredCourts.length > 0 && (
                          <div>
                            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 sticky top-12">
                              <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Courts Near You</p>
                            </div>
                            {filteredCourts.slice(0, 5).map((court, index) => (
                              <button
                                key={`court-${index}`}
                                onClick={() => {
                                  setSearchQuery(court.name);
                                  setShowSuggestions(false);
                                  router.push(`/findcourts?court=${court.name}`);
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-green-50 border-b border-gray-100 transition-colors"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start flex-1">
                                    <svg className="w-5 h-5 mr-3 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5z" />
                                    </svg>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-semibold text-gray-900">{court.name}</p>
                                      <p className="text-sm text-gray-500 mt-1">
                                        <span>{court.distance}</span>
                                        <span className="mx-2">•</span>
                                        <span>{court.location}</span>
                                      </p>
                                    </div>
                                  </div>
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded ml-2 flex-shrink-0">Open</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </MotionFade>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
