import { useAuth } from "@/contexts/AuthContext";

export function useAuthModal() {
  const { openAuthModal, closeAuthModal, isAuthModalOpen, authView } = useAuth();

  const openLogin = () => openAuthModal("login");
  const openSignup = () => openAuthModal("signup");

  return {
    openLogin,
    openSignup,
    closeAuthModal,
    isAuthModalOpen,
    authView,
  };
}
