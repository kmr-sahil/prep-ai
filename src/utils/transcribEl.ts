// src/utils/transcribEl.ts
export async function transcribeAudioFile(blob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append("file", blob, "audio.webm");

  const res = await fetch("/api/transcribe", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Transcription failed");

  const json = await res.json();
  console.log("Transcription response:", json);
  return json.transcript || "";
}
