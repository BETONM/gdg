'use client';

import { useState } from 'react';
import { Clock, Coins, Camera, MapPin, ChevronRight, Sparkles, CheckCircle2, Receipt, ImageIcon } from 'lucide-react';
import { MissionResult, Mission } from '@/types/mission';
import { cn } from '@/components/ui/utils';

interface MissionCardsProps {
  result?: MissionResult | null;
  onMissionSelect: (mission: Mission) => void;
  userMissions?: Mission[];
  onCreateMission?: (mission: Mission) => void;
}

const LIFE_AREA_COLOR: Record<string, string> = {
  meal: 'var(--spot-green)', rest: 'var(--spot-blue)', outdoor: 'var(--spot-blue)',
  homecare: 'var(--spot-yellow)', social: 'var(--spot-yellow)', safety: 'var(--spot-red)',
};
const LIFE_AREA_BG: Record<string, string> = {
  meal: 'var(--spot-green-light)', rest: 'var(--spot-blue-light)', outdoor: 'var(--spot-blue-light)',
  homecare: '#fef7e0', social: '#fef7e0', safety: '#fee2e2',
};
const PROOF_ICON: Record<string, any> = {
  self_check: CheckCircle2, photo: ImageIcon, receipt: Receipt,
  location: MapPin, text: ChevronRight,
};

const DEFAULT_NEW_MISSION: Mission = {
  title: '',
  description: '',
  lifeArea: 'meal',
  difficulty: 'easy',
  estimatedMinutes: 30,
  estimatedCostKRW: 0,
  points: 50,
  proofType: 'self_check',
  proofCriteria: [],
  steps: [],
  placeSearchQuery: '',
  needsMapSpot: false,
  soloFriendly: true,
  whyThisMission: '',
};

export function MissionCards({ result, onMissionSelect, userMissions, onCreateMission }: MissionCardsProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newMission, setNewMission] = useState<Mission>(DEFAULT_NEW_MISSION);
  const stateSummary = result?.stateSummary;
  const missions = result?.missions ?? [];
  const safetyNote = result?.safetyNote ?? '';

  const analysisSteps = [
    { step: 1, label: '상태 분석', status: 'completed' },
    { step: 2, label: '카테고리 결정', status: 'completed' },
    { step: 3, label: '미션 생성', status: 'completed' }
  ];

  const handleSubmitNewMission = () => {
    if (!onCreateMission) return;
    if (!newMission.title.trim()) return;

    const missionToSave: Mission = {
      ...newMission,
      proofCriteria: newMission.proofCriteria || [],
      steps: newMission.steps || [],
      placeSearchQuery: newMission.placeSearchQuery || '',
      whyThisMission: newMission.whyThisMission || '',
    };

    onCreateMission(missionToSave);
    setIsCreating(false);
    setNewMission(DEFAULT_NEW_MISSION);
  };

  const renderMissionCard = (mission: Mission, idx: number, sectionKey: string) => {
    const Icon = PROOF_ICON[mission.proofType] || CheckCircle2;
    const key = `${sectionKey}-${idx}`;

    return (
      <div
        key={key}
        className={cn(
          "bg-white rounded-lg transition-all shadow-md border-l-4",
          selectedId === idx && sectionKey === 'recommended' ? "ring-2 ring-[var(--spot-green)]/30" : ""
        )}
        style={{
          borderLeftColor: LIFE_AREA_COLOR[mission.lifeArea] || 'var(--spot-gray-300)'
        }}
      >
        {/* Mission Header */}
        <div className="p-4 border-b border-[var(--spot-gray-200)]">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-sm font-bold text-[var(--spot-gray-900)] break-words flex-1">
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
              <span className="text-xs text-[var(--spot-gray-700)]">{mission.estimatedMinutes}분</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-[var(--spot-gray-600)]" />
              <span className="text-xs text-[var(--spot-gray-700)]">
                {mission.estimatedCostKRW === 0 ? '무료' : `${mission.estimatedCostKRW.toLocaleString()}원`}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon className="w-3.5 h-3.5 text-[var(--spot-gray-600)]" />
              <span className="text-xs text-[var(--spot-gray-700)] uppercase">{mission.proofType}</span>
            </div>
          </div>
        </div>

        {/* Mission Body */}
        <div className="p-4">
          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium uppercase"
              style={{
                backgroundColor: LIFE_AREA_BG[mission.lifeArea] || 'var(--spot-gray-100)',
                color: LIFE_AREA_COLOR[mission.lifeArea] || 'var(--spot-gray-600)'
              }}
            >
              {mission.lifeArea}
            </span>
            {mission.needsMapSpot && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--spot-blue-light)] text-[var(--spot-blue)] rounded-full text-xs font-medium">
                <MapPin className="w-3 h-3" />
                주변 장소
              </span>
            )}
          </div>

          {/* Steps */}
          <div className="bg-[var(--spot-gray-50)] rounded-md p-3 mb-3">
            <p className="text-[10px] font-bold text-[var(--spot-gray-700)] mb-2 uppercase tracking-tight">실행 단계</p>
            <div className="space-y-1.5">
              {mission.steps.map((step, sidx) => (
                <div key={sidx} className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-white border border-[var(--spot-gray-300)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[9px] text-[var(--spot-gray-600)] font-bold">{sidx + 1}</span>
                  </div>
                  <p className="text-xs text-[var(--spot-gray-700)] break-words flex-1 leading-snug">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => {
              setSelectedId(idx);
              onMissionSelect(mission);
            }}
            className="w-full py-3 px-4 bg-gradient-to-r from-[var(--spot-green)] to-[var(--spot-blue)] text-white rounded-lg text-sm font-bold hover:shadow-lg transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span className="whitespace-nowrap">이 미션 선택</span>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--spot-yellow)]/10 via-white to-[var(--spot-green-light)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--spot-green)] via-[var(--spot-blue)] to-[var(--spot-yellow)] px-5 pt-safe pb-4 sticky top-0 z-10">
        <h1 className="text-lg font-semibold text-white drop-shadow">오늘의 미션</h1>
        <p className="text-xs text-white/90 mt-0.5">Gemini가 추천한 3가지 행동</p>
      </div>

      <div className="px-4 py-5 space-y-4 pb-24">
        {/* State Summary */}
        {stateSummary ? (
          <div className="bg-white rounded-lg border-l-4 border-[var(--spot-blue)] shadow-md p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--spot-blue)] to-[var(--spot-green)] flex items-center justify-center flex-shrink-0 shadow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-medium text-[var(--spot-gray-900)] mb-1.5">Gemini 분석 결과</h3>
                <p className="text-xs text-[var(--spot-gray-700)] break-words leading-relaxed">
                  {stateSummary.summary}
                </p>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              <span className="inline-flex items-center px-2 py-1 bg-[var(--spot-green-light)] text-[var(--spot-green-dark)] rounded text-[10px] font-medium uppercase">
                {stateSummary.primaryNeed} 우선
              </span>
              <span className="inline-flex items-center px-2 py-1 bg-[var(--spot-gray-200)] text-[var(--spot-gray-700)] rounded text-[10px] font-medium uppercase">
                에너지 {stateSummary.energyLevel}
              </span>
              <span className="inline-flex items-center px-2 py-1 bg-[var(--spot-gray-200)] text-[var(--spot-gray-700)] rounded text-[10px] font-medium uppercase">
                긴급도 {stateSummary.urgency}
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border-l-4 border-[var(--spot-gray-300)] shadow-sm p-4">
            <p className="text-xs text-[var(--spot-gray-700)] leading-relaxed">
              체크인을 하면 Gemini 추천 미션이 나타나요. 또는 아래에서 내 미션을 직접 추가할 수 있어요.
            </p>
          </div>
        )}

        {/* Agent Process */}
        {stateSummary && (
          <div className="bg-white rounded-lg border-l-4 border-[var(--spot-yellow)] shadow-sm p-4">
            <h3 className="text-xs font-medium text-[var(--spot-gray-700)] mb-3 uppercase tracking-wider">AI 분석 과정</h3>
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
        )}

        {/* Mission Cards */}
        <div className="space-y-4">
          {/* 상단: 내 미션 추가 버튼 */}
          {onCreateMission && (
            <div className="flex justify-end">
              <button
                onClick={() => setIsCreating((v) => !v)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--spot-green)] text-[var(--spot-green)] text-xs font-semibold bg-white shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>내 미션 직접 추가</span>
              </button>
            </div>
          )}

          {/* 내 미션 생성 폼 */}
          {isCreating && (
            <div className="bg-white rounded-lg border-l-4 border-[var(--spot-green)] shadow-md p-4 space-y-3">
              <h3 className="text-xs font-semibold text-[var(--spot-gray-900)] mb-1">
                나만의 미션 만들기
              </h3>
              <div className="space-y-2">
                <input
                  value={newMission.title}
                  onChange={(e) => setNewMission((m) => ({ ...m, title: e.target.value }))}
                  placeholder="미션 제목"
                  className="w-full px-3 py-2 rounded-md border border-[var(--spot-gray-300)] text-xs"
                />
                <textarea
                  value={newMission.description}
                  onChange={(e) => setNewMission((m) => ({ ...m, description: e.target.value }))}
                  placeholder="어떤 미션인지 간단히 적어주세요"
                  className="w-full px-3 py-2 rounded-md border border-[var(--spot-gray-300)] text-xs resize-none"
                  rows={3}
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newMission.lifeArea}
                    onChange={(e) =>
                      setNewMission((m) => ({ ...m, lifeArea: e.target.value as any }))
                    }
                    className="w-full px-3 py-2 rounded-md border border-[var(--spot-gray-300)] text-xs bg-white"
                  >
                    <option value="meal">식사</option>
                    <option value="rest">휴식</option>
                    <option value="outdoor">외출</option>
                    <option value="homecare">집안일</option>
                    <option value="social">사교</option>
                    <option value="safety">안전</option>
                  </select>
                  <select
                    value={newMission.difficulty}
                    onChange={(e) =>
                      setNewMission((m) => ({ ...m, difficulty: e.target.value as any }))
                    }
                    className="w-full px-3 py-2 rounded-md border border-[var(--spot-gray-300)] text-xs bg-white"
                  >
                    <option value="easy">가볍게</option>
                    <option value="normal">보통</option>
                    <option value="challenge">도전</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min={1}
                    value={newMission.estimatedMinutes}
                    onChange={(e) =>
                      setNewMission((m) => ({
                        ...m,
                        estimatedMinutes: Number(e.target.value || 0),
                      }))
                    }
                    className="w-full px-3 py-2 rounded-md border border-[var(--spot-gray-300)] text-xs"
                    placeholder="예상 시간(분)"
                  />
                  <input
                    type="number"
                    min={0}
                    value={newMission.estimatedCostKRW}
                    onChange={(e) =>
                      setNewMission((m) => ({
                        ...m,
                        estimatedCostKRW: Number(e.target.value || 0),
                      }))
                    }
                    className="w-full px-3 py-2 rounded-md border border-[var(--spot-gray-300)] text-xs"
                    placeholder="예상 비용(원)"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min={0}
                    value={newMission.points}
                    onChange={(e) =>
                      setNewMission((m) => ({
                        ...m,
                        points: Number(e.target.value || 0),
                      }))
                    }
                    className="w-full px-3 py-2 rounded-md border border-[var(--spot-gray-300)] text-xs"
                    placeholder="포인트"
                  />
                  <select
                    value={newMission.proofType}
                    onChange={(e) =>
                      setNewMission((m) => ({ ...m, proofType: e.target.value as any }))
                    }
                    className="w-full px-3 py-2 rounded-md border border-[var(--spot-gray-300)] text-xs bg-white"
                  >
                    <option value="self_check">셀프 체크</option>
                    <option value="photo">사진</option>
                    <option value="receipt">영수증</option>
                    <option value="location">위치</option>
                    <option value="text">텍스트</option>
                  </select>
                </div>
                <textarea
                  value={newMission.steps.join('\n')}
                  onChange={(e) =>
                    setNewMission((m) => ({
                      ...m,
                      steps: e.target.value
                        .split('\n')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    }))
                  }
                  placeholder="실행 단계를 한 줄씩 적어주세요"
                  className="w-full px-3 py-2 rounded-md border border-[var(--spot-gray-300)] text-xs resize-none"
                  rows={3}
                />
                <button
                  onClick={handleSubmitNewMission}
                  disabled={!newMission.title.trim()}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-[var(--spot-green)] to-[var(--spot-blue)] text-white rounded-lg text-xs font-bold hover:shadow-md transition-all disabled:opacity-50"
                >
                  이 설정으로 내 미션 추가
                </button>
              </div>
            </div>
          )}

          {/* AI 추천 미션 */}
          <div className="space-y-3">
            {missions.map((mission, idx) => renderMissionCard(mission, idx, 'recommended'))}
          </div>

          {/* 사용자가 만든 미션 목록 */}
          {userMissions && userMissions.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-dashed border-[var(--spot-gray-200)]">
              <h3 className="text-xs font-semibold text-[var(--spot-gray-700)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--spot-green)]" />
                내가 만든 미션
              </h3>
              {userMissions.map((mission, idx) => renderMissionCard(mission, idx, 'user'))}
            </div>
          )}
        </div>

        {safetyNote && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex gap-2">
            <span className="text-red-500 text-sm">⚠️</span>
            <p className="text-xs text-red-700 leading-relaxed font-medium">{safetyNote}</p>
          </div>
        )}
      </div>
    </div>
  );
}
