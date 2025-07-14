"use client";
import React, { useState } from "react";
import { Mic, Type, Send } from "lucide-react";
import VoiceInput from "./VoiceInput"; // import the new component
import { useInterview } from "../context/InterviewContext";
import FeedbackBox from "./FeedbackBox";

export default function InterviewPanel() {
  const {
    questions,
    activeIndex,
    answers,
    setAnswer,
    nextQuestion,
    getInterviewFeedback,
    resetInterview,
  } = useInterview();

  const [currentAnswer, setCurrentAnswer] = useState("");
  const [inputMode, setInputMode] = useState<"text" | "voice">("voice");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(false);
  const [feedback, setFeedback] = useState<any>();

  const handleSubmit = async () => {
    const trimmed = currentAnswer.trim();
    if (!trimmed) {
      alert("Please provide an answer before submitting.");
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
          <button
            onClick={resetInterview}
            className="ml-auto flex items-center justify-end bg-(--accent) text-(--accent-foreground) px-4 py-2 rounded-xl hover:bg-(--accent)/90 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            Practice more
          </button>
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
              {questions[activeIndex]}
            </p>
          </div>

          {/* Toggle Input Mode */}
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-[0.9rem] pl-[0.5rem] font- text-(--text)/80">
              {inputMode == "text"
                ? ""
                : "Speak up your answer confident and clearly"}
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
                  setCurrentAnswer={setCurrentAnswer}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                />
              </div>
            </>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isProcessing || currentAnswer == ""}
            className="ml-auto flex items-center justify-end bg-(--accent) text-(--accent-foreground) px-4 py-2 rounded-xl hover:bg-(--accent)/90 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                {/* <Send size={18} /> */}
                <span>
                  {activeIndex < questions.length - 1
                    ? "Next Question"
                    : "Finish Interview"}
                </span>
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}
