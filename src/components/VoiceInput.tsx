"use client";

import React, { useRef, useState, useEffect } from "react";
import { Mic, MicOff, Play, RotateCcw } from "lucide-react";
import { transcribeAudioFile } from "@/utils/transcribEl";
import { transcribeWithSarvam } from "@/utils/transcribeSarvam";

type VoiceInputProps = {
  setCurrentAnswer: (text: string) => void;
  isProcessing: boolean;
  setIsProcessing: (val: boolean) => void;
};

export default function VoiceInput({
  setCurrentAnswer,
  isProcessing,
  setIsProcessing,
}: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcriptedText, setTranscriptedText] = useState("");
  const [duration, setDuration] = useState(0);
  const durationRef = useRef(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setDuration((prev) => {
        durationRef.current = prev + 1;
        return prev + 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      setTranscriptedText("");
      setCurrentAnswer("");
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      startTimer();

      mediaRecorder.onstop = async () => {
        const completeBlob = new Blob(chunksRef.current, {
          type: "audio/webm",
        });
        setAudioBlob(completeBlob);
        await transcribeAndAppend(completeBlob);
      };

      mediaRecorder.start();

      setIsRecording(true);
    } catch (err) {
      console.error("Microphone error:", err);
      alert("Microphone permission denied or not available.");
    } finally {
      setDuration(0);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    stopTimer();
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
  };

  const retryRecording = () => {
    setAudioBlob(null);
    setTranscriptedText("");
    setCurrentAnswer("");
    setDuration(0);
    startRecording();
  };

  const playRecording = () => {
    if (audioBlob && audioRef.current) {
      const url = URL.createObjectURL(audioBlob);
      audioRef.current.src = url;
      audioRef.current.play();
    }
  };

  const transcribeAndAppend = async (blob: Blob) => {
    console.log("duration", durationRef.current); // <- always accurate
    setIsProcessing(true);
    try {
      const text =
        durationRef.current < 29
          ? await transcribeWithSarvam(blob)
          : await transcribeAudioFile(blob);

      const updated = transcriptedText + " " + text;
      setTranscriptedText(updated.trim());
      setCurrentAnswer(updated.trim());
    } catch (err) {
      console.error("Transcription failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-[10rem] flex flex-col justify-center items-center border border-gray-300 rounded-lg p-4 mb-4">
      {!isRecording && !audioBlob ? (
        <div className="text-center">
          <button
            onClick={startRecording}
            disabled={isProcessing}
            className="flex items-center space-x-2 mx-auto px-6 py-3 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          >
            <Mic size={20} />
            <span>Start Recording</span>
          </button>
        </div>
      ) : isRecording ? (
        <div className="text-center">
          <button
            onClick={stopRecording}
            disabled={isProcessing}
            className="flex items-center space-x-2 mx-auto px-6 py-3 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            <MicOff size={20} />
            <span>Stop Recording</span>
          </button>
          <p className="text-[0.9rem] text-red-600 mt-2">
            Recording... {duration}s
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-[0.9rem] text-green-600 font-medium">
            Recording completed! Duration: {duration}s
          </p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={playRecording}
              className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Play size={14} />
              <span>Play</span>
            </button>
            <button
              onClick={retryRecording}
              className="flex items-center space-x-2 px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <RotateCcw size={14} />
              <span>Retry</span>
            </button>
          </div>
          <audio ref={audioRef} className="hidden" controls />
        </div>
      )}

      <span className="text-[0.9rem] text-gray-500 mt-2">
        {transcriptedText || "Press the button to start speaking"}
      </span>
    </div>
  );
}
