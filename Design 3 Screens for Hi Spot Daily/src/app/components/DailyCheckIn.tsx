import { useState } from 'react';
import { Mic, MicOff, Sparkles, TrendingUp } from 'lucide-react';

interface DailyCheckInProps {
  onComplete: () => void;
}

export function DailyCheckIn({ onComplete }: DailyCheckInProps) {
  const [isListening, setIsListening] = useState(false);
  const [freeText, setFreeText] = useState('');

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const today = new Date().toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--spot-green-light)] via-white to-[var(--spot-blue-light)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--spot-green)] via-[var(--spot-blue)] to-[var(--spot-yellow)] px-5 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white drop-shadow">Hi Spot Daily</h1>
            <p className="text-xs text-white/90 mt-0.5">{today}</p>
          </div>
          <div className="flex items-center gap-1.5 bg-white/95 px-3 py-1.5 rounded-full shadow-sm">
            <TrendingUp className="w-3.5 h-3.5 text-[var(--spot-green)]" />
            <span className="text-xs font-bold text-[var(--spot-gray-900)]">1,240pt</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-5 pb-24">
        {/* Intro */}
        <div className="bg-white rounded-lg border-l-4 border-[var(--spot-blue)] shadow-sm p-5">
          <h2 className="text-base font-semibold text-[var(--spot-gray-900)] mb-2">오늘의 체크인</h2>
          <p className="text-sm text-[var(--spot-gray-700)] leading-relaxed">
            오늘 상태를 알려주시면, Gemini가 지금 할 만한 미션 3개를 추천해드려요.
          </p>
        </div>

        {/* Gemini Voice Check-in */}
        <div className="bg-white rounded-lg border-l-4 border-[var(--spot-yellow)] shadow-md p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--spot-blue)] to-[var(--spot-green)] flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--spot-gray-900)]">Gemini 음성 체크인</h3>
          </div>

          <button
            onClick={toggleListening}
            className={`w-full flex flex-col items-center justify-center py-12 rounded-xl border-2 border-dashed transition-all ${
              isListening
                ? 'bg-gradient-to-br from-[var(--spot-blue-light)] to-[var(--spot-green-light)] border-[var(--spot-blue)] animate-pulse'
                : 'bg-gradient-to-br from-white to-[var(--spot-gray-50)] border-[var(--spot-gray-300)] hover:border-[var(--spot-blue)] hover:shadow-md'
            }`}
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-lg transition-all ${
              isListening
                ? 'bg-gradient-to-br from-[var(--spot-blue)] to-[var(--spot-green)] scale-110'
                : 'bg-gradient-to-br from-[var(--spot-gray-300)] to-[var(--spot-gray-400)]'
            }`}>
              {isListening ? (
                <Mic className="w-10 h-10 text-white" />
              ) : (
                <MicOff className="w-10 h-10 text-white" />
              )}
            </div>
            <p className={`text-base font-semibold mb-1 ${
              isListening ? 'text-[var(--spot-blue)]' : 'text-[var(--spot-gray-700)]'
            }`}>
              {isListening ? '듣고 있어요...' : '마이크 버튼을 눌러 말씀해주세요'}
            </p>
            <p className="text-xs text-[var(--spot-gray-600)]">
              "저녁인데 밥을 안 먹었고, 피곤해요"
            </p>
            {isListening && (
              <div className="flex gap-1.5 mt-4">
                <div className="w-1.5 h-10 bg-[var(--spot-blue)] rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-8 bg-[var(--spot-blue)] rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-12 bg-[var(--spot-green)] rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                <div className="w-1.5 h-9 bg-[var(--spot-green)] rounded-full animate-pulse" style={{ animationDelay: '450ms' }}></div>
              </div>
            )}
          </button>

          <div className="mt-5 flex items-center justify-center gap-3">
            <div className="h-px bg-[var(--spot-gray-300)] flex-1"></div>
            <span className="text-xs text-[var(--spot-gray-600)] font-medium">또는</span>
            <div className="h-px bg-[var(--spot-gray-300)] flex-1"></div>
          </div>
        </div>

        {/* Text Input */}
        <div className="bg-white rounded-lg border-l-4 border-[var(--spot-green)] shadow-md p-5">
          <label className="text-sm font-semibold text-[var(--spot-gray-900)] mb-3 block">
            텍스트로 입력하기
          </label>
          <textarea
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder="지금 상태를 자유롭게 적어주세요&#10;예: 저녁 7시인데 아직 밥을 못 먹었어요. 피곤하지만 뭔가 먹어야 할 것 같아요."
            className="w-full px-4 py-3 rounded-lg border-2 border-[var(--spot-gray-300)] bg-white text-sm text-[var(--spot-gray-900)] placeholder:text-[var(--spot-gray-600)] focus:outline-none focus:ring-2 focus:ring-[var(--spot-blue)] focus:border-[var(--spot-blue)] resize-none leading-relaxed"
            rows={5}
          />
          <p className="text-xs text-[var(--spot-gray-600)] mt-2 leading-relaxed">
            💡 시간대, 식사 여부, 에너지 상태, 예산 등을 말씀해주시면 더 정확한 미션을 추천해드려요.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={onComplete}
            className="w-full py-4 px-5 bg-gradient-to-r from-[var(--spot-green)] to-[var(--spot-blue)] text-white rounded-xl text-base font-bold hover:shadow-xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            오늘의 미션 만들기
          </button>
        </div>
      </div>
    </div>
  );
}
