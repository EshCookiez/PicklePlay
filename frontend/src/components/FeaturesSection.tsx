"use client";

import { Zap, Users, Trophy, Clock } from "lucide-react";
import AnimatedContent from "../animate/AnimatedContent";
import { MotionFade } from "../animate/MotionFade";

const features = [
  {
    icon: Zap,
    title: "Quick Matching",
    description: "Find available courts and players instantly",
  },
  {
    icon: Users,
    title: "Community",
    description: "Connect with local pickleball enthusiasts",
  },
  {
    icon: Trophy,
    title: "Tournaments",
    description: "Participate in organized competitions",
  },
  {
    icon: Clock,
    title: "Real-time Updates",
    description: "Get live court availability and scores",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-12 sm:py-16 md:py-24 pb-16 sm:pb-20 md:pb-24 lg:pb-32 bg-blue-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 text-[#0a56a7]">Why Choose PicklePlay?</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <MotionFade key={idx} delay={0.1 * idx} y={40}>
                <div className="group bg-white rounded-xl border border-gray-200 p-4 sm:p-5 md:p-6 shadow-md hover:shadow-2xl hover:scale-105 active:scale-[0.98] transition-all duration-300 ease-out h-full">
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <div className="p-2.5 sm:p-3 md:p-4 bg-[#0a56a7] text-white rounded-full group-hover:bg-[#a3ff01] group-hover:text-[#0a56a7] group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2 text-center text-gray-900 group-hover:text-[#0a56a7] transition-colors duration-200">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 text-center group-hover:text-gray-700 transition-colors duration-200 line-clamp-2 sm:line-clamp-none">{feature.description}</p>
                </div>
              </MotionFade>
            );
          })}
        </div>
      </div>
    </section>
  );
}
