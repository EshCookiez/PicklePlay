"use client";

import { useEffect, useState } from "react";
import { Award, Users, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import Ball from "@/images/Ball.png";
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
    <section className="py-20 md:py-28 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
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
      `}</style>
      
      {/* Bouncing Balls Background */}
      {ballPositions.map((position, index) => (
        <div
          key={index}
          className="bouncing-ball"
          style={{
            width: `${position.size}px`,
            height: `${position.size}px`,
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

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Court Finder / Location Directory
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Discover pickleball courts near you and connect with your local community
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a56a7]"></div>
          </div>
        ) : courts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No courts available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courts.map((court) => (
              <div
                key={court.id}
                className="group bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl border border-slate-600 p-8 shadow-2xl hover:shadow-2xl hover:border-[#a3ff01] transition-all duration-300 h-full backdrop-blur-xl"
              >
                {/* Image Container */}
                <div className="relative h-40 md:h-48 bg-gray-200 overflow-hidden rounded-lg mb-6">
                  <img
                    alt={court.name}
                    src={getCourtImage(court)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                </div>

                {/* Content Container */}
                <div>
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#a3ff01] transition-colors duration-200">
                    {court.name}
                  </h3>

                  <div className="space-y-3 mb-6">
                    {/* Location */}
                    <div className="flex items-center gap-2 text-slate-300 group-hover:text-white transition-colors duration-200">
                      <MapPin className="w-4 h-4 text-[#a3ff01]" />
                      <span className="text-sm">
                        {court.address || `${court.city}, Philippines`}
                      </span>
                    </div>

                    {/* Distance */}
                    <div className="flex items-center gap-2 text-slate-300 group-hover:text-white transition-colors duration-200">
                      <Clock className="w-4 h-4 text-[#a3ff01]" />
                      <span className="text-sm">
                        {calculateDistance(court.latitude, court.longitude)} km away
                      </span>
                    </div>

                    {/* Courts and Rating */}
                    <div className="flex gap-4 pt-2">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#a3ff01]" />
                        <span className="text-sm font-semibold text-slate-200">
                          {court.number_of_courts} Court{court.number_of_courts !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#a3ff01]" />
                        <span className="text-sm font-semibold text-slate-200">
                          {court.rating.toFixed(1)} ⭐
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Button */}
                  <button className="w-full bg-gradient-to-r from-[#a3ff01] to-[#7fe100] text-slate-900 py-3 rounded-lg font-bold hover:from-white hover:to-[#a3ff01] hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Google Maps Button */}
        <div className="flex justify-center mt-12">
          <a
            href="https://www.google.com/maps"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-[#a3ff01] to-[#7fe100] text-slate-900 px-8 py-3 rounded-lg font-bold hover:from-white hover:to-[#a3ff01] hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-2 transform hover:scale-105"
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
