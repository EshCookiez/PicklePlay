"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Download, Apple, PlayCircle } from "lucide-react";

export default function DownloadAppSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translateX(60px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .fadeInUp {
          animation: fadeInUp 1s ease-out forwards;
        }

        .slideInRight {
          animation: slideInRight 1s ease-out 0.3s forwards;
          opacity: 0;
        }

        .delay-100 {
          animation-delay: 0.1s;
          opacity: 0;
        }

        .delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
        }
      `}</style>
      <section 
        ref={sectionRef}
        className="relative bg-gradient-to-br from-[#1157a7] to-[#1157a7] overflow-hidden m-0 p-0"
      >
        {/* Gradient border at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#a3ff01]/50 via-[#84cc16]/30 to-transparent z-20"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto p-0">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 m-0 p-0">
            {/* Left Side - Download Content */}
            <div className="flex-1 text-center lg:text-left m-0 p-0">
              <div className={`space-y-6 ${isVisible ? 'fadeInUp' : ''} m-0 p-0`}>
                <div className="space-y-2 m-0 p-0">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white m-0 p-0">
                    Download Our App
                  </h2>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white/90 m-0 p-0">
                    Experience PicklePlay in Action
                  </h3>
                </div>
                
                <div className="space-y-4 max-w-2xl m-0 p-0">
                  <p className="text-lg text-white/80 leading-relaxed m-0">
                    <span className="font-bold text-white">PICKLEPLAY</span> — Your New Pickleball Playground. 
                    Get ready to serve, volley, and smash your way to victory at the heart of Cebu's newest 
                    and most thrilling pickleball destination.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start m-0 p-0">
                  <a 
                    href="https://apps.apple.com/app/pickleplay-court-finder/id1234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-3 px-6 py-4 bg-black text-white rounded-xl hover:bg-gray-900 transition-all duration-300 hover:scale-105 shadow-lg m-0 ${
                      isVisible ? 'delay-100 fadeInUp' : ''
                    }`}
                  >
                    <Apple className="w-6 h-6" />
                    <div className="text-left">
                      <div className="text-xs opacity-80">Download on the</div>
                      <div className="text-sm font-semibold">App Store</div>
                    </div>
                  </a>
                  
                  <a 
                    href="https://play.google.com/store/apps/details?id=com.pickleplay.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-3 px-6 py-4 bg-black text-white rounded-xl hover:bg-gray-900 transition-all duration-300 hover:scale-105 shadow-lg m-0 ${
                      isVisible ? 'delay-200 fadeInUp' : ''
                    }`}
                  >
                    <PlayCircle className="w-6 h-6" />
                    <div className="text-left">
                      <div className="text-xs opacity-80">Get it on</div>
                      <div className="text-sm font-semibold">Google Play</div>
                    </div>
                  </a>
                </div>

                <div className={`flex items-center justify-center lg:justify-start gap-6 m-0 p-0 ${
                  isVisible ? 'delay-300 fadeInUp' : ''
                }`}>
                  <div className="flex items-center gap-2 m-0 p-0">
                    <Download className="w-5 h-5 text-white/80" />
                    <span className="text-white/80 text-sm">Free Download</span>
                  </div>
                  <div className="flex items-center gap-2 m-0 p-0">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white/80 text-sm">Available Now</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Mobile Ad - STRETCHED WIDTH */}
            <div className={`flex-1 flex justify-center lg:justify-end m-0 p-0 ${
              isVisible ? 'slideInRight' : ''
            }`}>
              <div className="relative w-full max-w-2xl m-0 p-0">
                <div className="relative w-full h-auto m-0 p-0">
                  <Image
                    src="/images/MobileAd.png"
                    alt="PicklePlay Mobile App"
                    width={1200}
                    height={1600}
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 60vw, 50vw"
                    className="w-full h-auto m-0 p-0 object-contain"
                    style={{ width: 'auto', height: 'auto' }}
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}