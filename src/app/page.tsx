import AuthModal from "@/components/AuthModal";
import InterviewPanel from "@/components/InterviewPanel";
import JobInput from "@/components/JobInput";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="flex items-center min-h-screen flex-col flex-grow gap-4 pt-[5rem] w-[100%] max-w-[48rem] mx-auto relative">
      <AuthModal />
      <Navbar />

      <div className="max-w-[30rem] flex flex-col items-center justify-center mt-[4rem] mb-[4rem] text-center gap-4 px-[1rem]">
        <span></span>
        <h1 className="text-[1.5rem] md:text-[2rem] font-medium leading-[1.5rem] md:leading-[2rem]">
          Crack Your Dream Job Before Someone Else Does
        </h1>
        <h4>Only the prepared get hired. Start practicing now.</h4>
      </div>

      <JobInput />
      <InterviewPanel />
    </div>
  );
}
