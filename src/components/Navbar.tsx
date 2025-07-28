"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { BadgeAlert, BadgeInfo, LogOut, Mail } from "lucide-react";
import { supabase } from "@/utils/supabase";

function Navbar() {
  const { user, profile, isLoggedIn, openAuthModal } = useAuth();
  const [show, setShow] = useState(false);

  const logout = async () => {
    let { error } = await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="fixed w-[100%] top-5 left-1/2 transform -translate-x-1/2 flex justify-between max-w-[30rem] px-2 z-50">
      <div className="w-full flex justify-between max-w-[30rem] mx-[1rem] rounded-2xl bg-(--muted) border border-(--secondary) px-4 py-2 ">
        <div className="flex gap-2 items-center justify-center">
          <img src="/logo.svg" alt="" className="w-6 h-6 " />
          <h5 className="text-base font-medium leading-[1rem]">prep-ai</h5>
        </div>
        <div>
          {isLoggedIn ? (
            <div className="relative">
              <img
                src={user?.user_metadata?.avatar_url}
                alt="profile"
                className="w-8 h-8 rounded-full cursor-pointer"
                onClick={() => setShow(!show)}
              />
              {show && (
                <div className="absolute top-6 right-0 bg-(--muted) border border-(--secondary) rounded-md px-3 py-2 text-sm text(--text) flex flex-col items-end">
                  <span className="whitespace-nowrap flex gap-2 items-center justify-center">
                    {user?.email}
                    <Mail size={16} />
                  </span>
                  <div className="h-[0.5px] w-full bg-(--primary)/10 my-2"></div>
                  <span
                    title="One Interview cost 1 credit"
                    className="whitespace-nowrap flex gap-2 items-center justify-center cursor-pointer"
                  >
                    Credits : {profile?.credits}
                    {profile?.credits || 0 > 0 ? (
                      <BadgeInfo size={16} />
                    ) : (
                      <BadgeAlert size={16} />
                    )}
                  </span>
                  <div className="h-[0.5px] w-full bg-(--primary)/10 my-2"></div>
                  <button
                    onClick={logout}
                    className="whitespace-nowrap flex gap-2 items-center justify-center text-[#E14434] cursor-pointer"
                  >
                    Logout
                    <LogOut size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <span className="cursor-pointer" onClick={() => openAuthModal()}>
              Login
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
