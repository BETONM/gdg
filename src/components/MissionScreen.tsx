'use client';

import { Mission, MissionResult } from '@/types/mission';
import { useTts } from '@/hooks/useTts';

interface Props {
  result: MissionResult;
  onSelect: (mission: Mission) => void;
}

const NEED_LABEL: Record<string, string> = {
  meal: '식사', rest: '휴식', outdoor: '외출',
  homecare: '집관리', social: '사회적 연결', safety: '안전',
};
const ENERGY_LABEL: Record<string, string> = { low: '낮음', medium: '보통', high: '높음' };
const URGENCY_COLOR: Record<string, string> = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' };
const URGENCY_LABEL: Record<string, string> = { low: '낮음', medium: '보통', high: '높음' };
const LIFE_AREA_EMOJI: Record<string, string> = {
  meal: '🍱', rest: '😴', outdoor: '🚶', homecare: '🏠', social: '👥', safety: '🛡',
};
const DIFFICULTY_LABEL: Record<string, string> = { easy: '쉬움', normal: '보통', challenge: '도전' };
const DIFFICULTY_COLOR: Record<string, string> = { easy: '#22c55e', normal: '#f59e0b', challenge: '#ef4444' };
const PROOF_LABEL: Record<string, string> = {
  self_check: '자가 체크', photo: '사진 인증', receipt: '영수증',
  location: '위치 인증', text: '글 작성',
};

function missionTtsScript(mission: Mission): string {
  return `${mission.title}. ${mission.description} 예상 시간은 ${mission.estimatedMinutes}분이에요. ${mission.whyThisMission}`;
}

function MissionCard({
  mission,
  onSelect,
}: {
  mission: Mission;
  onSelect: () => void;
}) {
  const { speak, playing } = useTts();

  return (
    <div className="mission-card glass-card">
      <div className="mission-card-header">
        <span className="mission-emoji">{LIFE_AREA_EMOJI[mission.lifeArea]}</span>
        <div className="mission-badges">
          <span
            className="badge"
            style={{
              color: DIFFICULTY_COLOR[mission.difficulty],
              borderColor: DIFFICULTY_COLOR[mission.difficulty],
            }}
          >
            {DIFFICULTY_LABEL[mission.difficulty]}
          </span>
          {mission.needsMapSpot && <span className="badge badge-map">📍 지도 연결</span>}
          <button
            className={`tts-btn ${playing ? 'tts-btn--playing' : ''}`}
            onClick={() => speak(missionTtsScript(mission))}
            title="음성 안내 듣기"
          >
            {playing ? '⏸' : '🔊'}
          </button>
        </div>
      </div>

      <h3 className="mission-title">{mission.title}</h3>
      <p className="mission-desc">{mission.description}</p>

      <div className="mission-meta">
        <span>⏱ {mission.estimatedMinutes}분</span>
        <span>
          💰{' '}
          {mission.estimatedCostKRW === 0
            ? '무료'
            : `${mission.estimatedCostKRW.toLocaleString()}원`}
        </span>
        <span>⭐ {mission.points}p</span>
        <span>📋 {PROOF_LABEL[mission.proofType]}</span>
      </div>

      <div className="mission-steps">
        <p className="steps-label">실행 단계</p>
        <ol className="steps-list">
          {mission.steps.map((step, j) => (
            <li key={j}>{step}</li>
          ))}
        </ol>
      </div>

      <p className="mission-why">💡 {mission.whyThisMission}</p>

      <button className="btn btn-primary mission-select-btn" onClick={onSelect}>
        이 미션 선택 →
      </button>
    </div>
  );
}

export default function MissionScreen({ result, onSelect }: Props) {
  const { stateSummary, agentPlan, missions } = result;
  const { speak, playing } = useTts();

  const summarySpeech = `${stateSummary.summary} 오늘 우선순위는 ${NEED_LABEL[stateSummary.primaryNeed]}이에요.`;

  return (
    <div className="screen-wrap">
      <div className="screen-header">
        <div className="app-badge">Gemini Agent</div>
        <h1 className="screen-title">오늘의 미션</h1>
        <p className="screen-subtitle">상태를 분석하고 미션 3개를 준비했어요</p>
      </div>

      {/* State Summary */}
      <div className="glass-card analysis-card">
        <div className="analysis-card-top">
          <p className="analysis-summary">{stateSummary.summary}</p>
          <button
            className={`tts-btn tts-btn--lg ${playing ? 'tts-btn--playing' : ''}`}
            onClick={() => speak(summarySpeech)}
            title="상태 요약 음성으로 듣기"
          >
            {playing ? '⏸' : '🔊'}
          </button>
        </div>
        <div className="analysis-tags">
          <span className="tag">우선순위: {NEED_LABEL[stateSummary.primaryNeed]}</span>
          <span className="tag">에너지: {ENERGY_LABEL[stateSummary.energyLevel]}</span>
          <span
            className="tag"
            style={{
              borderColor: URGENCY_COLOR[stateSummary.urgency],
              color: URGENCY_COLOR[stateSummary.urgency],
            }}
          >
            긴급도: {URGENCY_LABEL[stateSummary.urgency]}
          </span>
        </div>
      </div>

      {/* Agent Plan */}
      <div className="agent-plan-section">
        <h2 className="section-title">Agent Plan</h2>
        <ol className="plan-list">
          {agentPlan.map((step, i) => (
            <li key={i} className="plan-item">
              <span className="plan-num">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Mission Cards */}
      <div className="mission-list">
        {missions.map((mission, i) => (
          <MissionCard key={i} mission={mission} onSelect={() => onSelect(mission)} />
        ))}
      </div>

      {result.safetyNote && (
        <div className="safety-note">
          <span>⚠️</span>
          <p>{result.safetyNote}</p>
        </div>
      )}
    </div>
  );
}
