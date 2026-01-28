"use client";

import Image from "next/image";

export default function ExperienceSection() {
  return (
    <>
      <section className="w-full py-16 bg-white relative overflow-visible"> {/* Changed from overflow-hidden to overflow-visible */}
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="flex-1 text-left">
            <h2 className="text-3xl md:text-5xl mb-4 text-[#0a56a7] font-serif italic tracking-wide">
              Experience PicklePlay in Action
            </h2>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              PICKLEPLAY — Your New Pickleball Playground. Get ready to serve, volley, 
              and smash your way to victory at the heart of Cebu's newest and most thrilling
              pickleball destination.
            </p>
          </div>

          <div className="flex-1 w-full max-w-xl">
            <div className="relative bg-gray-200 rounded-xl overflow-hidden shadow-lg aspect-video">
              <Image
                src="https://images.unsplash.com/photo-1534158914592-062992fbe900?w=800&q=80"
                alt="Pickleball Community"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                loading="eager"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="w-full pt-0 pb-0 bg-[#a3ff01] -mt-8 relative z-40 overflow-visible"> {/* Added overflow-visible here too */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/80 via-white/40 to-[#a3ff01]/0 backdrop-blur-md z-10 pointer-events-none"></div>
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10 relative z-10">
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