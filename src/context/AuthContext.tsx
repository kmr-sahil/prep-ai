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
  user: any;
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
  const [user, setUser] = useState<User | null | undefined>(undefined); // undefined means "loading"
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        console.log(session)

        if (session?.user) {
          // Fetch profile
          
          const { data, error } = await supabase
            .from("users")
            .select("credits")
            .eq("id", session.user.id)
            .single<Profile>();

          if (!data || error) {
            // Insert default profile if not found
            console.error("Profile not found, inserting default profile:", error);
            await supabase
              .from("users")
              .insert([{ id: session.user.id, credits: 2 }]);
            setProfile({ credits: 2 });
          } else {
            setProfile(data);
          }
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
      value={{ user,
        profile,
        isLoggedIn: !!user,
        isAuthModalOpen,
        hasCredits: profile?.credits || 0,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false), }}
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
