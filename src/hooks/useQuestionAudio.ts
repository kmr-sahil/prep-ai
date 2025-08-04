// hooks/useQuestionAudio.ts
import { useEffect, useRef, useState } from "react";
import { generateSpeechUrl } from "@/utils/textToSpeech";
import toast from "react-hot-toast";

export default function useQuestionAudio(questions: string[], activeIndex: number) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!questions.length || activeIndex >= questions.length) return;
    let isCancelled = false;

    setAudioReady(false);
    setAudioUrl(null);

    async function fetchAudio() {
      try {
        const url = await generateSpeechUrl(questions[activeIndex]);
        if (isCancelled) return;
        setAudioUrl(url);
      } catch {
        setAudioReady(true);
        toast.error("Failed to load audio for the question.");
      }
    }

    fetchAudio();

    return () => {
      isCancelled = true;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [questions, activeIndex]);

  useEffect(() => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.oncanplaythrough = () => {
      setAudioReady(true);
      audio.play().catch(() => {});
    };

    audio.onerror = () => {
      setAudioReady(true);
      toast.error("Error playing question audio.");
    };

    return () => {
      audio.pause();
      audioRef.current = null;
      if (audioUrl.startsWith("blob:")) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return { audioReady };
}
