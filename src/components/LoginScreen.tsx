'use client';

import { Sparkles } from 'lucide-react';

interface LoginScreenProps {
  onSignIn: () => void;
  isLoading?: boolean;
}

export default function LoginScreen({ onSignIn, isLoading }: LoginScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[var(--spot-green-light)] via-white to-[var(--spot-blue-light)] px-6">
      {/* Logo Area */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-24 h-24 rounded-3xl bg-white flex items-center justify-center shadow-2xl mb-6 overflow-hidden border-2 border-[var(--spot-gray-100)]">
          <img src="/logo.png" alt="Hi Spot Daily Logo" className="w-full h-full object-contain scale-[1.3]" />
        </div>
        <h1 className="text-2xl font-black text-[var(--spot-gray-900)] tracking-tight">Hi Spot Daily</h1>
        <p className="text-sm text-[var(--spot-gray-600)] mt-2 text-center leading-relaxed">
          Gemini가 오늘 상태에 딱 맞는<br />미션 3개를 추천해드립니다
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="w-full max-w-xs space-y-3 mb-10">
        {[
          { emoji: '🤖', text: 'Gemini AI가 개인화 미션 생성' },
          { emoji: '📍', text: '주변 장소와 연결된 실행 가이드' },
          { emoji: '💬', text: '커뮤니티 팁 공유로 포인트 적립' },
        ].map(({ emoji, text }) => (
          <div key={text} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-[var(--spot-gray-200)]">
            <span className="text-xl">{emoji}</span>
            <span className="text-sm font-medium text-[var(--spot-gray-800)]">{text}</span>
          </div>
        ))}
      </div>

      {/* Google Sign-in Button */}
      <button
        onClick={onSignIn}
        disabled={isLoading}
        className="w-full max-w-xs flex items-center justify-center gap-3 bg-white border-2 border-[var(--spot-gray-200)] rounded-2xl px-6 py-4 shadow-md hover:shadow-lg hover:border-[var(--spot-blue)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {/* Google logo SVG */}
        <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        <span className="text-sm font-bold text-[var(--spot-gray-800)]">
          {isLoading ? '로그인 중...' : 'Google로 시작하기'}
        </span>
      </button>

      <p className="text-xs text-[var(--spot-gray-500)] mt-6 text-center leading-relaxed max-w-xs">
        로그인하면 미션 기록과 포인트가<br />저장됩니다
      </p>
    </div>
  );
}
