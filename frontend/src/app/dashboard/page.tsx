"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;
  if (!user) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 pt-16 lg:pt-8 animate-in fade-in duration-1000">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f2e22] mb-3 lg:mb-4">
            Dashboard
          </h1>
          <p className="text-base lg:text-lg text-gray-600 max-w-2xl">
            Your personalized pickleball activity dashboard
          </p>
        </div>

        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-6 lg:p-8 text-center">
          <p className="text-gray-600">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}
