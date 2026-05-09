'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Heart, Bookmark, TrendingUp, ChevronRight, Star, Plus, MessageSquare, CheckCircle2, Lightbulb, Camera, Save } from 'lucide-react';
import { TipInput, TipReview } from '@/types/mission';
import { cn } from '@/components/ui/utils';
import { useAuth } from '@/hooks/useAuth';
import { saveTip } from '@/lib/missionStore';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';

interface CommunityTipProps {
  onComplete?: () => void;
}

export function CommunityTip({ onComplete }: CommunityTipProps) {
  const { user } = useAuth();
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<TipInput>({
    category: 'convenience_combo',
    title: '',
    content: '',
    estimatedCostKRW: 0
  });
  const [review, setReview] = useState<TipReview | null>(null);

  const [communityTips, setCommunityTips] = useState<any[]>([]);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'tips'), orderBy('createdAt', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTips = snapshot.docs.map(doc => {
        const data = doc.data();
        let timeAgo = '방금 전';
        if (data.createdAt) {
          const diffMs = Date.now() - data.createdAt.toMillis();
          const diffMins = Math.floor(diffMs / 60000);
          if (diffMins < 60) timeAgo = `${Math.max(1, diffMins)}분 전`;
          else if (diffMins < 1440) timeAgo = `${Math.floor(diffMins / 60)}시간 전`;
          else timeAgo = `${Math.floor(diffMins / 1440)}일 전`;
        }
        
        return {
          id: doc.id,
          title: data.improvedTitle || data.title,
          content: data.improvedTip || data.content,
          author: data.author,
          timeAgo,
          likes: data.likes || 0,
          saves: data.saves || 0,
          points: data.suggestedPoints || 0,
          tags: data.tags || [],
        };
      });
      setCommunityTips(fetchedTips);
    });
    return () => unsubscribe();
  }, []);

  const handleReview = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/review-tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data: TipReview = await res.json();
      setReview(data);
    } catch (err) {
      console.error('Review failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!user || !review) return;
    setLoading(true);
    try {
        await saveTip(review, user.uid, user.displayName || '익명');
        setShowWriteForm(false);
        setReview(null);
        setForm({ category: 'convenience_combo', title: '', content: '', estimatedCostKRW: 0 });
    } catch (err) {
        console.error('Post failed:', err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--spot-blue-light)] via-white to-[var(--spot-yellow)]/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--spot-green)] via-[var(--spot-blue)] to-[var(--spot-yellow)] px-5 pt-safe pb-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white drop-shadow">커뮤니티</h1>
            <p className="text-xs text-white/90 mt-0.5">자취생들의 생활 꿀팁</p>
          </div>
          <div className="flex items-center gap-1.5 bg-white/95 px-3 py-1.5 rounded-full shadow-sm">
            <Star className="w-3.5 h-3.5 text-[var(--spot-yellow)]" fill="var(--spot-yellow)" />
            <span className="text-xs font-bold text-[var(--spot-gray-900)]">Top 100</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-4 pb-24">
        {!showWriteForm ? (
            <>
                {/* Write Tip CTA */}
                <button
                onClick={() => setShowWriteForm(true)}
                className="w-full bg-gradient-to-r from-[var(--spot-blue)] to-[var(--spot-green)] text-white rounded-xl p-5 hover:shadow-xl transition-all shadow-lg"
                >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Plus className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-base font-bold mb-0.5">나만의 꿀팁 공유하기</h3>
                        <p className="text-xs text-white/90">Gemini가 다듬어서 최대 50pt 드려요</p>
                    </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white flex-shrink-0" />
                </div>
                </button>

                {/* Stats Banner */}
                <div className="bg-white rounded-lg border-l-4 border-[var(--spot-yellow)] shadow-sm p-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                    <div className="text-xs text-[var(--spot-gray-600)] mb-1">공유된 꿀팁</div>
                    <div className="text-lg font-bold text-[var(--spot-gray-900)]">1,234</div>
                    </div>
                    <div>
                    <div className="text-xs text-[var(--spot-gray-600)] mb-1">이번 주 베스트</div>
                    <div className="text-lg font-bold text-[var(--spot-green)]">156</div>
                    </div>
                    <div>
                    <div className="text-xs text-[var(--spot-gray-600)] mb-1">내가 저장</div>
                    <div className="text-lg font-bold text-[var(--spot-blue)]">23</div>
                    </div>
                </div>
                </div>

                {/* Community Feed */}
                <div>
                <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-sm font-semibold text-[var(--spot-gray-900)]">인기 꿀팁</h3>
                    <button className="text-xs text-[var(--spot-blue)] font-medium">더보기</button>
                </div>

                <div className="space-y-3">
                    {communityTips.map((tip, index) => (
                    <div
                        key={tip.id}
                        className="bg-white rounded-lg shadow-md border-l-4"
                        style={{ borderLeftColor: index === 0 ? 'var(--spot-green)' : 'var(--spot-blue)' }}
                    >
                        <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-[var(--spot-gray-900)] truncate">{tip.title}</h4>
                                <p className="text-xs text-[var(--spot-gray-600)] line-clamp-2 mt-1">{tip.content}</p>
                            </div>
                            <div className="bg-[var(--spot-green-light)] px-2 py-1 rounded text-[10px] font-bold text-[var(--spot-green)] flex-shrink-0">
                                +{tip.points}pt
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                            <span className="text-[10px] text-gray-500">{tip.author} · {tip.timeAgo}</span>
                            <div className="flex gap-2">
                                <Heart className="w-3 h-3 text-gray-400" />
                                <Bookmark className="w-3 h-3 text-gray-400" />
                            </div>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            </>
        ) : (
            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-[var(--spot-gray-900)]">꿀팁 작성</h2>
                    <button onClick={() => setShowWriteForm(false)} className="text-gray-400 hover:text-gray-600 font-medium">취소</button>
                </div>

                {!review ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">꿀팁 제목</label>
                            <input 
                                type="text"
                                value={form.title}
                                onChange={e => setForm({...form, title: e.target.value})}
                                placeholder="예: 8천원 편의점 식단 조합"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--spot-blue)] outline-none text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">상세 내용</label>
                            <textarea 
                                value={form.content}
                                onChange={e => setForm({...form, content: e.target.value})}
                                placeholder="나만의 자취 노하우를 공유해주세요..."
                                rows={5}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--spot-blue)] outline-none text-sm resize-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
                                <Camera className="w-6 h-6" />
                                <span className="text-[10px] font-bold">사진 첨부</span>
                            </button>
                            <button 
                                onClick={() => setForm({
                                    category: 'convenience_combo',
                                    title: '편의점 8천원 균형식',
                                    content: '삼각김밥 + 닭가슴살 + 무지방 우유 조합 추천해요. 저렴하고 배불러요.',
                                    estimatedCostKRW: 7900
                                })}
                                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-gray-100 bg-gray-50 text-gray-500"
                            >
                                <Lightbulb className="w-6 h-6 text-yellow-500" />
                                <span className="text-[10px] font-bold">샘플 입력</span>
                            </button>
                        </div>
                        <button
                            onClick={handleReview}
                            disabled={loading || !form.title || !form.content}
                            className="w-full py-4 bg-gradient-to-r from-[var(--spot-blue)] to-[var(--spot-green)] text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            Gemini로 꿀팁 다듬기
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="bg-gradient-to-br from-[var(--spot-green-light)] to-white p-5 rounded-2xl border-l-4 border-[var(--spot-green)] shadow-md">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-[var(--spot-green)] flex items-center justify-center text-white text-xl font-black">
                                    {review.usefulnessScore}
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase">Gemini 평점</p>
                                    <p className="text-sm font-bold text-[var(--spot-green)]">+{review.suggestedPoints}pt 예정</p>
                                </div>
                            </div>
                            <h3 className="font-bold text-[var(--spot-gray-900)] mb-2">{review.improvedTitle}</h3>
                            <p className="text-xs text-gray-700 leading-relaxed">{review.improvedTip}</p>
                            <div className="flex flex-wrap gap-1 mt-3">
                                {review.tags.map(tag => <span key={tag} className="px-2 py-0.5 bg-white rounded text-[9px] text-gray-500 border border-gray-100">#{tag}</span>)}
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl flex gap-2">
                            <Lightbulb className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <p className="text-[11px] text-blue-700 font-medium">{review.whyUseful}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setReview(null)} className="py-4 rounded-xl border border-gray-200 font-bold text-gray-600">다시 쓰기</button>
                            <button 
                                onClick={handlePost} 
                                disabled={loading}
                                className="py-4 rounded-xl bg-[var(--spot-gray-900)] text-white font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                                등록하기
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
}
