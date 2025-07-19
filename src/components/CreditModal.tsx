"use client"
import { useAuth } from "@/context/AuthContext";
import React from "react";

function CustomModal() {

  return (
    <div className=" inset-0 z-50 bg-(--primary)/10 bg-opacity-50 flex items-center justify-center">
      <div className="bg-(--muted) border border-(--secondary) text-(--text) rounded-xl shadow-lg p-6 w-full max-w-sm relative"></div>
    </div>
  );
}

export default CustomModal;
