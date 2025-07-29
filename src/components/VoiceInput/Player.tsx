// components/VoiceInput/Player.tsx
import { Play, RotateCcw } from "lucide-react";
import { useRef } from "react";

interface PlayerProps {
  audioBlob: Blob;
  duration: number;
  onRetry: () => void;
  hasCredits: number;
}

export default function Player({ audioBlob, duration, onRetry, hasCredits }: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const playRecording = () => {
    if (audioBlob && audioRef.current) {
      const url = URL.createObjectURL(audioBlob);
      audioRef.current.src = url;
      audioRef.current.playbackRate = 1.0; // or 1.2 if you want speedup on playback only
      audioRef.current.play();
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-[0.9rem] text-green-600 font-medium">
        Recording completed! Duration: {duration}s
      </p>
      <div className="flex justify-center space-x-3">
        <button onClick={playRecording} className="flex text-sm items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Play size={14} /><span>Play</span>
        </button>
        <button onClick={onRetry} disabled={hasCredits > 2} title="You need PRO to retry" className="flex text-sm items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
          <RotateCcw size={14} /><span>Retry</span>
        </button>
      </div>
      <audio ref={audioRef} className="hidden" controls />
    </div>
  );
}
