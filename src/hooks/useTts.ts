'use client';

import { useState, useRef } from 'react';

export function useTts() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = async (text: string) => {
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
      return;
    }

    setPlaying(true);

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (res.status === 204) {
        // Gemini TTS 미설정 시 브라우저 TTS로 fallback
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        utterance.onend = () => setPlaying(false);
        speechSynthesis.speak(utterance);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        setPlaying(false);
        URL.revokeObjectURL(url);
      };
      audio.play();
    } catch {
      // 완전 실패 시 브라우저 TTS fallback
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.onend = () => setPlaying(false);
      speechSynthesis.speak(utterance);
    }
  };

  return { speak, playing };
}
