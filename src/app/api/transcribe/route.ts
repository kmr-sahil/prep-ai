import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as Blob;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVEN_API_KEY!, // keep it in .env.local
  });

  try {
    const result = await elevenlabs.speechToText.convert({
      file,
      modelId: "scribe_v1",
      tagAudioEvents: true,
      languageCode: "eng",
      diarize: true,
    });

    return NextResponse.json({ transcript: result.text });
  } catch (err: any) {
    console.error("Transcription failed:", err);
    return NextResponse.json({ error: "Failed to transcribe" }, { status: 500 });
  }
}
