"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CoachingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-[#1E40AF] mb-4">
              Coaching
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Book lessons and improve your pickleball skills with professional coaches
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-gray-600">Coming soon...</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
