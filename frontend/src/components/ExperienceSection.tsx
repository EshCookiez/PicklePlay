"use client";


import Image from "next/image";
import Tournament from "@/images/Tournament.png";
import Ball from "@/images/Ball.png";
import { MotionFade } from "../animate/MotionFade";

export default function ExperienceSection() {
  // Array of ball positions for scattered background design
  const ballPositions = [
    { top: "5%", left: "8%", size: 60, opacity: 0.15, delay: "0s" },
    { top: "15%", right: "5%", size: 80, opacity: 0.1, delay: "0.2s" },
    { top: "30%", left: "35%", size: 50, opacity: 0.2, delay: "0.4s" },
    { top: "40%", left: "12%", size: 75, opacity: 0.16, delay: "0.3s" },
    { top: "50%", right: "30%", size: 70, opacity: 0.14, delay: "0.1s" },
    { top: "65%", left: "40%", size: 65, opacity: 0.18, delay: "0.7s" },
    { top: "75%", right: "10%", size: 60, opacity: 0.12, delay: "0.5s" },
    { top: "85%", left: "15%", size: 75, opacity: 0.15, delay: "0.8s" },
  ];

  return (
    <>
      <section className="w-full pt-16 pb-0 relative overflow-visible">
        {/* Background gradient that transitions from white to lime green */}
        <div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: "linear-gradient(to bottom, #ffffff 0%, #ffffff 60%, #e0f2fe 100%)"
          }}
        ></div>
        {/* Scattered Ball Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
          {ballPositions.map((ball, idx) => (
            <MotionFade key={idx} delay={0.1 * idx} y={30}>
              <div
                className="absolute"
                style={{
                  top: ball.top,
                  left: ball.left,
                  right: ball.right,
                }}
              >
                <Image
                  src={Ball}
                  alt="Decorative Ball"
                  width={ball.size}
                  height={ball.size}
                  className="w-full h-auto"
                  style={{
                    opacity: ball.opacity,
                    filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
                  }}
                />
              </div>
            </MotionFade>
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-start gap-10 relative z-[5]">
          <div className="flex-1 text-left">
            <MotionFade delay={0.1} y={40}>
              <h2 className="text-3xl md:text-5xl mb-4 text-[#0a56a7] font-black">
                Experience PicklePlay Tournament
              </h2>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                PICKLEPLAY — Compete in thrilling tournaments. Get ready to serve, volley, 
                and smash your way to victory in our most exciting pickleball tournament
                competitions and events.
              </p>
            </MotionFade>
          </div>

          <div className="flex-1 w-full max-w-3xl">
            <MotionFade delay={0.2} y={40}>
              <Image
                src={Tournament}
                alt="Pickleball Tournament"
                width={800}
                height={450}
                priority
                className="w-full h-auto rounded-xl"
              />
            </MotionFade>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="w-full pt-0 pb-0 relative z-40 overflow-visible">
        {/* Lime green background */}
        <div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: "linear-gradient(to bottom, rgb(163, 230, 53) 0%, rgb(163, 230, 53) 100%)"
          }}
        ></div>
        {/* Gradient overlay extending above section for smooth blend */}
        <div 
          className="absolute -top-24 left-0 right-0 h-24 pointer-events-none z-[1]"
          style={{
            background: "linear-gradient(to bottom, rgba(163, 230, 53, 0) 0%, rgba(163, 230, 53, 0.6) 50%, rgb(163, 230, 53) 100%)"
          }}
        ></div>
        
        {/* Two-column layout on desktop */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-[5]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-end">
            {/* Column 1: Image - overlaps into gradient above, contained within column */}
            <div className="flex justify-center md:justify-start order-2 md:order-1 -mt-20 sm:-mt-28 md:-mt-36 lg:-mt-44 xl:-mt-52 overflow-visible">
              <MotionFade delay={0.1} y={40}>
                <div className="relative w-[320px] sm:w-[400px] md:w-full md:max-w-[420px] lg:max-w-[500px] xl:max-w-[580px] 2xl:max-w-[650px]">
                  <img
                    src="/images/Mowdel.png"
                    alt="PicklePlay Community"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </MotionFade>
            </div>
            
            {/* Column 2: Text content */}
            <div className="flex-1 text-center md:text-left order-1 md:order-2 pb-8 sm:pb-12 md:pb-16 lg:pb-24 relative z-10">
              <MotionFade delay={0.2} y={40}>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4 text-white font-black">
                  Be Part of our Growing Community
                </h2>
                <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base md:text-lg leading-relaxed px-2 sm:px-0">
                  Join thousands of pickleball enthusiasts who have made PicklePlay their home. 
                  Connect with players of all skill levels, share your passion, and be part of 
                  the fastest-growing sports community in the Philippines.
                </p>
              </MotionFade>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}