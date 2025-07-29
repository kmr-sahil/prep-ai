// components/VoiceInput/Recorder.tsx
import { Mic, MicOff } from "lucide-react";

interface RecorderProps {
  isRecording: boolean;
  duration: number;
  start: () => void;
  stop: () => void;
  isProcessing: boolean;
}

export default function Recorder({
  isRecording, duration, start, stop, isProcessing
}: RecorderProps) {
  return (
    <div className="text-center">
      {!isRecording ? (
        <button onClick={start} disabled={isProcessing} className="flex items-center space-x-2 mx-auto px-3 py-2 rounded-lg text-sm bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 cursor-pointer">
          <Mic size={15} /><span>Start Recording</span>
        </button>
      ) : (
        <>
          <button onClick={stop} disabled={isProcessing} className="flex items-center space-x-2 mx-auto px-3 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer">
            <MicOff size={15} /><span>Stop Recording</span>
          </button>
          <p className="text-[0.9rem] text-red-600 mt-2">Recording... {duration}s</p>
        </>
      )}
    </div>
  );
}
