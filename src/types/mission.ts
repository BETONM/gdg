export type InputMode = 'keyboard' | 'voice';

export type CheckinPayload =
  | ({ mode: 'keyboard' } & CheckinInput)
  | { mode: 'voice'; transcript: string };

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
export type EnergyLevel = 'low' | 'medium' | 'high';
export type PrimaryNeed = 'meal' | 'rest' | 'outdoor' | 'homecare' | 'social' | 'safety';
export type Urgency = 'low' | 'medium' | 'high';
export type Difficulty = 'easy' | 'normal' | 'challenge';
export type ProofType = 'self_check' | 'photo' | 'receipt' | 'location' | 'text';
export type LifeArea = 'meal' | 'rest' | 'outdoor' | 'homecare' | 'social' | 'safety';

export interface CheckinInput {
  timeOfDay: TimeOfDay;
  hasEaten: boolean;
  energyLevel: EnergyLevel;
  wentOutsideToday: boolean;
  currentNeed: PrimaryNeed;
  budgetKRW: number;
  mood: string;
}

export interface StateSummary {
  timeOfDay: TimeOfDay;
  primaryNeed: PrimaryNeed;
  energyLevel: EnergyLevel;
  urgency: Urgency;
  summary: string;
}

export interface Mission {
  title: string;
  description: string;
  lifeArea: LifeArea;
  difficulty: Difficulty;
  estimatedMinutes: number;
  estimatedCostKRW: number;
  points: number;
  proofType: ProofType;
  proofCriteria: string[];
  steps: string[];
  placeSearchQuery: string;
  needsMapSpot: boolean;
  soloFriendly: boolean;
  whyThisMission: string;
}

export interface MissionResult {
  stateSummary: StateSummary;
  agentPlan: string[];
  missions: Mission[];
  safetyNote: string;
}

export interface PlaceResult {
  name: string;
  vicinity: string;
  location: { lat: number; lng: number };
  rating?: number;
  placeId: string;
}

export type TipCategory =
  | 'convenience_combo'
  | 'budget'
  | 'homecare'
  | 'safety'
  | 'loneliness'
  | 'cleaning_laundry';

export interface TipInput {
  category: TipCategory;
  title: string;
  content: string;
  estimatedCostKRW: number;
}

export interface TipReview {
  category: TipCategory;
  improvedTitle: string;
  improvedTip: string;
  estimatedCostKRW: number;
  usefulnessScore: number;
  suggestedPoints: number;
  whyUseful: string;
  tags: string[];
  safetyOrHealthNote: string;
}

export interface Activity {
  id?: string;
  userId: string;
  missionTitle: string;
  lifeArea: LifeArea;
  // 500m 격자 단위로 스냅된 좌표 (개인정보 보호)
  lat: number;
  lng: number;
  createdAt: Date;
}
