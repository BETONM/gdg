import { useState } from 'react';
import { Clock, Coins, Camera, MapPin, ChevronRight, Sparkles, CheckCircle2, Receipt, ImageIcon } from 'lucide-react';

interface MissionCardsProps {
  onMissionSelect: () => void;
}

export function MissionCards({ onMissionSelect }: MissionCardsProps) {
  const [selectedMission, setSelectedMission] = useState<number | null>(null);

  const missions = [
    {
      id: 1,
      title: '8천원 편의점 균형식 챌린지',
      category: '식사',
      points: 40,
      time: '20분',
      cost: '7,900원',
      verification: '영수증',
      verificationIcon: Receipt,
      description: '편의점에서 단백질+탄수화물+채소 조합 구매',
      steps: ['주변 편의점 찾기', '단백질 1개 선택', '탄수화물 1개 선택'],
      hasLocation: true,
      categoryColor: 'var(--spot-green)',
      categoryBg: 'var(--spot-green-light)'
    },
    {
      id: 2,
      title: '집 앞 10분 환기 산책',
      category: '외출',
      points: 25,
      time: '10분',
      cost: '0원',
      verification: '위치',
      verificationIcon: MapPin,
      description: '집 근처를 가볍게 걸으며 환기하기',
      steps: ['현관 나가기', '100m 이상 걷기', '돌아오기'],
      hasLocation: false,
      categoryColor: 'var(--spot-blue)',
      categoryBg: 'var(--spot-blue-light)'
    },
    {
      id: 3,
      title: '싱크대 5분 리셋',
      category: '집관리',
      points: 20,
      time: '5분',
      cost: '0원',
      verification: '사진',
      verificationIcon: ImageIcon,
      description: '싱크대 그릇 정리하고 물기 닦기',
      steps: ['그릇 씻기', '싱크대 닦기', '완료 사진'],
      hasLocation: false,
      categoryColor: 'var(--spot-yellow)',
      categoryBg: '#fef7e0'
    }
  ];

  const analysisSteps = [
    { step: 1, label: '상태 분석', status: 'completed' },
    { step: 2, label: '카테고리 결정', status: 'completed' },
    { step: 3, label: '포인트 생성', status: 'completed' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--spot-yellow)]/10 via-white to-[var(--spot-green-light)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--spot-green)] via-[var(--spot-blue)] to-[var(--spot-yellow)] px-5 py-4 sticky top-0 z-10">
        <h1 className="text-lg font-semibold text-white drop-shadow">오늘의 미션</h1>
        <p className="text-xs text-white/90 mt-0.5">Gemini가 추천한 3가지 행동</p>
      </div>

      <div className="px-4 py-5 space-y-4 pb-24">
        {/* State Summary */}
        <div className="bg-white rounded-lg border-l-4 border-[var(--spot-blue)] shadow-md p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--spot-blue)] to-[var(--spot-green)] flex items-center justify-center flex-shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-medium text-[var(--spot-gray-900)] mb-1.5">Gemini 분석 결과</h3>
              <p className="text-xs text-[var(--spot-gray-700)] break-words leading-relaxed">
                저녁 시간이고 아직 식사를 하지 않아서, 부담 없는 식사 해결이 우선이에요.
              </p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            <span className="inline-flex items-center px-2 py-1 bg-[var(--spot-green-light)] text-[var(--spot-green-dark)] rounded text-[10px] font-medium">
              식사 우선
            </span>
            <span className="inline-flex items-center px-2 py-1 bg-[var(--spot-gray-200)] text-[var(--spot-gray-700)] rounded text-[10px] font-medium">
              에너지 낮음
            </span>
            <span className="inline-flex items-center px-2 py-1 bg-[var(--spot-gray-200)] text-[var(--spot-gray-700)] rounded text-[10px] font-medium">
              긴급도 보통
            </span>
          </div>
        </div>

        {/* Agent Process */}
        <div className="bg-white rounded-lg border-l-4 border-[var(--spot-yellow)] shadow-sm p-4">
          <h3 className="text-xs font-medium text-[var(--spot-gray-700)] mb-3">AI 분석 과정</h3>
          <div className="flex items-center gap-2">
            {analysisSteps.map((item, index) => (
              <div key={item.step} className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-1.5 flex-1">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                    item.status === 'completed'
                      ? 'bg-gradient-to-br from-[var(--spot-green)] to-[var(--spot-blue)]'
                      : 'bg-[var(--spot-gray-300)]'
                  }`}>
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-[10px] text-[var(--spot-gray-700)] truncate">{item.label}</span>
                </div>
                {index < analysisSteps.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-[var(--spot-gray-400)] flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mission Cards */}
        <div className="space-y-3">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className={`bg-white rounded-lg transition-all shadow-md ${
                selectedMission === mission.id
                  ? 'border-l-4 border-[var(--spot-green)]'
                  : 'border-l-4'
              }`}
              style={{
                borderLeftColor: selectedMission === mission.id ? 'var(--spot-green)' : mission.categoryColor
              }}
            >
              {/* Mission Header */}
              <div className="p-4 border-b border-[var(--spot-gray-200)]">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-sm font-medium text-[var(--spot-gray-900)] break-words flex-1">
                    {mission.title}
                  </h3>
                  <div className="flex items-center gap-1 flex-shrink-0 bg-[var(--spot-green-light)] px-2 py-1 rounded-md">
                    <Coins className="w-3.5 h-3.5 text-[var(--spot-green)]" />
                    <span className="text-sm font-bold text-[var(--spot-green)] whitespace-nowrap">
                      {mission.points}pt
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[var(--spot-gray-600)] break-words mb-3">{mission.description}</p>

                {/* Stats */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[var(--spot-gray-600)]" />
                    <span className="text-xs text-[var(--spot-gray-700)]">{mission.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-[var(--spot-gray-600)]" />
                    <span className="text-xs text-[var(--spot-gray-700)]">{mission.cost}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <mission.verificationIcon className="w-3.5 h-3.5 text-[var(--spot-gray-600)]" />
                    <span className="text-xs text-[var(--spot-gray-700)]">{mission.verification}</span>
                  </div>
                </div>
              </div>

              {/* Mission Body */}
              <div className="p-4">
                {/* Category Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: mission.categoryBg,
                      color: mission.categoryColor
                    }}
                  >
                    {mission.category}
                  </span>
                  {mission.hasLocation && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--spot-blue-light)] text-[var(--spot-blue)] rounded-full text-xs font-medium">
                      <MapPin className="w-3 h-3" />
                      주변 장소
                    </span>
                  )}
                </div>

                {/* Steps */}
                <div className="bg-[var(--spot-gray-50)] rounded-md p-3 mb-3">
                  <p className="text-[10px] font-medium text-[var(--spot-gray-700)] mb-2">실행 단계</p>
                  <div className="space-y-1.5">
                    {mission.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-white border border-[var(--spot-gray-300)] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[9px] text-[var(--spot-gray-600)] font-medium">{idx + 1}</span>
                        </div>
                        <p className="text-xs text-[var(--spot-gray-700)] break-words flex-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => {
                    setSelectedMission(mission.id);
                    if (mission.hasLocation) {
                      onMissionSelect();
                    }
                  }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[var(--spot-green)] to-[var(--spot-blue)] text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span className="whitespace-nowrap">이 미션 선택</span>
                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Community CTA */}
        <button
          onClick={onMissionSelect}
          className="w-full py-4 px-4 bg-gradient-to-r from-[var(--spot-blue)] to-[var(--spot-green)] text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all shadow-md"
        >
          오늘의 자취 꿀팁 공유하고 추가 포인트 받기
        </button>
      </div>
    </div>
  );
}
