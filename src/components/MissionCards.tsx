'use client';

import { Mission, MissionResult } from '@/types/mission';

interface Props {
  result: MissionResult;
  onSelect: (mission: Mission) => void;
}

const LIFE_AREA_EMOJI: Record<string, string> = {
  meal: '🍱',
  rest: '😴',
  outdoor: '🚶',
  homecare: '🏠',
  social: '👥',
  safety: '🛡',
};

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: '쉬움',
  normal: '보통',
  challenge: '도전',
};

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: '#22c55e',
  normal: '#f59e0b',
  challenge: '#ef4444',
};

const PROOF_LABEL: Record<string, string> = {
  self_check: '자가 체크',
  photo: '사진 인증',
  receipt: '영수증',
  location: '위치 인증',
  text: '글 작성',
};

export default function MissionCards({ result, onSelect }: Props) {
  return (
    <div className="screen-wrap">
      <div className="screen-header">
        <div className="app-badge">오늘의 미션</div>
        <h1 className="screen-title">미션 3개가 준비됐어요</h1>
        <p className="screen-subtitle">하나를 골라서 시작해보세요</p>
      </div>

      <div className="mission-list">
        {result.missions.map((mission, i) => (
          <div key={i} className="mission-card glass-card">
            <div className="mission-card-header">
              <span className="mission-emoji">{LIFE_AREA_EMOJI[mission.lifeArea]}</span>
              <div className="mission-badges">
                <span
                  className="badge"
                  style={{ color: DIFFICULTY_COLOR[mission.difficulty], borderColor: DIFFICULTY_COLOR[mission.difficulty] }}
                >
                  {DIFFICULTY_LABEL[mission.difficulty]}
                </span>
                {mission.needsMapSpot && <span className="badge badge-map">📍 지도 연결</span>}
              </div>
            </div>

            <h3 className="mission-title">{mission.title}</h3>
            <p className="mission-desc">{mission.description}</p>

            <div className="mission-meta">
              <span>⏱ {mission.estimatedMinutes}분</span>
              <span>💰 {mission.estimatedCostKRW === 0 ? '무료' : `${mission.estimatedCostKRW.toLocaleString()}원`}</span>
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

            <button className="btn btn-primary mission-select-btn" onClick={() => onSelect(mission)}>
              이 미션 선택하기 →
            </button>
          </div>
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
