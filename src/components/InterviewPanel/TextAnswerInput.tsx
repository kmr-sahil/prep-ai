export default function TextAnswerInput({
  value,
  setValue,
}: {
  value: string;
  setValue: (val: string) => void;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="w-full p-3 bg-(--tertiary) border border-(--secondary) rounded-lg mb-4 focus:outline-2 focus:outline-(--accent)"
      rows={6}
      placeholder="Type your answer here..."
    />
  );
}
