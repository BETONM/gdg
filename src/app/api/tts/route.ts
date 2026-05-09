import { NextRequest } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const TTS_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent';

function buildWav(pcm: Uint8Array, sampleRate = 24000): ArrayBuffer {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcm.length;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const enc = new TextEncoder();
  const write = (offset: number, str: string) =>
    enc.encode(str).forEach((b, i) => view.setUint8(offset + i, b));

  write(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  write(8, 'WAVE');
  write(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  write(36, 'data');
  view.setUint32(40, dataSize, true);
  new Uint8Array(buffer, 44).set(pcm);

  return buffer;
}

export async function POST(request: NextRequest) {
  const { text } = await request.json();

  if (!GEMINI_API_KEY || !text) {
    return new Response(null, { status: 204 });
  }

  try {
    const res = await fetch(`${TTS_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text }] }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      }),
    });

    if (!res.ok) return new Response(null, { status: 204 });

    const data = await res.json();
    const inlineData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData;

    if (!inlineData?.data) return new Response(null, { status: 204 });

    const raw = atob(inlineData.data);
    const pcm = new Uint8Array(raw.length).map((_, i) => raw.charCodeAt(i));
    const wav = buildWav(pcm);

    return new Response(wav, {
      headers: { 'Content-Type': 'audio/wav' },
    });
  } catch (err) {
    console.error('TTS error:', err);
    return new Response(null, { status: 204 });
  }
}
