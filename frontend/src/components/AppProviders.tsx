"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppContent>{children}</AppContent>
    </AuthProvider>
  );
}

function AppContent({ children }: { children: React.ReactNode }) {
  const { isAuthModalOpen, authView, closeAuthModal } = useAuth();

  return (
    <>
      {children}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
        initialView={authView}
      />
    </>
  );
}
