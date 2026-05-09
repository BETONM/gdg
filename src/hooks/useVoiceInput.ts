'use client';

import { useState, useRef, useCallback } from 'react';

/* SpeechRecognition은 @types/dom-speech-recognition에 없으므로 직접 선언 */
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any;
  }
}

export type VoiceState = 'idle' | 'recording' | 'done' | 'error';

export function useVoiceInput() {
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const [state, setState] = useState<VoiceState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const start = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setErrorMsg('이 브라우저는 음성 인식을 지원하지 않아요. Chrome을 사용해주세요.');
      setState('error');
      return;
    }

    const recognition = new SR();
    recognition.lang = 'ko-KR';
    recognition.continuous = true;
    recognition.interimResults = true;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let finalText = '';
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const chunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += chunk;
        } else {
          interimText += chunk;
        }
      }
      if (finalText) setTranscript((prev) => prev + finalText);
      setInterim(interimText);
    };

    recognition.onend = () => {
      setInterim('');
      setState((s) => (s === 'recording' ? 'done' : s));
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (e: any) => {
      const messages: Record<string, string> = {
        'not-allowed': '마이크 권한을 허용해주세요.',
        'no-speech': '음성이 감지되지 않았어요. 다시 시도해주세요.',
        network: '네트워크 오류가 발생했어요.',
      };
      setErrorMsg(messages[e.error] ?? '음성 인식에 실패했어요.');
      setState('error');
    };

    recognitionRef.current = recognition;
    recognition.start();
    setTranscript('');
    setInterim('');
    setErrorMsg('');
    setState('recording');
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setState('done');
  }, []);

  const reset = useCallback(() => {
    recognitionRef.current?.stop();
    setTranscript('');
    setInterim('');
    setErrorMsg('');
    setState('idle');
  }, []);

  return { transcript, interim, state, errorMsg, start, stop, reset };
}
