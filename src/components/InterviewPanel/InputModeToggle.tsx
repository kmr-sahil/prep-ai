// components/InterviewPanel/InputModeToggle.tsx
import { Mic, Type } from "lucide-react";

export default function InputModeToggle({ inputMode, setInputMode }: {
  inputMode: "text" | "voice";
  setInputMode: (mode: "text" | "voice") => void;
}) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h5 className="text-sm pl-[0.5rem] text-(--text)/80 leading-4" />
      <div className="flex">
        <button
          onClick={() => setInputMode("voice")}
          className={`flex items-center space-x-2 px-3 py-1 rounded-l-lg ${
            inputMode === "voice"
              ? "bg-(--accent) text-white"
              : "bg-(--tertiary) text-(--text-muted)"
          }`}
        >
          <Mic size={18} />
        </button>
        <button
          onClick={() => setInputMode("text")}
          className={`flex items-center space-x-2 px-3 py-1 rounded-r-lg ${
            inputMode === "text"
              ? "bg-(--accent) text-white"
              : "bg-(--tertiary) text-(--text-muted)"
          }`}
        >
          <Type size={16} />
        </button>
      </div>
    </div>
  );
}
