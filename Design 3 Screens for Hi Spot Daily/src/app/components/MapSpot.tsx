import { useState } from 'react';
import { MapPin, Clock, CheckCircle2, ChevronRight, Trophy, Sparkles, Camera, Navigation, Star } from 'lucide-react';

interface MapSpotProps {
  onComplete?: () => void;
}

export function MapSpot({ onComplete }: MapSpotProps) {
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const selectedMission = {
    title: '8천원 편의점 균형식 챌린지',
    points: 40,
    time: '20분',
    cost: '7,900원',
    verification: '영수증 사진'
  };

  const spots = [
    {
      id: 1,
      name: 'CU 편의점 역삼점',
      distance: '120m',
      walkTime: '도보 2분',
      status: '영업중',
      reason: '단백질 도시락 다양',
      position: { x: 30, y: 35 }
    },
    {
      id: 2,
      name: 'GS25 강남타워점',
      distance: '250m',
      walkTime: '도보 4분',
      status: '영업중',
      reason: '신선 샐러드 구비',
      position: { x: 70, y: 25 }
    },
    {
      id: 3,
      name: '세븐일레븐 테헤란점',
      distance: '180m',
      walkTime: '도보 3분',
      status: '영업중',
      reason: '균형잡힌 조합 가능',
      position: { x: 50, y: 75 }
    }
  ];

  const steps = [
    { id: 1, text: '주변 편의점 찾기' },
    { id: 2, text: '단백질 1개 + 탄수화물 1개 선택' },
    { id: 3, text: '채소/과일 1개 추가' },
    { id: 4, text: '영수증 사진 촬영' }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--spot-yellow)]/10 via-white to-[var(--spot-green-light)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--spot-green)] via-[var(--spot-blue)] to-[var(--spot-yellow)] px-5 py-4 sticky top-0 z-10">
        <h1 className="text-lg font-semibold text-white drop-shadow">주변 장소</h1>
        <p className="text-xs text-white/90 mt-0.5">미션을 실행할 수 있는 곳이에요</p>
      </div>

      <div className="px-4 py-5 space-y-4 pb-24">
        {/* Mission Summary */}
        <div className="bg-white rounded-lg border-l-4 border-[var(--spot-green)] shadow-md p-4">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-[var(--spot-green)]" />
            <h2 className="text-base font-semibold text-[var(--spot-gray-900)]">선택한 미션</h2>
          </div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-sm font-medium text-[var(--spot-gray-900)] break-words flex-1">
              {selectedMission.title}
            </h3>
            <div className="flex items-center gap-1 bg-[var(--spot-green-light)] px-2.5 py-1 rounded-md flex-shrink-0">
              <span className="text-sm font-bold text-[var(--spot-green)]">
                {selectedMission.points}pt
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-[var(--spot-gray-600)]">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {selectedMission.time}
            </div>
            <span>·</span>
            <span>{selectedMission.cost}</span>
            <span>·</span>
            <div className="flex items-center gap-1">
              <Camera className="w-3.5 h-3.5" />
              {selectedMission.verification}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-lg border-l-4 border-[var(--spot-blue)] shadow-md overflow-hidden">
          <div className="p-3 border-b border-[var(--spot-gray-200)] bg-[var(--spot-blue-light)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[var(--spot-blue)]" />
                <span className="text-sm font-semibold text-[var(--spot-gray-900)]">주변 3곳 발견</span>
              </div>
              <span className="text-xs text-[var(--spot-blue)] font-medium">500m 이내</span>
            </div>
          </div>

          <div className="relative h-64 bg-gradient-to-br from-[var(--spot-gray-100)] via-[var(--spot-gray-50)] to-[var(--spot-blue-light)]">
            {/* Simplified Map Visual */}
            <div className="absolute inset-0">
              {/* Road Grid */}
              <div className="absolute top-1/3 left-0 right-0 h-1 bg-white/60"></div>
              <div className="absolute top-2/3 left-0 right-0 h-1 bg-white/60"></div>
              <div className="absolute top-0 bottom-0 left-1/3 w-1 bg-white/60"></div>
              <div className="absolute top-0 bottom-0 left-2/3 w-1 bg-white/60"></div>

              {/* Location Markers */}
              {spots.map((spot, index) => (
                <div
                  key={spot.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-in fade-in zoom-in duration-500"
                  style={{
                    left: `${spot.position.x}%`,
                    top: `${spot.position.y}%`,
                    animationDelay: `${index * 150}ms`
                  }}
                >
                  <div className="relative group cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-br from-[var(--spot-red)] to-[var(--spot-yellow)] rounded-full flex items-center justify-center shadow-lg ring-4 ring-white hover:scale-110 transition-transform">
                      <MapPin className="w-6 h-6 text-white drop-shadow" fill="white" />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-gradient-to-br from-[var(--spot-red)] to-[var(--spot-yellow)] rounded-full opacity-50"></div>
                  </div>
                </div>
              ))}

              {/* Current Location (Center) */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-4 h-4 bg-[var(--spot-blue)] rounded-full ring-4 ring-[var(--spot-blue-light)] shadow-lg"></div>
                  <div className="absolute inset-0 bg-[var(--spot-blue)] rounded-full animate-ping opacity-75"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spot List */}
        <div>
          <h3 className="text-sm font-semibold text-[var(--spot-gray-900)] mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[var(--spot-green)]" />
            가까운 순서
          </h3>
          <div className="space-y-3">
            {spots.map((spot, index) => (
              <div
                key={spot.id}
                className="bg-white rounded-lg border-l-4 border-[var(--spot-green)] p-4 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[var(--spot-green-light)] to-white rounded-full flex items-center justify-center flex-shrink-0 border-2 border-[var(--spot-green)]">
                    <span className="text-sm font-bold text-[var(--spot-green)]">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="text-sm font-semibold text-[var(--spot-gray-900)] break-words flex-1">
                        {spot.name}
                      </h4>
                      <span className="text-xs text-[var(--spot-green)] font-bold flex-shrink-0 whitespace-nowrap">
                        {spot.distance}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--spot-gray-600)] mb-2 break-words">
                      {spot.reason}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--spot-green-light)] text-[var(--spot-green-dark)] rounded-full text-xs font-medium">
                        <Clock className="w-3 h-3" />
                        {spot.status}
                      </span>
                      <span className="text-xs text-[var(--spot-gray-600)]">{spot.walkTime}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[var(--spot-gray-400)] flex-shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Progress */}
        {!isCompleted && (
          <div className="bg-white rounded-lg border-l-4 border-[var(--spot-yellow)] shadow-md p-5">
            <h3 className="text-sm font-semibold text-[var(--spot-gray-900)] mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--spot-yellow)]" />
              미션 체크리스트
            </h3>
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
                    className={`text-sm flex-1 break-words transition-all ${
                      checkedSteps.includes(step.id)
                        ? 'text-[var(--spot-gray-600)] line-through'
                        : 'text-[var(--spot-gray-900)] font-medium'
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
              className="w-full py-4 px-5 bg-gradient-to-r from-[var(--spot-green)] to-[var(--spot-blue)] text-white rounded-xl text-base font-bold hover:shadow-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              미션 완료하기
            </button>
          </div>
        )}

        {/* Completion Card */}
        {isCompleted && (
          <div className="bg-white rounded-lg border-l-4 border-[var(--spot-green)] shadow-xl p-6">
            <div className="text-center mb-5">
              <div className="w-20 h-20 bg-gradient-to-br from-[var(--spot-green)] to-[var(--spot-blue)] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-bold text-[var(--spot-gray-900)] mb-3">미션 완료!</h2>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-[var(--spot-green)]" />
                <span className="text-4xl font-bold bg-gradient-to-r from-[var(--spot-green)] to-[var(--spot-blue)] bg-clip-text text-transparent">
                  +{selectedMission.points}pt
                </span>
              </div>
              <p className="text-sm text-[var(--spot-gray-700)] bg-[var(--spot-green-light)] rounded-lg px-4 py-2.5 inline-block max-w-full break-words">
                오늘은 균형잡힌 식사를 챙기는 데 성공했어요! 👏
              </p>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-br from-[var(--spot-gray-50)] to-white rounded-lg p-4 mb-4 border border-[var(--spot-gray-200)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-[var(--spot-gray-900)]">오늘 획득 포인트</span>
                <span className="text-lg font-bold text-[var(--spot-green)]">+65pt</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: '식사', score: '100', color: 'var(--spot-green)' },
                  { label: '외출', score: '80', color: 'var(--spot-blue)' },
                  { label: '집관리', score: '40', color: 'var(--spot-gray-400)' }
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-xs text-[var(--spot-gray-600)] mb-1">{stat.label}</div>
                    <div className="text-base font-bold" style={{ color: stat.color }}>{stat.score}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Action */}
            <div className="text-center">
              <p className="text-xs text-[var(--spot-gray-600)] mb-3 leading-relaxed">
                내일도 Hi Spot Daily와 함께 건강한 하루를 만들어요 💚
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
