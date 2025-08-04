// components/InterviewPanel/InterviewPanel.tsx
"use client";

import React, { act, useEffect, useRef, useState } from "react";
import { useInterview } from "@/context/InterviewContext";
import toast from "react-hot-toast";

import QuestionSection from "./QuestionSection";
import InputModeToggle from "./InputModeToggle";
import TextAnswerInput from "./TextAnswerInput";
import VoiceAnswerInput from "./VoiceAnswerInput";
import ResultSection from "./ResultSection";
import CustomButton from "../CustomButton";
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

  // const [audioReady, setAudioReady] = useState(false);
  const [lastAudioData, setLastAudioData] = useState<string | null>(null);

  const playAudio = async (i: number) => {
    try {
      const audioData = await generateSpeechUrl(questions[i]);
      setLastAudioData(audioData); // Save it for replay
      playAudioFromUrl(
        audioData,
        () => {},
        () => {}
      );
    } catch (err: any) {
      toast.error("Audio generation failed:", err);
    }
    // finally {
    //   setLoading(false);
    // }
  };

  const handleReplay = () => {
    if (lastAudioData) {
      playAudioFromUrl(
        lastAudioData,
        () => {},
        () => {}
      );
    }
  };

  const handleSubmit = async () => {
    const trimmed = currentAnswer.trim();
    if (!trimmed) {
      toast.error("Please provide an answer before submitting.");
      return;
    }

    setAnswer(trimmed);
    setCurrentAnswer("");
    setIsProcessing(true);

    if (activeIndex === questions.length - 1) {
      const res = await getInterviewFeedback();
      setFeedback(res);
      setResult(true);
    } else {
      await playAudio(activeIndex + 1);
      nextQuestion();
    }
    setIsProcessing(false);
  };

  const startInterview = async () => {
    if (questions.length === 0) {
      toast.error("No questions available to start the interview.");
      return;
    }

    setIsProcessing(true);

    try {
      await playAudio(0);
      setIsProcessing(false);
    } catch (err) {
      console.log("Error starting interview:", err);
      toast.error("Failed to start the interview.");
      setIsProcessing(false);
    }
  }

  if (!questions.length && !result) return null;



  return (
    <div className="p-6 w-full bg-(--muted) border border-(--secondary) text-(--text) rounded-2xl">
      {lastAudioData == null ? 
        <>
        <p className="mx-auto">Your questions are ready. You can proceed.</p>
        <CustomButton
          className="my-4 mx-auto"
          onClick={startInterview}
          title="Start Interview"
        /></> :
      result ? (
        <ResultSection
          feedback={feedback}
          questions={questions}
          answers={answers}
          resetInterview={resetInterview}
        />
      ) : (
        <>
          <QuestionSection
            replayAudio={handleReplay}
            question={questions[activeIndex]}
            index={activeIndex}
            total={questions.length}
          />

          <InputModeToggle inputMode={inputMode} setInputMode={setInputMode} />

          {inputMode === "text" ? (
            <TextAnswerInput
              value={currentAnswer}
              setValue={setCurrentAnswer}
            />
          ) : (
            <VoiceAnswerInput
              activeIndex={activeIndex}
              setCurrentAnswer={setCurrentAnswer}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />
          )}

          <CustomButton
            className="ml-auto"
            onClick={handleSubmit}
            loading={isProcessing || loading}
            loadingTitle={[
              "Processing...",
              "Still working...",
              "Almost done...",
              "Just a second...",
            ]}
            disabled={isProcessing || loading}
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
