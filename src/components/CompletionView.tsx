'use client';

import { Mission, LifeArea } from '@/types/mission';

interface Props {
  mission: Mission;
  totalPoints: number;
  lifeAreaScores: Record<LifeArea, number>;
  onRestart: () => void;
}

const LIFE_AREA_LABEL: Record<LifeArea, string> = {
  meal: '🍱 식사',
  rest: '😴 휴식',
  outdoor: '🚶 외출',
  homecare: '🏠 집관리',
  social: '👥 사회적 연결',
  safety: '🛡 안전',
};

const COMPLETION_MESSAGES = [
  '오늘 하루도 잘 해냈어요!',
  '작은 실행이 큰 변화를 만들어요.',
  '혼자서도 충분히 잘하고 있어요.',
  '오늘의 미션, 완벽하게 클리어!',
];

export default function CompletionView({ mission, totalPoints, lifeAreaScores, onRestart }: Props) {
  const message = COMPLETION_MESSAGES[Math.floor(Math.random() * COMPLETION_MESSAGES.length)];

  return (
    <div className="screen-wrap">
      <div className="screen-header">
        <div className="completion-trophy">🏆</div>
        <h1 className="screen-title">미션 완료!</h1>
        <p className="screen-subtitle">{message}</p>
      </div>

      <div className="glass-card points-card">
        <p className="points-label">획득 포인트</p>
        <p className="points-earned">+{mission.points}p</p>
        <p className="points-total">오늘 누적: {totalPoints}p</p>
      </div>

      <div className="life-scores-section">
        <h2 className="section-title">생활 영역 점수</h2>
        <div className="life-scores-grid">
          {(Object.entries(lifeAreaScores) as [LifeArea, number][]).map(([area, score]) => (
            <div key={area} className="life-score-item glass-card">
              <span className="life-area-label">{LIFE_AREA_LABEL[area]}</span>
              <div className="score-bar-wrap">
                <div className="score-bar" style={{ width: `${Math.min(score, 100)}%` }} />
              </div>
              <span className="score-num">{score}p</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card completed-mission-card">
        <p className="completed-label">완료한 미션</p>
        <p className="completed-title">{mission.title}</p>
        <p className="completed-proof">인증 방식: {mission.proofType}</p>
      </div>

      <button className="btn btn-primary submit-btn" onClick={onRestart}>
        오늘 미션 더 하기 →
      </button>
    </div>
  );
}
