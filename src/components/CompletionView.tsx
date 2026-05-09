import { useState } from 'react';
import { MapPin, Clock, CheckCircle2, ChevronRight, Trophy, Sparkles, Camera } from 'lucide-react';

interface MapCompletionProps {
  onComplete?: () => void;
}

export default function MapCompletion({ onComplete }: MapCompletionProps) {
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const selectedMission = {
    title: '8천원 편의점 균형식 챌린지',
    points: 40,
    time: '15분',
    cost: '8,000원',
    verification: '영수증'
  };

  const spots = [
    {
      id: 1,
      name: 'CU 편의점 역삼점',
      distance: '120m',
      status: '영업중',
      reason: '다양한 단백질 옵션 보유',
      position: { x: 35, y: 40 }
    },
    {
      id: 2,
      name: 'GS25 강남타워점',
      distance: '250m',
      status: '영업중',
      reason: '신선 샐러드 구비',
      position: { x: 65, y: 25 }
    },
    {
      id: 3,
      name: '세븐일레븐 테헤란로점',
      distance: '180m',
      status: '영업중',
      reason: '균형잡힌 도시락 판매',
      position: { x: 50, y: 70 }
    }
  ];

  const steps = [
    { id: 1, text: '주변 편의점 찾기' },
    { id: 2, text: '단백질 1개 선택' },
    { id: 3, text: '탄수화물 1개 선택' },
    { id: 4, text: '채소/과일 1개 선택' },
    { id: 5, text: '영수증 촬영' }
  ];

  const toggleStep = (stepId: number) => {
    setCheckedSteps(prev =>
      prev.includes(stepId)
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const handleComplete = () => {
    setIsCompleted(true);
  };

  const stats = [
    { label: '식사', score: '85', color: 'var(--spot-green)' },
    { label: '외출', score: '60', color: 'var(--spot-gray-300)' },
    { label: '집관리', score: '40', color: 'var(--spot-gray-300)' }
  ];

  return (
    <div className="min-h-screen bg-[var(--spot-gray-50)] pb-8">
      {/* Header */}
      <div className="bg-white border-b border-[var(--spot-gray-200)] px-5 py-6">
        <h1 className="text-xl font-semibold text-[var(--spot-gray-900)]">Hi Spot Daily</h1>
        <p className="text-sm text-[var(--spot-gray-600)] mt-1">미션 실행하기</p>
      </div>

      <div className="px-5 mt-5 space-y-5">
        {/* Mission Summary */}
        <div className="bg-white rounded-lg border border-[var(--spot-gray-200)] p-4">
          <div className="flex items-start justify-between mb-2 gap-3">
            <h2 className="text-base font-medium text-[var(--spot-gray-900)] break-words flex-1 min-w-0">
              {selectedMission.title}
            </h2>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Trophy className="w-4 h-4 text-[var(--spot-green)]" />
              <span className="text-base font-semibold text-[var(--spot-green)] whitespace-nowrap">
                {selectedMission.points}pt
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-[var(--spot-gray-600)]">
            <span>{selectedMission.time}</span>
            <span>·</span>
            <span>{selectedMission.cost}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Camera className="w-3.5 h-3.5" />
              {selectedMission.verification}
            </span>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-lg border border-[var(--spot-gray-200)] overflow-hidden">
          <div className="relative h-56 bg-gradient-to-br from-[var(--spot-gray-100)] to-[var(--spot-gray-200)]">
            {/* Simplified Map Visual */}
            <div className="absolute inset-0">
              {/* Roads */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[var(--spot-gray-300)]" />
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-[var(--spot-gray-300)]" />

              {/* Markers */}
              {spots.map((spot) => (
                <div
                  key={spot.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${spot.position.x}%`, top: `${spot.position.y}%` }}
                >
                  <div className="w-7 h-7 bg-[var(--spot-green)] rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
                    <MapPin className="w-4 h-4 text-white fill-white" />
                  </div>
                </div>
              ))}

              {/* Current Location */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-3 h-3 bg-blue-500 rounded-full ring-4 ring-blue-200" />
              </div>
            </div>

            {/* Map Label */}
            <div className="absolute bottom-3 left-3 bg-white px-3 py-1.5 rounded-lg shadow-md">
              <p className="text-xs text-[var(--spot-gray-700)] font-medium">주변 3곳 발견</p>
            </div>
          </div>
        </div>

        {/* Spot List */}
        <div>
          <h3 className="text-sm font-medium text-[var(--spot-gray-900)] mb-3">주변 장소 (3곳)</h3>
          <div className="space-y-2">
            {spots.map((spot) => (
              <div
                key={spot.id}
                className="bg-white rounded-lg border border-[var(--spot-gray-200)] p-4 hover:border-[var(--spot-green)] transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[var(--spot-green-light)] rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[var(--spot-green)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-medium text-[var(--spot-gray-900)] truncate">{spot.name}</h4>
                      <span className="text-xs text-[var(--spot-green)] font-medium flex-shrink-0 whitespace-nowrap">
                        {spot.distance}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--spot-gray-600)] mb-1.5 break-words">{spot.reason}</p>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--spot-green-light)] text-[var(--spot-green-dark)] rounded text-xs font-medium">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        {spot.status}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[var(--spot-gray-600)] flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Progress */}
        {!isCompleted && (
          <div className="bg-white rounded-lg border border-[var(--spot-gray-200)] p-5">
            <h3 className="text-sm font-medium text-[var(--spot-gray-900)] mb-4">미션 체크리스트</h3>
            <div className="space-y-3 mb-5">
              {steps.map((step) => (
                <label
                  key={step.id}
                  className="flex items-start gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={checkedSteps.includes(step.id)}
                    onChange={() => toggleStep(step.id)}
                    className="w-5 h-5 rounded border-2 border-[var(--spot-gray-300)] text-[var(--spot-green)] focus:ring-2 focus:ring-[var(--spot-green)] cursor-pointer flex-shrink-0 mt-0.5"
                  />
                  <span
                    className={`text-sm flex-1 break-words ${
                      checkedSteps.includes(step.id)
                        ? 'text-[var(--spot-gray-600)] line-through'
                        : 'text-[var(--spot-gray-900)]'
                    }`}
                  >
                    {step.text}
                  </span>
                </label>
              ))}
            </div>
            <button
              onClick={handleComplete}
              disabled={checkedSteps.length < steps.length}
              className="w-full py-4 px-6 bg-[var(--spot-green)] text-white rounded-lg font-medium hover:bg-[var(--spot-green-dark)] transition-colors disabled:bg-[var(--spot-gray-300)] disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span className="whitespace-nowrap">미션 완료하기</span>
            </button>
          </div>
        )}

        {/* Completion Card */}
        {isCompleted && (
          <div className="bg-gradient-to-br from-[var(--spot-green-light)] to-white rounded-lg border-2 border-[var(--spot-green)] p-6">
            <div className="text-center mb-5">
              <div className="w-16 h-16 bg-[var(--spot-green)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--spot-gray-900)] mb-2">미션 완료!</h2>
              <div className="flex items-center justify-center gap-2 text-3xl font-bold text-[var(--spot-green)] mb-3">
                <Sparkles className="w-6 h-6 flex-shrink-0" />
                <span>+{selectedMission.points}pt</span>
              </div>
              <p className="text-sm text-[var(--spot-gray-700)] bg-white/80 rounded-lg px-4 py-2 inline-block max-w-full break-words">
                오늘은 식사를 챙기는 데 성공했어요.
              </p>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-[var(--spot-gray-900)]">오늘 누적 포인트</span>
                <span className="text-lg font-bold text-[var(--spot-green)]">160pt</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-xs text-[var(--spot-gray-600)] mb-1">{stat.label}</div>
                    <div className="text-base font-semibold text-[var(--spot-gray-900)]">{stat.score}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Check-in CTA */}
            <div className="text-center">
              <p className="text-xs text-[var(--spot-gray-600)] mb-3 px-2 break-words">
                내일 또 만나요! 다음 체크인까지 12시간 남았어요
              </p>
              <button className="text-sm text-[var(--spot-green)] font-medium hover:underline whitespace-nowrap">
                홈으로 돌아가기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
