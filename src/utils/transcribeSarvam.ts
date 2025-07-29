// utils/transcribeSarvam.ts

import toast from "react-hot-toast";

export const transcribeWithSarvam = async (blob: Blob): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", blob, "audio.webm");
    formData.append("language_code", "en-IN");

    const API_KEY = process.env.NEXT_PUBLIC_SARVAM_API_KEY || "";

    const res = await fetch("https://api.sarvam.ai/speech-to-text", {
      method: "POST",
      headers: {
        "api-subscription-key": API_KEY || "",
      },
      body: formData,
    });

    const json = await res.json();
    if (json.transcript) return json.transcript;
    console.log("Sarvam Error Response:", json);
    toast.error("Transcription failed");
    return "";
  } catch (err) {
    toast.error("Transcription failed");
    console.log("Sarvam Transcription Error:", err);
    return "";
  }
};
