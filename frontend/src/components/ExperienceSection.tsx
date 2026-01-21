import Image from "next/image";

export default function ExperienceSection() {
  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0a56a7]">
            Experience PicklePlay in Action
          </h2>
          <p className="text-gray-700 mb-6">
            PICKLEPLAY — Your New Pickleball Playground. Get ready to serve, volley, and smash
            your way to victory at the heart of Cebu's newest and most thrilling pickleball
            destination.
          </p>
        </div>

        <div className="flex-1 w-full max-w-xl">
          <div className="relative bg-gray-200 rounded-xl overflow-hidden shadow-lg aspect-video">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner5-SwAiVYRMsfUCqZMBq1uTm9yK0DsC3F.png"
              alt="PicklePlay Experience"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
