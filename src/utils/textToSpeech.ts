// utils/textToSpeech.ts
import { SarvamAIClient } from "sarvamai";

const client = new SarvamAIClient({
  apiSubscriptionKey: process.env.NEXT_PUBLIC_SARVAM_API_KEY || "YOUR_API_SUBSCRIPTION_KEY",
});

interface TTSConfig {
  model?: any;
  target_language_code?: any;
  speaker?: any;
  pitch?: number;
  pace?: number
  loudness?: number;
  speech_sample_rate?: number;
  enable_preprocessing?: boolean;
}

export async function generateSpeechUrl(text: string, config: TTSConfig = {}): Promise<string> {
  const response = await client.textToSpeech.convert({
    text,
    model: config.model || "bulbul:v2",
    target_language_code: config.target_language_code || "en-IN",
    speaker: config.speaker || "arya",
    pitch: config.pitch ?? 0.1,
    pace: config.pace ?? 1.0,
    loudness: config.loudness ?? 1.1,
    speech_sample_rate: config.speech_sample_rate ?? 24000,
    enable_preprocessing: config.enable_preprocessing !== undefined ? config.enable_preprocessing : true,
  });

  // Adjust property if the actual audio URL property differs
  console.log("Generated Speech URL:", response);
  return response.audios[0];
}
