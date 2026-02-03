"use client";


import CourtCard from "./CourtCard";
import CurvedLoop from "../animate/CurvedLoop";
import Image from "next/image";
import Ball from "@/images/Ball.png";

const courts = [
  {
    name: "Banawa Community Court",
    location: "Banawa, Cebu City",
    distance: "2.3 km",
    courts: 4,
    players: 45,
    image: "https://pickleplay.ph/pickleball-court.jpg",
  },
  {
    name: "Downtown Sports Complex",
    location: "Downtown, Cebu City",
    distance: "4.1 km",
    courts: 6,
    players: 78,
    image: "https://pickleplay.ph/sports-complex.jpg",
  },
  {
    name: "Riverside Recreation Center",
    location: "Riverside, Cebu City",
    distance: "5.8 km",
    courts: 3,
    players: 32,
    image: "https://pickleplay.ph/recreation-center.jpg",
  },
];

export default function CourtsSection() {
  // Ball positions and animation delays for bouncing effect
  const ballPositions = [
    { left: "8%", bottom: "10%", size: 60, delay: "0s" },
    { right: "5%", bottom: "20%", size: 80, delay: "0.3s" },
    { left: "35%", bottom: "30%", size: 50, delay: "0.5s" },
    { left: "12%", bottom: "50%", size: 75, delay: "0.7s" },
    { right: "30%", bottom: "40%", size: 70, delay: "0.2s" },
    { left: "40%", bottom: "65%", size: 65, delay: "0.6s" },
    { right: "10%", bottom: "75%", size: 60, delay: "0.4s" },
    { left: "15%", bottom: "85%", size: 75, delay: "0.8s" },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
      {/* Animated Bouncing Balls Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {ballPositions.map((ball, idx) => (
          <div
            key={idx}
            className="absolute animate-bounce-slow"
            style={{
              left: ball.left,
              right: ball.right,
              bottom: ball.bottom,
              animationDelay: ball.delay,
              zIndex: 1,
            }}
          >
            <Image
              src={Ball}
              alt="Decorative Ball"
              width={ball.size}
              height={ball.size}
              className="w-full h-auto opacity-20"
              style={{
                filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
              }}
            />
          </div>
        ))}
      </div>

      {/* Curved Loop Background */}
      <div className="absolute inset-0 -top-10 opacity-20">
        <CurvedLoop 
          marqueeText="PicklePlay     PicklePlay     PicklePlay"
          speed={2}
          curveAmount={400}
          direction="right"
          interactive={false}
          textColor="#0a56a7"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0a56a7]">
            Court Finder / Location Directory
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover pickleball courts near you and connect with your local community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[#0a56a7]">
          {courts.map((court, idx) => (
            <CourtCard key={idx} {...court} />
          ))}
        </div>
      </div>
    </section>
  );
}
// Add custom slow bounce animation
// In your global CSS (e.g., globals.css), add:
// @keyframes bounce-slow {
//   0%, 100% { transform: translateY(0); }
//   50% { transform: translateY(-40px); }
// }
// .animate-bounce-slow {
//   animation: bounce-slow 3.5s infinite;
// }
