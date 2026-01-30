"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContestsPage() {
  return (
    <div className="min-h-screen flex flex-col animate-in fade-in duration-1000">
      <Header />
      <main className="flex-1 pt-20 sm:pt-24 pb-24 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f2e22] mb-3 lg:mb-4">
              Contests
            </h1>
            <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
              Participate in exciting pickleball contests and challenges
            </p>
          </div>

          <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6 lg:p-8 text-center">
            <p className="text-gray-600">Coming soon...</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
