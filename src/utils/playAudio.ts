import toast from "react-hot-toast";

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function playAudioFromUrl(
  audioData: string, // base64 or URL
  onReady: () => void,
  onError?: () => void
): () => void {
  let audio: HTMLAudioElement;
  let objectUrl: string | null = null;

  // Detect raw PCM-like or base64 audio, convert to blob
  if (audioData.startsWith("UklGR") || /^[A-Za-z0-9+/=]+$/.test(audioData.slice(0, 50))) {
    const audioBytes = base64ToUint8Array(audioData);
    const blob = new Blob([audioBytes], { type: "audio/wav" }); // or "audio/mpeg" if MP3
    objectUrl = URL.createObjectURL(blob);
    audio = new Audio(objectUrl);
  } else {
    // Assume it's a valid URL
    audio = new Audio(audioData);
  }

  audio.oncanplaythrough = () => {
    onReady();
    audio.play().catch(() => {
      toast.error("Autoplay failed. Please click play.");
    });
  };

  audio.onerror = () => {
    onReady();
    toast.error("Error playing question audio.");
    if (onError) onError();
  };

  audio.load();

  return () => {
    audio.pause();
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
  };
}
