"use client";

import React, { useState } from "react";
import { generateSpeechUrl } from "@/utils/textToSpeech";
import { playAudioFromUrl } from "@/utils/playAudio";
import { Volume2 } from "lucide-react"; // Icon

export default function AudioTestPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [lastAudioData, setLastAudioData] = useState<string | null>(null); // Store last audio

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const audioData = await generateSpeechUrl(text);
      setLastAudioData(audioData); // Save it for replay
      playAudioFromUrl(audioData, () => setAudioReady(true), () => setAudioReady(true));
    } catch (err) {
      console.error("Audio generation failed:", err);
      alert("Failed to generate or play audio.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleReplay = () => {
    if (lastAudioData) {
      playAudioFromUrl(lastAudioData, () => {}, () => {});
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-semibold mb-4">Text-to-Speech Player</h1>

      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Type something..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 pr-10"
          disabled={loading}
        />
        {audioReady && lastAudioData && (
          <button
            onClick={handleReplay}
            className="absolute right-3 top-2.5 text-gray-600 hover:text-black"
            title="Replay Audio"
          >
            <Volume2 size={20} />
          </button>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Generating Audio..." : "Speak"}
      </button>
    </div>
  );
}
