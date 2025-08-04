import FeedbackBox from "../FeedbackBox";
import CustomButton from "../CustomButton";
import Link from "next/link";
import { Send } from "lucide-react";
import { generateFeedbackPDF } from "@/utils/generateFeedbackPDF";

export default function ResultSection({
  feedback,
  questions,
  answers,
  resetInterview,
}: any) {
  return (
    <>
      <FeedbackBox feedback={feedback} />
      <div className="ml-auto justify-end flex flex-col md:flex-row gap-2 md:gap-4 mt-8 text-sm">
        <Link
          href={"https://tally.so/r/3lkVQB"}
          className="text-sm sm:text-base flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-(--secondary) text-(--text) border-(--muted)/10 hover:bg-(--secondary)/90 cursor-pointer transition-colors"
        >
          <Send size={12} />
          Help us Improve
        </Link>
        <CustomButton
          title="Download PDF Feedback"
          styleType="secondary"
          onClick={() => generateFeedbackPDF(questions, answers, feedback)}
        />
        <CustomButton title="Practice more" onClick={resetInterview} />
      </div>
    </>
  );
}
