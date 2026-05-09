import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Mission, LifeArea } from '@/types/mission';

export async function saveMissionCompletion(
  mission: Mission,
  totalPoints: number,
  lifeAreaScores: Record<LifeArea, number>,
  sessionId: string
): Promise<void> {
  if (!db) return;
  try {
    await addDoc(collection(db, 'completions'), {
      sessionId,
      missionTitle: mission.title,
      lifeArea: mission.lifeArea,
      difficulty: mission.difficulty,
      pointsEarned: mission.points,
      totalPoints,
      lifeAreaScores,
      completedAt: serverTimestamp(),
    });
  } catch (err) {
    // Firebase 미설정 시 조용히 실패 — 앱 흐름에 영향 없음
    console.warn('Firestore save skipped:', err);
  }
}
