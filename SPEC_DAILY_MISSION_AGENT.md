# Implementation Spec: Hi Spot Daily

## 1. Scope

Build a single-page MVP web app for the hackathon.

Required demo flow:

```text
Check-in form
-> Generate missions with Gemini
-> Render 3 mission cards
-> Optional map/spot helper
-> Open community tip screen
-> Review tip with Gemini
-> Post tip and increase points
```

## 2. Recommended Stack

- React + TypeScript
- Vite or Next.js
- CSS or Tailwind CSS
- Gemini API via server route or server function
- Firebase Hosting
- Optional Google Maps JavaScript API
- Optional Google Places API

## 3. Environment Variables

```bash
GEMINI_API_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

Rules:

- `GEMINI_API_KEY` must never be exposed in client code.
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` may be exposed but must be restricted in Google Cloud Console.

## 4. Suggested File Structure

If using Vite:

```text
src/
  App.tsx
  main.tsx
  styles.css
  components/
    CheckInForm.tsx
    AgentAnalysis.tsx
    MissionCard.tsx
    SpotHelper.tsx
    CommunityTips.tsx
    TipReviewCard.tsx
    PointsPanel.tsx
  lib/
    geminiMissions.ts
    geminiTipReview.ts
    fallbackData.ts
    places.ts
  types/
    mission.ts
    tip.ts
```

If using Next.js:

```text
src/
  app/
    page.tsx
    api/
      generate-missions/route.ts
      review-tip/route.ts
      places/route.ts
  components/
  lib/
  types/
```

## 5. Data Contracts

### CheckInInput

```ts
type CheckInInput = {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  hasEaten: boolean;
  energyLevel: 'low' | 'medium' | 'high';
  wentOutsideToday: boolean;
  currentNeed: 'meal' | 'rest' | 'outdoor' | 'homecare' | 'social' | 'safety';
  budgetKRW: number;
  mood?: string;
};
```

### TipInput

```ts
type TipInput = {
  category: 'convenience_combo' | 'budget' | 'homecare' | 'safety' | 'loneliness' | 'cleaning_laundry';
  title: string;
  content: string;
  estimatedCostKRW?: number;
};
```

### MissionResult

Use the JSON shape in `PRD_DAILY_MISSION_AGENT.md`.

### TipReviewResult

Use the JSON shape in `PRD_DAILY_MISSION_AGENT.md`.

## 6. API Design

### POST /api/generate-missions

Input: `CheckInInput`

Output: `MissionResult`

Responsibilities:

- Build Gemini Daily Mission Designer prompt
- Use structured output / JSON schema when supported
- Validate output shape
- Return fallback sample on API failure

### POST /api/review-tip

Input: `TipInput`

Output: `TipReviewResult`

Responsibilities:

- Build Gemini Community Tip Reviewer prompt
- Improve rough user tip
- Score usefulness from 0 to 100
- Suggest points from 0 to 50
- Return fallback sample on API failure

### POST /api/places

Optional.

Input:

```ts
{
  query: string;
  lat: number;
  lng: number;
}
```

Output:

```ts
{
  places: Array<{
    id: string;
    name: string;
    address?: string;
    lat: number;
    lng: number;
    rating?: number;
  }>
}
```

## 7. UI States

The app must handle:

- Initial empty state
- Sample check-in loaded
- Generating missions
- Gemini mission fallback mode
- Missions generated
- Mission selected
- Tip form empty
- Sample tip loaded
- Reviewing tip
- Tip review fallback mode
- Tip ready to post
- Tip posted and points added

## 8. Fallback Strategy

Fallback is mandatory.

- If mission Gemini call fails, use `fallbackMissionResult`
- If tip review Gemini call fails, use `fallbackTipReview`
- If Places fails, use `fallbackPlaces`
- If map fails, keep the mission and community screens working

## 9. Acceptance Criteria

- User can load a sample check-in
- User can generate missions
- 3 mission cards render without layout breakage
- Each mission has points, time, cost, proof type, and steps
- User can open community tip screen
- User can load or write a tip
- Gemini returns improved title, improved tip, usefulness score, and suggested points
- User can post tip
- Point total increases
- No blocking console errors during the demo flow
- App can be deployed to Firebase Hosting

## 10. Verification Checklist

Before demo:

- Run install
- Run dev server
- Open app in browser
- Click sample check-in
- Generate missions
- Confirm 3 mission cards render
- Open community tip screen
- Click sample tip
- Review tip with Gemini
- Post tip
- Confirm points update
- Test missing Gemini key and confirm fallback

## 11. Implementation Order

1. Static 3-screen UI and mock data
2. Mission generation API
3. Community tip review API
4. Points and post-tip flow
5. Optional spot helper with Maps/Places
6. Visual polish
7. Firebase deployment

Stop adding features once the core demo is stable.
