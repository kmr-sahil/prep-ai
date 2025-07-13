"use client"
import React, { createContext, useContext, useState } from "react";
import { GoogleGenAI, Type } from "@google/genai";

// Setup Gemini
const genAI = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "YOUR_API_KEY_HERE",
});

interface InterviewContextProps {
  questions: string[];
  answers: string[];
  activeIndex: number;
  loading: boolean;
  disabled: boolean;
  fetchQuestions: (jobDesc: string) => Promise<void>;
  setAnswer: (answer: string) => void;
  nextQuestion: () => void;
  resetInterview: () => void;
}

const InterviewContext = createContext<InterviewContextProps | null>(null);

export const InterviewProvider = ({ children }: { children: React.ReactNode }) => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const fetchQuestions = async (jobDesc: string) => {
    if (disabled) return;
    setDisabled(true);
    setLoading(true);
    try {
      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash-lite-preview-06-17",
        contents: `Generate 5-10 realistic mock interview questions based on the following job description:\n\n"${jobDesc}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
      });

      const json = JSON.parse(response.text || "[]");
      if (Array.isArray(json)) {
        setQuestions(json);
        setAnswers(new Array(json.length).fill(""));
        setActiveIndex(0);
      } else {
        console.warn("Unexpected response format", response.text);
      }
    } catch (err) {
      console.error("Gemini API error:", err);
    } finally {
      setLoading(false);
      setTimeout(() => setDisabled(false), 30000); // 30s cooldown to avoid spam
    }
  };

  const setAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[activeIndex] = answer;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (activeIndex < questions.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const resetInterview = () => {
    setQuestions([]);
    setAnswers([]);
    setActiveIndex(0);
    setDisabled(false);
  };

  return (
    <InterviewContext.Provider
      value={{
        questions,
        answers,
        activeIndex,
        loading,
        disabled,
        fetchQuestions,
        setAnswer,
        nextQuestion,
        resetInterview,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }
  return context;
};
