"use client";

import Image from "next/image";
import { Sparkles, Bell, ArrowRight, Trophy } from "lucide-react";

export default function TournamentsPage() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-gradient-to-br from-[#f8fafc] via-white to-[#f0fdf4] fixed top-0 left-0 flex items-center justify-center">
      {/* Decorative Elements - Lime Green Accents */}
      <div className="absolute top-0 left-0 w-48 sm:w-72 h-48 sm:h-72 bg-[#a3e635] opacity-20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-[#a3e635] opacity-15 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/4 w-32 sm:w-48 h-32 sm:h-48 bg-[#84cc16] opacity-10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-1/4 left-1/3 w-24 sm:w-32 h-24 sm:h-32 bg-[#FDE047] opacity-15 rounded-full blur-2xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-40 sm:w-56 h-40 sm:h-56 bg-[#a3e635] opacity-10 rounded-full blur-3xl"></div>
      
      {/* Floating Sparkles - Left Side */}
      <div className="absolute top-1/4 left-1/4 animate-pulse">
        <Sparkles className="w-6 h-6 text-[#a3e635]" />
      </div>
      <div className="absolute bottom-1/3 left-1/3 animate-pulse delay-300">
        <Sparkles className="w-4 h-4 text-[#84cc16]" />
      </div>
      <div className="absolute top-1/2 left-1/5 animate-pulse delay-500">
        <Sparkles className="w-5 h-5 text-[#a3e635] opacity-70" />
      </div>
      <div className="absolute bottom-1/4 left-1/2 animate-pulse delay-700">
        <Sparkles className="w-4 h-4 text-[#FDE047]" />
      </div>

      {/* Ball Background Pattern - Random Distribution */}
      <div className="absolute top-12 right-20 opacity-15 pointer-events-none">
        <Image src="/images/Ball.png" alt="Ball" width={80} height={80} className="object-contain" />
      </div>
      <div className="absolute top-1/3 right-1/4 opacity-10 pointer-events-none transform rotate-45">
        <Image src="/images/Ball.png" alt="Ball" width={120} height={120} className="object-contain" />
      </div>
      <div className="absolute bottom-20 left-1/3 opacity-12 pointer-events-none">
        <Image src="/images/Ball.png" alt="Ball" width={100} height={100} className="object-contain" />
      </div>
      <div className="absolute top-2/3 right-10 opacity-8 pointer-events-none transform -rotate-12">
        <Image src="/images/Ball.png" alt="Ball" width={60} height={60} className="object-contain" />
      </div>
      <div className="absolute bottom-1/3 right-1/3 opacity-14 pointer-events-none">
        <Image src="/images/Ball.png" alt="Ball" width={90} height={90} className="object-contain" />
      </div>

      {/* Main Container - 2 Columns */}
      <div className="relative z-10 w-full h-full flex items-center justify-center animate-in fade-in duration-1000">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 max-w-7xl px-6">
          {/* Left Column - Decorative/Visual Content */}
          <div className="hidden lg:flex items-center justify-center relative flex-shrink-0">
            {/* Large Logo Display */}
            <div className="relative">
              <div className="absolute inset-0 bg-[#a3e635] rounded-full blur-3xl opacity-30 scale-150"></div>
              <div className="relative w-96 h-96 rounded-full p-8 border-2 border-[#a3e635]/30 flex items-center justify-center">
                <Image
                  src="/images/PicklePlayLogo.jpg"
                  alt="PicklePlay Logo"
                  width={360}
                  height={360}
                  className="relative z-10 object-contain"
                />
              </div>
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full border-2 border-[#a3e635]/20 scale-125"></div>
              <div className="absolute inset-0 rounded-full border border-[#a3e635]/10 scale-150"></div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="w-full lg:w-auto flex flex-col items-center justify-center text-center lg:text-left">
            {/* Logo for Mobile */}
            <div className="mb-8 relative lg:hidden">
              <div className="absolute inset-0 bg-[#a3e635] rounded-3xl blur-2xl opacity-30 scale-125"></div>
              <div className="relative rounded-2xl sm:rounded-3xl p-3 sm:p-4 border-2 border-[#a3e635]/30">
                <Image
                  src="/images/PicklePlayLogo.jpg"
                  alt="PicklePlay Logo"
                  width={120}
                  height={120}
                  className="relative z-10 sm:w-[150px] sm:h-[150px] object-contain"
                />
              </div>
            </div>

            {/* Page Icon */}
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-[#a3e635]/20 rounded-2xl inline-flex">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-[#65a30d]" />
            </div>

            {/* Brand */}
            <div className="mb-3 sm:mb-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#a3e635] tracking-tight drop-shadow-[0_2px_4px_rgba(163,230,53,0.3)]">
                PicklePlay<span className="text-[#65a30d]">.ph</span>
              </h1>
            </div>

            {/* Title - without decorative lines on desktop */}
            <div className="lg:flex lg:flex-col lg:gap-0">
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-[#65a30d] tracking-tight drop-shadow-[0_4px_8px_rgba(101,163,13,0.25)] mb-3 sm:mb-4">
                Tournaments
              </h2>
            </div>

            {/* Subtitle */}
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#a3e635] mb-4 sm:mb-6 drop-shadow-[0_2px_4px_rgba(163,230,53,0.2)]">
              Coming Soon
            </h3>

            {/* Description */}
            <p className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-md lg:max-w-lg mb-6 sm:mb-8 leading-relaxed">
              Join local pickleball competitions and tournaments. Compete with players, showcase your skills, and win amazing prizes!
            </p>

            {/* Notify Button */}
            <button className="group flex items-center gap-2 sm:gap-3 bg-[#a3e635] hover:bg-[#84cc16] text-[#0f2e22] font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#a3e635]/30 text-sm sm:text-base mb-8 sm:mb-10">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Notify Me When Ready</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Progress Indicator */}
            <div className="flex flex-col items-center lg:items-start">
              <p className="text-[#65a30d] text-xs sm:text-sm font-bold uppercase tracking-wider mb-2 sm:mb-3 drop-shadow-sm">
                Development Progress
              </p>
              <div className="w-48 sm:w-64 h-2 sm:h-3 bg-[#0f2e22]/10 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-gradient-to-r from-[#a3e635] to-[#84cc16] rounded-full animate-pulse"></div>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm mt-2">65% Complete</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
