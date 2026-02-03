"use client";

import Image from "next/image";
import Tournament from "@/images/Tournament.png";
import Ball from "@/images/Ball.png";

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
            <div
              key={idx}
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
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10 relative z-[5]">
          <div className="flex-1 text-left">
            <h2 className="text-3xl md:text-5xl mb-4 text-[#0a56a7] font-serif italic tracking-wide">
              Experience PicklePlay Tournament
            </h2>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              PICKLEPLAY — Compete in thrilling tournaments. Get ready to serve, volley, 
              and smash your way to victory in our most exciting pickleball tournament
              competitions and events.
            </p>
          </div>

          <div className="flex-1 w-full max-w-xl">
            <Image
              src={Tournament}
              alt="Pickleball Tournament"
              width={800}
              height={450}
              priority
              className="w-full h-auto rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="w-full pt-0 pb-0 -mt-8 relative z-40 overflow-visible">
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
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10 relative z-[5]">
          <div className="flex-1 w-full max-w-none">
            <div className="relative rounded-xl overflow-visible z-50"> {/* Changed from overflow-hidden to overflow-visible */}
              <img
                src="/images/Mowdel.png"
                alt="PicklePlay Community"
                className="w-full h-[580px] object-cover m-0 -mt-32 relative z-50"
              />
            </div>
          </div>

          <div className="flex-1 text-left mt-16">
            <h2 className="text-3xl md:text-5xl mb-4 text-[#0a56a7] font-serif italic tracking-wide">
              Be Part of our Growing Community
            </h2>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              Join thousands of pickleball enthusiasts who have made PicklePlay their home. 
              Connect with players of all skill levels, share your passion, and be part of 
              the fastest-growing sports community in the Philippines.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}