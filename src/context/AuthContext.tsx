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

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null | undefined>(undefined); // undefined = loading
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Fetch profile helper with logs
  const fetchProfile = async (uid: string) => {
    console.log(`[AuthProvider] fetchProfile started for user id: ${uid}`);
    const { data, error } = await supabase
      .from("users")
      .select("credits")
      .eq("id", uid)
      .single<Profile>();

    if (!data || error) {
      console.error("[AuthProvider] Profile not found or error:", error);
      console.log("[AuthProvider] Creating default profile with 2 credits");
      await supabase.from("users").insert([{ id: uid, credits: 2 }]);
      setProfile({ credits: 2 });
      console.log("[AuthProvider] Default profile set");
    } else {
      setProfile(data);
      console.log("[AuthProvider] Profile loaded:", data);
    }
  };

  useEffect(() => {
    const checkUserAndProfile = async () => {
      console.log("[AuthProvider] Checking user with supabase.auth.getUser()");
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          console.log("[AuthProvider] User found:", data.user);
          setUser(data.user);
          await fetchProfile(data.user.id);
          setIsAuthModalOpen(false);
          console.log("[AuthProvider] Auth modal closed");
        } else {
          console.log("[AuthProvider] No user found, opening auth modal");
          setUser(null);
          setProfile(null);
          setIsAuthModalOpen(true);
        }
      } catch (error) {
        console.error("[AuthProvider] Error checking user:", error);
        setUser(null);
        setProfile(null);
        setIsAuthModalOpen(true);
      }
    };
    checkUserAndProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoggedIn: !!user,
        isAuthModalOpen,
        hasCredits: profile?.credits || 0,
        openAuthModal: () => {
          console.log("[AuthProvider] openAuthModal called");
          setIsAuthModalOpen(true);
        },
        closeAuthModal: () => {
          console.log("[AuthProvider] closeAuthModal called");
          setIsAuthModalOpen(false);
        },
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
