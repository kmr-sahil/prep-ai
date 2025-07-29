// Utility: Speed up audio Blob by 1.2x and return as WAV Blob (in-browser)
export async function speedUpAudioBlob(blob: Blob, multiplier: number): Promise<Blob> {
  // 1. Read original data
  const arrayBuffer = await blob.arrayBuffer();
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

  // 2. Set up an offline context to render the sped-up buffer
  const newLength = Math.floor(audioBuffer.length / multiplier);
  const offlineCtx = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    newLength,
    audioBuffer.sampleRate
  );
  const source = offlineCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.playbackRate.value = multiplier;
  source.connect(offlineCtx.destination);
  source.start();

  const renderedBuffer = await offlineCtx.startRendering();
  return audioBufferToWavBlob(renderedBuffer);
}

// --- Minimal WAV export: no dependencies needed! ---
function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  // Courtesy: https://stackoverflow.com/a/56605730 and WebAudio docs
  const numOfChan = buffer.numberOfChannels,
        length = buffer.length * numOfChan * 2 + 44,
        bufferArray = new ArrayBuffer(length),
        view = new DataView(bufferArray),
        channels = [],
        sampleRate = buffer.sampleRate;

  let pos = 0;
  function setUint16(data: number) { view.setUint16(pos, data, true); pos += 2; }
  function setUint32(data: number) { view.setUint32(pos, data, true); pos += 4; }

  // Write WAV header
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"

  setUint32(0x20746d66); // "fmt "
  setUint32(16); // PCM
  setUint16(1); // Linear quantization
  setUint16(numOfChan);
  setUint32(sampleRate);
  setUint32(sampleRate * 2 * numOfChan); // byte rate
  setUint16(numOfChan * 2); // block align
  setUint16(16); // bit depth

  setUint32(0x61746164); // "data"
  setUint32(length - pos - 4);

  // Write interleaved PCM samples
  for (let i = 0; i < numOfChan; i++) channels.push(buffer.getChannelData(i));
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numOfChan; ch++) {
      let sample = Math.max(-1, Math.min(1, channels[ch][i]));
      sample = sample < 0 ? sample * 32768 : sample * 32767;
      view.setInt16(pos, sample, true); pos += 2;
    }
  }
  return new Blob([bufferArray], { type: "audio/wav" });
}
