"use client";
import React, { useState } from "react";
import { useInterview } from "../context/InterviewContext";

export default function JobInput() {
  const [input, setInput] = useState("");
  const { fetchQuestions, loading, disabled } = useInterview();

  const handleSubmit = () => {
    if (!input.trim()) return;
    fetchQuestions(input);
  };

  return (
    <div className="w-full relative flex flex-col px-2 py-2 rounded-3xl bg-(--muted) border border-(--secondary) text-(--text)">
      <textarea
        id="jobdesc"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your job description..."
        className="w-full px-4 py-3 bg-background  rounded-lg focus:border-accent focus:outline-none resize-none"
        rows={5}
      />

      <div className="flex justify-end mt-2 mb-1 pr-4">
        <button
          onClick={handleSubmit}
          disabled={loading || disabled}
          className="bg-(--accent) text-(--accent-foreground) px-4 py-2 rounded-xl hover:bg-(--accent)/90 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
        >
          {loading
            ? "Generating..."
            : disabled
            ? "Please wait..."
            : "Generate Questions"}
        </button>
      </div>
    </div>
  );
}
