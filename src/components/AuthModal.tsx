"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useAuth } from "@/context/AuthContext";
import { X } from "lucide-react";

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signUpWithEmail = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
    } else {
      window.location.reload();
    }
    setLoading(false);
  };

  const signInWithEmail = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    } else {
      window.location.reload();
    }
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) alert(error.message);
    setLoading(false);
  };

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mode === "login" ? signInWithEmail() : signUpWithEmail();
  };

  return (
    <div className="fixed inset-0 z-50 bg-(--primary)/10 bg-opacity-50 flex items-center justify-center">
      <div className="bg-(--muted) border border-(--secondary) text-(--text) rounded-xl shadow-lg p-6 w-full max-w-sm relative">
        <button
          onClick={closeAuthModal}
          className="absolute top-3 right-3 text-(--text)/50 hover:text-(--text)/80"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center capitalize">
          {mode === "login" ? "Sign In" : "Sign Up"}
        </h2>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-1.5 border border-(--secondary) focus:border-(--accent) rounded-md focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-1.5 border border-(--secondary) focus:border-(--accent) rounded-md focus:outline-none"
            required
          />
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-(--accent) text-(--accent-foreground) px-4 py-2 rounded-xl border border-(--accent-foreground)/10 hover:bg-(--accent)/90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={loading}
          >
            {loading ? "Loading..." : mode === "login" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="text-sm mt-4 text-center">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-blue-600 hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-blue-600 hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </div>

        <div className="mt-4">
          <button
            onClick={signInWithGoogle}
            className="w-full border border-(--secondary) hover:bg-(--tertiary) py-2 px-4 rounded"
          >
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
