// hooks/useAudioRecorder.ts
import { useRef, useState, useEffect } from "react";

export function useAudioRecorder(onStop: (audio: Blob, duration: number) => void) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState(0);
  const durationRef = useRef(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
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
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    setAudioBlob(null);
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const completeBlob = new Blob(chunksRef.current, { type: "audio/webm" });
      setAudioBlob(completeBlob);
      stopTimer();
      onStop(completeBlob, durationRef.current);
    };

    mediaRecorder.start();
    setDuration(0);
    setIsRecording(true);
    startTimer();
  };

  const stopRecording = () => {
    setIsRecording(false);
    stopTimer();
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
  };

  const reset = () => {
    setAudioBlob(null);
    setDuration(0);
    setIsRecording(false);
  };

  return {
    isRecording,
    audioBlob,
    duration,
    startRecording,
    stopRecording,
    reset
  };
}
