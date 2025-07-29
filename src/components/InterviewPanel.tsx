"use client";
import React, { useState } from "react";
import { Mic, Type, Send } from "lucide-react";
import { useInterview } from "../context/InterviewContext";
import FeedbackBox from "./FeedbackBox";
import { generateFeedbackPDF } from "@/utils/generateFeedbackPDF";
import { TextEffect } from "./TextAnimation";
import CustomButton from "./CustomButton";
import Link from "next/link";
import VoiceInput from "./VoiceInput/VoiceInput";
import toast from "react-hot-toast";

export default function InterviewPanel() {
  const {
    questions,
    activeIndex,
    answers,
    setAnswer,
    nextQuestion,
    getInterviewFeedback,
    resetInterview,
    loading,
  } = useInterview();

  const [currentAnswer, setCurrentAnswer] = useState("");
  const [inputMode, setInputMode] = useState<"text" | "voice">("voice");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(false);
  const [feedback, setFeedback] = useState<any>();

  const handleSubmit = async () => {
    const trimmed = currentAnswer.trim();
    if (!trimmed) {
      toast.error("Please provide an answer before submitting.");
      return;
    }

    console.log("Submitting answer:", trimmed);

    setAnswer(trimmed);
    setCurrentAnswer("");

    // If this is the last question
    if (activeIndex === questions.length - 1) {
      const res = await getInterviewFeedback();
      setFeedback(res);
      setResult(true);
      console.log("Gemini Feedback:", res);
    } else {
      nextQuestion();
    }
  };

  if (!questions.length && !result) return null;

  return (
    <div className="p-6 w-full bg-(--muted) border border-(--secondary) text-(--text) rounded-2xl">
      {result && feedback ? (
        <>
          <FeedbackBox feedback={feedback} />
          <div className="ml-auto justify-end flex flex-col md:flex-row gap-2 md:gap-4 mt-8 text-sm">
            <Link
              href={"https://tally.so/r/3lkVQB"}
              className=" text-sm sm:text-base flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-(--secondary) text-(--text) border-(--muted)/10 hover:bg-(--secondary)/90 cursor-pointer transition-colors"
            >
              <Send size={12} />
              Help us Improve
            </Link>
            <CustomButton
              title="Download PDF Feedback"
              styleType="secondary"
              onClick={() => generateFeedbackPDF(questions, answers, feedback)}
            />
            <CustomButton
              title="Practice more"
              onClick={() => resetInterview()}
            />
          </div>
        </>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-[0.9rem] pl-[0.5rem] font-medium text-(--text-muted)/80">
              Question {activeIndex + 1} of {questions.length}
            </h2>
            {/* <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((activeIndex + 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div> */}
          </div>

          <div className="mb-6 px-3 py-2 bg-(--accent)/20 border-dashed border border-(--text)/10 rounded-lg">
            <p className="text-[1.1rem] font-normal text-(--text)">
              <TextEffect per="word" as="span" preset="fade" key={activeIndex}>
                {questions[activeIndex]}
              </TextEffect>
            </p>
          </div>

          {/* Toggle Input Mode */}
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-sm pl-[0.5rem] font- text-(--text)/80 leading-4">
              {inputMode == "text" ? "" : ""}
            </h5>
            <div className=" flex">
              <button
                onClick={() => setInputMode("voice")}
                className={`flex items-center space-x-2 px-3 py-1 rounded-l-lg ${
                  inputMode === "voice"
                    ? "bg-(--accent) text-white"
                    : "bg-(--tertiary) text-(--text-muted) hover:bg-(--tertiary)/80 cursor-pointer"
                }`}
              >
                <Mic size={18} />
                {/* <span>Voice Input</span> */}
              </button>
              <button
                onClick={() => setInputMode("text")}
                className={`flex items-center text-[0.9rem] space-x-2 px-3 py-1 rounded-r-lg ${
                  inputMode === "text"
                    ? "bg-(--accent) text-white"
                    : "bg-(--tertiary) text-(--text-muted) hover:bg-(--tertiary)/80 cursor-pointer"
                }`}
              >
                <Type size={16} />
                {/* <span>Text Input</span> */}
              </button>
            </div>
          </div>

          {inputMode == "text" ? (
            <>
              {/* Text Input */}
              <div
                className={`transition-opacity duration-300 ${
                  inputMode === "text" ? "opacity-100" : "opacity-30"
                }`}
              >
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  className="w-full p-3 bg-(--tertiary) border border-(--secondary) rounded-lg mb-4 focus:outline-2 focus:outline-(--accent)  "
                  rows={6}
                  placeholder="Type your answer here..."
                />
              </div>{" "}
            </>
          ) : (
            <>
              {/* Voice Input */}
              <div
                className={`transition-opacity duration-300 ${
                  inputMode === "voice" ? "opacity-100" : "opacity-30"
                }`}
              >
                <VoiceInput
                  resetTrigger={activeIndex}
                  setCurrentAnswer={setCurrentAnswer}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                />
              </div>
            </>
          )}

          {/* Submit */}
          <CustomButton
            className="ml-auto"
            onClick={handleSubmit}
            loadingTitle={[
              "Processing...",
              "Still working...",
              "Almost done...",
              "Just a second...",
            ]}
            disabled={isProcessing || loading}
            loading={isProcessing || loading}
            title={
              activeIndex === questions.length - 1
                ? "Submit & Get Feedback"
                : "Next"
            }
          />
        </>
      )}
    </div>
  );
}
