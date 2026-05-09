# Google Stack MVP Plan: Hi Spot Daily

## 1. Goal

4시간 안에 Google 제품을 명확히 활용한 웹앱 MVP를 만든다.

제품 컨셉:

> 처음 독립한 20대 1인 가구가 하루에 한 번 상태를 체크하면 Gemini가 지금 할 만한 미션 3개를 만들고, 사용자가 자취 꿀팁을 올리면 Gemini가 이를 정리·점수화해 포인트를 부여하는 Daily Mission Agent.

## 2. Must-have Google Stack

| Stack | 역할 | 왜 필요한가 |
|---|---|---|
| Gemini API | 사용자 상태 분석, 미션 생성, 꿀팁 리뷰 | 핵심 LLM 사용 지점 |
| Gemini Structured Output | 미션/꿀팁 리뷰 응답을 JSON schema로 고정 | UI 안정성, Prompt/Spec Quality |
| Firebase Hosting | 완성된 웹앱 배포 | Google stack 기반 Completeness |
| Google Maps JavaScript API | 지도 기반 미션이 있을 때 주변 spot 표시 | Google 지도 제품 사용 명확화 |
| Google Places API | 편의점, 카페, 공원 등 주변 장소 검색 | 미션을 실제 장소와 연결 |

중요:

- 3번째 핵심 화면은 지도 완료 화면이 아니라 **Community Tip Sharing**이다.
- Maps/Places는 Screen 2의 미션 중 `needsMapSpot`이 true인 경우 보조적으로 사용한다.
- MVP가 늦어지면 Maps/Places는 작은 지도 영역이나 fallback 장소 리스트로 축소한다.

## 3. Optional Google Stack

| Stack | 역할 | 우선순위 |
|---|---|---:|
| Gemini Vision | 꿀팁 사진/영수증 검수 | 1 |
| Cloud Vision OCR | 편의점 영수증 금액/품목 추출 | 2 |
| Gemini TTS | 미션 시작 전 짧은 음성 안내 | 2 |
| Firebase Cloud Messaging | 하루 1회 체크인 알림 | 3 |
| Cloud Run Functions | API key 보호용 서버리스 함수 | 3 |

## 4. App Flow

```text
Daily Check-in
-> Gemini state analysis
-> Gemini mission generation with points
-> Optional map/places spot for selected mission
-> Community tip sharing
-> Gemini tip review and point scoring
-> Point total update
```

## 5. Core Screens

### Screen 1. Daily Check-in

- 시간대
- 밥 먹었는지 여부
- 에너지 수준
- 오늘 외출 여부
- 오늘 필요한 것
- 예산
- 자유 입력
- CTA: `오늘의 미션 만들기`

### Screen 2. Gemini Agent Analysis + Mission Cards

- 현재 상태 요약
- Agent Plan 3단계
- 생활 영역 badge
- 긴급도/에너지 표시
- 미션 카드 3개
- 각 미션의 포인트, 시간, 비용, 인증 방식, 실행 단계
- 지도 기반 미션은 작은 spot 영역 또는 장소 리스트 표시

### Screen 3. Community Tip Sharing

- 꿀팁 작성 카드
- 카테고리: 편의점 조합, 식비 절약, 집관리, 안전, 외로움 해소, 청소·빨래
- 제목/내용/예상 비용/사진 placeholder
- CTA: `Gemini로 꿀팁 다듬기`
- Gemini Tip Review 카드
  - 유용성 점수
  - 예상 포인트
  - 개선된 제목
  - 정리된 꿀팁
  - 왜 유용한지
- 커뮤니티 피드 미리보기
- CTA: `커뮤니티에 올리고 포인트 받기`

## 6. Gemini Mission Prompt Contract

```text
You are a Daily Mission Designer for young adults living alone for the first time.
Convert the user's current state into 3 small, realistic missions they can complete today.

Rules:
- Output valid JSON only.
- Do not provide medical, legal, or financial diagnosis.
- Missions must be small enough to complete within 5 to 30 minutes.
- Prefer low-cost actions.
- Consider food, rest, outdoor movement, home care, safety, and light social connection.
- Each mission must include points, proof type, and proof criteria.
- Include placeSearchQuery only when a nearby spot would help.
- Keep the tone warm but practical.
```

## 7. Gemini Tip Review Prompt Contract

```text
You are a Community Tip Reviewer for young adults living alone.
Improve, structure, and score a user-submitted living-alone tip.

Rules:
- Output valid JSON only.
- Do not shame the user.
- Keep the rewritten tip practical and short.
- Estimate cost if possible.
- Score usefulness from 0 to 100.
- Suggest points from 0 to 50.
- Explain why the tip is useful for a first-time solo-living user.
- Add a safety or health note only when needed.
```

## 8. Mission Output Schema

```json
{
  "stateSummary": {
    "timeOfDay": "morning | afternoon | evening | night",
    "primaryNeed": "meal | rest | outdoor | homecare | social | safety",
    "energyLevel": "low | medium | high",
    "urgency": "low | medium | high",
    "summary": "string"
  },
  "agentPlan": ["string"],
  "missions": [
    {
      "title": "string",
      "description": "string",
      "lifeArea": "meal | rest | outdoor | homecare | social | safety",
      "difficulty": "easy | normal | challenge",
      "estimatedMinutes": 10,
      "estimatedCostKRW": 0,
      "points": 30,
      "proofType": "self_check | photo | receipt | location | text",
      "proofCriteria": ["string"],
      "steps": ["string"],
      "placeSearchQuery": "string",
      "needsMapSpot": true,
      "soloFriendly": true,
      "whyThisMission": "string"
    }
  ],
  "safetyNote": "string"
}
```

## 9. Tip Review Output Schema

```json
{
  "category": "convenience_combo | budget | homecare | safety | loneliness | cleaning_laundry",
  "improvedTitle": "string",
  "improvedTip": "string",
  "estimatedCostKRW": 7900,
  "usefulnessScore": 86,
  "suggestedPoints": 40,
  "whyUseful": "string",
  "tags": ["string"],
  "safetyOrHealthNote": "string"
}
```

## 10. 4-hour Implementation Plan

### 0:00-0:40

- 새 웹앱 세팅
- 기본 레이아웃
- 모바일 3-screen 구조

### 0:40-1:20

- Daily Check-in UI
- Mock mission cards
- Point total UI

### 1:20-2:20

- Gemini mission generation API
- Structured output parsing
- fallback mission JSON

### 2:20-3:10

- Community tip sharing UI
- Gemini tip review API
- fallback tip review JSON

### 3:10-3:35

- Optional Google Maps/Places 작은 spot 영역
- 실패 시 fallback 장소 리스트

### 3:35-4:00

- Firebase Hosting 배포 준비
- 시각 polish
- 데모 시나리오 고정

## 11. Environment Variables

```bash
GEMINI_API_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

## 12. Fallback Rules

- Gemini mission generation 실패 시 `fallbackMissionResult` 사용
- Gemini tip review 실패 시 `fallbackTipReview` 사용
- Places API 실패 시 `fallbackPlaces` 사용
- 지도 실패 시 미션과 커뮤니티 화면은 계속 작동

## 13. Demo Pitch

```text
Hi Spot Daily는 처음 독립한 20대 1인 가구를 위한 Daily Mission Agent입니다.
사용자가 오늘 상태를 체크하면 Gemini가 지금 할 만한 미션 3개를 포인트와 함께 생성합니다.
그리고 사용자가 편의점 조합이나 집관리 같은 자취 꿀팁을 올리면 Gemini가 이를 정리하고 유용성을 점수화해 포인트를 제안합니다.
이 서비스는 혼자 사는 청년의 하루 행동과 생활 지식을 포인트로 연결하는 Google AI 기반 루틴 앱입니다.
```
