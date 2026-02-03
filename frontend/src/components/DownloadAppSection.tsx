"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import appstoreLogo from "@/images/appstore.png";
import googleplayLogo from "@/images/googleapp.png";

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
        className="relative bg-gradient-to-br from-[#1157a7] to-[#1157a7] overflow-hidden m-0 py-32 md:py-40"
      >
        {/* Gradient border at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#a3ff01]/50 via-[#84cc16]/30 to-transparent z-20"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto p-0">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 m-0 p-0">
            {/* Left Side - Download Content */}
            <div className="flex-1 text-center lg:text-left m-0 p-0">
              <div className={`space-y-6 ${isVisible ? 'fadeInUp' : ''} m-0 p-0`}>
                <div className="space-y-2 m-0 p-0">
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white m-0 p-0">
                    Download Our App
                  </h2>
                </div>
                
                <div className="space-y-4 max-w-2xl m-0 p-0">
                  <p className="text-xl sm:text-2xl text-white/80 leading-relaxed m-0">
                    <span className="font-bold text-white">PICKLEPLAY</span> — Your New Pickleball Playground. 
                    Get ready to serve, volley, and smash your way to victory across the Philippines' most exciting 
                    and thriving pickleball courts nationwide.
                  </p>
                  <p className="text-sm text-white/70 italic m-0">
                    Mobile app coming soon! Stay tuned for nationwide availability.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start m-0 p-0 mt-6">
                  <a 
                    href="https://apps.apple.com/app/pickleplay-court-finder/id1234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-3 px-6 py-4 bg-transparent rounded-xl transition-all duration-300 hover:scale-105 m-0 ${
                      isVisible ? 'delay-100 fadeInUp' : ''
                    }`}
                  >
                    <Image
                      src={appstoreLogo}
                      alt="App Store"
                      className="h-12 w-auto object-contain"
                    />
                  </a>
                  
                  <a 
                    href="https://play.google.com/store/apps/details?id=com.pickleplay.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-3 px-6 py-4 bg-transparent rounded-xl transition-all duration-300 hover:scale-105 m-0 ${
                      isVisible ? 'delay-200 fadeInUp' : ''
                    }`}
                  >
                    <Image
                      src={googleplayLogo}
                      alt="Google Play"
                      className="h-12 w-auto object-contain"
                    />
                  </a>
                </div>

                <div className="mt-4 m-0 p-0">
                  <p className="text-xs text-white/70 m-0">
                    Compatible with iOS 13+ and Android 8+
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Mobile Ad - STRETCHED WIDTH */}
            <div className={`flex-1 flex justify-center lg:justify-end m-0 p-0 ${
              isVisible ? 'slideInRight' : ''
            }`}>
              <div className="relative w-full max-w-3xl m-0 p-0">
                <div className="relative w-full h-auto m-0 p-0 pb-0 mb-0">
                  <Image
                    src="/images/MobileAd.png"
                    alt="PicklePlay Mobile App"
                    width={1200}
                    height={1600}
                    sizes="(max-width: 640px) 95vw, (max-width: 1024px) 80vw, 80vw"
                    className="w-full h-auto m-0 p-0 mb-0 object-contain"
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