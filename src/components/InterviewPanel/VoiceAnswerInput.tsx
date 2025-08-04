import VoiceInput from "../VoiceInput/VoiceInput";

export default function VoiceAnswerInput({
  activeIndex,
  setCurrentAnswer,
  isProcessing,
  setIsProcessing,
}: any) {
  // if (!audioReady) return null;
  return (
    <VoiceInput
      resetTrigger={activeIndex}
      setCurrentAnswer={setCurrentAnswer}
      isProcessing={isProcessing}
      setIsProcessing={setIsProcessing}
    />
  );
}
