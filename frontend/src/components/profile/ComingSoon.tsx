"use client";

import React from 'react';
import Image from 'next/image';
import { Sparkles, Bell, ArrowRight } from 'lucide-react';

interface ComingSoonProps {
  title?: string;
  description?: string;
  showNotifyButton?: boolean;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ 
  title = "Coming Soon",
  description = "We're working hard to bring you this feature. Stay tuned!",
  showNotifyButton = true
}) => {
  return (
    <div className="w-full max-w-full overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-gradient-to-br from-[#f8fafc] via-white to-[#f0fdf4] rounded-2xl sm:rounded-[2rem] p-6 sm:p-12 relative overflow-hidden min-h-[400px] sm:min-h-[500px] flex flex-col items-center justify-center text-center border border-[#a3e635]/30 shadow-xl">
        
        {/* Decorative Elements - Lime Green Accents */}
        <div className="absolute top-0 left-0 w-48 sm:w-72 h-48 sm:h-72 bg-[#a3e635] opacity-20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-[#a3e635] opacity-15 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/2 w-32 sm:w-48 h-32 sm:h-48 bg-[#84cc16] opacity-10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/4 right-1/4 w-24 sm:w-32 h-24 sm:h-32 bg-[#FDE047] opacity-20 rounded-full blur-2xl"></div>
        
        {/* Floating Sparkles */}
        <div className="absolute top-8 right-12 animate-pulse">
          <Sparkles className="w-6 h-6 text-[#a3e635]" />
        </div>
        <div className="absolute bottom-16 left-8 animate-pulse delay-300">
          <Sparkles className="w-4 h-4 text-[#84cc16]" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-pulse delay-500">
          <Sparkles className="w-5 h-5 text-[#a3e635] opacity-70" />
        </div>
        <div className="absolute bottom-1/3 left-1/4 animate-pulse delay-700">
          <Sparkles className="w-4 h-4 text-[#FDE047]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Logo */}
          <div className="mb-6 sm:mb-8 relative">
            <div className="absolute inset-0 bg-[#a3e635] rounded-3xl blur-2xl opacity-30 scale-125"></div>
            <div className="relative bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xl border-2 border-[#a3e635]/30">
              <Image
                src="/images/Pickleplay_1.png"
                alt="PicklePlay Logo"
                width={120}
                height={120}
                className="relative z-10 sm:w-[150px] sm:h-[150px] object-contain"
              />
            </div>
          </div>

          {/* Brand */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0f2e22] tracking-tight">
              PicklePlay<span className="text-[#a3e635]">.ph</span>
            </h1>
          </div>

          {/* Title */}
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#a3e635]"></div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0f2e22] tracking-tight">
              {title}
            </h2>
            <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#a3e635]"></div>
          </div>

          {/* Description */}
          <p className="text-slate-600 text-sm sm:text-base max-w-md mb-6 sm:mb-8 leading-relaxed px-4">
            {description}
          </p>

          {/* Notify Button */}
          {showNotifyButton && (
            <button className="group flex items-center gap-2 sm:gap-3 bg-[#a3e635] hover:bg-[#84cc16] text-[#0f2e22] font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#a3e635]/30 text-sm sm:text-base">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Notify Me When Ready</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          {/* Progress Indicator */}
          <div className="mt-8 sm:mt-10 flex flex-col items-center">
            <p className="text-[#0f2e22] text-xs sm:text-sm font-bold uppercase tracking-wider mb-2 sm:mb-3">
              Development Progress
            </p>
            <div className="w-48 sm:w-64 h-2 sm:h-3 bg-[#0f2e22]/10 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-[#a3e635] to-[#84cc16] rounded-full animate-pulse"></div>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-2">75% Complete</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
