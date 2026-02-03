"use client";

import { useEffect, useState } from "react";
import { MotionFade } from "../animate/MotionFade";
import { Award, Users, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import Ball from "@/images/Ball.png";
import PinMarker from "@/images/PinMarker.png";
import { createClient } from "@/lib/supabase/client";

interface Court {
  id: number;
  name: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  number_of_courts: number;
  rating: number;
  total_reviews: number;
  cover_image: string;
  images: string[];
}

export default function CourtGridSection() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const { data, error } = await supabase
          .from("courts")
          .select("*")
          .eq("status", "approved")
          .eq("is_active", true)
          .limit(3)
          .order("rating", { ascending: false });

        if (error) throw error;

        setCourts(data || []);
      } catch (error) {
        console.error("Error fetching courts:", error);
        setCourts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, []);

  const getCourtImage = (court: Court) => {
    // Use cover_image if available, otherwise use first image from images array
    if (court.cover_image) return court.cover_image;
    if (court.images && court.images.length > 0) return court.images[0];
    return "https://via.placeholder.com/400x300?text=" + encodeURIComponent(court.name);
  };

  const calculateDistance = (lat: number, lng: number) => {
    // Placeholder distance calculation - in real app would use user's location
    return (Math.random() * 8 + 1).toFixed(1);
  };

  // Ball positions and animation delays for bouncing effect
  const ballPositions = [
    { left: "5%", bottom: "5%", size: 120, delay: "0s" },
    { right: "3%", bottom: "15%", size: 160, delay: "0.3s" },
    { left: "50%", bottom: "8%", size: 100, delay: "0.5s" },
    { left: "15%", bottom: "60%", size: 150, delay: "0.7s" },
    { right: "25%", bottom: "50%", size: 140, delay: "0.2s" },
    { left: "70%", bottom: "70%", size: 130, delay: "0.6s" },
    { right: "12%", bottom: "80%", size: 120, delay: "0.4s" },
    { left: "40%", bottom: "85%", size: 150, delay: "0.8s" },
    { left: "75%", bottom: "25%", size: 40, delay: "0.1s" },
    { right: "40%", bottom: "35%", size: 35, delay: "0.4s" },
    { left: "20%", bottom: "45%", size: 45, delay: "0.2s" },
    { right: "8%", bottom: "65%", size: 38, delay: "0.5s" },
    { left: "82%", bottom: "12%", size: 42, delay: "0.3s" },
    { right: "55%", bottom: "75%", size: 40, delay: "0.7s" },
    { left: "28%", bottom: "20%", size: 36, delay: "0.6s" },
    { right: "60%", bottom: "40%", size: 44, delay: "0.1s" },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }
        .bouncing-ball {
          animation: bounce 3s infinite;
          position: absolute;
          border-radius: 50%;
          opacity: 0.7;
          pointer-events: none;
        }
        @media (max-width: 768px) {
          .bouncing-ball {
            opacity: 0.4;
          }
        }
      `}</style>
      
      {/* Bouncing Balls Background - fewer on mobile */}
      {ballPositions.slice(0, typeof window !== 'undefined' && window.innerWidth < 768 ? 6 : ballPositions.length).map((position, index) => (
        <div
          key={index}
          className="bouncing-ball hidden sm:block"
          style={{
            width: `${position.size * 0.7}px`,
            height: `${position.size * 0.7}px`,
            left: position.left,
            right: position.right,
            bottom: position.bottom,
            animationDelay: position.delay,
            zIndex: 0,
            position: 'absolute',
            backgroundImage: `url(${Ball.src})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-3 sm:px-4 relative z-10">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-black mb-2 sm:mb-4 text-white drop-shadow-2xl uppercase" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.8)', letterSpacing: '0.08em' }}>
            COURT NEAR YOU
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto px-4">
            Discover pickleball courts near you and connect with your local community
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#0a56a7]"></div>
          </div>
        ) : courts.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-600 text-base sm:text-lg">No courts available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {courts.map((court, idx) => (
              <MotionFade key={court.id} delay={0.1 * idx} y={40}>
                <div
                  className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-2xl hover:border-[#a3ff01] active:scale-[0.98] transition-all duration-300 h-full"
                >
                  {/* Image Container */}
                  <div className="relative h-36 sm:h-40 md:h-48 bg-gray-200 overflow-hidden rounded-lg mb-4 sm:mb-6">
                    <img
                      alt={court.name}
                      src={getCourtImage(court)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                  </div>

                  {/* Content Container */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-slate-900 group-hover:text-[#a3ff01] transition-colors duration-200 line-clamp-1">
                      {court.name}
                    </h3>

                    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                      {/* Location */}
                      <div className="flex items-center gap-2 text-slate-600 group-hover:text-slate-900 transition-colors duration-200">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#a3ff01] flex-shrink-0" />
                        <span className="text-xs sm:text-sm line-clamp-1">
                          {court.address || `${court.city}, Philippines`}
                        </span>
                      </div>

                      {/* Distance */}
                      <div className="flex items-center gap-2 text-slate-600 group-hover:text-slate-900 transition-colors duration-200">
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#a3ff01] flex-shrink-0" />
                        <span className="text-xs sm:text-sm">
                          {calculateDistance(court.latitude, court.longitude)} km away
                        </span>
                      </div>

                      {/* Courts and Rating */}
                      <div className="flex gap-3 sm:gap-4 pt-1 sm:pt-2">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#a3ff01]" />
                          <span className="text-xs sm:text-sm font-semibold text-slate-700">
                            {court.number_of_courts} Court{court.number_of_courts !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#a3ff01]" />
                          <span className="text-xs sm:text-sm font-semibold text-slate-700">
                            {court.rating.toFixed(1)} ⭐
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Button */}
                    <button className="w-full bg-gradient-to-r from-[#a3ff01] to-[#7fe100] text-slate-900 py-2.5 sm:py-3 rounded-lg font-bold hover:from-white hover:to-[#a3ff01] hover:shadow-2xl active:scale-95 transition-all duration-300 text-sm sm:text-base touch-target">
                      View Details
                    </button>
                  </div>
                </div>
              </MotionFade>
            ))}
          </div>
        )}

        {/* Google Maps Button */}
        <div className="flex justify-center mt-8 sm:mt-10 md:mt-12">
          <a
            href="https://www.google.com/maps"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-[#a3ff01] to-[#7fe100] text-slate-900 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-bold hover:from-white hover:to-[#a3ff01] hover:shadow-2xl active:scale-95 transition-all duration-300 inline-flex items-center gap-2 text-sm sm:text-base touch-target"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-map"
            >
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
              <line x1="9" y1="3" x2="9" y2="18"></line>
              <line x1="15" y1="6" x2="15" y2="21"></line>
            </svg>
            Use Google Maps
          </a>
        </div>
      </div>
    </section>
  );
}
