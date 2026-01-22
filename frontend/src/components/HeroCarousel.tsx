"use client";

import { useState, useEffect } from "react";
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
const handleAnimationComplete = () => {
  console.log('All letters have animated!');
};

export default function HeroCarousel() {
  const [current, setCurrent] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <style jsx>{`
        @keyframes bounceInCircle {
          0%,
          100% {
            transform: translateY(0) scale(1.02, 0.98);
          }
          50% {
            transform: translateY(-18%) scale(0.96, 1.05);
          }
        }

        .ballBounce {
          animation: bounceInCircle 1.2s ease-in-out infinite;
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
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center justify-center gap-4">
                <SplitText
                  text="FIND A LOCAL COURT NEAR YOU"
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-7xl font-black mb-4 text-white drop-shadow-lg"
                  delay={50}
                  duration={1.25}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  tag="h1"
                  onLetterAnimationComplete={handleAnimationComplete}
                />
                
              </div>
              <div className="h-24 flex items-center justify-center">
                <SplitText
                  text="Connect with pickleball courts in your area and start playing today"
                  className="text-base sm:text-lg md:text-2xl text-white drop-shadow-lg max-w-2xl px-4"
                  delay={30}
                  duration={1.25}
                  ease="power3.out"
                  splitType="chars"
                  threshold={0}
                  rootMargin="-100px"
                  tag="p"
                />
                {/* <span className="ballBounce relative inline-flex w-20 h-20 md:w-32 md:h-32 items-center justify-center flex-shrink-0">
                  <Image
                    src="/images/Ball.png"
                    alt="Bouncing ball"
                    fill
                    className="object-contain"
                  />
                </span> */}
              </div>
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
