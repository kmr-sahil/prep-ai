import InterviewPanel from "@/components/InterviewPanel";
import JobInput from "@/components/JobInput";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col flex-grow gap-4 py-24 w-[100%] max-w-[48rem] mx-auto">

          <JobInput />
          <InterviewPanel />

    </div>
  );
}
