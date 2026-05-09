'use client';

import { useState } from 'react';
import { CheckinInput, TimeOfDay, EnergyLevel, PrimaryNeed } from '@/types/mission';

interface Props {
  onSubmit: (input: CheckinInput) => void;
}

const TIME_OPTIONS: [TimeOfDay, string][] = [
  ['morning', '☀️ 아침'],
  ['afternoon', '🌤 점심'],
  ['evening', '🌆 저녁'],
  ['night', '🌙 밤'],
];

const ENERGY_OPTIONS: [EnergyLevel, string][] = [
  ['low', '😴 낮음'],
  ['medium', '🙂 보통'],
  ['high', '⚡ 높음'],
];

const SAMPLE_INPUT: CheckinInput = {
  timeOfDay: 'evening',
  hasEaten: false,
  energyLevel: 'low',
  wentOutsideToday: false,
  currentNeed: 'meal',
  budgetKRW: 8000,
  mood: '좀 피곤하고 외로운 느낌이 들어요',
};

const NEED_OPTIONS: [PrimaryNeed, string][] = [
  ['meal', '🍱 식사'],
  ['rest', '😴 휴식'],
  ['outdoor', '🚶 외출'],
  ['homecare', '🏠 집관리'],
  ['social', '👥 사람과의 연결'],
  ['safety', '🛡 안전'],
];

export default function CheckinForm({ onSubmit }: Props) {
  const [form, setForm] = useState<CheckinInput>({
    timeOfDay: 'evening',
    hasEaten: false,
    energyLevel: 'low',
    wentOutsideToday: false,
    currentNeed: 'meal',
    budgetKRW: 8000,
    mood: '',
  });

  return (
    <div className="screen-wrap">
      <div className="screen-header">
        <div className="app-badge">Hi Spot Daily</div>
        <h1 className="screen-title">오늘 상태 체크인</h1>
        <p className="screen-subtitle">지금 나의 상태를 알려주세요 ✨</p>
      </div>

      <div className="field-group">
        <label className="field-label">지금 시간대</label>
        <div className="option-grid cols-4">
          {TIME_OPTIONS.map(([val, label]) => (
            <button
              key={val}
              type="button"
              className={`option-btn ${form.timeOfDay === val ? 'active' : ''}`}
              onClick={() => setForm((f) => ({ ...f, timeOfDay: val }))}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="field-group">
        <label className="field-label">밥 먹었나요?</label>
        <div className="option-grid cols-2">
          <button
            type="button"
            className={`option-btn ${form.hasEaten ? 'active' : ''}`}
            onClick={() => setForm((f) => ({ ...f, hasEaten: true }))}
          >
            먹었어요
          </button>
          <button
            type="button"
            className={`option-btn ${!form.hasEaten ? 'active' : ''}`}
            onClick={() => setForm((f) => ({ ...f, hasEaten: false }))}
          >
            아직이에요
          </button>
        </div>
      </div>

      <div className="field-group">
        <label className="field-label">에너지 수준</label>
        <div className="option-grid cols-3">
          {ENERGY_OPTIONS.map(([val, label]) => (
            <button
              key={val}
              type="button"
              className={`option-btn ${form.energyLevel === val ? 'active' : ''}`}
              onClick={() => setForm((f) => ({ ...f, energyLevel: val }))}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="field-group">
        <label className="field-label">오늘 외출했나요?</label>
        <div className="option-grid cols-2">
          <button
            type="button"
            className={`option-btn ${form.wentOutsideToday ? 'active' : ''}`}
            onClick={() => setForm((f) => ({ ...f, wentOutsideToday: true }))}
          >
            했어요
          </button>
          <button
            type="button"
            className={`option-btn ${!form.wentOutsideToday ? 'active' : ''}`}
            onClick={() => setForm((f) => ({ ...f, wentOutsideToday: false }))}
          >
            안 했어요
          </button>
        </div>
      </div>

      <div className="field-group">
        <label className="field-label">오늘 필요한 것</label>
        <div className="option-grid cols-3">
          {NEED_OPTIONS.map(([val, label]) => (
            <button
              key={val}
              type="button"
              className={`option-btn ${form.currentNeed === val ? 'active' : ''}`}
              onClick={() => setForm((f) => ({ ...f, currentNeed: val }))}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="field-group">
        <label className="field-label">예산 (원)</label>
        <input
          type="number"
          className="text-input"
          value={form.budgetKRW}
          min={0}
          step={1000}
          onChange={(e) => setForm((f) => ({ ...f, budgetKRW: Number(e.target.value) }))}
        />
      </div>

      <div className="field-group">
        <label className="field-label">지금 기분이나 상황 (선택)</label>
        <textarea
          className="text-input textarea"
          placeholder="예: 좀 피곤하고 외로운 느낌이 들어요..."
          value={form.mood}
          onChange={(e) => setForm((f) => ({ ...f, mood: e.target.value }))}
        />
      </div>

      <button
        className="btn btn-secondary sample-btn"
        onClick={() => setForm(SAMPLE_INPUT)}
      >
        샘플로 채우기
      </button>

      <button className="btn btn-primary submit-btn" onClick={() => onSubmit(form)}>
        오늘의 미션 만들기 →
      </button>
    </div>
  );
}
