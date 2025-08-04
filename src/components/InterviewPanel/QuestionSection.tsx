// components/InterviewPanel/QuestionSection.tsx
import { Volume2 } from "lucide-react";
import { TextEffect } from "../TextAnimation";

export default function QuestionSection({
  question,
  index,
  total,
  replayAudio
}: {
  question: string;
  index: number;
  total: number;
  replayAudio: () => void;
}) {
  return (
    <>
      <div className="mb-6">
        <div className="flex w-full justify-between items-center"><h2 className="text-[0.9rem] pl-[0.5rem] font-medium text-(--text-muted)/80">
          Question {index + 1} of {total}
        </h2>
         <button
              onClick={replayAudio}
              className={`text-(--text-muted) hover:text-(--accent) p-1 rounded cursor-pointer`}
              aria-label="Replay question audio"
              type="button"
            >
              <Volume2 size={20} />
            </button>
            </div>
      </div>
      <div className="mb-6 px-3 py-2 bg-(--accent)/20 border-dashed border border-(--text)/10 rounded-lg">
        <p className="text-[1.1rem] font-normal text-(--text)">
          <TextEffect per="word" as="span" preset="fade" key={index}>
            {question}
          </TextEffect>
        </p>
      </div>
    </>
  );
}
