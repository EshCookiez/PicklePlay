"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { User as DbUser } from '@/types/database'

interface AuthContextType {
  user: DbUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authView: "login" | "signup";
  openAuthModal: (view?: "login" | "signup") => void;
  closeAuthModal: () => void;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (userData: { 
    email: string; 
    password: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    location: string;
    phone_number?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DbUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "signup">("login");
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;
    let initialCheckDone = false;

    // Helper function to add timeout to promises
    const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> => {
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Operation timed out')), ms)
      );
      return Promise.race([promise, timeout]);
    };

    const initializeAuth = async () => {
      try {
        // Get initial session with timeout
        const { data: { session: initialSession } } = await withTimeout(
          supabase.auth.getSession(),
          10000 // 10 second timeout
        );
        
        if (!isMounted) return;

        setSession(initialSession);
        
        if (initialSession?.user) {
          // Fetch user data from public.users table with timeout
          const { data: userData } = await withTimeout(
            supabase
              .from('users')
              .select('*')
              .eq('id', initialSession.user.id)
              .single(),
            10000 // 10 second timeout
          );
          
          if (isMounted) {
            setUser(userData || null);
          }
        } else {
          if (isMounted) {
            setUser(null);
          }
        }
        
        initialCheckDone = true;
        
        if (isMounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes - only update after initial check is done
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted || !initialCheckDone) return;

      // Ignore focus events - refetch only on actual auth changes
      if (event === 'INITIAL_SESSION' || event === 'MFA_CHALLENGE_VERIFIED') {
        return;
      }

      // Only refetch user data on actual auth state changes, not on focus/visibility
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        setSession(session);
        
        if (session?.user) {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (isMounted) {
            setUser(userData || null);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        if (isMounted) {
          setSession(null);
          setUser(null);
        }
      }
      // Ignore other events like INITIAL_SESSION to prevent unnecessary refetches
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const openAuthModal = useCallback((view: "login" | "signup" = "login") => {
    setAuthView(view);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  // Check for login=required URL parameter (from protected route redirect)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('login') === 'required' && !user && !isLoading) {
        // Remove the query param from URL without reload
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
        openAuthModal("login");
      }
    }
  }, [user, isLoading, openAuthModal]);

  const login = async (credentials: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) throw error;
    
    // Wait for user data to be fetched
    if (data.session?.user) {
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.session.user.id)
        .single();
      
      if (userData) {
        setUser(userData);
        setSession(data.session);
      }
    }
  };

  const signup = async (userData: { 
    email: string; 
    password: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    location: string;
    phone_number?: string;
  }) => {
    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          first_name: userData.first_name,
          last_name: userData.last_name,
          date_of_birth: userData.date_of_birth,
        },
      },
    });

    if (error) throw error;

    // Create user record in public.users table
    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id, // Use the Supabase Auth user ID
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          date_of_birth: userData.date_of_birth,
          location: userData.location,
          phone_number: userData.phone_number || null,
          role: 'user',
          status: 'active',
          email_verified_at: null,
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        throw profileError;
      }
      
      // Fetch and set the newly created user data
      const { data: newUserData } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (newUserData) {
        setUser(newUserData);
      }
      
      if (data.session) {
        setSession(data.session);
      }
    }
  };

  const logout = async () => {
    try {
      // Clear state
      setUser(null);
      setSession(null);
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear browser history and replace with homepage
      // This prevents back button from going to protected pages
      window.history.replaceState(null, '', '/');
      window.location.replace('/');
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an error, navigate to clear state
      window.history.replaceState(null, '', '/');
      window.location.replace('/');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthModalOpen,
        authView,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
