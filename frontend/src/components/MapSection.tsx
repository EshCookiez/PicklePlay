"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { MapPin, Navigation } from "lucide-react";
import type { Court } from "./MapView";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <div className="h-[420px] w-full bg-blue-50 animate-pulse" />,
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

export default function MapSection() {
  const [center, setCenter] = useState<[number, number]>([14.5995, 120.9842]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = parseInt(entry.target.getAttribute('data-card-index') || '0');
            setTimeout(() => {
              setVisibleCards((prev) => new Set(prev).add(cardIndex));
            }, cardIndex * 100); // Stagger animations by 100ms
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = cardsRef.current?.querySelectorAll('[data-card-index]');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

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
    <>
      <style jsx>{`
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

        @keyframes cardPopup {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .contentFadeIn {
          animation: fadeInEntrance 1.5s ease-out forwards;
        }

        .cardPopup {
          animation: cardPopup 0.6s ease-out forwards;
        }

        .cardHidden {
          opacity: 0;
          transform: translateY(20px) scale(0.95);
        }
      `}</style>
      <section className="py-16 bg-white/70 contentFadeIn" id="map">
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
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Featured Courts</h3>
              <span className="text-sm text-[#0a56a7] bg-[#0a56a7]/10 px-3 py-1 rounded-full">
                {courts.length} Courts
              </span>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto" ref={cardsRef}>
              {courts.map((court, index) => (
                <button
                  key={court.id}
                  data-card-index={index}
                  type="button"
                  onClick={() => setCenter([court.lat, court.lng])}
                  className={`w-full text-left p-4 rounded-2xl border border-gray-100 hover:border-[#0a56a7]/40 hover:bg-blue-50/50 transition-all duration-200 group ${
                    visibleCards.has(index) ? 'cardPopup' : 'cardHidden'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0a56a7] to-[#0a56a7]/80 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <img src="/images/PinMarker.png" alt="Pickleball" className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 group-hover:text-[#0a56a7] transition-colors">
                        {court.name}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{court.address}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-[#0a56a7] font-semibold">{court.city}</p>
                        <span className="text-xs text-gray-500">Tap to view →</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
