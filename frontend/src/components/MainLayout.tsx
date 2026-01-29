"use client";

import { ReactNode } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { usePathname } from "next/navigation";

function MainLayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // Pages that should not have the sidebar
  const noSidebarPages = ['/auth'];
  const shouldShowSidebar = !noSidebarPages.includes(pathname);

  return (
    <div className="min-h-screen">
      <Header />
      {shouldShowSidebar ? (
        <>
          <Sidebar />
          <main className="ml-24 transition-all duration-300">
            {children}
          </main>
        </>
      ) : (
        <main>
          {children}
        </main>
      )}
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
