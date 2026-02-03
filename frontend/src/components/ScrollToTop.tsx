"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import Image from "next/image";
import Ball from "@/images/Ball.png";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    setIsAnimating(true);
    
    // Wait for animation to play before scrolling
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, 300);

    // Reset animation state after it completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
  };

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Fire Ball Animation */}
      {isAnimating && (
        <div className="fixed bottom-6 right-6 z-[60] pointer-events-none">
          <div className="relative animate-rocket-up">
            {/* Fire Trail */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-8 h-16">
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-orange-500 to-yellow-400 rounded-full blur-md animate-pulse opacity-90"></div>
              <div className="absolute inset-1 bg-gradient-to-t from-transparent via-red-500 to-orange-400 rounded-full blur-sm animate-pulse"></div>
              <div className="absolute inset-2 bg-gradient-to-t from-transparent via-yellow-300 to-white rounded-full blur-xs"></div>
            </div>
            {/* Ball */}
            <Image
              src={Ball}
              alt="Ball"
              width={48}
              height={48}
              className="relative z-10 drop-shadow-[0_0_15px_rgba(255,165,0,0.8)]"
            />
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes rocket-up {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(-200px) scale(1.1);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) scale(0.8);
            opacity: 0;
          }
        }
        .animate-rocket-up {
          animation: rocket-up 1.2s ease-in forwards;
        }
      `}</style>

      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={scrollToTop}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative p-3 bg-[#0a56a7] text-white rounded-full shadow-lg hover:bg-[#a3ff01] hover:text-[#0a56a7] transition-all duration-300 ease-in-out transform hover:scale-110"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6" />
          
          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-md whitespace-nowrap">
              Back to top
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
            </div>
          )}
        </button>
      </div>
    </>
  );
}
