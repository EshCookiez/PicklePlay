"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import appstoreLogo from "@/images/appstore.png";
import googleplayLogo from "@/images/googleapp.png";
import MobileAd from "@/images/MobileAd.png";
import Ball from "@/images/Ball.png";

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

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
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

        .ball {
          animation: bounce 3s infinite ease-in-out;
        }

        .ball-1 { animation-delay: 0s; }
        .ball-2 { animation-delay: 0.2s; }
        .ball-3 { animation-delay: 0.4s; }
        .ball-4 { animation-delay: 0.6s; }
        .ball-5 { animation-delay: 0.8s; }
        .ball-6 { animation-delay: 1s; }
        .ball-7 { animation-delay: 1.2s; }
        .ball-8 { animation-delay: 1.4s; }
      `}</style>
      <section 
        ref={sectionRef}
        className="relative bg-gradient-to-br from-[#1157a7] to-[#1157a7] overflow-hidden m-0 py-16 sm:py-20 md:py-28 lg:py-32"
      >
        {/* Scattered Ball Animations - Background (hidden on mobile) */}
        <Image src={Ball} alt="Ball" className="hidden sm:block absolute top-10 left-8 w-12 h-12 md:w-16 md:h-16 ball ball-1 opacity-60" />
        <Image src={Ball} alt="Ball" className="hidden sm:block absolute top-32 right-24 w-10 h-10 md:w-12 md:h-12 ball ball-2 opacity-50" />
        <Image src={Ball} alt="Ball" className="hidden md:block absolute top-48 left-1/3 w-14 h-14 ball ball-3 opacity-55" />
        <Image src={Ball} alt="Ball" className="hidden md:block absolute top-64 right-1/4 w-10 h-10 ball ball-4 opacity-45" />
        <Image src={Ball} alt="Ball" className="hidden sm:block absolute bottom-40 left-20 w-10 h-10 md:w-12 md:h-12 ball ball-5 opacity-50" />
        <Image src={Ball} alt="Ball" className="hidden md:block absolute bottom-32 right-32 w-16 h-16 ball ball-6 opacity-60" />
        <Image src={Ball} alt="Ball" className="hidden lg:block absolute top-1/2 left-12 w-10 h-10 ball ball-7 opacity-45" />
        <Image src={Ball} alt="Ball" className="hidden lg:block absolute bottom-20 left-1/2 w-14 h-14 ball ball-8 opacity-55" />
        {/* Additional Balls (hidden on smaller screens) */}
        <Image src={Ball} alt="Ball" className="hidden lg:block absolute top-1/4 right-10 w-20 h-20 ball ball-1 opacity-40" />
        <Image src={Ball} alt="Ball" className="hidden md:block absolute top-3/4 left-1/4 w-16 h-16 ball ball-2 opacity-50" />
        <Image src={Ball} alt="Ball" className="hidden lg:block absolute top-2/3 right-40 w-12 h-12 ball ball-3 opacity-45" />
        <Image src={Ball} alt="Ball" className="hidden lg:block absolute bottom-1/2 right-1/3 w-14 h-14 ball ball-4 opacity-55" />
        <Image src={Ball} alt="Ball" className="hidden md:block absolute top-1/3 left-1/2 w-10 h-10 ball ball-5 opacity-40" />
        <Image src={Ball} alt="Ball" className="hidden md:block absolute bottom-1/4 left-1/3 w-16 h-16 ball ball-6 opacity-50" />

        {/* Mobile Ad - Always at the very bottom, behind the gradient (z-0) */}
        <div className={`absolute bottom-0 left-0 right-0 flex justify-center lg:justify-end lg:right-8 xl:right-16 2xl:right-24 z-0 ${
          isVisible ? 'slideInRight' : ''
        }`}>
          <div className="relative w-[280px] sm:w-[360px] md:w-[440px] lg:w-[500px] xl:w-[560px] 2xl:w-[640px]">
            <Image
              src={MobileAd}
              alt="PicklePlay Mobile App"
              sizes="(max-width: 640px) 280px, (max-width: 768px) 360px, (max-width: 1024px) 440px, (max-width: 1280px) 500px, (max-width: 1536px) 560px, 640px"
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>
        
        {/* Gradient border at bottom - on top of the phone image (z-10) */}
        <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 md:h-20 lg:h-24 bg-gradient-to-t from-[#a3ff01]/60 via-[#84cc16]/40 to-transparent z-10 pointer-events-none"></div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 md:pt-12 lg:pt-16 pb-[240px] sm:pb-[320px] md:pb-[380px] lg:pb-16">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 sm:gap-8 lg:gap-16 m-0 p-0">
            {/* Left Side - Download Content */}
            <div className="flex-1 text-center lg:text-left m-0 p-0 lg:max-w-[55%]">
              <div className={`space-y-4 sm:space-y-5 md:space-y-6 ${isVisible ? 'fadeInUp' : ''} m-0 p-0`}>
                <div className="space-y-2 m-0 p-0">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white m-0 p-0">
                    Download Our App
                  </h2>
                </div>
                
                <div className="space-y-3 sm:space-y-4 max-w-2xl mx-auto lg:mx-0 m-0 p-0">
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 leading-relaxed m-0 px-2 sm:px-0">
                    <span className="font-bold text-white">PICKLEPLAY</span> — Your New Pickleball Playground. 
                    Get ready to serve, volley, and smash your way to victory across the Philippines' most exciting 
                    and thriving pickleball courts nationwide.
                  </p>
                  <p className="text-xs sm:text-sm text-white/70 italic m-0">
                    Mobile app coming soon! Stay tuned for nationwide availability.
                  </p>
                </div>

                <div className="flex flex-row gap-2 sm:gap-4 justify-center lg:justify-start m-0 p-0 mt-4 sm:mt-6">
                  <a 
                    href="https://apps.apple.com/app/pickleplay-court-finder/id1234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 bg-transparent rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 m-0 touch-target ${
                      isVisible ? 'delay-100 fadeInUp' : ''
                    }`}
                  >
                    <Image
                      src={appstoreLogo}
                      alt="App Store"
                      className="h-10 sm:h-11 md:h-12 w-auto object-contain"
                    />
                  </a>
                  
                  <a 
                    href="https://play.google.com/store/apps/details?id=com.pickleplay.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 bg-transparent rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 m-0 touch-target ${
                      isVisible ? 'delay-200 fadeInUp' : ''
                    }`}
                  >
                    <Image
                      src={googleplayLogo}
                      alt="Google Play"
                      className="h-10 sm:h-11 md:h-12 w-auto object-contain"
                    />
                  </a>
                </div>

                <div className="mt-2 sm:mt-4 m-0 p-0">
                  <p className="text-xs text-white/70 m-0">
                    Compatible to iOS and Android
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}