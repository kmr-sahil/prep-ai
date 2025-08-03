"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "../utils/supabase";
import { User } from "@supabase/supabase-js";

// Define the shape of profile data
interface Profile {
  credits: number;
}

// Define the context type
type AuthContextType = {
  user: User | null | undefined;
  profile: Profile | null;
  isLoggedIn: boolean;
  hasCredits: number;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
};

// Create context with undefined initially
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props type for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null | undefined>(undefined); // undefined = loading
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Fetch profile (credits) by user id
  const fetchProfile = async (uid: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("credits")
      .eq("id", uid)
      .single<Profile>();
    if (!data || error) {
      // Profile doesn't exist, create default
      await supabase.from("users").insert([{ id: uid, credits: 2 }]);
      setProfile({ credits: 2 });
    } else {
      setProfile(data);
    }
  };

  // Initial eager session and profile fetch (fixes "must reload for credits" bug)
  useEffect(() => {
    let isMounted = true; // Prevent state updates if unmounted
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
        setIsAuthModalOpen(false);
      } else {
        setProfile(null);
        setIsAuthModalOpen(true);
      }
    };
    getInitialSession();
    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for all auth state changes (including login/logout/profile)
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
          setIsAuthModalOpen(false);
        } else {
          setProfile(null);
          setIsAuthModalOpen(true);
        }
      }
    );
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoggedIn: !!user,
        isAuthModalOpen,
        hasCredits: profile?.credits || 0,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
