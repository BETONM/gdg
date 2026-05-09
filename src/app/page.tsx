"use client";

import { useState, useRef, useEffect } from 'react';
import { DailyCheckIn } from '@/components/CheckinForm';
import { MapSpot } from '@/components/MapView';
import { CommunityTip } from '@/components/TipSharing';
import { MissionCards } from '@/components/MissionScreen';
import LoginScreen from '@/components/LoginScreen';
import { Home as HomeIcon, MapPin, Users, Sparkles, LogOut } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import { MissionResult, Mission, CheckinPayload, LifeArea } from '@/types/mission';
import { saveMissionCompletion, fetchUserMissions, createUserMission } from '@/lib/missionStore';
import { useAuth } from '@/hooks/useAuth';

type Screen = 'checkin' | 'loading' | 'missions' | 'map' | 'community';

const INITIAL_SCORES: Record<LifeArea, number> = {
  meal: 0, rest: 0, outdoor: 0, homecare: 0, social: 0, safety: 0,
};

export default function App() {
  const { user, state: authState, signIn, signOut } = useAuth();
  const [screen, setScreen] = useState<Screen>('checkin');
  const [missionResult, setMissionResult] = useState<MissionResult | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [lifeAreaScores, setLifeAreaScores] = useState<Record<LifeArea, number>>(INITIAL_SCORES);
  const [userMissions, setUserMissions] = useState<Mission[]>([]);
  const sessionId = useRef(crypto.randomUUID());

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const missions = await fetchUserMissions(user.uid);
        setUserMissions(missions);
      } catch (err) {
        console.warn('Failed to load user missions', err);
      }
    })();
  }, [user]);

  const handleCheckin = async (payload: CheckinPayload) => {
    setScreen('loading');
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data: MissionResult = await res.json();
      setMissionResult(data);
      setScreen('missions');
    } catch (err) {
      console.error('Checkin failed:', err);
      setScreen('checkin');
    }
  };

  const handleMissionSelect = (mission: Mission) => {
    setSelectedMission(mission);
    if (mission.needsMapSpot) {
      setScreen('map');
    } else {
      handleMissionComplete(mission);
    }
  };

  const handleMissionComplete = async (mission: Mission) => {
    const newPoints = totalPoints + mission.points;
    const newScores = {
      ...lifeAreaScores,
      [mission.lifeArea]: (lifeAreaScores[mission.lifeArea] || 0) + mission.points,
    };
    setTotalPoints(newPoints);
    setLifeAreaScores(newScores);
    
    // Save to Firestore
    await saveMissionCompletion(mission, newPoints, newScores, sessionId.current, 'keyboard');
    
    setScreen('community');
  };

  const handleCreateUserMission = async (mission: Mission) => {
    if (!user) return;
    try {
      await createUserMission(user.uid, mission);
      setUserMissions((prev) => [mission, ...prev]);
    } catch (err) {
      console.warn('Failed to create user mission', err);
    }
  };

  if (authState === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--spot-gray-50)]">
        <div className="w-10 h-10 border-4 border-[var(--spot-green)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (authState === 'unauthenticated') {
    return <LoginScreen onSignIn={signIn} />;
  }

  return (
    <div className="size-full bg-[var(--spot-gray-50)] min-h-screen">
      {/* Mobile Container */}
      <div className="max-w-[480px] mx-auto h-dvh bg-white shadow-2xl relative flex flex-col overflow-hidden">
        {/* User Header */}
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
            <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-[var(--spot-gray-500)] uppercase">User</span>
                <span className="text-xs font-bold text-[var(--spot-gray-900)] truncate max-w-[100px]">{user?.displayName}</span>
            </div>
            <button 
                onClick={signOut}
                className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-[var(--spot-gray-400)] hover:text-[var(--spot-red)] transition-colors"
            >
                <LogOut className="w-4 h-4" />
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {screen === 'checkin' && (
            <DailyCheckIn onComplete={handleCheckin} />
          )}
          
          {screen === 'loading' && (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-[var(--spot-green-light)] border-t-[var(--spot-green)] animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-[var(--spot-blue)] animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--spot-gray-900)]">Gemini가 분석 중...</h2>
                <p className="text-sm text-[var(--spot-gray-600)] mt-2">오늘 상태에 딱 맞는 미션을 만들고 있어요.</p>
              </div>
            </div>
          )}

          {screen === 'missions' && (
            missionResult ? (
              <MissionCards 
                result={missionResult} 
                onMissionSelect={handleMissionSelect}
                userMissions={userMissions}
                onCreateMission={handleCreateUserMission}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4 opacity-50">
                <Sparkles className="w-12 h-12 text-[var(--spot-gray-400)] mb-2" />
                <p className="text-sm text-[var(--spot-gray-600)]">체크인을 먼저 해주세요!</p>
              </div>
            )
          )}
          
          {screen === 'map' && (
            <MapSpot 
              mission={selectedMission || undefined}
              onComplete={selectedMission ? () => handleMissionComplete(selectedMission) : undefined} 
            />
          )}
          
          {screen === 'community' && (
            <CommunityTip onComplete={() => setScreen('checkin')} />
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-t-2 border-[var(--spot-gray-200)] px-2 pt-2 pb-safe flex items-center justify-around flex-shrink-0 shadow-[0_-4px_15_rgba(0,0,0,0.08)] sticky bottom-0 z-50">
          <button
            onClick={() => setScreen('checkin')}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all",
              screen === 'checkin' ? "text-[var(--spot-green)]" : "text-[var(--spot-gray-600)]"
            )}
          >
            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", screen === 'checkin' && "bg-[var(--spot-green-light)]")}>
              <HomeIcon className={cn("w-4.5 h-4.5", screen === 'checkin' && "fill-current")} />
            </div>
            <span className="text-[10px] font-medium">체크인</span>
          </button>

          <button
            onClick={() => setScreen('missions')}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all",
              (screen === 'missions' || screen === 'loading') ? "text-[var(--spot-blue)]" : "text-[var(--spot-gray-600)]"
            )}
          >
            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", (screen === 'missions' || screen === 'loading') && "bg-[var(--spot-blue-light)]")}>
              <Sparkles className={cn("w-4.5 h-4.5", (screen === 'missions' || screen === 'loading') && "fill-current")} />
            </div>
            <span className="text-[10px] font-medium">미션</span>
          </button>

          <button
            onClick={() => setScreen('map')}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all",
              screen === 'map' ? "text-[var(--spot-blue)]" : "text-[var(--spot-gray-600)]"
            )}
          >
            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", screen === 'map' && "bg-[var(--spot-blue-light)]")}>
              <MapPin className={cn("w-4.5 h-4.5", screen === 'map' && "fill-current")} />
            </div>
            <span className="text-[10px] font-medium">지도</span>
          </button>

          <button
            onClick={() => setScreen('community')}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all",
              screen === 'community' ? "text-[var(--spot-yellow)]" : "text-[var(--spot-gray-600)]"
            )}
            style={{ color: screen === 'community' ? '#ea8c00' : undefined }}
          >
            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", screen === 'community' && "bg-[var(--spot-yellow)]/20")}>
              <Users className={cn("w-4.5 h-4.5", screen === 'community' && "fill-current")} />
            </div>
            <span className="text-[10px] font-medium">커뮤니티</span>
          </button>
        </div>
      </div>
    </div>
  );
}
