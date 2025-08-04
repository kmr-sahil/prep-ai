"use client";

import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { Mic, Type, Send, Volume2 } from "lucide-react";
import Link from "next/link";

import { useInterview } from "../context/InterviewContext";
import FeedbackBox from "./FeedbackBox";
import CustomButton from "./CustomButton";
import VoiceInput from "./VoiceInput/VoiceInput";
import { generateFeedbackPDF } from "@/utils/generateFeedbackPDF";
import { TextEffect } from "./TextAnimation";
import { generateSpeechUrl } from "@/utils/textToSpeech";
import { playAudioFromUrl } from "@/utils/playAudio";

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

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load and play audio for current question
  useEffect(() => {
    if (!questions.length || activeIndex >= questions.length) {
      return;
    }

    let isCancelled = false;

    setAudioReady(false);
    setShowQuestion(false);
    setAudioUrl(null);

    async function fetchAndSetAudio() {
      try {
        console.log("[InterviewPanel] Generating speech URL for question ", activeIndex);
        const url = await generateSpeechUrl(questions[activeIndex]);
        if (isCancelled) return;

        console.log("[InterviewPanel] Generated audio URL:", url);
        setAudioUrl(url);
      } catch (error) {
        console.error("[InterviewPanel] Error generating audio:", error);
        setAudioReady(true);
        setShowQuestion(true);
        toast.error("Failed to load audio for the question.");
      }
    }

    fetchAndSetAudio();

    return () => {
      isCancelled = true;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [activeIndex, questions]);

  // Play audio when audioUrl changes
  useEffect(() => {
    if (!audioUrl) return;

    console.log("[InterviewPanel] Playing audio from URL:", audioUrl);

    // playAudioFromUrl returns a cleanup function
    const cleanup = playAudioFromUrl(
      audioUrl,
      () => {
        console.log("[InterviewPanel] Audio playback ended successfully.");
        setAudioReady(true);
        setShowQuestion(true);
      }
      
    );

    return () => {
      cleanup();
    };
  }, [audioUrl]);

  // Replay audio on clicking 🔊 icon
  const replayAudio = () => {
    if (!audioUrl) return;

    setAudioReady(false);
    setShowQuestion(false);

    const cleanup = playAudioFromUrl(
      audioUrl,
      () => {
        setAudioReady(true);
        setShowQuestion(true);
        cleanup();
      }
    );
  };

  // Handle submit / next button click
  const handleSubmit = async () => {
    const trimmed = currentAnswer.trim();
    if (!trimmed) {
      toast.error("Please provide an answer before submitting.");
      return;
    }

    setAnswer(trimmed);
    setCurrentAnswer("");

    if (activeIndex === questions.length - 1) {
      // Last question: get feedback
      setIsProcessing(true);
      try {
        const res = await getInterviewFeedback();
        setFeedback(res);
        setResult(true);
      } catch (err) {
        console.error("[InterviewPanel] Error getting feedback:", err);
        toast.error("Failed to get feedback.");
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Preload audio for next question then advance question and show text
      setIsProcessing(true);
      setShowQuestion(false);
      setAudioReady(false);

      try {
        const nextIndex = activeIndex + 1;
        console.log("[InterviewPanel] Preloading next question audio:", nextIndex);
        const nextAudioUrl = await generateSpeechUrl(questions[nextIndex]);
        setAudioUrl(nextAudioUrl);

        playAudioFromUrl(
          nextAudioUrl,
          () => {
            setAudioReady(true);
            setShowQuestion(true);
            nextQuestion(); // Advance after audio playback
            setIsProcessing(false);
          },
        );
      } catch (error) {
        console.error("[InterviewPanel] Failed to load next question audio:", error);
        toast.error("Failed to load audio for the next question.");
        setIsProcessing(false);
        // As fallback, proceed to next question immediately
        nextQuestion();
        setShowQuestion(true);
        setAudioReady(true);
      }
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
              className="text-sm sm:text-base flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-(--secondary) text-(--text) border-(--muted)/10 hover:bg-(--secondary)/90 cursor-pointer transition-colors"
            >
              <Send size={12} />
              Help us Improve
            </Link>
            <CustomButton
              title="Download PDF Feedback"
              styleType="secondary"
              onClick={() => generateFeedbackPDF(questions, answers, feedback)}
            />
            <CustomButton title="Practice more" onClick={resetInterview} />
          </div>
        </>
      ) : (
        <>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-[0.9rem] pl-[0.5rem] font-medium text-(--text-muted)/80">
              Question {activeIndex + 1} of {questions.length}
            </h2>

            {/* Replay audio button */}
            <button
              onClick={replayAudio}
              disabled={!audioReady || isProcessing || loading}
              className={`text-(--text-muted) hover:text-(--accent) p-1 rounded ${
                !audioReady || isProcessing || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              aria-label="Replay question audio"
              type="button"
            >
              <Volume2 size={20} />
            </button>
          </div>

          {/* Show question only after audio is ready and played */}
          {showQuestion && (
            <div className="mb-6 px-3 py-2 bg-(--accent)/20 border-dashed border border-(--text)/10 rounded-lg">
              <p className="text-[1.1rem] font-normal text-(--text)">
                <TextEffect per="word" as="span" preset="fade" key={activeIndex}>
                  {questions[activeIndex]}
                </TextEffect>
              </p>
            </div>
          )}

          {/* Input mode toggle */}
          <div className="flex justify-between items-center mb-4">
            <Volume2 size={20} className="text-(--text-muted)" />
            <div className="flex">
              <button
                onClick={() => setInputMode("voice")}
                className={`flex items-center space-x-2 px-3 py-1 rounded-l-lg ${
                  inputMode === "voice"
                    ? "bg-(--accent) text-white"
                    : "bg-(--tertiary) text-(--text-muted) hover:bg-(--tertiary)/80 cursor-pointer"
                }`}
                type="button"
              >
                <Mic size={18} />
              </button>
              <button
                onClick={() => setInputMode("text")}
                className={`flex items-center text-[0.9rem] space-x-2 px-3 py-1 rounded-r-lg ${
                  inputMode === "text"
                    ? "bg-(--accent) text-white"
                    : "bg-(--tertiary) text-(--text-muted) hover:bg-(--tertiary)/80 cursor-pointer"
                }`}
                type="button"
              >
                <Type size={16} />
              </button>
            </div>
          </div>

          {/* Answer input area */}
          {inputMode === "text" ? (
            <div
              className={`transition-opacity duration-300 ${
                inputMode === "text" ? "opacity-100" : "opacity-30"
              }`}
            >
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                className="w-full p-3 bg-(--tertiary) border border-(--secondary) rounded-lg mb-4 focus:outline-2 focus:outline-(--accent)"
                rows={6}
                placeholder="Type your answer here..."
                disabled={!audioReady || isProcessing || loading}
              />
            </div>
          ) : (
            <div
              className={`transition-opacity duration-300 ${
                inputMode === "voice" ? "opacity-100" : "opacity-30"
              }`}
            >
              {audioReady && !isProcessing && !loading && (
                <VoiceInput
                  resetTrigger={activeIndex}
                  setCurrentAnswer={setCurrentAnswer}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                />
              )}
            </div>
          )}

          {/* Submit / Next button */}
          <CustomButton
            className="ml-auto"
            onClick={handleSubmit}
            loadingTitle={[
              "Processing...",
              "Still working...",
              "Almost done...",
              "Just a second...",
            ]}
            disabled={isProcessing || loading || !audioReady}
            loading={isProcessing || loading}
            title={activeIndex === questions.length - 1 ? "Submit & Get Feedback" : "Next"}
          />
        </>
      )}
    </div>
  );
}
