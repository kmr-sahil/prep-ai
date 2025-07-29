"use client";

import React, { useRef, useState } from "react";
import { speedUpAudioBlob } from "@/utils/audioFasten";

export default function Page() {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [fastenedBlob, setFastenedBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Start recording
  const startRecording = async () => {
    setFastenedBlob(null);
    setDuration(0);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };
    recorder.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      clearInterval(timerRef.current!);
      const completeBlob = new Blob(chunksRef.current, { type: "audio/webm" });
      setAudioBlob(completeBlob);
    };
    setIsRecording(true);
    recorder.start();

    // Timer for duration display
    timerRef.current = setInterval(() => {
      setDuration((d) => d + 1);
    }, 1000);
  };

  // Stop recording
  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    clearInterval(timerRef.current!);
  };

  // Speed up the audio by 1.2x
  const handleSpeedUp = async () => {
    if (!audioBlob) return;
    setIsProcessing(true);
    try {
      const faster = await speedUpAudioBlob(audioBlob, 1.1);
      console.log("Speed up complete:", faster);
      setFastenedBlob(faster);
    } catch (err) {
        console.error("Error speeding up audio:", err);
      alert("Failed to speed up audio!");
    } finally {
      setIsProcessing(false);
    }
  };

  // Clean-up when unmounted
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6 mt-[8rem]">
      <h1 className="text-xl font-bold mb-4">Test Audio Recording & Speed-up</h1>

      {/* Recorder controls */}
      {!isRecording && !audioBlob && (
        <button
          className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
          onClick={startRecording}
        >
          Start Recording
        </button>
      )}

      {isRecording && (
        <div>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={stopRecording}
          >
            Stop Recording
          </button>
          <div className="mt-2 text-red-700 font-semibold">
            Recording... {duration}s
          </div>
        </div>
      )}

      {/* After recording: playback and speed up */}
      {audioBlob && (
        <div>
          <div>
            <h2 className="font-semibold">Original Audio</h2>
            <audio controls src={URL.createObjectURL(audioBlob)} />
            <div className="mb-2">Duration as recorded: {duration}s</div>
          </div>

          <button
            onClick={handleSpeedUp}
            disabled={isProcessing}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Speed Up by 1.2x"}
          </button>
        </div>
      )}

      {fastenedBlob && (
        <div>
          <h2 className="font-semibold mt-4">Fastened Audio (1.2x speed)</h2>
          <audio controls src={URL.createObjectURL(fastenedBlob)} />
          <p>Listen! The file is actually shorter and plays faster.</p>
        </div>
      )}

      {(audioBlob || fastenedBlob) && (
        <button
          className="mt-4 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
          onClick={() => {
            setAudioBlob(null);
            setFastenedBlob(null);
            setDuration(0);
          }}
        >
          Reset / Record Again
        </button>
      )}
    </div>
  );
}
