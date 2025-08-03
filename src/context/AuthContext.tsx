"use client";
import {
  createContext, useContext, useEffect, useState, ReactNode,
} from "react";
import { supabase } from "../utils/supabase";
import { User } from "@supabase/supabase-js";

interface Profile { credits: number; }

type AuthContextType = {
  user: User | null | undefined;
  profile: Profile | null;
  isLoggedIn: boolean;
  hasCredits: number;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps { children: ReactNode; }

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Helper function to robustly fetch profile
  const fetchProfile = async (uid: string) => {
    const { data, error } = await supabase
      .from("users").select("credits").eq("id", uid).single<Profile>();
    if (!data || error) {
      await supabase.from("users").insert([{ id: uid, credits: 2 }]);
      setProfile({ credits: 2 });
    } else {
      setProfile(data);
    }
  };

  useEffect(() => {
    // Listen for INITIAL_SESSION to guarantee session recovery done
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "INITIAL_SESSION") {
          setUser(session?.user ?? null);
          if (session?.user) {
            await fetchProfile(session.user.id);
            setIsAuthModalOpen(false);
          } else {
            setProfile(null);
            setIsAuthModalOpen(true);
          }
        }
        // You can also listen for SIGNED_IN/SIGNED_OUT here for live updates:
        if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile(null);
          setIsAuthModalOpen(true);
        }
        if (event === "SIGNED_IN") {
          setUser(session?.user ?? null);
          if (session?.user) {
            await fetchProfile(session.user.id);
            setIsAuthModalOpen(false);
          }
        }
      }
    );
    return () => { authListener.subscription.unsubscribe(); };
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
