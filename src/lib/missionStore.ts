import { db } from './firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  increment,
  serverTimestamp,
  Timestamp,
  orderBy,
  limit,
} from 'firebase/firestore';
import { Mission, LifeArea, InputMode, Activity } from '@/types/mission';

// 500m 격자 단위로 스냅 (개인정보 보호)
function snapToGrid(coord: number): number {
  return Math.round(coord * 200) / 200;
}

export async function saveMissionCompletion(
  mission: Mission,
  totalPoints: number,
  lifeAreaScores: Record<LifeArea, number>,
  sessionId: string,
  inputMode: InputMode = 'keyboard'
): Promise<void> {
  if (!db) return;
  try {
    await addDoc(collection(db, 'completions'), {
      sessionId,
      inputMode,
      missionTitle: mission.title,
      lifeArea: mission.lifeArea,
      difficulty: mission.difficulty,
      pointsEarned: mission.points,
      totalPoints,
      lifeAreaScores,
      completedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Firestore save skipped:', err);
  }
}

export async function saveTip(
  tip: any,
  userId: string,
  userDisplayName: string
): Promise<void> {
  if (!db) return;
  try {
    await addDoc(collection(db, 'tips'), {
      ...tip,
      userId,
      author: userDisplayName,
      createdAt: serverTimestamp(),
      likes: 0,
      saves: 0,
    });
  } catch (err) {
    console.warn('Tip save skipped:', err);
  }
}

export async function saveActivity(
  userId: string,
  mission: Pick<Mission, 'title' | 'lifeArea'>,
  location: { lat: number; lng: number }
): Promise<void> {
  if (!db) return;
  try {
    await addDoc(collection(db, 'activities'), {
      userId,
      missionTitle: mission.title,
      lifeArea: mission.lifeArea,
      lat: snapToGrid(location.lat),
      lng: snapToGrid(location.lng),
      participantCount: 1,
      maxParticipants: 5,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Activity save skipped:', err);
  }
}

// 최근 24시간 내 활동을 가져와서 클라이언트에서 거리 필터링
export async function fetchNearbyActivities(
  center: { lat: number; lng: number },
  radiusKm = 2
): Promise<Activity[]> {
  if (!db) return [];
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const q = query(
      collection(db, 'activities'),
      where('createdAt', '>=', Timestamp.fromDate(since)),
      orderBy('createdAt', 'desc'),
      limit(100)
    );
    const snap = await getDocs(q);
    const latDelta = radiusKm / 111;
    const lngDelta = radiusKm / (111 * Math.cos((center.lat * Math.PI) / 180));

    return snap.docs
      .map((d) => {
        const data = d.data();
        return {
          id: d.id,
          userId: data.userId,
          missionTitle: data.missionTitle,
          lifeArea: data.lifeArea,
          lat: data.lat,
          lng: data.lng,
          participantCount: data.participantCount ?? 1,
          maxParticipants: data.maxParticipants ?? 5,
          createdAt: (data.createdAt as Timestamp).toDate(),
        } as Activity;
      })
      .filter(
        (a) =>
          Math.abs(a.lat - center.lat) <= latDelta &&
          Math.abs(a.lng - center.lng) <= lngDelta
      );
  } catch (err) {
    console.warn('Nearby activities fetch skipped:', err);
    return [];
  }
}

export async function sendCollaborationRequest(
  fromUserId: string,
  toUserId: string,
  activityId: string
): Promise<void> {
  if (!db) return;
  try {
    await addDoc(collection(db, 'requests'), {
      fromUserId,
      toUserId,
      activityId,
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    // 해당 activity의 참여자 수 +1 증가
    const activityRef = doc(db, 'activities', activityId);
    await updateDoc(activityRef, {
      participantCount: increment(1),
    });
  } catch (err) {
    console.warn('Collaboration request skipped:', err);
  }
}

// 사용자가 직접 생성한 커스텀 미션 저장
export async function createUserMission(
  userId: string,
  mission: Mission
): Promise<void> {
  if (!db) return;
  try {
    await addDoc(collection(db, 'user_missions'), {
      userId,
      ...mission,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('User mission save skipped:', err);
  }
}

// 사용자가 만든 미션 목록 조회
export async function fetchUserMissions(userId: string): Promise<Mission[]> {
  if (!db) return [];
  try {
    const q = query(
      collection(db, 'user_missions'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        title: data.title,
        description: data.description,
        lifeArea: data.lifeArea,
        difficulty: data.difficulty,
        estimatedMinutes: data.estimatedMinutes,
        estimatedCostKRW: data.estimatedCostKRW,
        points: data.points,
        proofType: data.proofType,
        proofCriteria: data.proofCriteria || [],
        steps: data.steps || [],
        placeSearchQuery: data.placeSearchQuery || '',
        needsMapSpot: data.needsMapSpot ?? false,
        soloFriendly: data.soloFriendly ?? true,
        whyThisMission: data.whyThisMission || '',
      } as Mission;
    });
  } catch (err) {
    console.warn('User missions fetch skipped:', err);
    return [];
  }
}

