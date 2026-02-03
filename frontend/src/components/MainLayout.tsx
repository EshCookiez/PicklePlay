"use client";

import { ReactNode, useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

function MainLayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  // Pages that should not have the sidebar
  const noSidebarPages = ['/auth', '/'];
  const shouldShowSidebar = pathname && !noSidebarPages.includes(pathname) && user !== null && !isLoading;

  // Smooth page transition effect
  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
      setIsReady(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Show smooth loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen min-h-[100dvh] transition-opacity duration-300">
        <Header />
        <main className="animate-in fade-in duration-300">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-[#a3ff01] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 text-sm animate-pulse">Loading...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] relative overflow-x-hidden overflow-y-auto w-full max-w-[100vw]">
      <Header />
      {shouldShowSidebar && <Sidebar />}
      <main 
        className={`relative z-0 overflow-x-hidden overflow-y-auto w-full pb-20 lg:pb-0 transition-all duration-300 ease-out ${
          shouldShowSidebar ? 'lg:ml-72' : ''
        } ${isPageLoading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`} 
      >
        <div className={`w-full px-0 ${shouldShowSidebar ? 'lg:w-[calc(100vw-18rem)] lg:ml-0' : ''}`}>
          {children}
        </div>
      </main>
    </div>
  );
}

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </SidebarProvider>
  );
}
