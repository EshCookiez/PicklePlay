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
  isLoggingOut: boolean;
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
  loginWithProvider: (provider: 'google' | 'facebook') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DbUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "signup">("login");
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;
    let initialCheckDone = false;

    const initializeAuth = async () => {
      console.log("AuthContext: Starting initial check...");
      try {
        // Get initial session
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("AuthContext: getSession error:", sessionError);
        }

        console.log("AuthContext: initialSession:", initialSession ? "FOUND" : "NOT FOUND", initialSession?.user?.id);

        if (!isMounted) return;

        setSession(initialSession);

        if (initialSession?.user) {
          console.log("AuthContext: Fetching profile for:", initialSession.user.id);
          // Fetch user data from public.users table
          let { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', initialSession.user.id)
            .single();

          if (fetchError) {
            console.warn("AuthContext: Profile fetch error (expected for new social users):", fetchError);
          }

          // Handle case where user is authenticated but has no profile in public.users (Social Login)
          if (!userData || fetchError?.code === 'PGRST116') {
            console.log("AuthContext: No profile found. Attempting to create default...");

            const metadata = initialSession.user.user_metadata;
            const firstName = metadata?.full_name?.split(' ')[0] || metadata?.given_name || metadata?.first_name || 'User';
            const lastName = metadata?.full_name?.split(' ').slice(1).join(' ') || metadata?.family_name || metadata?.last_name || '';

            const { data: newProfile, error: createError } = await supabase
              .from('users')
              .insert([
                {
                  id: initialSession.user.id,
                  email: initialSession.user.email,
                  first_name: firstName,
                  last_name: lastName,
                  role: 'user'
                }
              ])
              .select()
              .single();

            if (!createError) {
              userData = newProfile;
              console.log("AuthContext: Default profile created successfully.");
            } else {
              console.error("AuthContext: Profile creation error:", createError);
              // ALERT THE USER: This is likely an RLS issue
              if (typeof window !== 'undefined') {
                console.error("DEBUG ALERT: Your public.users table might have RLS blocking this insert. Check your Supabase policies.");
              }
            }
          }

          if (isMounted) {
            setUser(userData || null);
          }
        } else {
          console.log("AuthContext: No initial session, user set to null");
          if (isMounted) {
            setUser(null);
          }
        }

        initialCheckDone = true;

        if (isMounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Auth initialization exception:", error);
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
      if (!isMounted) return;

      // Ignore focus events - refetch only on actual auth changes
      if (event === 'INITIAL_SESSION' || event === 'MFA_CHALLENGE_VERIFIED') {
        return;
      }

      // Only refetch user data on actual auth state changes, not on focus/visibility
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        console.log(`Auth event: ${event}`, { hasSession: !!session, userId: session?.user?.id });
        setSession(session);

        if (session?.user) {
          // Fetch user data from public.users table
          let { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          // Handle case where user is authenticated but has no profile in public.users (Social Login)
          if (!userData || fetchError?.code === 'PGRST116') {
            console.log("No profile found for authenticated user on event. Creating default...");
            const { data: newProfile, error: createError } = await supabase
              .from('users')
              .insert([
                {
                  id: session.user.id,
                  email: session.user.email,
                  first_name: session.user.user_metadata?.full_name?.split(' ')[0] || session.user.user_metadata?.first_name || 'User',
                  last_name: session.user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || session.user.user_metadata?.last_name || '',
                  role: 'user'
                }
              ])
              .select()
              .single();

            if (!createError) {
              userData = newProfile;
              console.log("Default profile created successfully on event.");
            } else {
              console.error("Error creating default profile on event:", createError);
            }
          }

          if (isMounted) {
            setUser(userData || null);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("Auth event: SIGNED_OUT");
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

      setUser(userData);
      setSession(data.session);
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

  const loginWithProvider = async (provider: 'google' | 'facebook') => {
    console.log(`Initiating ${provider} login with redirect to: ${window.location.origin}/auth/callback`);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error(`${provider} login initiation error:`, error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Show smooth transition overlay
      setIsLoggingOut(true);

      // Clear state
      setUser(null);
      setSession(null);

      // Sign out from Supabase
      await supabase.auth.signOut();

      // Wait for fade animation to complete before navigating
      await new Promise(resolve => setTimeout(resolve, 500));

      // Clear browser history and replace with homepage
      // This prevents back button from going to protected pages
      window.history.replaceState(null, '', '/');
      window.location.replace('/');
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an error, navigate to clear state
      await new Promise(resolve => setTimeout(resolve, 300));
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
        isLoggingOut,
        isAuthModalOpen,
        authView,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        loginWithProvider,
        logout,
      }}
    >
      {/* Logout Transition Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[9999] bg-white animate-in fade-in duration-300 flex items-center justify-center">
          <div className="text-center animate-in zoom-in duration-500">
            <div className="w-16 h-16 mx-auto mb-4">
              <svg className="animate-spin w-full h-full text-[#a3e635]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-[#0f2e22] font-semibold text-lg">Logging out...</p>
          </div>
        </div>
      )}
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
