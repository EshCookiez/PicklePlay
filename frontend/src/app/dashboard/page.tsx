"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;
  if (!user) return null;

  return (
    <div className="p-6 md:p-8 pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-[#1E40AF] mb-4">
            Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Your personalized pickleball activity dashboard
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <p className="text-gray-600">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}
