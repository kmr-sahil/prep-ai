// components/VoiceInput/VoiceInput.tsx
"use client";

import { useState } from "react";
import Recorder from "./Recorder";
import Player from "./Player";
import { useAuth } from "@/context/AuthContext";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { transcribeWithSarvam } from "@/utils/transcribeSarvam";
import { transcribeAudioFile } from "@/utils/transcribEl";
import React from "react";
import toast from "react-hot-toast";

type VoiceInputProps = {
  resetTrigger: number;
  setCurrentAnswer: (text: string) => void;
  isProcessing: boolean;
  setIsProcessing: (val: boolean) => void;
};

export default function VoiceInput({
  resetTrigger,
  setCurrentAnswer,
  isProcessing,
  setIsProcessing,
}: VoiceInputProps) {
  const { hasCredits } = useAuth();
  const [transcriptedText, setTranscriptedText] = useState("");

  // Handler after recording stops (called by custom hook)
  const handleStop = async (blob: Blob, duration: number) => {
    setIsProcessing(true);
    try {
      const text =
        duration < 29
          ? await transcribeWithSarvam(blob)
          : await transcribeAudioFile(blob);

      const updated = (transcriptedText + " " + text).trim();
      setTranscriptedText(updated);
      setCurrentAnswer(updated);
    } catch (err) {
      toast.error("Transcription failed");
      console.log("Transcription failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const {
    isRecording,
    audioBlob,
    duration,
    startRecording,
    stopRecording,
    reset,
  } = useAudioRecorder(handleStop);

  // Handle external reset
  React.useEffect(() => {
    reset();
    setTranscriptedText("");
  }, [resetTrigger]);

  return (
    <div className="min-h-[10rem] flex flex-col justify-center items-center border-2 border-(--tertiary) bg-(--tertiary) rounded-lg p-4 mb-4">
      {!audioBlob ? (
        <Recorder
          isRecording={isRecording}
          duration={duration}
          start={startRecording}
          stop={stopRecording}
          isProcessing={isProcessing}
        />
      ) : (
        <Player
          audioBlob={audioBlob}
          duration={duration}
          onRetry={reset}
          hasCredits={hasCredits}
        />
      )}

      <span className="text-[0.9rem] text-gray-500 mt-2">
        {transcriptedText || "Press the button to start speaking"}
      </span>
    </div>
  );
}
