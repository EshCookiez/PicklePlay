"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SplitText from "../animate/SplitText";
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
  const [current, setCurrent] = useState(2);
  
  // Search functionality state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResult, setSearchResult] = useState('');
  
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
  
  // Filter places based on search query
  const filteredPlaces = philippinePlaces.filter(place =>
    place.toLowerCase().includes(searchQuery.toLowerCase())
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
      <style jsx>{`
        @keyframes bounceInCircle {
          0%,
          100% {
            transform: translateY(0) scale(1, 1);
          }
          25% {
            transform: translateY(-8px) scale(1.05, 0.95);
          }
          50% {
            transform: translateY(-25px) scale(0.95, 1.05);
          }
          75% {
            transform: translateY(-5px) scale(1.02, 0.98);
          }
        }

        @keyframes fadeInEntrance {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .ballBounce {
          animation: bounceInCircle 1s ease-in-out infinite;
        }

        .contentFadeIn {
          animation: fadeInEntrance 1.5s ease-out forwards;
        }
      `}</style>
      <section className="relative w-full h-lvh md:h-screen bg-gray-200 overflow-hidden">
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
            <div className="flex flex-col items-center justify-center text-center contentFadeIn">
              <div className="w-full max-w-7xl mb-8 mt-16 flex items-center justify-center mx-4 relative">
                <Image
                  src="/images/PickleplayPH.png"
                  alt="Pickleplay Philippines"
                  width={1800}
                  height={900}
                  className="w-full h-auto object-contain max-h-[300px] md:max-h-[450px]"
                  style={{ width: 'auto', height: 'auto', maxHeight: '450px' }}
                />
              </div>
              
              <div className="flex flex-col items-center justify-center mb-8">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-4 animate-in fade-in duration-700">
                  FIND A LOCAL COURT NEAR YOU
                </h2>
                <p className="text-base sm:text-lg md:text-2xl text-white drop-shadow-lg max-w-4xl px-4 mb-16 text-center animate-in fade-in duration-700 delay-200">
                  Connect with pickleball courts in your area and start playing
                </p>
                {/* <span className="ballBounce relative inline-flex w-20 h-20 md:w-32 md:h-32 items-center justify-center flex-shrink-0">
                  <Image
                    src="/images/Ball.png"
                    alt="Bouncing ball"
                    fill
                    className="object-contain"
                  />
                </span> */}
              </div>
              
              {/* Search Bar */}
              <div className="w-full max-w-2xl mb-6 absolute bottom-0 left-1/2 transform -translate-x-1/2 z-40">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for a place in the Philippines..."
                    className="w-full px-4 py-3 pr-12 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
                  <button
                    onClick={handleSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
                
                {/* Autocomplete Suggestions */}
                {showSuggestions && filteredPlaces.length > 0 && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredPlaces.map((place, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(place);
                          setShowSuggestions(false);
                          handleSearch();
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {place}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Results Section */}
              {searchResult && (
                <div className="w-full max-w-2xl mb-8 absolute bottom-20 left-1/2 transform -translate-x-1/2 z-40 animate-in fade-in duration-500">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6">
                    <div className="flex items-center mb-4">
                      <Image
                        src="/images/PinMarker.png"
                        alt="Location Pin"
                        width={24}
                        height={24}
                        className="mr-3"
                        style={{ width: 'auto', height: 'auto' }}
                      />
                      <h3 className="text-xl font-semibold text-gray-900">{searchResult}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Find pickleball courts and players in {searchResult}</p>
                    <button 
                      onClick={() => router.push('/findcourts')}
                      className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                      View Courts in {searchResult}
                    </button>
                  </div>
                </div>
              )}
              <div className="w-full max-w-2xl">
                {/* SEARCH SECTION */}
                {/* <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter a location"
                    className="flex-1 px-6 py-4 rounded-full bg-white text-black placeholder-gray-400 border-2 border-[#0a56a7] focus:outline-none focus:ring-2 focus:ring-[#0a56a7]"
                  />
                  <button className="px-8 py-4 bg-[#0a56a7] text-white rounded-full font-semibold hover:opacity-90 transition">
                    Search
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
