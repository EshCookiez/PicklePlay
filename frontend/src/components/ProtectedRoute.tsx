"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { SkeletonProfile } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading, openAuthModal } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      // Replace current history entry so back button doesn't return here
      window.history.replaceState(null, '', '/');
      router.replace('/');
      openAuthModal("login");
    }
  }, [user, isLoading, router, openAuthModal]);

  // Show loading skeleton while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#f0fdf4] p-8 lg:p-12">
        <div className="max-w-md mx-auto animate-in fade-in duration-500">
          <SkeletonProfile />
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#f0fdf4] p-8 lg:p-12">
        <div className="max-w-md mx-auto animate-in fade-in duration-500">
          <SkeletonProfile />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
