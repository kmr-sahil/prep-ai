"use client";
import React, { useState } from "react";
import { useInterview } from "../context/InterviewContext";
import CustomButton from "./CustomButton";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

export default function JobInput() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const { fetchQuestions, loading, disabled } = useInterview();
  const { isLoggedIn, openAuthModal, hasCredits } = useAuth();
  const [buttonLocked, setButtonLocked] = useState(false);

  const handleSubmit = () => {
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }

    if (hasCredits <= 0) {
      toast((t) => (
        <span className="flex text-sm">
          You are out of&nbsp;<b>&nbsp;credits</b>
          <button
            className="pl-2 text-sm text-(--accent) underline underline-offset-2 flex items-baseline cursor-pointer"
            onClick={() => router.push("/pricing")}
          >
            Recharge it
            {/* <ArrowUpRight size={14} /> */}
          </button>
        </span>
      ));

      return;
    }

    if (!input.trim()) {
      toast.error("Enter proper job description or topic");
      return;
    }
    fetchQuestions(input);
    setInput("");
    setButtonLocked(true); // Lock the button permanently after submit
  };

  return (
    <div className="w-full relative flex flex-col px-2 py-2 rounded-3xl bg-(--muted) border border-(--secondary) text-(--text)">
      <textarea
        id="jobdesc"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your job description..."
        className="w-full px-4 py-3 bg-background rounded-lg focus:border-accent focus:outline-none resize-none"
        rows={5}
      />

      <div className="flex justify-end mt-2 mb-1 pr-4">
        <CustomButton
          title={
            loading
              ? "Generating..."
              : buttonLocked
              ? "Submitted"
              : "Generate Questions"
          }
          loading={loading}
          onClick={handleSubmit}
          disabled={buttonLocked}
        />
      </div>
    </div>
  );
}
