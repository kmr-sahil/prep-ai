"use client";
import React, { useState, useEffect } from "react";
import { useInterview } from "../context/InterviewContext";
import CustomButton from "./CustomButton";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { jobTitleTags, difficultyTags } from "@/constants/tags";

export default function JobInput() {
  const router = useRouter();
  const [input, setInput] = useState<string>("");
  const { fetchQuestions, loading, questions, disabled } = useInterview();
  const { isLoggedIn, openAuthModal, hasCredits } = useAuth();

  const [buttonLocked, setButtonLocked] = useState<boolean>(false);
  const [jobTitle, setJobTitle] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string[]>([]);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(3);
  // Update textarea content based on selections
  useEffect(() => {
    if (jobTitle && jobTitle.toLowerCase() !== "custom job description") {
      let content = `Job Role: ${jobTitle}`;
      if (difficulty.length > 0) {
        content += `\nDifficulty: ${difficulty.join(", ")}`;
      }
      // content += "\n\nJob Description:\n"
      setInput(content);
    } else if (jobTitle && jobTitle.toLowerCase() === "custom") {
      setInput(""); // Clear textarea for custom input
    }
  }, [jobTitle, difficulty]);

  const handleJobTitleClick = (tag: string) => {
    if (jobTitle === tag) {
      // Deselect job title and reset everything
      setJobTitle("");
      setDifficulty([]);
      setInput("");
    } else {
      // Select new job title and reset difficulty
      setJobTitle(tag);
      setDifficulty([]);
    }
  };

  const handleDifficultyClick = (tag: string) => {
    let updatedDifficulty = [...difficulty];

    if (difficulty.includes(tag)) {
      updatedDifficulty = difficulty.filter((item) => item !== tag);
    } else {
      updatedDifficulty.push(tag);
    }

    // Set number of questions if those tags are selected
    if (tag === "3-5 questions") {
      setNumberOfQuestions(3);
    } else if (tag === "5-10 questions") {
      setNumberOfQuestions(5);
    }

    setDifficulty(updatedDifficulty);
  };

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
    fetchQuestions(input, numberOfQuestions);
    setInput("");
    setButtonLocked(true); // Lock the button permanently after submit
  };

  // useEffect(() => {
  //   console.log(input);
  // }, [input]);

  if (questions.length) return null;

  return (
    <div className="w-full relative flex flex-col px-2 py-2 rounded-3xl bg-(--muted) border border-(--secondary) text-(--text)">
      <div className="w-full flex flex-wrap items-center mb-2">
        {!jobTitle &&
          jobTitleTags.map((tag, key) => (
            <span
              key={key}
              onClick={() => setJobTitle(tag)}
              className="tag mr-2 mb-2 px-3 py-1 rounded-full bg-(--muted) border border-(--secondary) text-(--text)/80 text-xs whitespace-nowrap cursor-pointer"
            >
              {tag}
            </span>
          ))}

        {jobTitle && (
          <>
            {/* Show selected job title with different styling */}
            <span
              onClick={() => handleJobTitleClick(jobTitle)}
              className="tag mr-2 mb-2 px-3 py-1 rounded-full bg-(--accent) border border-(--primary)/20 hover:border-(--accent)/50 text-white text-xs whitespace-nowrap cursor-pointer"
            >
              {jobTitle} ✕
            </span>

            {/* Show difficulty tags */}
            {difficultyTags.map((tag, key) => (
              <span
                key={key}
                onClick={() => handleDifficultyClick(tag)}
                className={`tag mr-2 mb-2 px-3 py-1 rounded-full text-xs whitespace-nowrap cursor-pointer transition-colors ${
                  difficulty.includes(tag)
                    ? "bg-(--accent) text-white"
                    : "bg-(--muted) border border-(--primary)/20 text-(--text)/80 hover:border-(--accent)/50"
                }`}
              >
                {tag} {difficulty.includes(tag) ? "✕" : ""}
              </span>
            ))}
          </>
        )}
      </div>

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
