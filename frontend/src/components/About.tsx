"use client";

import { Users, Target, Zap } from "lucide-react";
import AnimatedContent from "../animate/AnimatedContent";
import { MotionFade } from "../animate/MotionFade";
import Image from "next/image";

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description: "To unite pickleball enthusiasts and make it easy to find courts, players, and tournaments.",
  },
  {
    icon: Users,
    title: "Our Community",
    description: "Building a thriving community of passionate pickleball players across the Philippines.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Leveraging technology to revolutionize how people discover and play pickleball.",
  },
];

export default function About() {
  return (
    <section className="py-12 sm:py-14 md:py-16 bg-gradient-to-b from-white to-blue-50" id="about">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <MotionFade delay={0.1} y={-30}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 text-[#0a56a7]">About PicklePlay</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              Changing the way Philippines discovers and enjoys pickleball
            </p>
          </MotionFade>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center mb-12 sm:mb-16 md:mb-20">
          <MotionFade delay={0.2} x={-40}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a56a7] to-[#a3ff01] rounded-xl sm:rounded-2xl blur-2xl opacity-20"></div>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner5-SwAiVYRMsfUCqZMBq1uTm9yK0DsC3F.png"
                alt="About PicklePlay"
                width={500}
                height={400}
                className="relative rounded-xl sm:rounded-2xl shadow-2xl object-cover w-full"
              />
            </div>
          </MotionFade>

          <MotionFade delay={0.3} x={40}>
            <div className="px-1">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 md:mb-6 text-[#0a56a7]">What is PicklePlay?</h3>
              <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 leading-relaxed">
                PicklePlay is a comprehensive platform designed to revolutionize how pickleball enthusiasts connect, discover courts, and build community. Whether you're a beginner looking to learn the sport or an experienced player seeking competitive opportunities, we've got you covered.
              </p>
              <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                Based in Cebu, Philippines, we're committed to making pickleball accessible, fun, and community-driven.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#a3ff01] mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-sm sm:text-base text-gray-900">Easy to Use</p>
                    <p className="text-xs sm:text-sm text-gray-600">Find courts in seconds</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#a3ff01] mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-sm sm:text-base text-gray-900">Always Updated</p>
                    <p className="text-xs sm:text-sm text-gray-600">Real-time availability</p>
                  </div>
                </div>
              </div>
            </div>
          </MotionFade>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {values.map((value, idx) => {
            const IconComponent = value.icon;
            return (
              <AnimatedContent
                key={idx}
                distance={100}
                direction="vertical"
                duration={0.8}
                ease="power3.out"
                initialOpacity={0}
                animateOpacity
                threshold={0.1}
                delay={idx * 0.15}
              >
                <div className="group bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-md hover:shadow-2xl active:scale-[0.98] transition-all duration-300 h-full">
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <div className="p-3 sm:p-4 bg-gradient-to-br from-[#a3ff01] to-blue-600 text-white rounded-full group-hover:bg-[#a3ff01] group-hover:text-[#0a56a7] transition-all duration-300 shadow-lg">
                      <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-center text-gray-900 group-hover:text-[#0a56a7] transition-colors">{value.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 text-center group-hover:text-gray-700 transition-colors">{value.description}</p>
                </div>
              </AnimatedContent>
            );
          })}
        </div>


      </div>
    </section>
  );
}
