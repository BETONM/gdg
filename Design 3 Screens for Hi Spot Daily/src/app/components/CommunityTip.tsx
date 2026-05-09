import { useState } from 'react';
import { Sparkles, Heart, Bookmark, TrendingUp, ChevronRight, Star, Plus, MessageSquare, CheckCircle2 } from 'lucide-react';

interface CommunityTipProps {
  onComplete?: () => void;
}

export function CommunityTip({ onComplete }: CommunityTipProps) {
  const [showWriteForm, setShowWriteForm] = useState(false);

  const communityTips = [
    {
      id: 1,
      title: '편의점 닭가슴살 샐러드 조합',
      content: '닭가슴살 + 컵샐러드 + 삶은계란으로 4천원 안에 단백질 식사 가능해요. CU에서 샐러드 1+1 할 때 사면 더 저렴합니다!',
      author: '자취 3개월차',
      timeAgo: '2시간 전',
      likes: 124,
      saves: 58,
      comments: 23,
      points: 45,
      tags: ['#편의점조합', '#식비절약', '#단백질'],
      category: '식사',
      verified: true
    },
    {
      id: 2,
      title: '전기요금 절약 타이머 활용법',
      content: '멀티탭 타이머로 대기전력 차단하니 한 달에 5천원 아껴요. 다이소 타이머 3천원으로 충분합니다.',
      author: '알뜰자취러',
      timeAgo: '5시간 전',
      likes: 89,
      saves: 102,
      comments: 18,
      points: 40,
      tags: ['#전기절약', '#집관리', '#월세절약'],
      category: '집관리',
      verified: true
    },
    {
      id: 3,
      title: '빨래 냄새 안 나는 법',
      content: '세탁 후 바로 털어서 널고, 통풍 잘 되는 곳에 걸면 냄새 안 나요. 베이킹소다 한 스푼 넣으면 더 좋습니다.',
      author: '깔끔이',
      timeAgo: '1일 전',
      likes: 156,
      saves: 89,
      comments: 31,
      points: 50,
      tags: ['#빨래', '#청소', '#생활팁'],
      category: '청소',
      verified: true
    },
    {
      id: 4,
      title: '혼밥 외로울 때 유튜브 추천',
      content: '먹방이 아니라 일상 브이로그 틀어놓으면 같이 먹는 느낌이에요. 조용한 브이로그 추천합니다.',
      author: '혼자살기',
      timeAgo: '2일 전',
      likes: 203,
      saves: 145,
      comments: 47,
      points: 48,
      tags: ['#외로움', '#혼밥', '#멘탈케어'],
      category: '정서',
      verified: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--spot-blue-light)] via-white to-[var(--spot-yellow)]/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--spot-green)] via-[var(--spot-blue)] to-[var(--spot-yellow)] px-5 py-4 sticky top-0 z-10">
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

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['전체', '식사', '집관리', '절약', '정서', '안전'].map((category, index) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                index === 0
                  ? 'bg-gradient-to-r from-[var(--spot-green)] to-[var(--spot-blue)] text-white shadow-md'
                  : 'bg-white text-[var(--spot-gray-700)] border border-[var(--spot-gray-300)] hover:border-[var(--spot-blue)]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Community Feed */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[var(--spot-gray-900)]">인기 꿀팁</h3>
            <button className="text-xs text-[var(--spot-blue)] font-medium flex items-center gap-1">
              더보기
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {communityTips.map((tip, index) => (
              <div
                key={tip.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer border-l-4"
                style={{
                  borderLeftColor:
                    index === 0 ? 'var(--spot-green)' :
                    index === 1 ? 'var(--spot-blue)' :
                    index === 2 ? 'var(--spot-yellow)' :
                    'var(--spot-red)'
                }}
              >
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-[var(--spot-gray-900)] break-words flex-1">
                          {tip.title}
                        </h4>
                        {tip.verified && (
                          <div className="w-4 h-4 bg-gradient-to-br from-[var(--spot-blue)] to-[var(--spot-green)] rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-[var(--spot-gray-600)] break-words leading-relaxed line-clamp-2">
                        {tip.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-gradient-to-br from-[var(--spot-green-light)] to-white px-2.5 py-1 rounded-lg border border-[var(--spot-green)]/30 flex-shrink-0 shadow-sm">
                      <TrendingUp className="w-3 h-3 text-[var(--spot-green)]" />
                      <span className="text-xs font-bold text-[var(--spot-green)]">{tip.points}pt</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {tip.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 bg-[var(--spot-gray-100)] text-[var(--spot-gray-700)] rounded text-[10px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-[var(--spot-gray-200)]">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-[var(--spot-gray-700)] font-medium">{tip.author}</span>
                      <span className="text-xs text-[var(--spot-gray-600)]">·</span>
                      <span className="text-xs text-[var(--spot-gray-600)]">{tip.timeAgo}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-[var(--spot-gray-600)]" />
                        <span className="text-xs text-[var(--spot-gray-700)] font-medium">{tip.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-[var(--spot-gray-600)]" />
                        <span className="text-xs text-[var(--spot-gray-700)] font-medium">{tip.comments}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bookmark className="w-3.5 h-3.5 text-[var(--spot-gray-600)]" />
                        <span className="text-xs text-[var(--spot-gray-700)] font-medium">{tip.saves}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Points Summary */}
        <div className="bg-white rounded-lg border-l-4 border-[var(--spot-green)] shadow-md p-4">
          <h3 className="text-sm font-semibold text-[var(--spot-gray-900)] mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--spot-green)]" />
            나의 포인트
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-[var(--spot-green-light)] to-white rounded-lg p-3 shadow-sm border border-[var(--spot-green)]/30">
              <p className="text-xs text-[var(--spot-gray-700)] mb-1">오늘 획득</p>
              <p className="text-xl font-bold text-[var(--spot-green)]">+65pt</p>
            </div>
            <div className="bg-gradient-to-br from-[var(--spot-blue-light)] to-white rounded-lg p-3 shadow-sm border border-[var(--spot-blue)]/30">
              <p className="text-xs text-[var(--spot-gray-700)] mb-1">누적 포인트</p>
              <p className="text-xl font-bold text-[var(--spot-blue)]">1,305pt</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
