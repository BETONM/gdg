'use client';

import { useState } from 'react';
import { TipInput, TipReview, TipCategory } from '@/types/mission';

interface Props {
  missionPoints: number;
  onPost: (pointsEarned: number) => void;
  onRestart: () => void;
}

type Stage = 'input' | 'reviewing' | 'reviewed' | 'posted';

const CATEGORIES: [TipCategory, string][] = [
  ['convenience_combo', '🏪 편의점 조합'],
  ['budget', '💰 식비 절약'],
  ['homecare', '🏠 집관리'],
  ['safety', '🛡 안전'],
  ['loneliness', '👥 외로움 해소'],
  ['cleaning_laundry', '🧺 청소·빨래'],
];

const MOCK_FEED = [
  { title: '냉동 볶음밥 황금 레시피', category: '식비 절약', points: 35, likes: 42, saves: 18 },
  { title: '욕실 5분 청소 루틴', category: '집관리', points: 25, likes: 31, saves: 24 },
  { title: '편의점 단백질 조합 5종', category: '편의점 조합', points: 45, likes: 67, saves: 39 },
];

const SAMPLE_TIP: TipInput = {
  category: 'convenience_combo',
  title: '8천원 편의점 균형식 조합',
  content: '삼각김밥 + 닭가슴살 + 두유 조합. 7,900원에 탄수화물이랑 단백질 챙길 수 있어요.',
  estimatedCostKRW: 7900,
};

export default function TipSharing({ missionPoints, onPost, onRestart }: Props) {
  const [stage, setStage] = useState<Stage>('input');
  const [form, setForm] = useState<TipInput>({
    category: 'convenience_combo',
    title: '',
    content: '',
    estimatedCostKRW: 0,
  });
  const [review, setReview] = useState<TipReview | null>(null);
  const [totalPoints, setTotalPoints] = useState(missionPoints);

  const handleReview = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setStage('reviewing');
    try {
      const res = await fetch('/api/review-tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data: TipReview = await res.json();
      setReview(data);
      setStage('reviewed');
    } catch {
      setStage('input');
    }
  };

  const handlePost = () => {
    if (!review) return;
    const newTotal = totalPoints + review.suggestedPoints;
    setTotalPoints(newTotal);
    onPost(review.suggestedPoints);
    setStage('posted');
  };

  if (stage === 'posted' && review) {
    return (
      <div className="screen-wrap">
        <div className="screen-header">
          <div className="completion-trophy">🎉</div>
          <h1 className="screen-title">꿀팁 공유 완료!</h1>
          <p className="screen-subtitle">커뮤니티에 올라갔어요</p>
        </div>

        <div className="glass-card points-card">
          <p className="points-label">오늘 획득 포인트</p>
          <p className="points-earned">+{review.suggestedPoints}p</p>
          <p className="points-total">미션 + 꿀팁 누적: {totalPoints}p</p>
        </div>

        <div className="glass-card tip-result-card">
          <p className="completed-label">공유된 꿀팁</p>
          <p className="completed-title">{review.improvedTitle}</p>
          <p className="mission-desc" style={{ marginTop: '0.5rem' }}>{review.improvedTip}</p>
          <div className="analysis-tags" style={{ marginTop: '0.75rem' }}>
            {review.tags.map((tag) => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        </div>

        <button className="btn btn-primary submit-btn" onClick={onRestart}>
          오늘 미션 더 하기 →
        </button>
      </div>
    );
  }

  return (
    <div className="screen-wrap">
      <div className="screen-header">
        <div className="app-badge">커뮤니티</div>
        <h1 className="screen-title">오늘의 자취 꿀팁</h1>
        <p className="screen-subtitle">유용한 꿀팁을 공유하면 최대 50pt</p>
      </div>

      {stage === 'input' && (
        <>
          <div className="field-group">
            <label className="field-label">카테고리</label>
            <div className="option-grid cols-3">
              {CATEGORIES.map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  className={`option-btn ${form.category === val ? 'active' : ''}`}
                  onClick={() => setForm((f) => ({ ...f, category: val }))}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">제목</label>
            <input
              type="text"
              className="text-input"
              placeholder="예: 8천원 편의점 균형식 조합"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>

          <div className="field-group">
            <label className="field-label">내용</label>
            <textarea
              className="text-input textarea"
              placeholder="어떤 꿀팁인지 자세히 써주세요..."
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            />
          </div>

          <div className="field-group">
            <label className="field-label">예상 비용 (원)</label>
            <input
              type="number"
              className="text-input"
              value={form.estimatedCostKRW}
              min={0}
              step={500}
              onChange={(e) =>
                setForm((f) => ({ ...f, estimatedCostKRW: Number(e.target.value) }))
              }
            />
          </div>

          <div className="tip-photo-placeholder glass-card">
            <span>📷</span>
            <p>사진 업로드 (준비 중)</p>
          </div>

          <button
            className="btn btn-secondary sample-btn"
            onClick={() => setForm(SAMPLE_TIP)}
          >
            샘플 꿀팁 입력
          </button>

          <button
            className="btn btn-primary submit-btn"
            onClick={handleReview}
            disabled={!form.title.trim() || !form.content.trim()}
          >
            Gemini로 꿀팁 다듬기 ✨
          </button>
        </>
      )}

      {stage === 'reviewing' && (
        <div className="loading-screen" style={{ minHeight: '30vh' }}>
          <div className="loading-spinner" />
          <p className="loading-msg">Gemini가 꿀팁을 분석하고 있어요...</p>
        </div>
      )}

      {stage === 'reviewed' && review && (
        <>
          <div className="glass-card tip-review-card">
            <div className="tip-review-header">
              <div className="usefulness-score">
                <span className="score-circle">{review.usefulnessScore}</span>
                <div>
                  <p className="score-label">유용성 점수</p>
                  <p className="score-points">예상 획득 +{review.suggestedPoints}p</p>
                </div>
              </div>
            </div>

            <h3 className="mission-title" style={{ marginTop: '1rem' }}>
              {review.improvedTitle}
            </h3>
            <p className="mission-desc">{review.improvedTip}</p>

            <p className="mission-why" style={{ marginTop: '0.75rem' }}>
              💡 {review.whyUseful}
            </p>

            <div className="analysis-tags" style={{ marginTop: '0.75rem' }}>
              {review.tags.map((tag) => (
                <span key={tag} className="tag">#{tag}</span>
              ))}
            </div>

            {review.safetyOrHealthNote && (
              <div className="safety-note" style={{ marginTop: '0.75rem' }}>
                <span>⚠️</span>
                <p>{review.safetyOrHealthNote}</p>
              </div>
            )}
          </div>

          <div className="community-feed-section">
            <h2 className="section-title">커뮤니티 피드 미리보기</h2>
            <div className="feed-list">
              {MOCK_FEED.map((item, i) => (
                <div key={i} className="feed-card glass-card">
                  <div className="feed-card-body">
                    <span className="feed-category">{item.category}</span>
                    <p className="feed-title">{item.title}</p>
                    <div className="feed-meta">
                      <span>❤️ {item.likes}</span>
                      <span>🔖 {item.saves}</span>
                    </div>
                  </div>
                  <span className="feed-points">+{item.points}p</span>
                </div>
              ))}
            </div>
          </div>

          <button className="btn btn-primary submit-btn" onClick={handlePost}>
            커뮤니티에 올리고 포인트 받기 🎉
          </button>
        </>
      )}
    </div>
  );
}
