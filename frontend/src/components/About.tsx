"use client";

import { Users, Target, Zap } from "lucide-react";
import AnimatedContent from "../animate/AnimatedContent";
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
    <section className="py-16 md:py-16 bg-gradient-to-b from-white to-blue-50" id="about">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <AnimatedContent
            distance={50}
            direction="vertical"
            duration={0.6}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.2}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#0a56a7]">About PicklePlay</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Changing the way Philippines discovers and enjoys pickleball
            </p>
          </AnimatedContent>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <AnimatedContent
            distance={100}
            direction="horizontal"
            duration={0.8}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.2}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a56a7] to-[#a3ff01] rounded-2xl blur-2xl opacity-20"></div>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner5-SwAiVYRMsfUCqZMBq1uTm9yK0DsC3F.png"
                alt="About PicklePlay"
                width={500}
                height={400}
                className="relative rounded-2xl shadow-2xl object-cover w-full"
              />
            </div>
          </AnimatedContent>

          <AnimatedContent
            distance={100}
            direction="horizontal"
            duration={0.8}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.2}
            delay={0.2}
          >
            <div>
              <h3 className="text-3xl font-bold mb-6 text-[#0a56a7]">What is PicklePlay?</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                PicklePlay is a comprehensive platform designed to revolutionize how pickleball enthusiasts connect, discover courts, and build community. Whether you're a beginner looking to learn the sport or an experienced player seeking competitive opportunities, we've got you covered.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Based in Cebu, Philippines, we're committed to making pickleball accessible, fun, and community-driven.
              </p>
              <div className="flex gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#a3ff01] mt-2"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Easy to Use</p>
                    <p className="text-sm text-gray-600">Find courts in seconds</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#a3ff01] mt-2"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Always Updated</p>
                    <p className="text-sm text-gray-600">Real-time availability</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedContent>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <div className="group bg-white rounded-xl border border-gray-200 p-8 shadow-md hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-[#a3ff01] to-blue-600 text-white rounded-full group-hover:bg-[#a3ff01] group-hover:text-[#0a56a7] transition-all duration-300 shadow-lg">
                      <IconComponent className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-center text-gray-900 group-hover:text-[#0a56a7] transition-colors">{value.title}</h3>
                  <p className="text-gray-600 text-center group-hover:text-gray-700 transition-colors">{value.description}</p>
                </div>
              </AnimatedContent>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-12 border-t border-gray-200">
          <AnimatedContent
            distance={50}
            direction="vertical"
            duration={0.6}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.2}
            delay={0}
          >
            <div className="text-center">
              <p className="text-4xl font-bold text-[#0a56a7] mb-2">500+</p>
              <p className="text-gray-600">Courts Listed</p>
            </div>
          </AnimatedContent>
          <AnimatedContent
            distance={50}
            direction="vertical"
            duration={0.6}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.2}
            delay={0.1}
          >
            <div className="text-center">
              <p className="text-4xl font-bold text-[#0a56a7] mb-2">10K+</p>
              <p className="text-gray-600">Active Players</p>
            </div>
          </AnimatedContent>
          <AnimatedContent
            distance={50}
            direction="vertical"
            duration={0.6}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.2}
            delay={0.2}
          >
            <div className="text-center">
              <p className="text-4xl font-bold text-[#0a56a7] mb-2">50+</p>
              <p className="text-gray-600">Events Yearly</p>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
}
