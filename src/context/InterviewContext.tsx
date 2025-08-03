"use client";
import React, { createContext, useContext, useState } from "react";
import { GoogleGenAI, Type } from "@google/genai";
import { decrementCredit } from "@/utils/updateCredits";
import { useAuth } from "./AuthContext";
import { general, threeToFive, fiveToTen, feedbackPrompt } from "@/constants/getQuestionsPrompt";

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
  fetchQuestions: (jobDesc: string, numberOfQuestions: number) => Promise<void>;
  setAnswer: (answer: string) => void;
  nextQuestion: () => void;
  getInterviewFeedback: () => Promise<{
    feedback: string;
    soi: string;
    tips: string[];
    score: number;
  } | null>;

  resetInterview: () => void;
}

const InterviewContext = createContext<InterviewContextProps | null>(null);

export const InterviewProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {profile} = useAuth();
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const fetchQuestions = async (jobDesc: string, numberOfQuestions: number) => {
    if (disabled) return;
    setDisabled(true);
    setLoading(true);
    try {
      const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash-lite",
        contents: `${general} ${numberOfQuestions <= 3 ? threeToFive : fiveToTen} ${jobDesc} "`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
      });

      // decrement the credit
      console.log("Decrementing credit for profile:", profile);
      await decrementCredit(profile?.credits || 0)

      const json = JSON.parse(response.text || "[]");

      if (Array.isArray(json)) {
        console.log("Received questions:", json);
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

  const getInterviewFeedback = async (): Promise<{
    feedback: string;
    soi: string;
    tips: string[];
    score: number;
  } | null> => {
    setLoading(true);
    try {
      const qa = questions
        .map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i]}`)
        .join("\n");

      const prompt = ` ${feedbackPrompt} ${qa} `.trim();

      const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash-lite",
        contents: prompt,
      });

      const text = response.text?.trim();
      if (!text) return null;

      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}") + 1;
      const jsonString = text.slice(jsonStart, jsonEnd);

      const result = JSON.parse(jsonString);
      return result;
    } catch (err) {
      console.error("Gemini feedback error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetInterview = () => {
    window.location.reload();
    // setQuestions([]);
    // setAnswers([]);
    // setActiveIndex(0);
    // setDisabled(false);
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
        getInterviewFeedback,
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
