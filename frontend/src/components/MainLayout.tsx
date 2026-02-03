"use client";

import { ReactNode } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

function MainLayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  
  // Pages that should not have the sidebar
  const noSidebarPages = ['/auth', '/'];
  const shouldShowSidebar = pathname && !noSidebarPages.includes(pathname) && user !== null && !isLoading;

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="animate-in fade-in">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden overflow-y-auto w-full max-w-[100vw]">
      <Header />
      {shouldShowSidebar && <Sidebar />}
      <main 
        className={`animate-in fade-in relative z-0 overflow-x-hidden overflow-y-auto w-full ${
          shouldShowSidebar ? 'lg:ml-72' : ''
        }`} 
        style={{
          width: shouldShowSidebar ? 'calc(100vw - 0rem)' : '100vw'
        }}
      >
        <div className={shouldShowSidebar ? 'lg:w-[calc(100vw-18rem)] lg:ml-0' : 'w-full'}>
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
