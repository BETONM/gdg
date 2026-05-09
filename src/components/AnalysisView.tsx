'use client';

import { MissionResult } from '@/types/mission';

interface Props {
  result: MissionResult;
  onContinue: () => void;
}

const NEED_LABEL: Record<string, string> = {
  meal: '식사',
  rest: '휴식',
  outdoor: '외출',
  homecare: '집관리',
  social: '사회적 연결',
  safety: '안전',
};

const ENERGY_LABEL: Record<string, string> = {
  low: '낮음',
  medium: '보통',
  high: '높음',
};

const URGENCY_LABEL: Record<string, string> = {
  low: '낮음',
  medium: '보통',
  high: '높음',
};

const URGENCY_COLOR: Record<string, string> = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
};

export default function AnalysisView({ result, onContinue }: Props) {
  const { stateSummary, agentPlan } = result;

  return (
    <div className="screen-wrap">
      <div className="screen-header">
        <div className="app-badge">Gemini Agent</div>
        <h1 className="screen-title">상태 분석 완료</h1>
        <p className="screen-subtitle">Gemini가 오늘의 상태를 분석했습니다</p>
      </div>

      <div className="glass-card analysis-card">
        <p className="analysis-summary">{stateSummary.summary}</p>
        <div className="analysis-tags">
          <span className="tag">우선순위: {NEED_LABEL[stateSummary.primaryNeed]}</span>
          <span className="tag">에너지: {ENERGY_LABEL[stateSummary.energyLevel]}</span>
          <span
            className="tag"
            style={{ borderColor: URGENCY_COLOR[stateSummary.urgency], color: URGENCY_COLOR[stateSummary.urgency] }}
          >
            긴급도: {URGENCY_LABEL[stateSummary.urgency]}
          </span>
        </div>
      </div>

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

      <button className="btn btn-primary submit-btn" onClick={onContinue}>
        미션 보기 →
      </button>
    </div>
  );
}
