'use client';

import { useState, useRef } from 'react';
import CheckinForm from '@/components/CheckinForm';
import MissionScreen from '@/components/MissionScreen';
import MapView from '@/components/MapView';
import TipSharing from '@/components/TipSharing';
import { CheckinInput, Mission, MissionResult, LifeArea } from '@/types/mission';
import { saveMissionCompletion } from '@/lib/missionStore';

type Screen = 'checkin' | 'loading' | 'missions' | 'map' | 'tip';

const INITIAL_SCORES: Record<LifeArea, number> = {
  meal: 0, rest: 0, outdoor: 0, homecare: 0, social: 0, safety: 0,
};

const SCREENS_ORDER: Screen[] = ['checkin', 'missions', 'map', 'tip'];
const STEP_LABELS: Record<string, string> = {
  checkin: '체크인', missions: '미션', map: '지도', tip: '꿀팁 공유',
};

export default function Home() {
  const [screen, setScreen] = useState<Screen>('checkin');
  const [missionResult, setMissionResult] = useState<MissionResult | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [lifeAreaScores, setLifeAreaScores] = useState<Record<LifeArea, number>>(INITIAL_SCORES);
  const sessionId = useRef(crypto.randomUUID());

  const handleCheckin = async (input: CheckinInput) => {
    setScreen('loading');
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data: MissionResult = await res.json();
      setMissionResult(data);
      setScreen('missions');
    } catch {
      setScreen('checkin');
    }
  };

  const handleMissionSelect = (mission: Mission) => {
    setSelectedMission(mission);
    if (mission.needsMapSpot) {
      setScreen('map');
    } else {
      completeMission(mission);
    }
  };

  const completeMission = (mission: Mission) => {
    const nextTotal = totalPoints + mission.points;
    const nextScores = {
      ...lifeAreaScores,
      [mission.lifeArea]: lifeAreaScores[mission.lifeArea] + mission.points,
    };
    setTotalPoints(nextTotal);
    setLifeAreaScores(nextScores);
    saveMissionCompletion(mission, nextTotal, nextScores, sessionId.current);
    setScreen('tip');
  };

  const handleMapComplete = () => {
    if (selectedMission) completeMission(selectedMission);
  };

  const handleTipPost = (pointsEarned: number) => {
    setTotalPoints((p) => p + pointsEarned);
  };

  const handleRestart = () => {
    setSelectedMission(null);
    setMissionResult(null);
    setScreen('checkin');
  };

  const visibleStep = screen === 'loading' ? 'missions' : screen;
  const currentStep = SCREENS_ORDER.indexOf(visibleStep as Screen);

  return (
    <main className="app-main">
      {screen !== 'checkin' && (
        <div className="step-indicator">
          {SCREENS_ORDER.map((s, i) => (
            <div
              key={s}
              className={`step ${i < currentStep ? 'done' : ''} ${i === currentStep ? 'active' : ''}`}
            >
              <div className="step-dot" />
              <span className="step-label">{STEP_LABELS[s]}</span>
            </div>
          ))}
        </div>
      )}

      {screen === 'checkin' && <CheckinForm onSubmit={handleCheckin} />}

      {screen === 'loading' && (
        <div className="loading-screen">
          <div className="loading-spinner" />
          <p className="loading-msg">Gemini가 상태를 분석하고 있어요...</p>
          <p className="loading-sub">Gemini · Google Places API 연결 중</p>
        </div>
      )}

      {screen === 'missions' && missionResult && (
        <MissionScreen result={missionResult} onSelect={handleMissionSelect} />
      )}

      {screen === 'map' && selectedMission && (
        <MapView mission={selectedMission} onComplete={handleMapComplete} />
      )}

      {screen === 'tip' && (
        <TipSharing
          missionPoints={totalPoints}
          onPost={handleTipPost}
          onRestart={handleRestart}
        />
      )}
    </main>
  );
}
